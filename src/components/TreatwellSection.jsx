import { brandLinks } from '../routes';
import React from 'react';
import { Smartphone, Calendar, Clock, ArrowRight, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';

export default function TreatwellSection() {
  const steps = [
    {
      num: '01',
      title: 'Prenotazioni online h24',
      desc: 'Il cliente può cercare disponibilità e prenotare in autonomia anche la sera o quando la barberia è chiusa, senza interrompere i tuoi tagli.'
    },
    {
      num: '02',
      title: 'Un’agenda organizzata e precisa',
      desc: 'Una visione istantanea e chiara degli appuntamenti che ottimizza i tempi di servizio, azzera i no-show e coordina il team.'
    },
    {
      num: '03',
      title: 'Esperienza cliente di alto livello',
      desc: 'Un percorso di prenotazione fluido e moderno che rafforza l’immagine premium della tua barberia fin dal primo contatto.'
    }
  ];

  return (
    <section id="treatwell" className="py-24 relative overflow-hidden bg-gradient-to-b from-[#111111] via-[#181818] to-[#111111]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-amber-500/30">
            <span className="text-[11px] uppercase tracking-[0.25em] text-amber-400 font-bold">
              05 / TREATWELL PARTNERSHIP
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-display font-bold text-white tracking-tight">
            La barberia è cambiata.{' '}
            <span className="font-serif italic font-normal gold-text-gradient">
              Anche l’agenda.
            </span>
          </h2>

          <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
            Come Brand Ambassador Treatwell, sono un punto di riferimento per i Barber che vogliono capire come la prenotazione digitale trasforma il flusso di cassa e il tempo libero.
          </p>
        </div>

        {/* Treatwell Presentation Card */}
        <div className="glass-panel-gold rounded-3xl p-8 sm:p-12 border border-amber-500/30 mb-16 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              
              {/* Logo Treatwell */}
              <a href={brandLinks.treatwell} target="_blank" rel="noopener noreferrer" className="logo-link" aria-label="Treatwell (si apre in una nuova scheda)">
                <img loading="lazy"
                src="/assets/loghi/treatwell.webp"
                alt="Treatwell"
                width="1293" height="240"
                className="h-10 sm:h-12 w-auto object-contain"
              />
              </a>

              <div className="space-y-1">
                <div className="text-xs uppercase font-bold tracking-[0.25em] text-amber-400">
                  BRAND AMBASSADOR TREATWELL
                </div>
                <h3 className="text-2xl sm:text-3xl font-display font-bold text-white">
                  Porta la tua barberia nel futuro digitale
                </h3>
              </div>

              <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                Niente più telefonate perse mentre sei con il rasoio in mano, niente messaggi sparsi su tre social diversi: una sola piattaforma che riempie gli spazi vuoti e porta nuovi clienti profilati alla tua poltrona.
              </p>

              {/* Digital Flow Diagram */}
              <div className="py-2">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 text-[11px] font-semibold uppercase tracking-wider text-amber-300 bg-black/40 p-3 rounded-xl border border-white/10">
                  <span>Cliente</span>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
                  <span>Smartphone</span>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
                  <span>Prenotazione</span>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
                  <span>Agenda</span>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
                  <span>Organizzazione</span>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
                  <span className="text-white">Esperienza</span>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href="https://wa.me/393917163833?text=Salve%20Maurizio,%20vorrei%20consigli%20su%20come%20attivare%20Treatwell%20nella%20mia%20barberia"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-full btn-gold text-xs uppercase font-bold tracking-wider shadow-gold-glow"
                >
                  <span>Voglio digitalizzare la mia barberia</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>

            </div>

            {/* Visual Icon / Highlight */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="p-8 rounded-3xl glass-panel border border-white/10 text-center space-y-4 max-w-sm">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Smartphone className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-white font-display">
                  Zero Interruzioni alla Poltrona
                </h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Il 42% delle prenotazioni su Treatwell avviene fuori dall'orario di apertura: mentre dormi o nei giorni di chiusura.
                </p>
                <div className="pt-2 text-[11px] font-bold text-amber-400 uppercase tracking-widest">
                  Assistenza Dedicata con Maurizio
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* 3 Step Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((s, idx) => (
            <div key={idx} className="glass-card rounded-2xl p-7 border-white/10 hover:border-amber-500/40">
              <div className="text-xs font-bold text-amber-400 mb-3">{s.num}</div>
              <h4 className="text-lg font-bold text-white mb-2">{s.title}</h4>
              <p className="text-xs text-gray-400 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
