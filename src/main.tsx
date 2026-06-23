import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx' // Garanta que essa linha está puxando o seu App correto

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)