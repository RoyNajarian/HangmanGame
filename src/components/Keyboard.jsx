import { useEffect } from "react"

export function Keyboard({ onLetterClick, guessedLetters, disabledBtn }) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('') // Split permet de décoper la string en un tableau de lettres

    useEffect(() => {
        const handleKeyDown = (event) => {
            const letter = event.key.toLowerCase(); // Convertit la lettre en minuscule pour la comparer avec les lettres devinées

            if (letter.length === 1 && letter >= 'a' && letter <= 'z' && !guessedLetters.includes(letter) && !disabledBtn) {
                onLetterClick(letter);
            }
        }
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onLetterClick, guessedLetters, disabledBtn])

    return (
        <div className="keyboard">
            {alphabet.map(letter => ( // On mappe chaque lettre de l'alphabet pour créer un bouton
                <button key={letter} onClick={() => onLetterClick(letter.toLowerCase())} disabled={guessedLetters.includes(letter.toLowerCase()) || disabledBtn}>{letter}</button> // Création du bouton avec la lettre, ou l'on peut cliquer dessus (Onclick) et qui est désactivé le clavier si la lettre a déjà été devinée ou si le jeu est terminé
            ))}
        </div>
    )
}