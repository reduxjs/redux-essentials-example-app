import React from 'react'
import logo from './logo.svg'
import './App.css'

import { client } from './api/client'

function App() {
  const fetchMovies = async () => {
    const promises = ['users', 'posts', 'comments'].map((name) =>
      client.get(`/fakeApi/${name}`)
    )
    const [users, posts, comments] = await Promise.all(promises)
    console.log({ users, posts, comments })

    const post = await client(`/fakeApi/posts/1`)
    console.log(post)
  }

  const fetchFailure = async () => {
    try {
      await client.get('/fakeApi/doesNotExist')
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
