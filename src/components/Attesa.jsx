import React from 'react';

// Attesa (14/11/2026): anello che gira + testo, al posto di «Caricamento…» e «Attendi…».
// Forma dell'anello da Loading UI (loading-ui.com, licenza MIT, © 2026 Bartosz Zagrodzki), nei colori di Maximize.
// Con movimento ridotto l'anello resta fermo (motion-reduce).
export function Anello({ className = 'w-4 h-4' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={`${className} animate-spin motion-reduce:animate-none`}>
      <path d="M21 12a9 9 0 1 1-6.22-8.56" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

export default function Attesa({ testo = 'Caricamento…', className = 'ap-soft' }) {
  return (
    <p className={`${className} inline-flex items-center gap-2`} role="status">
      <Anello className="w-4 h-4 text-amber-400" />
      <span>{testo}</span>
    </p>
  );
}
