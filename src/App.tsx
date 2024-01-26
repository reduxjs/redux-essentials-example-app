import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom'

import { Navbar } from './components/Navbar'

function App() {
  return (
    <Router>
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
          ></Route>
        </Routes>
      </div>
    </Router>
  )
}

export default App
