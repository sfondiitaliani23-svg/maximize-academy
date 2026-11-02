import React from 'react';

// Barra in basso dell'app installata (02/11/2026), come su Maurizio Barber Shop e Barberia Garofalo:
// Home · Formazione · Contatti · Area privata · WhatsApp. Nel browser normale non compare (decide App.jsx con isAppMode()).
const WA = 'https://wa.me/393245878724?text=Salve,%20vorrei%20informazioni%20su%20Maximize%20Academy';

const ICONS = {
  home: (<><path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V21h14V9.5" /><path d="M10 21v-6h4v6" /></>),
  learn: (<><path d="M2 9.5 12 5l10 4.5-10 4.5z" /><path d="M6 11.5V16c0 1.4 2.7 3 6 3s6-1.6 6-3v-4.5" /><path d="M22 9.5v5" /></>),
  contact: (<><path d="M21 15.5a2 2 0 0 1-2 2H8l-5 4V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /><path d="M8 9.5h8M8 13h5" /></>),
  area: (<><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>),
  wa: (<><path d="M21 12a9 9 0 0 1-13.4 7.8L3 21l1.3-4.4A9 9 0 1 1 21 12z" /><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.5-2-1-1 .8c-1-.5-1.8-1.3-2.3-2.3l.8-1-1-2z" /></>),
};

export default function AppDock({ currentPath }) {
  const items = [
    { key: 'home', label: 'Home', href: '/', active: currentPath === '/' },
    { key: 'learn', label: 'Formazione', href: '/formazione', active: currentPath === '/formazione' },
    { key: 'contact', label: 'Contatti', href: '/contatti', active: currentPath === '/contatti' },
    { key: 'area', label: 'Area privata', href: '/area' },
    { key: 'wa', label: 'WhatsApp', href: WA, external: true },
  ];
  return (
    <nav className="mx-dock" aria-label="Navigazione dell’app">
      {items.map((it, i) => (
        <a
          key={it.key}
          href={it.href}
          className={`mx-dock-item${it.active ? ' is-active' : ''}`}
          data-tooltip={it.label}
          aria-label={it.label}
          aria-current={it.active ? 'page' : undefined}
          style={{ '--i': i }}
          {...(it.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          <svg className="mx-dock-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">{ICONS[it.key]}</svg>
          <i className="mx-dock-dot" aria-hidden="true" />
        </a>
      ))}
    </nav>
  );
}
