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
    },
    {
      id: 'yass-the-barber',
      number: '02',
      name: 'Yass The Barber',
      role: 'International Barber',
      focus: 'Visione Globale',
      description: 'Esperienza internazionale, approccio visivo contemporaneo, osservazione dei volumi e lavoro pratico sul campo.',
      highlights: ['Tecniche internazionali', 'Forme e texture contemporanee', 'Approccio visivo'],
      badge: 'International Master'
    }
  ];

  return (
    <section id="formazione" className="py-24 relative overflow-hidden bg-gradient-to-b from-[#070709] via-[#0d0d12] to-[#070709]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-amber-500/30">
            <span className="text-[11px] uppercase tracking-[0.25em] text-amber-400 font-bold">
              01 / FORMAZIONE INTERNAZIONALE
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-display font-bold text-white tracking-tight">
            Impara da chi sta{' '}
            <span className="font-serif italic font-normal gold-text-gradient">
              cambiando il settore.
            </span>
          </h2>

          <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
            Collaboro alla promozione e organizzazione di percorsi ed eventi con Educator del panorama Barber nazionale e internazionale. La tecnica si evolve. Anche tu puoi farlo.
          </p>
        </div>

        {/* Educator Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
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

        {/* UNIFICAZIONE CONCETTUALE FORMAZIONE: MEN'S EVENTS EDUCATION & SABEY SCISSORS */}
        <div className="glass-panel-gold rounded-3xl p-8 sm:p-10 border border-amber-500/30 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-amber-300">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>SINERGIA FORMATIVA UFFICIALE</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-display font-bold text-white">
                Men’s Events Education & Sabey Scissors nella Formazione
              </h3>
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                Nella macroarea Formazione, Maximize Academy collabora attivamente con <strong className="text-amber-300">Men’s Events Education</strong> e <strong className="text-amber-300">Sabey Scissors</strong> per dare vita a corsi, masterclass pratiche, eventi e stage con i più grandi Educator del panorama italiano ed europeo.
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-gray-400">
                <span className="flex items-center gap-1.5 text-white/90">
                  <Award className="w-4 h-4 text-amber-400" /> Masterclass & Stage Accreditati
                </span>
                <span className="flex items-center gap-1.5 text-white/90">
                  <Scissors className="w-4 h-4 text-amber-400" /> Test Strumentale Sabey dal vivo
                </span>
              </div>
            </div>

            {/* Partner Logos inside Box */}
            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-4 items-center justify-center bg-black/40 p-6 rounded-2xl border border-white/10">
              <img loading="lazy" 
                src="/assets/loghi/1000363512.webp" 
                alt="Men's Events Education Logo" 
                className="h-10 sm:h-12 object-contain opacity-90 hover:opacity-100 transition-opacity"
              />
              <div className="w-full h-[1px] bg-white/10 hidden lg:block"></div>
              <img loading="lazy" 
                src="/assets/loghi/1000363520.webp" 
                alt="Sabey Scissors Logo" 
                className="h-7 sm:h-8 object-contain filter brightness-125"
              />
            </div>

          </div>

          <div className="mt-8 pt-6 border-t border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-gray-400 text-center sm:text-left">
              Vuoi partecipare al prossimo corso o organizzare una tappa nella tua città?
            </span>
            <a
              href="https://wa.me/393917163833?text=Salve,%20vorrei%20informazioni%20sulle%20prossime%20date%20dei%20corsi%20di%20Formazione"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-full btn-gold text-xs uppercase font-bold tracking-wider whitespace-nowrap shadow-gold-glow"
            >
              Parla con l'operatore formazione
            </a>
          </div>

        </div>

      </div>
    </section>
  );
}
