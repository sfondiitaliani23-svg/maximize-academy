import { brandLinks } from '../routes';
import React from 'react';
import { ArrowUpRight, Sparkles, ShieldCheck, BookOpen, TrendingUp, Briefcase, GraduationCap, Cpu } from 'lucide-react';

const pilastriM = [
  {
    icon: Briefcase,
    titolo: 'Maurizio Barber Shop',
    sottotitolo: 'Esperienza',
    desc: 'Le radici dell’attività imprenditoriale: oltre vent’anni di conoscenza diretta del mercato, delle persone e del mestiere quotidiano.',
  },
  {
    icon: GraduationCap,
    titolo: 'Maximize Academy',
    sottotitolo: 'Formazione',
    desc: 'La condivisione delle competenze, lo sviluppo manageriale del team, le relazioni commerciali e la creazione di nuove opportunità.',
  },
  {
    icon: Cpu,
    titolo: 'M×E Barber Lab',
    sottotitolo: 'Innovazione',
    desc: 'L’evoluzione dell’impresa attraverso l’incontro tra mestiere e tecnologia: architetture software proprietarie, CRM ed intelligenza artificiale.',
  },
];

const pilastriE = [
  {
    icon: ShieldCheck,
    titolo: 'Etica',
    sottotitolo: 'Fiducia',
    desc: 'Trasparenza totale, correttezza negli accordi e responsabilità professionale verso ogni singolo cliente e collaboratore.',
  },
  {
    icon: BookOpen,
    titolo: 'Educazione',
    sottotitolo: 'Conoscenza',
    desc: 'Rispetto delle persone, apprendimento continuo e volontà costante di condividere e trasferire competenze di valore.',
  },
  {
    icon: TrendingUp,
    titolo: 'Evoluzione',
    sottotitolo: 'Crescita',
    desc: 'Cambiamento, innovazione, apertura alla tecnologia e miglioramento continuo per rendere le imprese sempre più competitive.',
  },
];

export default function MxeSection() {
  return (
    <section id="mxe" className="py-24 relative overflow-hidden bg-gradient-to-b from-[#111111] via-[#181818] to-[#111111]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">

        {/* Header Sezione */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-amber-500/30">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-[11px] uppercase tracking-[0.25em] text-amber-400 font-bold">
              M×E BARBER LAB
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-display font-bold text-white tracking-tight">
            Due persone. Sei pilastri.{' '}
            <span className="font-serif italic font-normal gold-text-gradient">
              Un’unica visione.
            </span>
          </h2>

          <p className="text-sm sm:text-base text-gray-300 leading-relaxed italic">
            “L’esperienza incontra l’innovazione. I valori danno direzione alla crescita.”
          </p>
        </div>

        {/* Panel Presentazione Fondatori & Marchio */}
        <div className="glass-panel-gold rounded-3xl p-8 sm:p-12 border border-amber-500/30 shadow-2xl">
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
                  L'INCONTRO TRA DUE PROFESSIONALITÀ
                </div>
                <h3 className="text-2xl sm:text-3xl font-display font-bold text-white">
                  Esperienza di settore e ingegneria digitale.
                </h3>
              </div>

              <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                M×E non è semplicemente l’unione di due iniziali. È il punto d'incontro tra chi conosce da vent’anni le esigenze concrete di chi lavora in barberia e chi trasforma queste esigenze in architetture digitali, software su misura, intelligenza artificiale ed automazioni ad alte prestazioni.
              </p>

              <div className="pt-2">
                <div className="text-xs uppercase font-bold tracking-[0.2em] text-amber-400 mb-4">
                  I FONDATORI DI M×E BARBER LAB
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Card Maurizio */}
                  <div className="p-4 rounded-2xl bg-black/40 border border-amber-500/20 flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full overflow-hidden border border-amber-500/40 shrink-0 bg-neutral-900 flex items-center justify-center">
                      <img
                        src="/assets/img/maurizio_ritratto.webp"
                        alt="Maurizio Pizzuto"
                        className="w-full h-full object-cover"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Maurizio Pizzuto</h4>
                      <p className="text-[11px] text-amber-300 font-medium">Co-Founder & Strategia Barber</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">Mercato, persone, formazione e vendita.</p>
                    </div>
                  </div>

                  {/* Card Eliseo */}
                  <div className="p-4 rounded-2xl bg-black/40 border border-amber-500/20 flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full overflow-hidden border border-amber-500/40 shrink-0 bg-neutral-900 flex items-center justify-center text-amber-300 font-bold text-sm">
                      <img
                        src="/assets/img/eliseo_ritratto.webp"
                        alt="Eliseo Miraglia"
                        className="w-full h-full object-cover"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                      <span className="select-none">EM</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Eliseo Miraglia</h4>
                      <p className="text-[11px] text-amber-300 font-medium">Co-Founder & Sviluppo Digitale</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">Digitale, tecnologia, automazioni e IA.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <a
                  href={brandLinks.mxe}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-full btn-gold text-xs uppercase font-bold tracking-wider shadow-gold-glow"
                >
                  <span>Esplora M×E Barber Lab</span>
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

        {/* GRIGLIA COMPARATA: LE 3 M & LE 3 E */}
        <div className="space-y-8">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-amber-400">
              L'ARCHITETTURA DEI VALORI
            </span>
            <h3 className="text-2xl sm:text-3xl font-display font-bold text-white">
              Le Radici del Percorso e i Principi Guida
            </h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Blocco 3M */}
            <div className="glass-panel-gold rounded-3xl p-6 sm:p-8 border border-amber-500/30 space-y-6">
              <div className="flex items-center gap-3 border-b border-amber-500/20 pb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center font-bold text-amber-300 text-lg">
                  M
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">Le 3 M — Le Radici & Il Percorso</h4>
                  <p className="text-xs text-amber-300/80">L'esperienza e la costruzione dell'impresa nel tempo</p>
                </div>
              </div>

              <div className="space-y-4">
                {pilastriM.map((p) => {
                  const Icon = p.icon;
                  return (
                    <div key={p.titolo} className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-white flex items-center gap-2">
                          <Icon className="w-4 h-4 text-amber-400" />
                          {p.titolo}
                        </span>
                        <span className="text-[11px] uppercase tracking-wider text-amber-300 font-semibold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                          {p.sottotitolo}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 leading-relaxed pt-1">
                        {p.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Blocco 3E */}
            <div className="glass-panel-gold rounded-3xl p-6 sm:p-8 border border-amber-500/30 space-y-6">
              <div className="flex items-center gap-3 border-b border-amber-500/20 pb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center font-bold text-amber-300 text-lg">
                  E
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">Le 3 E — I Valori Condivisi</h4>
                  <p className="text-xs text-amber-300/80">I principi guida che orientano ogni scelta</p>
                </div>
              </div>

              <div className="space-y-4">
                {pilastriE.map((p) => {
                  const Icon = p.icon;
                  return (
                    <div key={p.titolo} className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-white flex items-center gap-2">
                          <Icon className="w-4 h-4 text-amber-400" />
                          {p.titolo}
                        </span>
                        <span className="text-[11px] uppercase tracking-wider text-amber-300 font-semibold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                          {p.sottotitolo}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 leading-relaxed pt-1">
                        {p.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
