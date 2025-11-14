import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';

// Global error handler to catch unhandled exceptions
window.onerror = function(message, source, lineno, colno, error) {
  console.error("Uncaught error:", {
    message,
    source,
    lineno,
    colno,
    error
  });
  // This can be expanded to send errors to a logging service
  return true; // Prevents the default browser error handling
};

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

console.log('Rendering app...');

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);