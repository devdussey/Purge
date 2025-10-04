import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ThemeProvider } from './contexts/ThemeContext';
import { UITestProvider } from './contexts/UITestContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <UITestProvider>
        <App />
      </UITestProvider>
    </ThemeProvider>
  </StrictMode>
);
