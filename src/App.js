import React from 'react'

import { client } from './api/client'

import { PostsList } from './features/posts/PostsList'

function App() {
  return (
    <div className="App">
      <PostsList />
    </div>
  )
}

export default App
