import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css'; // Global CSS for Tailwind and font import
import App from './App'; // The main App component

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);