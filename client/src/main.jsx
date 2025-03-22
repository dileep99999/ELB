import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'
// import setupMockApi from './utils/mockApi'

// Initialize mock API interceptor for GitHub Pages deployment
// Disabled to use the real backend
// if (!import.meta.env.DEV) {
//   setupMockApi();
//   console.log('[Mock API] Initialized mock API for GitHub Pages deployment');
// }

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router basename="/ELB">
      <App />
    </Router>
  </React.StrictMode>,
)