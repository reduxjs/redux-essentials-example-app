import React from 'react'

import { client } from './api/client'

import { PostsList } from './features/posts/PostsList'
import { AddPostForm } from './features/posts/AddPostForm'

function App() {
  return (
    <div className="App">
      <nav>
        <section>
          <h1>Redux Quick Start Example</h1>
        </section>
      </nav>
      <AddPostForm />
      <PostsList />
    </div>
  )
}

export default App
