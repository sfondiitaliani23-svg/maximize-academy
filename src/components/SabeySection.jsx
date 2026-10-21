import React, { useState } from 'react';
import { Scissors, Check, MessageSquare, Sparkles, Shield, ChevronRight } from 'lucide-react';

export default function SabeySection() {
  const [selectedHand, setSelectedHand] = useState('Destra');
  const [selectedTechnique, setSelectedTechnique] = useState('Sfumatura & Pettine/Forbice');
  const [selectedSize, setSelectedSize] = useState('6.0"');
  const [recommendedModel, setRecommendedModel] = useState(null);

  const techniques = [
    { label: 'Sfumatura & Pettine/Forbice', desc: 'Precisione, stabilità e taglio pieno' },
    { label: 'Point-Cutting & Dettagli', desc: 'Punte affilate per rifiniture millimetriche' },
    { label: 'Sfoltitura & Texturizzazione', desc: 'Denti micropettinati senza creare barrature' },
    { label: 'Taglio Geometrico & Volumi', desc: 'Lame a rasoio per linee nette e decise' }
  ];

  const sizes = ['5.5"', '6.0"', '6.5"', '7.0"'];

  const handleRecommend = (e) => {
    e.preventDefault();
    let name = 'SABEY MASTER TITANIUM GOLD';
    let desc = 'La forbice d’elezione per il Barber che cerca fluidità assoluta, bilanciamento anatomico e nessuna fatica al polso.';

    if (selectedTechnique.includes('Point-Cutting')) {
      name = 'SABEY PRECISION SLIM 5.5"';
      desc = 'Lama affilatissima a doppio filo giapponese per il massimo controllo nei dettagli e contorni.';
    } else if (selectedTechnique.includes('Sfoltitura')) {
      name = 'SABEY TEXTURE 30T ERGONOMIC';
      desc = '30 denti con scanalatura a V per alleggerire le masse con naturalezza sartoriale.';
    }

    setRecommendedModel({
      name,
      hand: selectedHand,
      technique: selectedTechnique,
      size: selectedSize,
      desc,
      waLink: `https://wa.me/393917163833?text=${encodeURIComponent(`Salve, vorrei provare la forbice Sabey consigliata dal configuratore (${name}, misura ${selectedSize}, mano ${selectedHand}).`)}`
    });
  };

  return (
    <section id="sabey" className="py-24 relative overflow-hidden bg-gradient-to-b from-[#08080b] via-[#0f0f15] to-[#08080b]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-amber-500/30">
            <span className="text-[11px] uppercase tracking-[0.25em] text-amber-400 font-bold">
              03 / SABEY SCISSORS
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-display font-bold text-white tracking-tight">
            Lo strumento è parte{' '}
            <span className="font-serif italic font-normal gold-text-gradient">
              del professionista.
            </span>
          </h2>

          <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
            Una forbice non si compra a catalogo: si sceglie a partire dalla tua mano, dalla tua tecnica e dal lavoro che vuoi realizzare ogni giorno.
          </p>
        </div>

        {/* Presentation Card: Sabey Identity + Official Badge */}
        <div className="glass-panel-gold rounded-3xl p-8 sm:p-12 border border-amber-500/30 mb-16 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left: Sabey Brand Content */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="flex items-center gap-4">
                <img 
                  src="/assets/loghi/1000363520.png" 
                  alt="Sabey Scissors Logo" 
                  className="h-10 sm:h-12 object-contain filter brightness-125"
                />
              </div>

              <div className="space-y-1">
                <div className="text-xs uppercase font-bold tracking-[0.25em] text-amber-400">
                  BRAND AMBASSADOR STRATEGIST
                </div>
                <h3 className="text-2xl sm:text-3xl font-display font-bold text-white">
                  Maurizio Pizzuto
                </h3>
              </div>

              <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                Forbici professionali artigianali per Barber e Parrucchieri. Ti accompagno personalmente o tramite il mio team nella scelta dello strumento ideale, mettendo al centro comfort muscolare, angolo di taglio e obiettivi professionali.
              </p>

              {/* Pillars */}
              <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-amber-200">
                <span className="px-3.5 py-1.5 rounded-xl bg-black/40 border border-white/10">La tua mano</span>
                <span className="text-amber-500">•</span>
                <span className="px-3.5 py-1.5 rounded-xl bg-black/40 border border-white/10">La tua tecnica</span>
                <span className="text-amber-500">•</span>
                <span className="px-3.5 py-1.5 rounded-xl bg-black/40 border border-white/10">Il tuo strumento</span>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-4">
                <a
                  href="#trova-forbice"
                  className="px-7 py-3.5 rounded-full btn-gold text-xs uppercase font-bold tracking-wider text-center shadow-gold-glow"
                >
                  Trova la tua forbice
                </a>
                <a
                  href="https://wa.me/393917163833?text=Salve,%20vorrei%20aiuto%20per%20scegliere%20la%20mia%20forbice%20Sabey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-7 py-3.5 rounded-full btn-glass text-xs uppercase font-bold tracking-wider text-center text-amber-300 border-amber-500/30 flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4 text-amber-400" />
                  <span>Aiutami a scegliere la mia Sabey</span>
                </a>
              </div>

            </div>

            {/* Right: OFFICIAL BADGE Circolare Richiesto (assets/riferimenti/Sabey_Brand_Ambassador_Strategist.png) */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center">
              <div className="relative p-3 rounded-full glass-panel border border-amber-500/40 shadow-gold-glow group">
                <div className="w-56 h-56 sm:w-64 sm:h-64 rounded-full overflow-hidden bg-white/5 flex items-center justify-center p-2">
                  <img 
                    src="/assets/img/Sabey_Brand_Ambassador_Strategist.png" 
                    alt="Sabey Brand Ambassador Strategist Badge Ufficiale - Maurizio Pizzuto" 
                    className="w-full h-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
              <div className="mt-4 text-[11px] uppercase tracking-[0.2em] text-gray-400 text-center font-semibold">
                Certificazione Ufficiale Brand Ambassador
              </div>
            </div>

          </div>
        </div>

        {/* INTERACTIVE TOOL: TROVA LA TUA FORBICE IDEALE */}
        <div id="trova-forbice" className="glass-panel rounded-3xl p-8 sm:p-12 border border-white/10">
          <div className="max-w-2xl mb-8">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-amber-400 mb-2">
              <Scissors className="w-4 h-4" />
              <span>CONFIGURATORE SARTORIALE SABEY</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-display font-bold text-white">
              Qual è la forbice perfetta per il tuo stile?
            </h3>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              Seleziona la tua impostazione e ricevi la raccomandazione tecnica con filo rasoio e bilanciamento personalizzato.
            </p>
          </div>

          <form onSubmit={handleRecommend} className="space-y-6">
            
            {/* Step 1: Mano */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-3">
                1. Impugnatura
              </label>
              <div className="grid grid-cols-2 gap-4 max-w-md">
                {['Destra', 'Mancina'].map((hand) => (
                  <button
                    type="button"
                    key={hand}
                    onClick={() => setSelectedHand(hand)}
                    className={`py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                      selectedHand === hand 
                        ? 'bg-amber-400 text-black shadow-gold-glow' 
                        : 'bg-black/50 text-gray-300 border border-white/10 hover:border-amber-400/50'
                    }`}
                  >
                    Mano {hand}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Tecnica */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-3">
                2. Tecnica principale di utilizzo
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {techniques.map((t) => (
                  <button
                    type="button"
                    key={t.label}
                    onClick={() => setSelectedTechnique(t.label)}
                    className={`p-4 rounded-xl text-left transition-all ${
                      selectedTechnique === t.label 
                        ? 'bg-amber-500/15 border-2 border-amber-400 shadow-gold-glow' 
                        : 'bg-black/40 border border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="text-xs font-bold text-white mb-1">{t.label}</div>
                    <div className="text-[11px] text-gray-400">{t.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Misura */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-3">
                3. Misura preferita (Pollici)
              </label>
              <div className="flex flex-wrap gap-3">
                {sizes.map((s) => (
                  <button
                    type="button"
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`w-16 py-2.5 rounded-xl text-xs font-bold tracking-wider transition-all ${
                      selectedSize === s 
                        ? 'bg-amber-400 text-black shadow-gold-glow' 
                        : 'bg-black/50 text-gray-300 border border-white/10 hover:border-amber-400/50'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-4 rounded-xl btn-gold text-xs uppercase font-extrabold tracking-widest shadow-gold-glow"
              >
                Genera Configurazione Sabey
              </button>
            </div>

          </form>

          {/* Risultato Configurazione */}
          {recommendedModel && (
            <div className="mt-8 p-6 rounded-2xl glass-panel-gold border border-amber-500/40 animate-fadeIn">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                  <div className="text-[10px] uppercase font-bold tracking-[0.25em] text-amber-400 mb-1">
                    MODELLO CONSIGLIATO PER TE
                  </div>
                  <h4 className="text-xl sm:text-2xl font-display font-bold text-white mb-2">
                    {recommendedModel.name}
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-300 max-w-2xl leading-relaxed">
                    {recommendedModel.desc}
                  </p>
                  <div className="mt-3 flex items-center gap-3 text-xs text-amber-300 font-semibold">
                    <span>Mano: {recommendedModel.hand}</span>
                    <span>•</span>
                    <span>Misura: {recommendedModel.size}</span>
                    <span>•</span>
                    <span>Garanzia A Vita Sabey</span>
                  </div>
                </div>

                <a
                  href={recommendedModel.waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-full btn-gold text-xs uppercase font-bold tracking-wider whitespace-nowrap shadow-gold-glow"
                >
                  Richiedi Prova con Operatore
                </a>
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
}
