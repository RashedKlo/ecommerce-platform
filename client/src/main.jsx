import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter as Router } from 'react-router-dom'
const basename = import.meta.env.DEV ? "/" : "/E-Commerce-Platform/";
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router
      basename={basename}
      future={{
        v7_relativeSplatPath: true,
        v7_startTransition: true,
      }}
    >
      <App />
    </Router>
  </StrictMode >
)
