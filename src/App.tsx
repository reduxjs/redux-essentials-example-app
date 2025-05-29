import React from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'

import { useAppSelector } from './app/hooks'
import { Navbar } from './components/Navbar'
import { SinglePostPage } from './features/posts/SinglePostPage'
import { PostsMainPage } from './features/posts/PostsMainPage'
import { EditPostForm } from './features/posts/EditPostForm'
import { LoginPage } from './features/auth/LoginPage'
import { selectCurrentUsername } from './features/auth/authSlice'
import { UserPage } from './features/users/UserPage'
import { UsersList } from './features/users/UsersList'
import { NotificationsList } from './features/notifications/NotificationsList'
import { ToastContainer } from 'react-tiny-toast'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const username = useAppSelector(selectCurrentUsername)

  if (!username) {
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
            path="/*"
            element={
              <ProtectedRoute>
                <Routes>
                  <Route path="/posts" element={<PostsMainPage />} />
                  <Route path="/posts/:postId" element={<SinglePostPage />} />
                  <Route path="/editPost/:postId" element={<EditPostForm />} />

                  <Route path="/users" element={<UsersList />} />
                  <Route path="/users/:userId" element={<UserPage />} />

                  <Route path="/notifications" element={<NotificationsList />} />
                </Routes>
                <ToastContainer />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App
