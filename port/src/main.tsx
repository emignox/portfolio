import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter as Router } from 'react-router-dom';  // Importa Router
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>  {/* Avvolgi App nel Router */}
      <App />
    </Router>
  </React.StrictMode>,
);
