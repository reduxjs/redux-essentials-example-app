import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom'

import { Navbar } from './components/Navbar'
import { PostsList } from './features/posts/PostsList'
import { AddPostForm } from './features/posts/AddPostForm'
import { SinglePostPage } from './features/posts/SinglePostPage'

function Posts() {
  return (
    <div>
      <AddPostForm />
      <PostsList />
    </div>
  )
}

function App() {
  return (
    <Router>
      <Navbar />
      <div className="App">
        <Routes>
          <Route path="/" element={<Posts />}></Route>
          <Route path="/posts/:postId" element={<SinglePostPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
