import React from 'react';
import { Trophy, Users, Sparkles, ArrowRight, MapPin, Calendar } from 'lucide-react';

export default function BarberMatchSection({ onSelectCourse }) {
  return (
    <section id="barber-match" className="py-24 relative overflow-hidden bg-[#111111]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-amber-500/30">
            <span className="text-[11px] uppercase tracking-[0.25em] text-amber-400 font-bold">
              BARBER MATCH PAESTUM
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-display font-bold text-white tracking-tight">
            Dove il mondo Barber{' '}
            <span className="font-serif italic font-normal gold-text-gradient">
              si incontra.
            </span>
          </h2>

          <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
            Competizione, palco, formazione e networking. Collaboro con Barber Match per creare le più grandi occasioni di confronto e visibilità del settore in Italia.
          </p>
        </div>

        {/* Cohesive Luxury Container (Risolve il punto 4 delle Modifiche Pending: niente stacco blu sgraziato) */}
        <div className="glass-panel-gold rounded-3xl p-8 sm:p-12 border border-amber-500/40 relative shadow-2xl overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left: Event Details & Copy */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-widest">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>Edizione Ufficiale 2026 · Paestum</span>
              </div>

              <h3 className="text-3xl sm:text-4xl font-display font-extrabold text-white">
                Porta il tuo talento fuori dalla barberia.
              </h3>

              <div className="space-y-4 text-sm sm:text-base text-gray-300 leading-relaxed">
                <p>
                  Incontrare altri professionisti, confrontarsi con nuove tecniche e vivere l’emozione del palco può diventare il vero punto di svolta della tua carriera.
                </p>
                <p className="text-gray-400">
                  Barber Match non è solo una gara: è una celebrazione dell'artigianato barber, dove i migliori talenti emergenti e i maestri affermati condividono idee, visioni e contatti commerciali.
                </p>
              </div>

              {/* Pillars Tagline */}
              <div className="flex flex-wrap items-center gap-3 text-xs font-bold tracking-widest text-amber-400">
                <span className="px-3.5 py-1.5 rounded-xl bg-black/50 border border-white/10">COMPETIZIONE</span>
                <span>•</span>
                <span className="px-3.5 py-1.5 rounded-xl bg-black/50 border border-white/10">FORMAZIONE</span>
                <span>•</span>
                <span className="px-3.5 py-1.5 rounded-xl bg-black/50 border border-white/10">NETWORK</span>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-4">
                <a
                  href="https://wa.me/393917163833?text=Salve%20Maurizio,%20vorrei%20informazioni%20sulla%20partecipazione%20a%20Barber%20Match%202026%20Paestum"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 rounded-full btn-gold text-xs uppercase font-bold tracking-wider text-center shadow-gold-glow"
                >
                  Partecipa a Barber Match
                </a>
                <button
                  onClick={() => onSelectCourse('barber-match-2026')}
                  className="px-8 py-4 rounded-full btn-glass text-xs uppercase font-bold tracking-wider text-center text-amber-300 border-amber-500/30"
                >
                  Scopri le Categorie di Gara
                </button>
              </div>

            </div>

            {/* Right: Artwork integrato nel format Nero/Oro senza rottura visiva */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative p-3 rounded-3xl glass-panel border border-amber-500/30 bg-black/70 shadow-2xl max-w-sm w-full group">
                
                {/* Visual Barber Match Paestum con bordi sfumati eleganti e cornice oro */}
                <div className="relative rounded-2xl overflow-hidden aspect-[700/556] border border-white/10 bg-[#0d1b2a]">
                  <img loading="lazy" 
                    src="/assets/img/barber-match-2026.webp" width="700" height="556" 
                    alt="Barber Match 2026 Paestum" 
                    className="w-full h-full object-cover object-center filter contrast-110 group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Subtle vignette gold reflection border */}
                  <div className="absolute inset-0 ring-1 ring-inset ring-amber-500/30 pointer-events-none rounded-2xl"></div>
                </div>

                <div className="mt-3 flex items-center justify-between px-2 text-xs text-gray-300">
                  <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-amber-400" /> Paestum (SA)</span>
                  <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-amber-400" /> Stagione 2026</span>
                </div>

              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
