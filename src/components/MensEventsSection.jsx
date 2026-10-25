import React from 'react';
import { Users2, Globe, Compass, ArrowRight, Sparkles } from 'lucide-react';

export default function MensEventsSection() {
  return (
    <section id="mens-events" className="py-24 relative overflow-hidden bg-gradient-to-b from-[#070709] via-[#0c0c12] to-[#070709]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="glass-panel-gold rounded-3xl p-8 sm:p-14 border border-amber-500/30 relative shadow-2xl overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-8 space-y-6">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-widest">
                <Globe className="w-4 h-4 text-amber-400" />
                <span>07 / MEN'S EVENTS EDUCATION</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-display font-bold text-white tracking-tight">
                Il talento cresce{' '}
                <span className="font-serif italic font-normal gold-text-gradient">
                  quando si confronta.
                </span>
              </h2>

              <p className="text-sm sm:text-base text-gray-300 leading-relaxed max-w-2xl">
                Formarsi significa uscire dalla propria zona di comfort e dalla routine della bottega. 
                La collaborazione tra Maximize Academy e Men’s Events Education garantisce l'accesso a circuiti formativi di primissimo livello, clinic esclusive e contatti diretti con le personalità più influenti del settore.
              </p>

              <div className="pt-2">
                <a
                  href="https://wa.me/393917163833?text=Salve,%20vorrei%20informazioni%20sulle%20esperienze%20e%20sui%20corsi%20Men's%20Events%20Education"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-full btn-gold text-xs uppercase font-bold tracking-wider shadow-gold-glow"
                >
                  <span>Parliamo della prossima esperienza</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>

            </div>

            {/* Right: Partner Logo Inverted High Contrast */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center p-8 rounded-2xl bg-black/60 border border-white/10">
              <img loading="lazy" 
                src="/assets/loghi/1000363512.webp" 
                alt="Men's Events Education Official Logo" 
                className="w-full max-w-[260px] object-contain opacity-95 hover:opacity-100 transition-opacity"
              />
              <div className="mt-4 text-[10px] uppercase tracking-[0.25em] text-amber-400 font-semibold text-center">
                Education Partner Ufficiale
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
