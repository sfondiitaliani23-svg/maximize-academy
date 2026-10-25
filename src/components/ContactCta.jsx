import React from 'react';

// Chiusura della home, come «Ci vediamo in barberia» su Maurizio Barber Shop.
export default function ContactCta() {
  return (
    <section className="bg-[#181818] border-t border-[#3d3d3d] px-[clamp(1.25rem,6vw,4.5rem)] py-[clamp(4rem,3rem+4vw,7rem)] text-center">
      <p className="text-sm font-bold uppercase tracking-[0.16em] text-amber-400">Il prossimo passo</p>
      <h2 className="mt-3 text-[clamp(2.1rem,1.4rem+3vw,3.6rem)] leading-[1.1] font-bold text-[#f4f4f4]">
        Hai un progetto? <em className="not-italic font-normal text-amber-400">Parliamone.</em>
      </h2>
      <p className="mt-4 max-w-[40rem] mx-auto text-lg text-[#bdbdbd]">
        Corsi, Barber Reset, Sabey, ANAQA, Treatwell o eventi: raccontaci dove sei e dove vuoi arrivare.
      </p>
      <a href="/contatti" className="btn-gold inline-flex items-center gap-3 mt-8 min-h-[44px] py-3 font-bold">
        Vai ai contatti
      </a>
    </section>
  );
}
