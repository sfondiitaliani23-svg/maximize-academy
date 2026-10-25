import { brandLinks } from '../routes';
import React from 'react';
import { Sparkles, Package, ArrowRight, ShieldCheck, Droplets, Check } from 'lucide-react';

export default function AnaqaSection() {
  const categories = [
    {
      title: 'Beard Care & Shaving',
      desc: 'Oli nutrienti, balsami e lozioni pre e post rasatura a formulazione botanica avanzata per un rito barba eccellente.',
      tag: 'Cura Barba'
    },
    {
      title: 'Hair Styling & Finish',
      desc: 'Paste modellanti matte, pomate idrosolubili e polveri volumizzanti con tenuta impeccabile e zero residui.',
      tag: 'Styling'
    },
    {
      title: 'Hair Treatment & Scalp',
      desc: 'Shampoo specifici purificanti, energizzanti e riequilibranti formulati per le esigenze quotidiane dell’uomo.',
      tag: 'Trattamento'
    }
  ];

  return (
    <section id="anaqa" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-amber-500/30">
            <span className="text-[11px] uppercase tracking-[0.25em] text-amber-400 font-bold">
              ANAQA MEN CREATION
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-display font-bold text-white tracking-tight">
            Prodotti professionali.{' '}
            <span className="font-serif italic font-normal gold-text-gradient sm:whitespace-nowrap">
              Risultati professionali.
            </span>
          </h2>

          <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
            La scelta del prodotto completa il servizio, fidelizza il cliente ed eleva la marginalità della tua barberia.
          </p>
        </div>

        {/* Anaqa Presentation Card with Logo */}
        <div className="glass-panel-gold rounded-3xl p-8 sm:p-12 border border-amber-500/30 mb-12 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-8 space-y-6">
              
              {/* Logo Anaqa Ufficiale */}
              <a href={brandLinks.anaqa} target="_blank" rel="noopener noreferrer" className="logo-link" aria-label="ANAQA Men Creation (si apre in una nuova scheda)">
                <img loading="lazy"
                src="/assets/loghi/anaqa.webp"
                alt="ANAQA Men Creation"
                width="1169" height="240"
                className="h-14 sm:h-16 w-auto object-contain"
              />
              </a>

              <div className="space-y-2">
                <div className="text-xs uppercase font-bold tracking-[0.25em] text-amber-400">
                  REFERENTE & BRAND AMBASSADOR ANAQA
                </div>
                <h3 className="text-2xl sm:text-3xl font-display font-bold text-white">
                  Costruisci la tua linea retail d'eccellenza
                </h3>
              </div>

              <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                Come referente e Brand Ambassador ANAQA, ti aiuto a conoscere la linea e a individuare le formule dedicate alla tua clientela. Prodotti, novità, espositori e kit diventano parte di una proposta commerciale coerente ed esclusiva.
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-amber-200">
                <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-amber-400" /> Kit campionatura per barberie</span>
                <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-amber-400" /> Margini di rivendita protetti</span>
                <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-amber-400" /> Formazione tecnica all'uso</span>
              </div>

              <div className="pt-2">
                <a
                  href="https://wa.me/393917163833?text=Salve,%20vorrei%20conoscere%20la%20linea%20prodotti%20e%20i%20kit%20ANAQA%20per%20la%20mia%20barberia"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-full btn-gold text-xs uppercase font-bold tracking-wider shadow-gold-glow"
                >
                  <span>Voglio conoscere ANAQA</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>

            </div>

            {/* Product Luxury Mockup / Visual */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center">
              <div className="w-full p-6 rounded-2xl glass-panel border border-white/10 text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Package className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">ANAQA Elite Barber Kit</h4>
                  <p className="text-xs text-gray-400 mt-1">Soluzione chiavi in mano per integrare il retail alla poltrona.</p>
                </div>
                <div className="text-xs font-semibold text-amber-400 uppercase tracking-widest pt-2">
                  Esclusiva Barberie Selezionate
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((c, i) => (
            <div key={i} className="glass-card rounded-2xl p-6 border-white/10 hover:border-amber-500/40 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/20">
                  {c.tag}
                </span>
                <h4 className="text-lg font-bold text-white mt-4 mb-2">{c.title}</h4>
                <p className="text-xs text-gray-400 leading-relaxed">{c.desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
