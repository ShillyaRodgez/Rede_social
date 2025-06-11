import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Aplicar estilos globais ao body
document.body.style.backgroundColor = '#f5f5dc';
document.body.style.fontFamily = 'Arial, sans-serif';
document.body.style.margin = '0';
document.body.style.padding = '0';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);