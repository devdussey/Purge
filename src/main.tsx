import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ThemeProvider } from './contexts/ThemeContext';
import { UITestProvider } from './contexts/UITestContext';
import { initializeFirebase } from './config/firebase';

// Initialize Firebase on app startup
try {
  initializeFirebase();
} catch (error) {
  console.error('Failed to initialize Firebase:', error);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <UITestProvider>
        <App />
      </UITestProvider>
    </ThemeProvider>
  </StrictMode>
);
