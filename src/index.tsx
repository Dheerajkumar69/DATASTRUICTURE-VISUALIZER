import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Analytics } from "@vercel/analytics/react";
import App from './App';
import './index.css';
import './sw-registration';

// Set default theme to light mode
localStorage.setItem('theme', 'light');

// Set default theme to light mode
localStorage.setItem('theme', 'light');

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
    <Analytics />
  </React.StrictMode>
);