import React from 'react';

// Hero con la stessa impaginazione di Maurizio Barber Shop:
// testo a sinistra, ritratto a tutta altezza a destra con didascalia, striscia di dati sotto.
const gold = (t) => <strong className="text-amber-400 text-base font-bold">{t}</strong>;
// Ogni voce porta al sito del prodotto (marchi) o alla pagina di Maximize.
const tickerItems = [
  { content: <>{gold('Formazione')} internazionale</>, href: '/formazione' },
  { content: <>{gold('Barber Reset')} in barberia</>, href: '/barber-reset' },
  { content: <>Partner {gold("Men's Events Education")}</>, href: 'https://www.instagram.com/mensevents_education/', external: true },
  { content: <>Brand Ambassador {gold('Sabey')}</>, href: 'https://www.instagram.com/sabey_scissors_europa/', external: true },
  { content: <>Prodotti {gold('ANAQA')}</>, href: 'https://anaqaitalia.it/', external: true },
  { content: <>Agenda digitale {gold('Treatwell')}</>, href: 'https://www.treatwell.it/', external: true },
  { content: <>{gold('Eventi')} e networking</>, href: '/eventi' },
  { content: <>Sede a Foggia</>, href: '/contatti' },
];

export default function HeroSection() {
  return (
    <section
      className="grid grid-cols-1 lg:grid-cols-[1.15fr_.85fr] lg:min-h-[min(78vh,760px)] bg-[#111111]"
      id="inizio"
    >
      {/* Testo */}
      <div className="flex flex-col justify-center items-start gap-6 px-[clamp(1.25rem,6vw,4.5rem)] py-12 lg:py-[clamp(4rem,3rem+4vw,7rem)] lg:pr-8">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-amber-400">
          Maurizio Pizzuto · Maximize Academy
        </p>

        <h1 className="text-[clamp(2.6rem,1.5rem+3.6vw,5rem)] leading-[1.08] font-normal text-[#f4f4f4] max-w-[16ch]">
          Non solo Barber. <em className="not-italic text-amber-400">Molto di più.</em>
        </h1>

        <p className="max-w-[34rem] text-lg text-[#bdbdbd] leading-relaxed">
          Tutto ciò che può far crescere un Barber, in un unico ecosistema: formazione, vendita, business,
          strumenti di precisione e innovazione gestionale per diventare il professionista che vuoi essere.
        </p>

        <div className="flex flex-wrap items-center gap-x-12 gap-y-4 pt-2">
          {/* Pulsante principale inclinato, come «Prenota ora» */}
          <a
            href="/ecosistema"
            className="group inline-block min-h-[44px] text-amber-400 border border-amber-400 bg-[#111111]/60 -skew-x-[14deg] shadow-[inset_0_0_0_3px_#111,inset_0_0_0_4px_rgba(191,161,106,.55)] hover:bg-amber-400/20 hover:text-amber-300 transition-colors"
          >
            <span className="inline-flex items-center gap-3 min-h-[42px] px-8 py-3 skew-x-[14deg] font-bold uppercase tracking-[0.12em]">
              <span>Esplora il tuo percorso</span>
              <svg className="transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M4 12h15M13 6l6 6-6 6" />
              </svg>
            </span>
          </a>

          <a
            href="https://wa.me/393917163833?text=Salve%20Maurizio,%20vorrei%20informazioni%20sul%20percorso%20Maximize%20Academy"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 min-h-[44px] text-[#f4f4f4] border-b border-amber-400/70 hover:text-amber-400 hover:border-amber-400 transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="currentColor" d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.39-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.18-1.42-.08-.12-.27-.2-.57-.35m-5.42 7.4h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88 2.64 0 5.12 1.03 6.99 2.9a9.83 9.83 0 0 1 2.89 6.99c0 5.45-4.44 9.88-9.88 9.88m8.41-18.3A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.89 0-3.18-1.24-6.17-3.48-8.41Z" />
            </svg>
            Parla con Maurizio
          </a>
        </div>
      </div>

      {/* Ritratto */}
      <figure className="relative m-0 bg-[#181818] overflow-hidden aspect-[4/5] max-h-[560px] lg:aspect-auto lg:max-h-none">
        <img
          src="/assets/img/maurizio_ritratto.webp"
          alt="Maurizio Pizzuto, fondatore di Maximize Academy"
          width="1000"
          height="1250"
          fetchpriority="high"
          decoding="async"
          className="w-full h-full object-cover object-[center_12%] lg:absolute lg:inset-0"
        />
        <figcaption className="absolute left-4 right-4 bottom-4 px-4 py-3 bg-[#111111]/85 text-sm uppercase tracking-[0.08em] text-[#f4f4f4]">
          Maurizio Pizzuto · barber, formatore e consulente
        </figcaption>
      </figure>

      {/* Ticker: le voci scorrono all'infinito (si ferma passandoci sopra) */}
      <div className="lg:col-span-2 ticker border-y border-[#3d3d3d] py-6 text-sm uppercase tracking-[0.12em] text-[#bdbdbd]" aria-label="In breve">
        <div className="ticker__track">
          {[0, 1].map((copy) => (
            <ul key={copy} className="ticker__list" aria-hidden={copy === 1 ? 'true' : undefined}>
              {tickerItems.map((item, i) => (
                <li key={i} className="ticker__item">
                  <a
                    href={item.href}
                    className="ticker__link"
                    tabIndex={copy === 1 ? -1 : undefined}
                    {...(item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  >
                    {item.content}
                    {item.external && <span className="sr-only"> (si apre in una nuova scheda)</span>}
                  </a>
                  <span className="ticker__sep" aria-hidden="true">◆</span>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
