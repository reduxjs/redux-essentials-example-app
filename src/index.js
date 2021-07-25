import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import store from './app/store'
import { Provider } from 'react-redux'

import { extendedApi } from './features/users/usersSlice'

import { worker } from './api/browser'

store.dispatch(extendedApi.endpoints.getUsers.initiate())

const renderApp = () => {
  ReactDOM.render(
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>,
    document.getElementById('root')
  )
}

if (process.env.NODE_ENV === 'development') {
  worker.start({ onUnhandledRequest: 'bypass' }).then(() => {
    renderApp()
    // worker.printHandlers() // Optional: nice for debugging to see all available route handlers that will be intercepted
  })
} else {
  renderApp()
}
