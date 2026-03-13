import { useState, useEffect } from 'react'
import './App.css'
import { HangmanGame } from './components/HangmanGame'

function App() {
  return (
    <div className="Affichage">
      <h1>Hangman Game</h1>
      <HangmanGame />
    </div>
  )
}

export default App
