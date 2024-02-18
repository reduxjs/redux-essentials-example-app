import React from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-tiny-toast'

import { useAppSelector } from './app/hooks'
import { Navbar } from './components/Navbar'
import { LoginPage } from './features/auth/LoginPage'
import { PostsList } from './features/posts/PostsList'
import { AddPostForm } from './features/posts/AddPostForm'
import { SinglePostPage } from './features/posts/SinglePostPage'
import { EditPostForm } from './features/posts/EditPostForm'

function Posts() {
  return (
    <div>
      <AddPostForm />
      <PostsList />
    </div>
  )
}

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useAppSelector((state) => state.auth.username)

  if (!user) {
    return <Navigate to="/" replace />
  }

  return children
}

function App() {
  return (
    <Router>
      <Navbar />
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route
            path="/posts"
            element={
              <ProtectedRoute>
                <Posts />
              </ProtectedRoute>
            }
          ></Route>
          <Route
            path="/posts/:postId"
            element={
              <ProtectedRoute>
                <SinglePostPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/editPost/:postId"
            element={
              <ProtectedRoute>
                <EditPostForm />
              </ProtectedRoute>
            }
          />
        </Routes>
        <ToastContainer />
      </div>
    </Router>
  )
}

export default App
