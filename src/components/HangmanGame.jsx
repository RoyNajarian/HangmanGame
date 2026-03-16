import { useState, useEffect } from "react";
import { Keyboard } from "./Keyboard";
import { Popup } from "./Popup";
import "./HangmanGame.css";

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

export function HangmanGame() {
  const [word, setWord] = useState(null);
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [lang, setLang] = useState("fr");
  const maxWrongGuesses = 6;

  const fetchAPI = (currentLang) => {
    fetch("http://localhost:3333/", {
      method: "POST",
      body: new URLSearchParams({ locale: currentLang }),
    })
      .then((response) => response.json())
      .then((data) => setWord(data.word));
  };

  useEffect(() => {
    fetchAPI(trad[lang].locale);
  }, []);

  const restartGame = () => {
    setWord(null);
    setGuessedLetters([]);
    setWrongGuesses(0);
    setHasStarted(true);
    fetchAPI(trad[lang].locale);
  };

  const changeLang = () => {
    let newLang;
    if (lang === "fr") {
      newLang = "en";
    } 
    else {
      newLang = "fr";
    }
    setLang(newLang);
  };

  const letterClickHandler = (letter) => {
    if (!word) {
      return;
    }
    setGuessedLetters([...guessedLetters, letter]);
    if (!word.toLowerCase().includes(letter)) {
      setWrongGuesses(wrongGuesses + 1);
    }
  };

  const displayWord = () => {
    if (!word) {
      return;
    }

    let result = "";
    for (let letter of word) {
      if (letter === "-") {
        result += "\u00A0\u00A0";
      } 
      else if (guessedLetters.includes(letter)) {
        result += letter + " ";
      } 
      else {
        result += "_ ";
      }
    }
    return result;
  };

  let isWon = false;
  if (word) {
    isWon = true;
    for (let letter of word) {
      if (letter !== "-" && !guessedLetters.includes(letter)) {
        isWon = false;
        break;
      }
    }
  }

  let isGameOver = wrongGuesses >= maxWrongGuesses;

  let resultMessage = null;

  let langLabel;
  if (lang === "fr") {
    langLabel = "EN";
  } 
  else {
    langLabel = "FR";
  }

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
  } 
  else if (isWon) {
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
  else if (isGameOver) {
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
        <p className="tries">{trad[lang].tries} {maxWrongGuesses - wrongGuesses}</p>

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
