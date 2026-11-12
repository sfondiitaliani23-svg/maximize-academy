import { brandLinks, WA_KEPLERO, waLink } from '../routes';
import React, { useEffect, useState } from 'react';
import { ArrowRight, Check, ShoppingBag, MapPin } from 'lucide-react';
import ProductBookingModal from './ProductBookingModal';

const PAGINE_LINEA = 42;

const rituale = [
  { nome: 'Beard Shampoo', testo: 'Deterge delicatamente barba e pelle, eliminando impurità e residui.', prezzo: '18' },
  { nome: 'Beard Peeling', testo: 'Esfolia la pelle sotto la barba, rimuovendo le cellule morte.', prezzo: '18' },
  { nome: 'Beard Foam', testo: 'Ammorbidisce e condiziona la barba, rendendola più disciplinata.', prezzo: '20' },
  { nome: 'Beard Oil', testo: 'Nutre, ammorbidisce e dona lucentezza alla barba.', prezzo: '25' },
  { nome: 'Beard Perfume', testo: 'Completa il rituale con una piacevole fragranza.', prezzo: '28' },
];

function srcLinea(n) {
  return `/assets/img/anaqa/linea/${String(n).padStart(2, '0')}.webp`;
}

export default function AnaqaSection() {
  const [lineaAperta, setLineaAperta] = useState(false);
  const [pagina, setPagina] = useState(1);
  const [prodottoSelezionato, setProdottoSelezionato] = useState(null);
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

  useEffect(() => {
    if (!lineaAperta) return undefined;
    const vicino = pagina < PAGINE_LINEA ? pagina + 1 : null;
    if (vicino) {
      const img = new Image();
      img.src = srcLinea(vicino);
    }
    const onKey = (e) => {
      if (e.key === 'ArrowRight') setPagina((p) => Math.min(PAGINE_LINEA, p + 1));
      if (e.key === 'ArrowLeft') setPagina((p) => Math.max(1, p - 1));
      if (e.key === 'Escape') setLineaAperta(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lineaAperta, pagina]);

  useEffect(() => {
    if (!lineaAperta) return undefined;
    const id = requestAnimationFrame(() => {
      document.getElementById('linea-anaqa')?.scrollIntoView({ block: 'start' });
    });
    return () => cancelAnimationFrame(id);
  }, [lineaAperta]);

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
          <div className="max-w-3xl space-y-6">
              
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

              <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                L’acquisto dei prodotti è riservato esclusivamente ai professionisti del settore. Per informazioni o richieste commerciali scrivi a Keplero.
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-amber-200">
                <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-amber-400" /> Kit campionatura per barberie</span>
                <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-amber-400" /> Margini di rivendita protetti</span>
                <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-amber-400" /> Prodotti professionali per la barberia</span>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => { setPagina(1); setLineaAperta(true); }}
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full btn-gold text-xs uppercase font-bold tracking-wider shadow-gold-glow"
                >
                  <span>Scopri tutta la linea ANAQA</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <a
                  href={waLink(WA_KEPLERO, 'Voglio conoscere ANAQA')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full btn-glass text-xs uppercase font-bold tracking-wider text-amber-300 border-amber-500/30"
                >
                  <span>Voglio conoscere ANAQA</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>

          </div>
        </div>

        <div id="rituale-barba" className="glass-panel rounded-3xl p-8 sm:p-12 border border-white/10 mb-12 scroll-mt-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <figure className="lg:col-span-5">
              <img
                src="/assets/img/anaqa/rituale-barba.webp"
                alt="ANAQA, The Art of Grooming: rituale per barba e baffi. Cleanse, condition, define."
                width="1280"
                height="1600"
                className="w-full h-auto rounded-2xl border border-white/10"
              />
            </figure>

            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <div className="text-xs uppercase font-bold tracking-[0.25em] text-amber-400">
                  ANAQA
                </div>
                <h3 className="text-2xl sm:text-3xl font-display font-bold text-white">
                  Rituale Barba Professionale in 5 Step
                </h3>
              </div>

              <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                Un trattamento completo studiato per detergere, esfoliare, nutrire e valorizzare barba e pelle, trasformando la cura quotidiana in un’esperienza di benessere.
              </p>

              <ol className="space-y-4 list-none p-0 m-0">
                {rituale.map((passo, i) => (
                  <li key={passo.nome} className="flex gap-4">
                    <span className="shrink-0 w-8 h-8 rounded-full border border-amber-500/40 text-amber-300 text-sm font-bold flex items-center justify-center" aria-hidden="true">
                      {i + 1}
                    </span>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      <strong className="text-white">{passo.nome}.</strong> {passo.testo}
                    </p>
                  </li>
                ))}
              </ol>

              {/* Prenota e Ritira in Salone */}
              <div className="pt-6 border-t border-white/10 mt-6">
                <div className="flex items-center gap-2 text-xs uppercase font-bold tracking-[0.2em] text-amber-400 mb-2">
                  <ShoppingBag className="w-4 h-4" />
                  <span>PRENOTA E RITIRA IN BARBERIA</span>
                </div>
                <p className="text-xs text-gray-400 mb-4">
                  Vuoi i prodotti del rituale per la cura a casa? Bloccali online e ritirali comodamente al <strong className="text-white">Maurizio Barber Shop</strong> a Foggia, senza spese di spedizione.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {rituale.map((p) => (
                    <button
                      key={p.nome}
                      type="button"
                      onClick={() => setProdottoSelezionato({ name: `ANAQA ${p.nome}`, price: p.prezzo })}
                      className="p-3 rounded-xl bg-black/40 border border-amber-500/20 hover:border-amber-500/60 transition-all flex items-center justify-between text-left group"
                    >
                      <div>
                        <span className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors block">
                          {p.nome}
                        </span>
                        <span className="text-[11px] text-amber-300 font-semibold">€ {p.prezzo}</span>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/30">
                        Prenota
                      </span>
                    </button>
                  ))}
                </div>

                <div className="mt-3">
                  <button
                    type="button"
                    onClick={() => setProdottoSelezionato({ name: 'Kit Completo Rituale Barba ANAQA (5 Prodotti)', price: '99' })}
                    className="w-full p-3.5 rounded-xl btn-gold text-xs uppercase font-bold tracking-wider flex items-center justify-center gap-2 shadow-gold-glow"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Prenota Kit Completo (5 Prodotti) · € 99</span>
                  </button>
                </div>
              </div>

              <p className="text-sm sm:text-base text-gray-300 leading-relaxed pt-2">
                ANAQA: cinque prodotti, un unico rituale di cura e benessere professionale.
              </p>
              <p className="text-sm text-amber-200 leading-relaxed">
                Linea dedicata ai professionisti del settore barber.
              </p>
            </div>
          </div>
        </div>

        {lineaAperta && (
          <div id="linea-anaqa" className="glass-panel rounded-3xl p-4 sm:p-8 border border-white/10 mb-12 scroll-mt-24">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-4">
              <div>
                <h3 className="text-xl sm:text-2xl font-display font-bold text-white">Linea ANAQA</h3>
                <p className="text-xs sm:text-sm text-gray-400 mt-1 leading-relaxed max-w-xl">
                  Catalogo ufficiale. Si consulta qui, senza prezzi. L’acquisto resta riservato ai professionisti del settore.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setLineaAperta(false)}
                className="px-5 py-2.5 rounded-full btn-glass text-xs uppercase font-bold tracking-wider text-gray-200"
              >
                Chiudi
              </button>
            </div>

            <div className="mb-4 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setPagina((p) => Math.max(1, p - 1))}
                disabled={pagina === 1}
                className="px-3 sm:px-5 py-3 rounded-full btn-glass text-[11px] sm:text-xs uppercase font-bold tracking-wider text-amber-300 border-amber-500/30 disabled:opacity-40"
              >
                Precedente
              </button>
              <p className="text-[11px] sm:text-xs text-gray-300 tabular-nums text-center">Pagina {pagina} di {PAGINE_LINEA}</p>
              <button
                type="button"
                onClick={() => setPagina((p) => Math.min(PAGINE_LINEA, p + 1))}
                disabled={pagina === PAGINE_LINEA}
                className="px-3 sm:px-5 py-3 rounded-full btn-gold text-[11px] sm:text-xs uppercase font-bold tracking-wider disabled:opacity-40"
              >
                Successiva
              </button>
            </div>

            <img
              src={srcLinea(pagina)}
              alt={`Catalogo ANAQA, pagina ${pagina} di ${PAGINE_LINEA}`}
              width="1200"
              height="1697"
              className="w-full max-h-[68vh] sm:max-h-[75vh] object-contain bg-white rounded-xl"
            />
          </div>
        )}

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

      {/* Modale Prenotazione e Ritiro Prodotti al Maurizio Barber Shop */}
      {prodottoSelezionato && (
        <ProductBookingModal
          product={prodottoSelezionato}
          onClose={() => setProdottoSelezionato(null)}
        />
      )}
    </section>
  );
}
