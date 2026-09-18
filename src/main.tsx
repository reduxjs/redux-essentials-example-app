import React from 'react'
import { createRoot } from 'react-dom/client'

import App from './App'

import { worker } from './api/server'

import './primitiveui.css'
import './index.css'

// Wrap app rendering so we can wait for the mock API to initialize
async function start() {
  // Start our mock API server
  worker.listen({ onUnhandledRequest: 'bypass' })

  const root = createRoot(document.getElementById('root')!)

  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
}

start()
