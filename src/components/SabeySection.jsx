import { brandLinks, WA_KEPLERO, waLink } from '../routes';
import React from 'react';
import { Scissors, MessageSquare } from 'lucide-react';

// Modelli del catalogo Sabey (foto autorizzate da Maurizio). Nessuna scheda inventata:
// misure, nome commerciale completo e garanzia si pubblicano solo con dati ufficiali.
const modelli = [
  { id: '40-30', src: '/assets/img/sabey/sabey-3040.png' },
  { id: 'BLACK Anthos', src: '/assets/img/sabey/sabey-black-anthos.jpg' },
  { id: 'Curly semi offset', src: '/assets/img/sabey/sabey-curly-semi-offset.jpg' },
  { id: '40D', src: '/assets/img/sabey/sabey-40d.png' },
  { id: '40DS', src: '/assets/img/sabey/sabey-40ds.png' },
  { id: 'Francis', src: '/assets/img/sabey/sabey-francis.png' },
  { id: 'GT', src: '/assets/img/sabey/sabey-gt.png' },
  { id: 'VR', src: '/assets/img/sabey/sabey-vr.png' },
];

const WA = waLink(WA_KEPLERO, 'Salve, vorrei informazioni su una forbice Sabey.');

export default function SabeySection() {
  return (
    <section id="sabey" className="py-24 relative overflow-hidden bg-gradient-to-b from-[#111111] via-[#181818] to-[#111111]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-amber-500/30">
            <span className="text-[11px] uppercase tracking-[0.25em] text-amber-400 font-bold">
              SABEY SCISSORS
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-display font-bold text-white tracking-tight">
            Lo strumento è parte{' '}
            <span className="font-serif italic font-normal gold-text-gradient">
              del professionista.
            </span>
          </h2>

          <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
            Sabey Scissors propone forbici professionali.
            La scelta la fai con Keplero, a partire dalla tua mano e dal lavoro di ogni giorno.
          </p>
        </div>

        <div className="glass-panel-gold rounded-3xl p-8 sm:p-12 border border-amber-500/30 mb-16 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

            <div className="lg:col-span-7 space-y-6">

              <div className="flex items-center gap-4">
                <a href={brandLinks.sabey} target="_blank" rel="noopener noreferrer" className="logo-link" aria-label="Sabey Scissors Europa su Instagram (si apre in una nuova scheda)">
                  <img loading="lazy"
                    src="/assets/loghi/sabey.webp"
                    alt="Sabey Scissors Italy Hand Made"
                    width="1549" height="240"
                    className="h-14 sm:h-16 w-auto object-contain"
                  />
                </a>
              </div>

              <div className="space-y-1">
                <div className="text-xs uppercase font-bold tracking-[0.25em] text-amber-400">
                  BRAND AMBASSADOR STRATEGIST
                </div>
                <h3 className="text-2xl sm:text-3xl font-display font-bold text-white">
                  Maurizio Pizzuto
                </h3>
              </div>

              <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                Forbici professionali artigianali per Barber e Parrucchieri. Ti accompagno personalmente o tramite il mio team nella scelta dello strumento ideale, mettendo al centro comfort muscolare, angolo di taglio e obiettivi professionali.
              </p>

              <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-amber-200">
                <span className="px-3.5 py-1.5 rounded-xl bg-black/40 border border-white/10">La tua mano</span>
                <span className="hidden sm:inline text-amber-500" aria-hidden="true">•</span>
                <span className="px-3.5 py-1.5 rounded-xl bg-black/40 border border-white/10">La tua tecnica</span>
                <span className="hidden sm:inline text-amber-500" aria-hidden="true">•</span>
                <span className="px-3.5 py-1.5 rounded-xl bg-black/40 border border-white/10">Il tuo strumento</span>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-4">
                <a
                  href="#modelli"
                  className="px-7 py-3.5 rounded-full btn-gold text-xs uppercase font-bold tracking-wider text-center shadow-gold-glow"
                >
                  Vedi i modelli
                </a>
                <a
                  href={WA}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-7 py-3.5 rounded-full btn-glass text-xs uppercase font-bold tracking-wider text-center text-amber-300 border-amber-500/30 flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4 text-amber-400" />
                  <span>Aiutami a scegliere la mia Sabey</span>
                </a>
              </div>

            </div>

            <div className="lg:col-span-5 flex flex-col items-center justify-center">
              <img loading="lazy"
                src="/assets/img/sabey-brand-ambassador.webp"
                alt="Sabey Scissors, Brand Ambassador Strategist: Maurizio Pizzuto"
                width="800" height="791"
                className="w-64 h-auto sm:w-72 lg:w-80 object-contain"
              />
              <div className="mt-4 text-[11px] uppercase tracking-[0.2em] text-gray-400 text-center font-semibold">
                Certificazione Ufficiale Brand Ambassador
              </div>
            </div>

          </div>
        </div>

        <div id="modelli" className="glass-panel rounded-3xl p-8 sm:p-12 border border-white/10">
          <span id="trova-forbice" className="block scroll-mt-24" />
          <div className="max-w-2xl mb-8">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-amber-400 mb-2">
              <Scissors className="w-4 h-4" />
              <span>Forbici professionali</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-display font-bold text-white">
              Modelli dal catalogo Sabey
            </h3>
            <p className="text-xs sm:text-sm text-gray-400 mt-2 leading-relaxed">
              Foto autorizzate. Sotto, il codice o il nome indicato per il modello.
              Misure, nome commerciale completo e garanzia si aggiungono qui solo quando Sabey li conferma.
            </p>
          </div>

          <ul className="grid grid-cols-2 sm:grid-cols-3 gap-4 list-none p-0 m-0">
            {modelli.map((m) => (
              <li key={m.id} className="rounded-2xl border border-white/10 bg-white p-4 flex flex-col">
                <img
                  src={m.src}
                  alt={`Forbice Sabey ${m.id}`}
                  width="400"
                  height="400"
                  loading="lazy"
                  className="w-full h-44 sm:h-56 object-contain"
                />
                <p className="mt-3 text-center text-xs sm:text-sm font-bold tracking-wide text-black leading-snug">Sabey {m.id}</p>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="text-xs text-gray-400 max-w-xl">
              Per informazioni su un modello scrivi a Keplero su WhatsApp e indica la forbice che ti interessa.
            </p>
            <a
              href={WA}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-full btn-gold text-xs uppercase font-bold tracking-wider whitespace-nowrap shadow-gold-glow text-center"
            >
              Richiedi prova con operatore
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
