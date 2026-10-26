import React from 'react';
import ReactDOM from 'react-dom/client';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

// Le statistiche di Vercel funzionano solo sul suo indirizzo (su Cloudflare il loro script non esiste).
const ON_VERCEL = /\.vercel\.app$/.test(window.location.hostname);
import App from './App';
import './index.css';
import './storie.css';
import './gestione.css';
import { startAutoUpdate } from './autoUpdate';

startAutoUpdate();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    {ON_VERCEL && <Analytics />}
    {ON_VERCEL && <SpeedInsights />}
  </React.StrictMode>
);
