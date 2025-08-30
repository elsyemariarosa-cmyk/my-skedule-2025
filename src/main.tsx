import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log('My-Skedule: Starting application...');
const rootElement = document.getElementById("root");
console.log('My-Skedule: Root element found:', rootElement);

if (rootElement) {
  console.log('My-Skedule: Creating React root and rendering App...');
  createRoot(rootElement).render(<App />);
} else {
  console.error('My-Skedule: Root element not found!');
}
