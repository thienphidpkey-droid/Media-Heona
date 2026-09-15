import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import './index.css';

const rootElement = document.getElementById('root');

if (rootElement) {
  const app = (
    <React.StrictMode>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </React.StrictMode>
  );

  if (rootElement.dataset.prerendered === 'true') {
    hydrateRoot(rootElement, app, {
      onRecoverableError(err) {
        if (import.meta.env.DEV) {
          console.warn('[Hydration Notice]:', err);
        }
      }
    });
  } else {
    createRoot(rootElement).render(app);
  }
}
