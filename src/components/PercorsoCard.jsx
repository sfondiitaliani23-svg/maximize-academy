import React from 'react';

/** Il percorso in tre frasi (Tecnica, Mentalità, Futuro): la scheda che Maurizio vuole sul sito (02/11/2026). */
export default function PercorsoCard() {
  const righe = [
    ['Un Barbiere impara una ', 'Tecnica.'],
    ['Un Professionista sviluppa una ', 'Mentalità.'],
    ['Un Imprenditore costruisce il proprio ', 'Futuro.'],
  ];
  return (
    <section className="bg-black px-4 py-16 sm:py-24" aria-labelledby="percorso-titolo">
      <div className="mx-auto max-w-3xl rounded-[1.75rem] border border-white/10 bg-[#111] px-6 py-10 text-center shadow-2xl sm:px-12 sm:py-14">
        <p id="percorso-titolo" className="text-xs font-semibold uppercase tracking-[0.25em] text-[#bfa16a] sm:text-sm">Maximize Academy</p>
        <div className="mt-6 space-y-5 sm:space-y-6">
          {righe.map(([testo, parola]) => (
            <p key={parola} className="text-2xl font-semibold leading-snug text-white sm:text-4xl" style={{ fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif', letterSpacing: '-0.01em' }}>
              {testo}<span className="text-[#d2b67f]">{parola}</span>
            </p>
          ))}
        </div>
        <div className="mx-auto mt-10 h-px w-full bg-white/15" />
        <p className="mt-8 text-xs font-medium uppercase tracking-[0.16em] text-[#bfa16a] sm:text-sm">Non taglio solo i capelli. Taglio le scuse.</p>
      </div>
    </section>
  );
}
