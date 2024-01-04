import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { store } from './store'
import { Provider } from 'react-redux'
import { GlobalSnackBar } from './features/index.ts'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <GlobalSnackBar/>
      <App />
    </Provider>
  </React.StrictMode>,
)
