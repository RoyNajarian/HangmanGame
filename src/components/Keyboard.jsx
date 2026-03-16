import { useEffect } from "react";

// Composant qui affiche le clavier pour que le joueur puisse cliquer sur les lettres, et qui gère également les événements de clavier pour permettre au joueur de jouer en utilisant son clavier physique
export function Keyboard({ onLetterClick, guessedLetters, disabledBtn }) { // Props : onLetterClick (fonction de gestion du clic sur une lettre), guessedLetters (tableau des lettres déjà devinées), disabledBtn (booléen pour désactiver le clavier si le jeu est terminé ou pas encore commencé)
  const alphabet = "abcdefghijklmnopqrstuvwxyz".split(""); // Split permet de découper la string en un tableau de lettres

  useEffect(() => {
    const handleKeyDown = (event) => {
      // Fonction qui gère les événements de clavier, appelée à chaque fois que le joueur appuie sur une touche du clavier
      const letter = event.key.toLowerCase(); // Récupère la lettre appuyée et la convertit en minuscule (en cas ou le joueur écrit en majuscule) pour la comparer avec les lettres devinées qui sont en minuscule

      // Si la touche appuyée est une lettre (longueur de 1, entre 'a' et 'z'), que cette lettre n'a pas déjà été devinée (pas dans guessedLetters) et que le clavier n'est pas désactivé (disabledBtn est false), alors on appelle la fonction onLetterClick avec cette lettre pour traiter la devinette
      if (letter.length === 1 && letter >= "a" && letter <= "z" && !guessedLetters.includes(letter) && !disabledBtn) {
        onLetterClick(letter);
      }
    };
    window.addEventListener("keydown", handleKeyDown); // Ajoute un écouteur d'événements pour les touches du clavier, qui appelle handleKeyDown à chaque fois que le joueur appuie sur une touche

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onLetterClick, guessedLetters, disabledBtn]); // Dès que les props onLetterClick, guessedLetters ou disabledBtn changent, l'effet se réexécute pour mettre à jour le gestionnaire d'événements de clavier avec les nouvelles valeurs des props

  return (
    <div className="keyboard">

      {alphabet.map((letter) => ( // On mappe (parcours) chaque lettre de l'alphabet pour créer les boutons du clavier à partir du tableau alphabet

          /* 
          - Création du bouton avec la lettre, ou l'on peut cliquer dessus (Onclick) et qui est désactivé le clavier si la lettre a déjà été devinée ou si le jeu est terminé
          - La key est une "plaque d'immatriculation" unique qui permet à React d'identifier chaque bouton pour mettre à jour l'affichage de manière ultra-rapide sans avoir à tout reconstruire.
          - La syntaxe () => sert à "emballer" l'appel de fonction pour qu'il ne se déclenche qu'au moment du clic, tout en permettant de lui passer la lettre spécifique en paramètre.
          - Sert à verrouiller le bouton soit parce que la lettre a déjà été utilisée, soit parce que la partie est terminée (victoire ou défaite), empêchant ainsi toute action inutile du joueur
          */
          <button key={letter} onClick={() => onLetterClick(letter)} disabled={guessedLetters.includes(letter) || disabledBtn}>{letter}</button>
        ),
      )}
    </div>
  );
}
