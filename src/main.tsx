import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { store } from './store'
import { Provider } from 'react-redux'
import { AppSettings, GlobalSnackBar } from './features/index.ts'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <GlobalSnackBar/>
      <AppSettings/>
      <App />
    </Provider>
  </React.StrictMode>,
)
