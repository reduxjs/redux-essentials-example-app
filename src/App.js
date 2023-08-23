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
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
