// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/global.css';   // ← Design system global (prima linie de stiluri)
import './styles/dark.css';
import './index.css';             // ← Stiluri locale suplimentare (dacă există)
import './styles/responsive.css'; // ← Responsive overrides (ultimul import)
import App from './App';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
