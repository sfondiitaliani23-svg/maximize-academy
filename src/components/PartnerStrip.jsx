import React from 'react';

// Fascia dei partner sotto la home: i loghi ben visibili, ognuno porta alla sua sezione.
const partners = [
  { href: '/formazione', src: '/assets/loghi/mens-events.webp', alt: "Men's Events Education", w: 1074 },
  { href: '/sabey', src: '/assets/loghi/sabey.webp', alt: 'Sabey Scissors Italy Hand Made', w: 1549 },
  { href: '/anaqa', src: '/assets/loghi/anaqa.webp', alt: 'ANAQA Men Creation', w: 1169 },
  { href: '/treatwell', src: '/assets/loghi/treatwell.webp', alt: 'Treatwell', w: 1293, h: 'h-7 sm:h-9' },
];

export default function PartnerStrip() {
  return (
    <section className="bg-[#181818] border-b border-[#3d3d3d] px-[clamp(1.25rem,6vw,4.5rem)] py-10" aria-labelledby="partner-title">
      <p id="partner-title" className="text-sm font-bold uppercase tracking-[0.16em] text-amber-400 mb-8 text-center lg:text-left">
        I partner dell'ecosistema
      </p>
      <ul className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10 items-center list-none m-0 p-0">
        {partners.map((p) => (
          <li key={p.src} className="flex justify-center">
            <a href={p.href} className="block opacity-90 hover:opacity-100 transition-opacity" aria-label={p.alt}>
              <img src={p.src} alt={p.alt} width={p.w} height="240" loading="lazy" className={`${p.h || 'h-9 sm:h-11'} w-auto max-w-full object-contain`} />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
