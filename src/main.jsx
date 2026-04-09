import React from 'react'
import ReactDom from 'react-dom/client'
import App from './App.jsx'

// 1. Inyectamos Tailwind CSS directamente
const tailwindScript = document.createElement('script');
tailwindScript.src = 'https://cdn.tailwindcss.com';
document.head.appendChild(tailwindScript);

// 2. ELIMINADOR DE ESTILOS POR DEFECTO (El "mata-fondos-negros")
// Esto fuerza a que la pantalla sea clara y se acomode, 
// ignorando cualquier CSS viejo o rebelde de Vite.
document.body.style.backgroundColor = "#f5f5f5";
document.body.style.color = "#171717";
document.body.style.margin = "0";
document.body.style.display = "block";
document.body.style.placeItems = "normal";
document.body.style.minHeight = "100vh";

const rootElement = document.getElementById('root');
if (rootElement) {
  rootElement.style.maxWidth = "100%";
  rootElement.style.margin = "0";
  rootElement.style.padding = "0";
  rootElement.style.textAlign = "left";
}

ReactDom.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)