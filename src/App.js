import React from 'react'
import logo from './logo.svg'
import { Counter } from './features/counter/Counter'
import './App.css'

import { client } from './api/client'

function App() {
  const fetchMovies = async () => {
    const movies = await client('/api/movies')
    console.log(movies)
  }

  const fetchFailure = async () => {
    try {
      await client('/fakeApi/doesNotExist')
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={fetchMovies}>Fetch Movies</button>
        <button onClick={fetchFailure}>Fetch Failure</button>
        <Counter />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
      </header>
    </div>
  )
}

export default App
