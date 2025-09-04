import React from 'react';
import ReactDOM from 'react-dom/client';
import { Analytics } from "@vercel/analytics/react";
import App from './App';
import './index.css';
import './sw-registration';

// Set default theme to light mode
localStorage.setItem('theme', 'light');

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
    <Analytics />
  </React.StrictMode>
);