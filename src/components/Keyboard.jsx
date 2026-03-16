import { useEffect } from "react";
export function Keyboard({ onLetterClick, guessedLetters, disabledBtn }) {
  const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");

  useEffect(() => {
    const handleKeyDown = (event) => {
      const letter = event.key.toLowerCase();
      if (letter.length === 1 && letter >= "a" && letter <= "z" && !guessedLetters.includes(letter) && !disabledBtn) {
        onLetterClick(letter);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onLetterClick, guessedLetters, disabledBtn]);

  return (
    <div className="keyboard">
      {alphabet.map((letter) => (
        <button key={letter} onClick={() => onLetterClick(letter)} disabled={guessedLetters.includes(letter) || disabledBtn}>{letter}</button>
      ))}
    </div>
  );
}
