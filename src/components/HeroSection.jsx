import React from 'react';
import { Sparkles, ArrowRight, MessageCircle, ShieldCheck, TrendingUp, Award } from 'lucide-react';

export default function HeroSection({ onOpenQuiz }) {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-28 pb-16 overflow-hidden">
      {/* Background Glows & Luxury Gradients */}
      <div className="absolute inset-0 bg-[#070709] pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none"></div>
        <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-amber-600/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-10 left-10 w-[500px] h-[350px] bg-amber-700/5 rounded-full blur-[140px] pointer-events-none"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Text & Positioning */}
          <div className="lg:col-span-7 text-left space-y-6">
            
            {/* Top Micro-Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full glass-panel border border-amber-500/30 shimmer-badge shadow-gold-glow">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
              <span className="text-[11px] sm:text-xs uppercase tracking-[0.25em] text-amber-300 font-bold">
                MAURIZIO PIZZUTO · MAXIMIZE ACADEMY
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl xl:text-7xl font-display font-extrabold text-white leading-[1.08] tracking-tight">
              Non solo Barber.{' '}
              <span className="font-serif italic font-normal block mt-1 gold-text-gradient">
                Molto di più.
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="text-lg sm:text-2xl text-gray-200 font-medium leading-snug">
              Tutto ciò che può far crescere un Barber.{' '}
              <span className="text-amber-400 font-semibold">In un unico ecosistema.</span>
            </p>

            <p className="text-sm sm:text-base text-gray-400 max-w-xl leading-relaxed">
              Non limitarti a lavorare nella tua barberia. Impara a farla crescere. 
              Formazione, vendita, business, strumenti di precisione e innovazione gestionale per costruire il professionista che vuoi diventare.
            </p>

            {/* Pillars Tagline */}
            <div className="py-2">
              <div className="inline-flex flex-wrap items-center gap-2 text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-amber-400/90">
                <span>FORMAZIONE</span>
                <span className="text-white/30">•</span>
                <span>BUSINESS</span>
                <span className="text-white/30">•</span>
                <span>STRUMENTI</span>
                <span className="text-white/30">•</span>
                <span>PRODOTTI</span>
                <span className="text-white/30">•</span>
                <span>TECNOLOGIA</span>
                <span className="text-white/30">•</span>
                <span>EVENTI</span>
                <span className="text-white/30">•</span>
                <span>NETWORK</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <a
                href="#ecosistema"
                className="px-8 py-4 rounded-full btn-gold text-center text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-3 shadow-gold-glow group"
              >
                <span>Esplora il tuo percorso</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>

              <a
                href="https://wa.me/393917163833?text=Salve%20Maurizio,%20vorrei%20informazioni%20sul%20percorso%20Maximize%20Academy"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 rounded-full btn-glass text-center text-sm font-semibold tracking-wider flex items-center justify-center gap-2.5 border-amber-500/30 text-amber-300 hover:border-amber-400"
              >
                <MessageCircle className="w-4 h-4 text-amber-400" />
                <span>Parla con Maurizio</span>
              </a>
            </div>

            {/* Mini Trust Credibility Footprint */}
            <div className="pt-4 flex items-center gap-6 text-xs text-gray-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Esperienza reale sul campo</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-amber-400" />
                <span>Metodo imprenditoriale</span>
              </div>
            </div>

          </div>

          {/* Right Column: Founder Luxury Portrait with Glass Overlays */}
          <div className="lg:col-span-5 relative flex justify-center">
            
            {/* Outer Decorative Ring */}
            <div className="relative w-full max-w-md aspect-[4/5] rounded-3xl overflow-hidden glass-panel-gold border border-amber-500/40 p-2 shadow-2xl group">
              
              <div className="relative w-full h-full rounded-2xl overflow-hidden bg-black/60">
                <img 
                  src="/assets/img/maurizio_hero.webp" 
                  alt="Maurizio Pizzuto - Maximize Academy" 
                  className="w-full h-full object-cover object-top filter contrast-[1.08] brightness-[0.96] group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Dark Gradient Overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>

                {/* Floating Glass Badge Inside Photo */}
                <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl glass-panel border border-amber-500/30 backdrop-blur-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[10px] uppercase font-bold tracking-[0.25em] text-amber-400">
                        Dalla Barberia. Per le Barberie.
                      </div>
                      <div className="text-base font-bold text-white font-display">
                        Maurizio Pizzuto
                      </div>
                      <div className="text-xs text-gray-300">
                        Barber · Formatore · Consulente · Brand Ambassador
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
                      <Award className="w-5 h-5" />
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
