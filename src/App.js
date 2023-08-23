import React from 'react'
import { Route, BrowserRouter, Routes } from 'react-router-dom'

import { Navbar } from './app/Navbar'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={
              <section>
                <h2>Welcome to the Redux Essentials example app!</h2>
              </section>
            }
          />
          {/* use `const { postId } = useParams()` in components to access params */}
          {/* use `const navigate = useNavigate(); navigate('/')` instead `const history = useHistory(); history.push(`/posts/${postId}`)`*/}
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
