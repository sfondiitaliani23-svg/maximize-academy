import { brandLinks } from '../routes';
import React from 'react';
import { Award, Users, Scissors, Calendar, ArrowRight, Sparkles } from 'lucide-react';

export default function InternationalTraining({ onSelectCourse }) {
  const educators = [
    {
      id: 'gianni-cardinale',
      number: '01',
      name: 'Gianni Cardinale',
      role: 'Master Educator',
      focus: 'Tecnica & Metodo',
      description: 'Tecnica pura e confronto reale. Nuove prospettive metodologiche e chirurgiche da integrare direttamente nel lavoro quotidiano in barberia.',
      highlights: ['Sfumature millimetriche', 'Precisione geometrica', 'Work-flow alla poltrona'],
      badge: 'Docenza Tecnica'
    }
  ];

  return (
    <section id="formazione" className="py-24 relative overflow-hidden bg-gradient-to-b from-[#111111] via-[#181818] to-[#111111]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-amber-500/30">
            <span className="text-[11px] uppercase tracking-[0.25em] text-amber-400 font-bold">
              FORMAZIONE
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-display font-bold text-white tracking-tight">
            Impara da chi sta{' '}
            <span className="font-serif italic font-normal gold-text-gradient">
              cambiando il settore.
            </span>
          </h2>

          <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
            Percorsi concreti, costruiti con partner coerenti con la nostra visione. La tecnica si evolve. Anche tu puoi farlo.
          </p>
        </div>

        {/* Educator Cards Grid */}
        <div className="grid grid-cols-1 max-w-2xl mx-auto gap-8 mb-12">
          {educators.map((edu) => (
            <div 
              key={edu.id}
              className="glass-card rounded-3xl p-8 relative overflow-hidden group flex flex-col justify-between border-white/10 hover:border-amber-500/50"
            >
              {/* Background Glow */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-amber-500/10 transition-colors"></div>

              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="font-display font-extrabold text-sm tracking-widest text-amber-400">
                    {edu.number}
                  </span>
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-300 border border-amber-500/30">
                    {edu.badge}
                  </span>
                </div>

                <div className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-1">
                  {edu.focus}
                </div>

                <h3 className="text-2xl sm:text-3xl font-display font-bold text-white group-hover:text-amber-300 transition-colors mb-4">
                  {edu.name}
                </h3>

                <p className="text-sm text-gray-300 leading-relaxed mb-6">
                  {edu.description}
                </p>

                {/* Highlights tags */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {edu.highlights.map((h, i) => (
                    <span key={i} className="text-[11px] px-3 py-1 rounded-lg bg-black/40 border border-white/10 text-gray-300">
                      ✓ {h}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onSelectCourse(edu.id)}
                className="w-full py-3.5 px-6 rounded-xl btn-glass flex items-center justify-center gap-2 text-xs uppercase font-bold tracking-wider group-hover:border-amber-400 group-hover:text-amber-300"
              >
                <span>Richiedi Programma & Date</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ))}
        </div>

        {/* PERCORSO FORMATIVO: UAAMI (consenso ricevuto il 02/11/2026) & SABEY SCISSORS */}
        <div className="glass-panel-gold rounded-3xl p-8 sm:p-10 border border-amber-500/30 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-amber-300">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>PERCORSO PROFESSIONALE E FORMATIVO</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-display font-bold text-white">
                UAAMI & Sabey Scissors nella Formazione
              </h3>
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                Maurizio Pizzuto è entrato nella famiglia <strong className="text-amber-300">UAAMI</strong> (Unione Artistica Acconciatori Misti Italiani, dal 1957) come <strong className="text-amber-300">Centro UAAMI Foggia</strong>. Con UAAMI Maximize Academy costruisce un nuovo percorso professionale e formativo per i colleghi di Foggia e provincia, e collabora con <strong className="text-amber-300">Sabey Scissors</strong> per corsi, masterclass pratiche e stage.
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-gray-400">
                <span className="flex items-center gap-1.5 text-white/90">
                  <Award className="w-4 h-4 text-amber-400" /> Centro UAAMI Foggia
                </span>
                <span className="flex items-center gap-1.5 text-white/90">
                  <Scissors className="w-4 h-4 text-amber-400" /> Test Strumentale Sabey dal vivo
                </span>
              </div>
            </div>

            {/* Partner Logos inside Box */}
            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-4 items-center justify-center bg-black/40 p-6 rounded-2xl border border-white/10">
              <img loading="lazy"
                src="/assets/loghi/uaami.webp"
                alt="UAAMI – Unione Artistica Acconciatori Misti Italiani"
                width="600" height="600"
                className="h-28 sm:h-32 w-auto object-contain"
              />
              <div className="w-full h-[1px] bg-white/10 hidden lg:block"></div>
              <a href={brandLinks.sabey} target="_blank" rel="noopener noreferrer" className="logo-link" aria-label="Sabey Scissors Europa su Instagram (si apre in una nuova scheda)">
                <img loading="lazy"
                src="/assets/loghi/sabey.webp"
                alt="Sabey Scissors Italy Hand Made"
                width="1549" height="240"
                className="h-10 sm:h-12 w-auto object-contain"
              />
              </a>
            </div>

          </div>

          <div className="mt-8 pt-6 border-t border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-gray-400 text-center sm:text-left">
              Vuoi partecipare al prossimo corso o organizzare una tappa nella tua città?
            </span>
            <a
              href="https://wa.me/393245878724?text=Salve,%20vorrei%20informazioni%20sulle%20prossime%20date%20dei%20corsi%20di%20Formazione"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-full btn-gold text-xs uppercase font-bold tracking-wider whitespace-nowrap shadow-gold-glow"
            >
              Parla con l'operatore formazione
            </a>
          </div>

        </div>

        {/* Progetto 2027 (in sviluppo): pagina dedicata */}
        <a href="/barber-national-academy" className="group mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-dashed border-white/25 p-6 sm:p-8 hover:border-amber-400/60 transition-colors">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400">Progetto 2027 · in sviluppo</span>
            <h3 className="mt-2 text-xl sm:text-2xl font-display font-bold text-white group-hover:text-amber-300 transition-colors">Barber National Academy</h3>
            <p className="mt-1 text-sm text-gray-400">Dal settore giovanile alla Nazionale: il percorso per i collaboratori di barberia.</p>
          </div>
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-amber-400 whitespace-nowrap">Scopri il progetto <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></span>
        </a>

      </div>
    </section>
  );
}
