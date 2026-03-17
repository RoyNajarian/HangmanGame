import { useState, useEffect } from 'react'
import { HangmanGame } from './components/HangmanGame'

function App() {
  return (
    <div className="affichage">
      <h1>Hangman Game</h1>
      <HangmanGame />
    </div>
  )
}

export default App
