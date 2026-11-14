import React from 'react';
import { ArrowRight, Theater, Users, Handshake, MapPin, Send } from 'lucide-react';
import { WA_MAURIZIO, waLink } from '../routes.js';

// Vision Lab Academy × Maximize Academy (14/11/2026).
// Copy definitivo di Maurizio: non riscriverlo. Pagina in BOZZA: fuori da menu, footer e sitemap, con noindex,
// finché Luigi Di Domenico non la approva. Mancano: logo ufficiale Vision Lab e cosa comprende ogni offerta.

const fondatori = ['Luigi Di Domenico', 'Giuseppe Vinacci', 'Nando Quaranta', 'Giovanni Morra'];

const offerte = [
  { id: 'completo', title: 'Percorso completo', price: '1.000 €', note: 'Il percorso Vision Lab dall’inizio alla fine.', top: true },
  { id: 'team', title: 'Team Vision Specialist', price: '800 €', note: 'Il percorso dedicato al Team Vision Specialist.' },
  { id: 'giornata', title: 'Giornata singola', price: '150 €', note: 'Una giornata formativa a scelta.' },
];

const msg = (azione, o) => `Ciao Maurizio, ${azione} per Vision Lab Academy 2027: ${o.title} (${o.price}).`;

function VisionMark({ className = '' }) {
  // Segnaposto finché non arriva il logo ufficiale di Vision Lab Academy.
  return (
    <div className={`inline-flex flex-col items-center justify-center rounded-2xl border border-amber-500/40 bg-black/40 px-6 py-4 ${className}`} role="img" aria-label="Vision Lab Academy">
      <span className="text-2xl font-display font-bold tracking-[0.18em] text-white">VISION</span>
      <span className="text-[10px] font-bold tracking-[0.42em] text-amber-400">LAB ACADEMY</span>
    </div>
  );
}

export default function VisionLabSection() {
  return (
    <section id="vision-lab" className="relative overflow-hidden bg-gradient-to-b from-[#111111] via-[#161616] to-[#111111]">
      {/* 1. Vision Lab Academy */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-amber-500/30 text-[11px] uppercase tracking-[0.25em] text-amber-400 font-bold">Centro UAAMI Napoli</span>
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 items-start">
          <div>
            <h1 className="text-[clamp(2.4rem,1.6rem+4vw,4.6rem)] leading-[1.05] font-display font-bold text-white tracking-tight">
              Vision Lab Academy.
              <span className="block font-serif italic font-normal gold-text-gradient">Entra in Vision, cambia la tua visione.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base sm:text-lg text-gray-300 leading-relaxed">
              Fondata nel settembre 2026 a Sant’Antimo da Luigi Di Domenico, Giuseppe Vinacci, Nando Quaranta e Giovanni Morra, Vision Lab Academy nasce come sede del Centro UAAMI Napoli, con l’obiettivo di offrire una formazione avanzata, concreta e orientata alla crescita professionale di barbieri e acconciatori.
            </p>
          </div>
          <VisionMark className="lg:mt-2" />
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass-card rounded-3xl p-7 border-white/10">
            <Users className="w-6 h-6 text-amber-400" aria-hidden="true" />
            <h2 className="mt-4 text-sm font-bold uppercase tracking-[0.16em] text-amber-400">I fondatori</h2>
            <ul className="mt-3 space-y-1.5 text-white">
              {fondatori.map((f) => <li key={f}>{f}</li>)}
            </ul>
            <p className="mt-4 flex items-center gap-2 text-sm text-gray-400"><MapPin className="w-4 h-4" aria-hidden="true" /> Sant’Antimo (NA) · dal 2026</p>
          </div>
          <div className="glass-panel-gold rounded-3xl p-7 border border-amber-500/30 md:col-span-2">
            <Theater className="w-6 h-6 text-amber-400" aria-hidden="true" />
            <h2 className="mt-4 text-sm font-bold uppercase tracking-[0.16em] text-amber-400">Il metodo · Visual + Workshop</h2>
            <p className="mt-3 text-gray-200 leading-relaxed">
              Il cuore dell’accademia è il Vision Theater, uno spazio formativo dove dimostrazioni dal vivo e workshop pratici si integrano, favorendo il confronto diretto tra formatori e partecipanti.
            </p>
            <p className="mt-3 text-gray-300 leading-relaxed">
              Dalle tecniche di taglio alle sfumature, dallo styling alle nuove tendenze, ogni percorso è pensato per trasformare le conoscenze acquisite in competenze applicabili nel lavoro quotidiano.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Partnership */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20" aria-labelledby="vl-partner">
        <div className="rounded-3xl border border-amber-500/30 bg-black/30 p-8 sm:p-12">
          <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-8">
            <VisionMark />
            <span className="text-3xl font-light text-amber-400" aria-hidden="true">×</span>
            <img src="/assets/img/logo-maximize.webp" alt="Maximize Academy" className="h-16 sm:h-20 w-auto" loading="lazy" decoding="async" />
          </div>
          <p className="mt-10 text-center text-sm font-bold uppercase tracking-[0.16em] text-amber-400">Vision Lab Academy × Maximize Academy</p>
          <h2 id="vl-partner" className="mt-3 text-center text-[clamp(1.9rem,1.3rem+2.6vw,3.2rem)] leading-[1.1] font-bold text-white">
            Una partnership dedicata alla crescita dei <em className="not-italic font-normal text-amber-400">professionisti pugliesi.</em>
          </h2>
          <div className="mt-8 mx-auto max-w-3xl space-y-4 text-gray-300 leading-relaxed">
            <p>Dalla condivisione di una visione comune nasce la collaborazione tra Vision Lab Academy e Maximize Academy, fondata da Maurizio Pizzuto.</p>
            <p>L’obiettivo è creare un collegamento diretto tra l’offerta formativa di Vision Lab Academy e i professionisti della Puglia, facilitando l’accesso ai percorsi, alle informazioni e alle opportunità di aggiornamento.</p>
            <p>Attraverso Maximize Academy, i barber pugliesi potranno conoscere i programmi formativi, approfondire i contenuti e ricevere supporto nella scelta del percorso più adatto alle proprie esigenze.</p>
          </div>
          <div className="mt-8 flex flex-col items-center gap-1 text-center">
            <Handshake className="w-6 h-6 text-amber-400" aria-hidden="true" />
            <p className="mt-2 text-lg text-white">La formazione crea competenze. Il confronto genera crescita.</p>
            <p className="font-serif italic gold-text-gradient text-xl">Entra in Vision, cambia la tua visione.</p>
          </div>
        </div>
      </div>

      {/* 3. Offerte 2027 */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-24" aria-labelledby="vl-offerte">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-amber-400">Offerte formative 2027</p>
        <h2 id="vl-offerte" className="mt-3 text-[clamp(1.9rem,1.3rem+2.6vw,3.2rem)] leading-[1.1] font-bold text-white">
          Scegli il tuo <em className="not-italic font-normal text-amber-400">percorso.</em>
        </h2>
        <p className="mt-3 text-sm text-gray-400 max-w-2xl">Chiedi informazioni o iscriviti: ti risponde Maurizio su WhatsApp e ti aiuta a scegliere.</p>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
          {offerte.map((o) => (
            <article key={o.id} className={`flex flex-col rounded-3xl p-7 border ${o.top ? 'glass-panel-gold border-amber-500/50' : 'glass-card border-white/10'}`}>
              <h3 className="text-xl font-bold text-white">{o.title}</h3>
              <p className="mt-3 text-4xl font-display font-bold text-amber-400">{o.price}</p>
              <p className="mt-4 text-sm text-gray-300 leading-relaxed flex-1">{o.note}</p>
              {/* Cosa comprende: testo in arrivo da Maurizio / Luigi */}
              <div className="mt-6 grid gap-2">
                <a href={waLink(WA_MAURIZIO, msg('vorrei iscrivermi', o))} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full btn-gold text-xs uppercase font-bold tracking-wider">
                  Iscriviti <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </a>
                <a href={waLink(WA_MAURIZIO, msg('vorrei informazioni', o))} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full btn-glass text-xs uppercase font-bold tracking-wider">
                  Richiedi informazioni <Send className="w-4 h-4" aria-hidden="true" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
