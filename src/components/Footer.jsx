import React from 'react';
import { pages, brandLinks } from '../routes';

// Footer con slogan, colonne Esplora / Seguici / Sede e la scritta MAXIMIZE gigante in filo d'oro.
const WA = 'https://wa.me/393917163833?text=Salve%20Maurizio,%20vorrei%20informazioni%20su%20Maximize%20Academy';
const ico = 'w-[18px] h-[18px] shrink-0';
const social = [
  {
    href: 'https://www.instagram.com/mauriziobarbershop_fg/',
    label: 'Instagram',
    icon: (
      <svg className={ico} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r=".8" fill="currentColor" />
      </svg>
    ),
  },
  {
    href: 'https://www.tiktok.com/@mauriziobarbershop_fg',
    label: 'TikTok',
    icon: (
      <svg className={ico} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M16.6 5.8A4.3 4.3 0 0 1 15.5 3h-3.1v12.4a2.6 2.6 0 1 1-2.6-2.6c.3 0 .5 0 .8.1V9.7a5.7 5.7 0 1 0 4.9 5.7V9.1a7.3 7.3 0 0 0 4.3 1.4V7.4a4.3 4.3 0 0 1-3.2-1.6z" />
      </svg>
    ),
  },
  {
    href: WA,
    label: 'WhatsApp',
    icon: (
      <svg className={ico} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 21l2.1-5.5A8.4 8.4 0 1 1 21 11.5Z" />
      </svg>
    ),
  },
];

const h3 = 'm-0 mb-4 text-[0.85rem] font-bold uppercase tracking-[0.14em] text-[#f4f4f4]';
const link = 'inline-flex items-center gap-2 min-h-[36px] hover:text-amber-400 transition-colors';

export default function Footer() {
  return (
    <footer className="relative z-20 overflow-hidden bg-[#111111] border-t border-[#3d3d3d] text-[#bdbdbd]">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr] gap-10 px-[clamp(1.25rem,6vw,4.5rem)] pt-16 pb-8">
        <div className="sm:col-span-2 lg:col-span-1">
          <p className="m-0 mb-4 max-w-[22ch] text-[clamp(1.6rem,1.2rem+1.2vw,2rem)] leading-tight text-[#f4f4f4]">
            Non solo Barber. <span className="text-amber-400">Molto di più.</span>
          </p>
          <a
            href={WA}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 pb-1 border-b border-amber-400 text-amber-400 uppercase tracking-[0.12em] hover:text-[#d2b67f] hover:border-[#d2b67f] transition-colors"
          >
            {social[2].icon}
            Parla con Maurizio
          </a>
        </div>

        <nav aria-label="Pagine del sito">
          <h3 className={h3}>Esplora</h3>
          <ul className="m-0 p-0 list-none">
            {pages.map((p) => (
              <li key={p.path}><a href={p.path} className={link}>{p.label}</a></li>
            ))}
            {/* Collegamento al negozio: ok di Maurizio del 26/10/2026. */}
            <li><a href={brandLinks.maurizioBarberShop} target="_blank" rel="noopener noreferrer" className={link}>Maurizio Barber Shop</a></li>
          </ul>
        </nav>

        <div>
          <h3 className={h3}>Seguici</h3>
          <ul className="m-0 p-0 list-none">
            {social.map((s) => (
              <li key={s.href}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" className={link}>{s.icon}{s.label}</a>
              </li>
            ))}
          </ul>
          <h3 className={`${h3} mt-6`}>Sede</h3>
          <p className="m-0 leading-[1.7]">
            Via Benedetto Croce 8<br />71121 Foggia<br />
            <a href="mailto:mauriziomaximize@gmail.com" className="hover:text-amber-400 transition-colors">mauriziomaximize@gmail.com</a>
          </p>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="select-none whitespace-nowrap text-center font-bold leading-none text-transparent text-[clamp(4.5rem,15vw,15rem)] tracking-[0.02em] pt-4 pb-[clamp(1rem,2vw,2rem)] [-webkit-text-stroke:1px_rgba(191,161,106,0.55)]"
      >
        MAXIMIZE
      </div>

      <div className="flex flex-wrap justify-between gap-x-4 gap-y-1 border-t border-[#3d3d3d] px-[clamp(1.25rem,6vw,4.5rem)] pt-5 pb-24 sm:pb-5 sm:pr-[calc(clamp(1.25rem,6vw,4.5rem)+5rem)] text-[0.8rem]">
        <small className="text-[0.8rem]">© 2026 Maximize Academy S.r.l.s. · P. IVA 02147290767</small>
        <a href="/privacy.html" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-amber-400 transition-colors">
          Privacy e cookie
        </a>
      </div>
    </footer>
  );
}
