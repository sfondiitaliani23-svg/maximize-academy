import React, { useState } from 'react';
import { MessageSquare, X, ChevronRight } from 'lucide-react';

export default function WhatsAppConcierge() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      {/* Concierge Glass Panel Popover */}
      {isOpen && (
        <div className="mb-4 w-80 sm:w-88 glass-panel-gold rounded-3xl p-5 border border-amber-500/40 shadow-2xl animate-fadeIn">
          
          <div className="flex items-center justify-between pb-3 border-b border-amber-500/20">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300">
                Maximize Concierge WhatsApp
              </span>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-gray-300 my-3 leading-relaxed">
            Seleziona il canale diretto più adatto alle tue esigenze per una risposta rapida:
          </p>

          <div className="space-y-2.5">
            
            {/* Opzione 1: Maurizio */}
            <a
              href="https://wa.me/393917163833?text=Salve%20Maurizio,%20vorrei%20informazioni%20su%20Barber%20Reset%20e%20consulenza"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-2xl bg-black/50 border border-white/10 hover:border-amber-400/60 hover:bg-black/70 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-14 h-9 rounded-xl bg-[#111111] border border-white/10 flex items-center justify-center px-1">
                  <img src="/assets/img/logo-maurizio-barber-shop.webp" alt="" width="365" height="160" className="max-h-6 w-auto" aria-hidden="true" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                    Maurizio Pizzuto
                  </div>
                  <div className="text-[10px] text-gray-400">
                    Consulenza · Barber Reset · Partnership
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
            </a>

            {/* Opzione 2: Operatore */}
            <a
              href="https://wa.me/393917163833?text=Salve,%20vorrei%20informazioni%20sui%20corsi%20di%20formazione%20e%20forbici%20Sabey"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-2xl bg-black/50 border border-white/10 hover:border-amber-400/60 hover:bg-black/70 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-14 h-9 rounded-xl bg-[#111111] border border-white/10 flex items-center justify-center">
                  <img src="/assets/img/logo-maximize.webp" alt="" width="181" height="224" className="h-7 w-auto" aria-hidden="true" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                    Operatore Maximize
                  </div>
                  <div className="text-[10px] text-gray-400">
                    Formazione · Corsi · Forbici Sabey
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
            </a>

          </div>

          <div className="mt-3 text-[10px] text-gray-400 text-center">
            Disponibile 24/7 · Risposta diretta
          </div>

        </div>
      )}

      {/* Pulsante tondo come quello di Maurizio Barber Shop: nero, anello oro, icona chat */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-14 h-14 rounded-full bg-[#181818] border border-amber-400/70 shadow-[inset_0_0_0_3px_#181818,inset_0_0_0_4px_rgba(191,161,106,.45),0_8px_30px_rgba(0,0,0,.28)] flex items-center justify-center text-[#f4f4f4] hover:text-amber-400 transition-colors"
        aria-label={isOpen ? 'Chiudi i contatti WhatsApp' : 'Parla con noi su WhatsApp'}
        aria-expanded={isOpen}
      >
        <MessageSquare className="w-5 h-5" />
        <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-amber-400 ring-2 ring-[#111111]" aria-hidden="true"></span>
      </button>

    </div>
  );
}
