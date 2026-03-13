import { useState, useEffect } from "react";
import { Keyboard } from "./Keyboard";
import "./HangmanGame.css";

export function HangmanGame() {
  const [word, setWord] = useState(null); // Permet de stocker le mot à deviner, initialisé à null pour indiquer qu'on n'a pas encore reçu le mot
  const [guessedLetters, setGuessedLetters] = useState([]); // Tableau pour stocker les lettres devinées
  const [wrongGuesses, setWrongGuesses] = useState(0); // Compteur pour les mauvaises réponses, initialisé à 0 pour commencer le jeu
  const maxWrongGuesses = 6;

  useEffect(() => {
    // useEffect pour faire une requête à l'API dès que le composant est monté
    fetch("http://localhost:3333/", {
      method: "POST",
      body: new URLSearchParams({ locale: "fr-FR" }), // Envoie la locale (fr-FR) en tant que paramètre de la requête
    })
      .then((response) => response.json())
      .then((data) => setWord(data.word));
  }, []);

  // Gestion du clic sur une lettre
  const letterClickHandler = (letter) => {
    if (!word) { // Vérifier que le mot est chargé
        return;
    }
    
    setGuessedLetters([...guessedLetters, letter]); // On ajoute la lettre aux lettres jouées

    if (!word.toLowerCase().includes(letter)) {
      setWrongGuesses(wrongGuesses + 1); // Incrémente le compteur seulement si c'est une mauvaise réponse
    }
  };

  // Affichage du mot avec les lettres devinées et les lettres manquantes
  const displayWord = () => {
    if (!word) { // Vérifier que le mot est chargé
        return;
    }
    
    let result = "";
    for (let letter of word) { 
      if (letter === "-") {
        result += "\u00A0\u00A0";  // \u00A0 est le code pour un "espace forcé" en HTML. 
      } 
      else if (guessedLetters.includes(letter)) {
        result += letter + " "; // Affiche la lettre si elle a été devinée
      } 
      else {
        result += "_ "; // Affiche un underscore pour les lettres non devinées
      }
    }
    return result;
  };

  // Vérifier si le joueur a gagné
  let isWon = true;
  if (word !== null) {
    for (let letter of word) {
      if (letter !== "-" && !guessedLetters.includes(letter)) {
        isWon = false;
        break;
      }
    }
  }

  // Vérifier si le joueur a perdu
  let isGameOver = wrongGuesses >= maxWrongGuesses;

  // Préparer le message de fin de jeu
  let resultMessage = null;
  if (isWon) {
    resultMessage = <div className="win">Bravo ! Tu as trouvé le mot : {word}</div>;
  } 
  else if (isGameOver) {
    resultMessage = <div className="lose">Dommage ! Le mot caché était : {word}</div>;
  }

  return (
    <div className="container">
        <p className="word">{displayWord()}</p>

        <p className="tries">Essais restants: {maxWrongGuesses - wrongGuesses}</p>

        <Keyboard onLetterClick={letterClickHandler} guessedLetters={guessedLetters} disabledBtn={isGameOver || isWon}/>

        {resultMessage}
    </div>
  );
}
