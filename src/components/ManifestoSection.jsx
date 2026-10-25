import React from 'react';
import { Target, Sparkles, Check } from 'lucide-react';

export default function ManifestoSection() {
  const tools = [
    'Una formazione.',
    'Una forbice.',
    'Un prodotto.',
    'Un gestionale.',
    'Un evento.',
    'Una strategia.'
  ];

  return (
    <section className="py-28 relative overflow-hidden bg-black text-center">
      {/* Background radial gold glow */}
      <div className="absolute inset-0 pointer-events-none">
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
        
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-amber-500/30">
          <Target className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-[11px] uppercase tracking-[0.25em] text-amber-300 font-bold">
            UN SOLO OBIETTIVO
          </span>
        </div>

        <h2 className="text-3xl sm:text-6xl font-display font-black text-white leading-tight">
          Non voglio venderti{' '}
          <span className="font-serif italic font-normal gold-text-gradient block mt-1">
            semplicemente qualcosa.
          </span>
        </h2>

        <p className="text-lg sm:text-2xl text-gray-300 font-medium max-w-3xl mx-auto leading-relaxed">
          Voglio aiutarti a capire cosa può realmente far crescere te e la tua attività.
        </p>

        {/* Tools Sequence */}
        <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 py-4 max-w-3xl mx-auto">
          {tools.map((item, idx) => (
            <div 
              key={idx}
              className="px-4 py-2 rounded-xl glass-panel border border-white/10 text-xs sm:text-sm font-semibold text-gray-200"
            >
              {item}
            </div>
          ))}
        </div>

        {/* Climax Statement */}
        <div className="pt-6 space-y-4">
          <p className="text-xs uppercase tracking-[0.3em] text-amber-400/80 font-bold">
            GLI STRUMENTI CAMBIANO. L'OBIETTIVO RIMANE UNO:
          </p>
          <div className="text-3xl sm:text-6xl md:text-7xl font-display font-black tracking-tight text-white">
            <span className="gold-text-gradient underline decoration-amber-500/40 decoration-4 underline-offset-8">
              MAXIMIZZARE IL TUO POTENZIALE.
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
