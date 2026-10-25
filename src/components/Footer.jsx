import React from 'react';
import { pages } from '../routes';

// Footer minimale centrato: logo, motto, menu su una riga, social tondi, dati legali.
const social = [
  {
    href: 'https://www.instagram.com/mauriziobarbershop_fg/',
    label: 'Instagram di Maurizio Barber Shop',
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r=".8" fill="currentColor" />
      </svg>
    ),
  },
  {
    href: 'https://www.tiktok.com/@mauriziobarbershop_fg',
    label: 'TikTok di Maurizio Barber Shop',
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
        <path d="M16.6 5.8A4.3 4.3 0 0 1 15.5 3h-3.1v12.4a2.6 2.6 0 1 1-2.6-2.6c.3 0 .5 0 .8.1V9.7a5.7 5.7 0 1 0 4.9 5.7V9.1a7.3 7.3 0 0 0 4.3 1.4V7.4a4.3 4.3 0 0 1-3.2-1.6z" />
      </svg>
    ),
  },
  {
    href: 'https://wa.me/393917163833?text=Salve%20Maurizio,%20vorrei%20informazioni%20su%20Maximize%20Academy',
    label: 'Scrivi a Maurizio su WhatsApp',
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 21l2.1-5.5A8.4 8.4 0 1 1 21 11.5Z" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="relative z-20 bg-[#111111] border-t border-[#3d3d3d] text-[#bdbdbd]">
      <div className="flex flex-col items-center gap-6 px-[clamp(1.25rem,6vw,4.5rem)] pt-16 pb-12 text-center">
        <a href="/" className="logo-link" aria-label="Maximize Academy, torna all'inizio">
          <img src="/assets/img/logo-maximize.webp" alt="Maximize Academy" width="181" height="224" className="h-[90px] w-auto" loading="lazy" decoding="async" />
        </a>

        <p className="m-0 text-[0.8rem] uppercase tracking-[0.3em] text-amber-400">
          Dalla barberia · Per le barberie
        </p>

        <nav aria-label="Pagine del sito" className="flex flex-wrap justify-center gap-x-6 sm:gap-x-8 gap-y-1 text-[0.9rem] uppercase tracking-[0.12em] text-[#f4f4f4]">
          {pages.map((p) => (
            <a key={p.path} href={p.path} className="min-h-[44px] inline-flex items-center hover:text-amber-400 transition-colors">
              {p.label}
            </a>
          ))}
        </nav>

        <div className="flex gap-4">
          {social.map((s) => (
            <a
              key={s.href}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              className="grid place-items-center w-[46px] h-[46px] rounded-full border border-[#3d3d3d] text-[#f4f4f4] hover:border-amber-400 hover:text-amber-400 transition-colors"
            >
              {s.icon}
            </a>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center gap-1 border-t border-[#3d3d3d] px-[clamp(1.25rem,6vw,4.5rem)] pt-5 pb-24 sm:pb-5 text-center text-[0.8rem]">
        <small className="text-[0.8rem]">
          Maximize Academy S.r.l.s. · Via Benedetto Croce 8, 71121 Foggia · P. IVA 02147290767 ·{' '}
          <a href="mailto:mauriziomaximize@gmail.com" className="hover:text-amber-400 transition-colors">mauriziomaximize@gmail.com</a>
        </small>
        <small className="text-[0.8rem]">
          © 2026 ·{' '}
          <a href="/privacy.html" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-amber-400 transition-colors">
            Privacy e cookie
          </a>
        </small>
      </div>
    </footer>
  );
}
