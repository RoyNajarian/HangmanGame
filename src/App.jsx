import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [word, setWord] = useState(null)
  const [guesseWord, setGuesseWord] = useState([])

  useEffect(() => {
    fetch("http://localhost:3333/", {
      method: "POST",
      body: new URLSearchParams({ locale: "fr-FR" }),
    })
      .then((response) => response.json())
      .then((data) => setWord(data.word))
  }, [])

  return (
    <div>
      <h1>Hangman Game</h1>
      <p>Mot que vous devez deviner : {word}</p>
    </div>
  )
}

export default App
