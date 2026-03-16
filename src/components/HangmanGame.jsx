/* --- IMPORT --- */
import { useState, useEffect } from "react";
import { Keyboard } from "./Keyboard";
import { Popup } from "./Popup";
import "./HangmanGame.css";

/* --- TRADUCTION --- */
const trad = {
  fr: {
    locale: "fr-FR",
    startTitle: "JEU DU PENDU",
    startMessage: "Trouvez le mot caché en un nombre limité d'essais. Cliquez sur les lettres ou utilisez votre clavier pour jouer.",
    startButton: "JOUER !",
    winTitle: "Félicitations !",
    winMessage: "Tu as trouvé le mot: ",
    restartButton: "Relancer une partie",
    loseTitle: "Perdu !",
    loseMessage: "Dommage ! Le mot caché était: ",
    tries: "Essais restants: ",
    langContext: "Modifier la langue du jeu et de l'interface :",
  },
  en: {
    locale: "en-GB",
    startTitle: "HANGMAN GAME",
    startMessage: "Find the hidden word with a limited number of guesses. Click on the letters or use your keyboard to play.",
    startButton: "PLAY !",
    winTitle: "Congratulations!",
    winMessage: "You found the word: ",
    restartButton: "Restart Game",
    loseTitle: "Game Over !",
    loseMessage: "Too bad! The hidden word was: ",
    tries: "Guesses left: ",
    langContext: "Change game and interface language:",
  },
};

/* --- FONCTION PRINCIPALE --- */
export function HangmanGame() {
  const [word, setWord] = useState(null); // Stock le mot à deviner (initialisé à null pour indiquer qu'on n'a pas encore reçu le mot)
  const [guessedLetters, setGuessedLetters] = useState([]); // Stock les lettres jouées par le joueur
  const [wrongGuesses, setWrongGuesses] = useState(0); // Compteur pour les mauvaise réponse
  const [hasStarted, setHasStarted] = useState(false); // Stock si la première partie a démarré
  const [lang, setLang] = useState("fr"); // État de la langue actuelle (initialisé à "fr" pour commencer en français)
  const maxWrongGuesses = 6; // Nombre maxi de mauvaises réponses

  /* --- FONCTION POUR RÉCUPÉRER LES DONNÉES DE L'API --- */
  const fetchAPI = (currentLang) => {
    fetch("http://localhost:3333/", {
      method: "POST",
      body: new URLSearchParams({ locale: currentLang }), // Envoie la langue choisie dans le corps de la requête pour que l'API puisse retourner un mot dans la bonne langue. ICI, on utilise URLSearchParams pour formater les données de manière appropriée pour une requête POST. Cela permet d'envoyer la locale ("locale=fr-FR" ou "locale=en-GB") à l'API, qui peut ensuite utiliser cette information pour sélectionner un mot dans la langue correspondante.
    })
      .then((response) => response.json()) // Convertit la réponse en JSON
      .then((data) => setWord(data.word)); // Met à jour l'état du mot à deviner avec le mot reçu de l'API
  };

  useEffect(() => { // Evite une boucle infinie d'appels à l'API en ne faisant cet appel qu'au tout premier chargement et permet de charger le rendu graphique du jeu avant de récupérer le mot à deviner, ce qui évite d'avoir un écran blanc pendant le chargement du mot
    fetchAPI(trad[lang].locale); // Appel de la fonction pour récupérer le mot à deviner dès que le composant (hangmanGame) est affiché pour la première fois
  }, []);

  /* --- FONCTION POUR RECOMMENCER LE JEU --- */
  const restartGame = () => {
    setWord(null);
    setGuessedLetters([]);
    setWrongGuesses(0);
    setHasStarted(true); // Assure que le jeu est considéré comme démarré après le lancement du jeu ou un redémarrage d'une partie
    fetchAPI(trad[lang].locale); // Récupère un nouveau mot pour recommencer le jeu
  };

  /* --- FONCTION POUR CHANGER LA LANGUE --- */
  const changeLang = () => {
    let newLang;
    if (lang === "fr") {
      newLang = "en";
    } else {
      newLang = "fr";
    }
    setLang(newLang)
  };

  /* --- FONCTION POUR GÉRER LE CLIC SUR UNE LETTRE --- */
  const letterClickHandler = (letter) => {
    if (!word) { // Vérifier que le mot est chargé // (word === null || word === undefined || word === "")
      return;
    }
    setGuessedLetters([...guessedLetters, letter]); // On ajoute la lettre aux lettres jouées. En utilisant "Spread Operator" (...) je créer une copie superficielle de l'ancien tableau dans un tout nouveau tableau, et j'y ajoute la nouvelle lettre. Si j'avais fait un push la référence mémoire du tableau n'aurait pas changé, et React n'aurait pas détecté le changement pour déclencher le re-rendu de la page. Pourquoi ? Car React ne compare que l'adresse mémoire des 2 tableaux pour gagner en performance, et ne fait pas de comparaison profonde des éléments du tableau.
    if (!word.toLowerCase().includes(letter)) { // Vérifie si la lettre n'est pas dans le mot (en convertissant le mot en minuscules pour éviter les problèmes de casse)
      setWrongGuesses(wrongGuesses + 1);
    }
  };

  /* --- FONCTION POUR AFFICHER LE MOT --- */
  const displayWord = () => {
    if (!word) { // Vérifier que le mot est chargé // (word === null || word === undefined || word === "")
      return;
    }

    let result = "";
    for (let letter of word) {
      if (letter === "-") {
        result += "\u00A0\u00A0"; // \u00A0 est le code pour un "espace forcé" en HTML.
      } 
      else if (guessedLetters.includes(letter)) { // Vérifie si la lettre fait partie du tableau des lettres que le joueur a DÉJÀ cliquées ?
        result += letter + " "; // Affiche la lettre si elle a été devinée
      } 
      else {
        result += "_ "; 
      }
    }
    return result;
  };

  // Vérifier si le joueur a gagné
  let isWon = false; // Inialise à false pour éviter les problèmes de référence mémoire, et pour que le jeu ne considère pas que le joueur a gagné avant même d'avoir reçu le mot à deviner de l'API (car null est différent de false, et si j'avais initialisé isWon à true, le jeu aurait considéré que le joueur a gagné dès le début du jeu, avant même d'avoir reçu le mot à deviner de l'API)
  if (word) { // Vérifier que le mot est chargé // (word !== null && word !== undefined && word !== "")
    isWon = true; // On suppose que le joueur a gagné, et on va essayer de trouver une preuve du contraire en parcourant chaque lettre du mot à deviner
    for (let letter of word) {
      if (letter !== "-" && !guessedLetters.includes(letter)) { //  Si la lettre n'est pas un tiret et que dans les lettre jouer il n'y a pas la lettre en question, alors le joueur n'a pas encore gagné, car il lui reste au moins une lettre à deviner
        isWon = false;
        break; // Permet de sortir de la boucle dès qu'on trouve une lettre qui n'a pas été devinée, pour éviter de continuer à vérifier les autres lettres inutilement, ce qui améliore les performances du jeu, surtout pour les mots longs.
      }
    }
  }

  // Vérifier si le joueur a perdu
  let isGameOver = wrongGuesses >= maxWrongGuesses;

  // Popup de fin de jeu
  let resultMessage = null; // Variable pour stocker le composant de la popup à afficher en fonction de l'état du jeu (gagné, perdu, ou pas encore commencé)

  // Déterminer le label du bouton de changement de langue
  let langLabel;
  if (lang === "fr") {
    langLabel = "EN";
  } 
  else {
    langLabel = "FR";
  }

  if (!hasStarted) { // Si le jeu n'a pas encore démarré, on affiche la popup de démarrage du jeu avec les instructions et le bouton pour commencer à jouer
    resultMessage = (
      <Popup
        title={trad[lang].startTitle}
        message={trad[lang].startMessage}
        buttonText={trad[lang].startButton}
        onButtonClick={restartGame}
        type="start"
        changeLangFonction={changeLang}
        langLabelText={langLabel}
        langContext={trad[lang].langContext}
      />
    );
  } 
  else if (isWon) { // Si le joueur a gagné, on affiche la popup de victoire avec le mot trouvé et le bouton pour recommencer une partie
    resultMessage = (
      <Popup
        title={trad[lang].winTitle}
        message={trad[lang].winMessage + word}
        buttonText={trad[lang].restartButton}
        onButtonClick={restartGame}
        type="win"
        changeLangFonction={changeLang}
        langLabelText={langLabel}
        langContext={trad[lang].langContext}
      />
    );
  } 
  else if (isGameOver) { // Si le joueur a perdu, on affiche la popup de défaite avec le mot à deviner et le bouton pour recommencer une partie
    resultMessage = (
      <Popup
        title={trad[lang].loseTitle}
        message={trad[lang].loseMessage + word}
        buttonText={trad[lang].restartButton}
        onButtonClick={restartGame}
        type="lose"
        changeLangFonction={changeLang}
        langLabelText={langLabel}
        langContext={trad[lang].langContext}
      />
    );
  }

  // Affichage du jeu
  return (
    <> {/* React Fragment, permet de grouper plusieurs éléments sans ajouter d'élément supplémentaire dans le DOM */}
      <div className="container">
        <p className="word">{displayWord()}</p> {/* Affiche le mot à deviner en utilisant la fonction displayWord pour afficher les lettres devinées et les underscores pour les lettres non devinées */}

        <p className="tries">
            {trad[lang].tries} {maxWrongGuesses - wrongGuesses} {/* Affiche le nombre d'essais restants en utilisant la traduction appropriée pour le mot "Essais restants" ou "Guesses left" en fonction de la langue choisie, et en calculant le nombre d'essais restants en soustrayant le nombre de mauvaises réponses du nombre maximum d'essais autorisés */}
        </p>

        <Keyboard
          onLetterClick={letterClickHandler} /* Passe la fonction de gestion du clic sur une lettre au composant Keyboard pour qu'il puisse l'appeler lorsqu'une lettre est cliquée */
          guessedLetters={guessedLetters} /* Passe le tableau des lettres déjà devinées au composant Keyboard pour qu'il puisse désactiver les boutons correspondants et éviter que le joueur puisse cliquer plusieurs fois sur la même lettre */
          disabledBtn={isGameOver || isWon || !hasStarted} /* Désactive le clavier si le jeu est terminé (gagné ou perdu) ou si le jeu n'a pas encore démarré, pour éviter que le joueur puisse continuer à jouer alors que la partie est terminée ou pas encore commencée */
        />
      </div>
      {resultMessage} {/* Affiche la popup de résultat (gagné, perdu, ou pas encore commencé) en fonction de l'état du jeu */}
    </>
  );
}
