import React from 'react';

// Barra in alto come Maurizio Barber Shop: fondo nero pieno, menu in testo semplice,
// azione principale in oro con un filo verticale, pulsante "Menu" su telefono.
import { pages } from '../routes';
const links = pages.map((p) => ({ href: p.path, label: p.label }));

export default function Navbar({ currentPath = '/', onOpenMobileMenu }) {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between gap-4 h-[var(--header-h)] px-[clamp(1.25rem,6vw,4.5rem)] bg-[#111111]">
      <a href="/" className="shrink-0" aria-label="Maximize Academy, torna all'inizio">
        <img
          src="/assets/img/logo-maximize.webp"
          alt="Maximize Academy"
          width="181"
          height="224"
          className="h-12 sm:h-14 w-auto"
          decoding="async"
        />
      </a>

      <nav className="hidden xl:flex items-center gap-6 text-sm text-[#bdbdbd]" aria-label="Navigazione principale">
        {links.map((l) => (
          <a key={l.href} href={l.href} aria-current={currentPath === l.href ? 'page' : undefined} className={`min-h-[44px] inline-flex items-center whitespace-nowrap hover:text-amber-400 transition-colors ${currentPath === l.href ? 'text-amber-400' : ''}`}>
            {l.label}
          </a>
        ))}
      </nav>

      <div className="flex items-center gap-2">
        <a
          href="https://wa.me/393917163833?text=Salve%20Maurizio,%20vorrei%20informazioni%20su%20Maximize%20Academy"
          target="_blank"
          rel="noopener noreferrer"
          className="relative inline-flex items-center gap-2 min-h-[44px] pr-4 mr-2 text-amber-400 font-bold whitespace-nowrap hover:text-white transition-colors after:content-[''] after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:w-px after:h-6 after:bg-amber-400/45 xl:pr-0 xl:mr-0 xl:after:hidden"
          aria-label="Parla con Maurizio su WhatsApp"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 21l2.1-5.5A8.4 8.4 0 1 1 21 11.5Z" />
          </svg>
          <span className="hidden sm:inline">Parla con Maurizio</span>
        </a>

        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="xl:hidden inline-flex items-center gap-2 min-h-[44px] px-2 text-white hover:text-amber-400 transition-colors"
          aria-label="Apri il menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span className="text-sm uppercase tracking-wider">Menu</span>
        </button>
      </div>
    </header>
  );
}
