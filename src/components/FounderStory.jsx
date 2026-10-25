import React from 'react';
import { CheckCircle2, Flame, Award, Sparkles } from 'lucide-react';

export default function FounderStory() {
  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-b from-transparent via-[#181818] to-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Photo in Barberia */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="relative rounded-3xl overflow-hidden glass-panel-gold border border-amber-500/30 p-2 shadow-2xl">
              <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden bg-black">
                <img loading="lazy" 
                  src="/assets/img/maurizio-in-barberia.webp" width="796" height="498" 
                  alt="Maurizio Pizzuto al lavoro in barberia" 
                  className="w-full h-full object-cover object-[25%_center] filter contrast-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                
                <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl glass-panel border border-white/10 text-center">
                  <span className="text-xs uppercase tracking-[0.2em] text-amber-300 font-semibold">
                    L'esperienza comincia qui. In barberia.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Storytelling & Quote */}
          <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
            
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-amber-400 font-bold">
              <span>DALLA BARBERIA ALLA FORMAZIONE</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-display font-bold text-white leading-tight">
              Insegno ciò che{' '}
              <span className="font-serif italic font-normal gold-text-gradient">
                vivo ogni giorno.
              </span>
            </h2>

            <div className="space-y-4 text-gray-300 text-sm sm:text-base leading-relaxed">
              <p className="font-medium text-white/90">
                Sono Maurizio Pizzuto. Barber, imprenditore, formatore e professionista della vendita e della comunicazione applicate al mondo Barber.
              </p>
              
              <p className="text-gray-400">
                Maximize Academy nasce dall’esperienza reale: clienti, collaboratori, professionisti e scelte da affrontare ogni giorno. Metto questa esperienza a disposizione di chi vuole evolvere, professionalmente e imprenditorialmente.
              </p>

              <p className="text-gray-400">
                Essere tecnicamente bravi è il punto di partenza. Comunicare il proprio valore, organizzare il lavoro, fidelizzare i clienti e continuare a formarsi è ciò che permette di crescere.
              </p>
            </div>

            {/* Badges / Values */}
            <div className="pt-4 flex flex-wrap gap-3">
              <div className="px-4 py-2.5 rounded-xl glass-panel border border-amber-500/20 text-xs font-semibold text-amber-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                <span>Esperienza sul campo</span>
              </div>
              <div className="px-4 py-2.5 rounded-xl glass-panel border border-amber-500/20 text-xs font-semibold text-amber-200 flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-400" />
                <span>Visione imprenditoriale</span>
              </div>
              <div className="px-4 py-2.5 rounded-xl glass-panel border border-amber-500/20 text-xs font-semibold text-amber-200 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Confronto diretto</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
