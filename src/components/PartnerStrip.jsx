import React from 'react';

// Fascia dei partner sotto la home: i loghi ben visibili, ognuno porta alla sua sezione.
const partners = [
  { href: '/formazione', src: '/assets/loghi/uaami.webp', alt: 'UAAMI – Unione Artistica Acconciatori Misti Italiani', w: 600, ht: 600, h: 'h-20 sm:h-24' },
  { href: '/sabey', src: '/assets/loghi/sabey.webp', alt: 'Sabey Scissors Italy Hand Made', w: 1549 },
  { href: '/anaqa', src: '/assets/loghi/anaqa.webp', alt: 'ANAQA Men Creation', w: 1169 },
  { href: '/treatwell', src: '/assets/loghi/treatwell.webp', alt: 'Treatwell', w: 1293, h: 'h-7 sm:h-9' },
  { href: '/mxe', src: '/assets/loghi/mxe-monogramma-oro.svg', alt: 'M×E Barber Lab', w: 1445, ht: 945, h: 'h-16 sm:h-20', caption: 'M×E Barber Lab' },
];

export default function PartnerStrip() {
  return (
    <section className="bg-[#181818] border-b border-[#3d3d3d] px-[clamp(1.25rem,6vw,4.5rem)] py-10" aria-labelledby="partner-title">
      <p id="partner-title" className="text-sm font-bold uppercase tracking-[0.16em] text-amber-400 mb-8 text-center lg:text-left">
        I partner dell'ecosistema
      </p>
      <ul className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-x-6 gap-y-10 items-center list-none m-0 p-0">
        {partners.map((p) => (
          <li key={p.src} className="flex justify-center max-sm:[&:nth-child(5)]:col-span-2">
            <a href={p.href} className="flex flex-col items-center gap-3 opacity-90 hover:opacity-100 transition-opacity" aria-label={p.alt}>
              <img src={p.src} alt={p.alt} width={p.w} height={p.ht || 240} loading="lazy" className={`${p.h || 'h-9 sm:h-11'} w-auto max-w-full object-contain`} />
              {p.caption && <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.14em] text-[#f4f4f4] text-center">{p.caption}</span>}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
