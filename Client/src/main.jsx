import React from 'react'
import { createRoot } from 'react-dom/client';
import App from './App.jsx'
import './index.css'

const appRoot = document.getElementById('root');

if (appRoot) {
  createRoot(appRoot).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
