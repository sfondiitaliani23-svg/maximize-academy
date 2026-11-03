import { brandLinks } from '../routes';
import React from 'react';
import { ArrowUpRight } from 'lucide-react';

// Presentazione di M×E Barber Lab dentro Maximize. I fatti vengono dal sito ufficiale;
// la richiesta di progetto si fa lì, non su un modulo inventato qui.
const punti = [
  {
    tag: 'Identità',
    title: 'Presenza digitale',
    desc: 'Siti, presentazione del team, servizi e contatti, in uno spazio sotto il controllo dell’impresa.',
  },
  {
    tag: 'Clienti',
    title: 'Esperienza e prenotazioni',
    desc: 'Percorsi di prenotazione, recensioni e strumenti di relazione con chi entra in barberia.',
  },
  {
    tag: 'Metodo',
    title: 'Dal bisogno al progetto',
    desc: 'Si parte dall’attività reale. Funzioni, tempi e investimento si definiscono nella proposta.',
  },
];

export default function MxeSection() {
  return (
    <section id="mxe" className="py-24 relative overflow-hidden bg-gradient-to-b from-[#111111] via-[#181818] to-[#111111]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-amber-500/30">
            <span className="text-[11px] uppercase tracking-[0.25em] text-amber-400 font-bold">
              M×E BARBER LAB
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-display font-bold text-white tracking-tight">
            Business. Digital.{' '}
            <span className="font-serif italic font-normal gold-text-gradient">
              Growth.
            </span>
          </h2>

          <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
            Strategia, comunicazione e tecnologia per le imprese del settore barber.
            Dall’analisi delle esigenze alla costruzione di strumenti che lavorano insieme.
          </p>
        </div>

        <div className="glass-panel-gold rounded-3xl p-8 sm:p-12 border border-amber-500/30 mb-12 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

            <div className="lg:col-span-7 space-y-6">
              <a href={brandLinks.mxe} target="_blank" rel="noopener noreferrer" className="logo-link inline-flex items-center gap-4" aria-label="Sito ufficiale M×E Barber Lab (si apre in una nuova scheda)">
                <img
                  src="/assets/loghi/mxe-monogramma-oro.svg"
                  alt=""
                  width="1445"
                  height="945"
                  className="h-16 sm:h-20 w-auto"
                />
                <span className="text-sm sm:text-base font-bold uppercase tracking-[0.16em] text-[#f4f4f4]">
                  M×E Barber Lab
                </span>
              </a>

              <div className="space-y-2">
                <div className="text-xs uppercase font-bold tracking-[0.25em] text-amber-400">
                  IL PROGETTO DIGITALE
                </div>
                <h3 className="text-2xl sm:text-3xl font-display font-bold text-white">
                  La tua identità. La tua evoluzione.
                </h3>
              </div>

              <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                M×E Barber Lab progetta siti e soluzioni digitali intorno all’impresa, non da un modello uguale per tutti.
                Unisce l’esperienza di chi vive il settore barber e lo sviluppo tecnologico.
              </p>

              <ul className="space-y-2 text-sm text-gray-300 list-none p-0 m-0">
                <li><strong className="text-white">Maurizio Pizzuto</strong> — co-founder, strategia e esperienza dell’impresa barber.</li>
                <li><strong className="text-white">Eliseo Miraglia</strong> — co-founder, sviluppo digitale.</li>
              </ul>

              <div className="pt-2">
                <a
                  href={brandLinks.mxe}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-full btn-gold text-xs uppercase font-bold tracking-wider shadow-gold-glow"
                >
                  <span>Vai al sito ufficiale</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center">
              <img
                src="/assets/loghi/mxe-metallo.webp"
                alt="Marchio M×E Barber Lab"
                width="800"
                height="800"
                loading="lazy"
                className="w-full max-w-sm rounded-3xl object-contain bg-black"
              />
            </div>

          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {punti.map((p) => (
            <div key={p.title} className="glass-card rounded-2xl p-6 border-white/10 hover:border-amber-500/40">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/20">
                {p.tag}
              </span>
              <h4 className="text-lg font-bold text-white mt-4 mb-2">{p.title}</h4>
              <p className="text-xs text-gray-400 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
