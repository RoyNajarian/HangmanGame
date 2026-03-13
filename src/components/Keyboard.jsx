// Function Keyboard avec comme propos : onLetterClick pour appeler la fonction parent, guessedLetters pour savoir quelles lettres ont déjà été devinées, et disabledBtn pour désactiver le clavier si le jeu est terminé.
export function Keyboard({ onLetterClick, guessedLetters, disabledBtn }) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('') // Split permet de décoper la string en un tableau de lettres

    return (
        <div className="keyboard">
            {alphabet.map(letter => ( // On mappe chaque lettre de l'alphabet pour créer un bouton
                <button key={letter} onClick={() => onLetterClick(letter.toLowerCase())} disabled={guessedLetters.includes(letter.toLowerCase()) || disabledBtn}>{letter}</button> // Création du bouton avec la lettre, ou l'on peut cliquer dessus (Onclick) et qui est désactivé le clavier si la lettre a déjà été devinée ou si le jeu est terminé
            ))}
        </div>
    )
}