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
    startButton: "PLAY!",
    winTitle: "Congratulations!",
    winMessage: "You found the word: ",
    restartButton: "Restart Game",
    loseTitle: "Game Over!",
    loseMessage: "Too bad! The hidden word was: ",
    tries: "Guesses left: ",
    langContext: "Change game and interface language:",
  },
};

/* --- FONCTION PRINCIPALE --- */
export function HangmanGame() {
  const [word, setWord] = useState(null); // Stock le mot à deviner (initialisé à null pour indiquer qu'on n'a pas encore reçu le mot)
  const [guessedLetters, setGuessedLetters] = useState([]); // Stock les lettres devinées
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

  useEffect(() => {
    fetchAPI(trad[lang].locale); // Appel de la fonction pour récupérer le mot à deviner dès que le composant est monté
  }, []);

  /* --- FONCTION POUR RECOMMENCER LE JEU --- */
  const restartGame = () => {
    setWord(null);
    setGuessedLetters([]);
    setWrongGuesses(0);
    setHasStarted(true); // Assure que le jeu est considéré comme démarré après un redémarrage
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
    setLang(newLang);
  };

  /* --- FONCTION POUR GÉRER LE CLIC SUR UNE LETTRE --- */
  const letterClickHandler = (letter) => {
    if (!word) {
      // Vérifier que le mot est chargé
      return;
    }
    setGuessedLetters([...guessedLetters, letter]); // On ajoute la lettre aux lettres jouées
    if (!word.toLowerCase().includes(letter)) {
      setWrongGuesses(wrongGuesses + 1); // Incrémente le compteur seulement si c'est une mauvaise réponse
    }
  };

  /* --- FONCTION POUR AFFICHER LE MOT --- */
  const displayWord = () => {
    if (!word) {
      // Vérifier que le mot est chargé
      return;
    }

    let result = "";
    for (let letter of word) {
      if (letter === "-") {
        result += "\u00A0\u00A0"; // \u00A0 est le code pour un "espace forcé" en HTML.
      } else if (guessedLetters.includes(letter)) {
        result += letter + " "; // Affiche la lettre si elle a été devinée
      } else {
        result += "_ "; // Affiche un underscore pour les lettres non devinées
      }
    }
    return result;
  };

  // Vérifier si le joueur a gagné
  let isWon = false;
  if (word !== null) {
    isWon = true;
    for (let letter of word) {
      if (letter !== "-" && !guessedLetters.includes(letter)) {
        isWon = false;
        break;
      }
    }
  }

  // Vérifier si le joueur a perdu
  let isGameOver = wrongGuesses >= maxWrongGuesses;

  // Popup de fin de jeu
  let resultMessage = null;

  // Déterminer le label du bouton de changement de langue
  let langLabel;
  if (lang === "fr") {
    langLabel = "EN";
  } else {
    langLabel = "FR";
  }

  // 1ère chose à vérifier : Est-ce qu'on a cliqué sur Jouer ?
  if (!hasStarted) {
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
  } else if (isWon) {
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
  } else if (isGameOver) {
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

  return (
    <>
      <div className="container">
        <p className="word">{displayWord()}</p>

        <p className="tries">
          {trad[lang].tries} {maxWrongGuesses - wrongGuesses}
        </p>

        <Keyboard
          onLetterClick={letterClickHandler}
          guessedLetters={guessedLetters}
          disabledBtn={isGameOver || isWon || !hasStarted}
        />
      </div>
      {resultMessage}
    </>
  );
}
