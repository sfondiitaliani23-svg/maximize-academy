import React, { useState } from 'react';
import { MessageSquare, Phone, X, Sparkles, User, ChevronRight } from 'lucide-react';

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
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold">
                  MP
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
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
                  MA
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

      {/* Floating Pill Button (Fedele al layout degli screenshot con tocco luxury rifinito) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-4 py-3 rounded-full btn-gold shadow-gold-glow-lg hover:scale-105 transition-all duration-300 group"
        aria-label="Contattaci su WhatsApp"
      >
        <div className="w-8 h-8 rounded-full bg-black/20 flex items-center justify-center text-black">
          <MessageSquare className="w-4 h-4 fill-current" />
        </div>
        <div className="text-left hidden sm:block">
          <div className="text-[11px] font-black uppercase tracking-wider text-black leading-tight">
            Parla con noi
          </div>
          <div className="text-[9px] font-semibold text-black/80 tracking-tight">
            WhatsApp · Scrivi 24/7
          </div>
        </div>
      </button>

    </div>
  );
}
