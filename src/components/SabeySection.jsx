import { brandLinks, WA_KEPLERO, waLink } from '../routes';
import React from 'react';
import { Scissors, MessageSquare } from 'lucide-react';

// Schede ricostruite da Maurizio (05/11/2026). Niente garanzia, niente 30D:
// la foto non è arrivata. Per la Carly acciaio e numero denti restano fuori, sono da confermare.
const modelli = [
  {
    id: '40/30',
    titolo: 'Sfoltitura controllata',
    src: '/assets/img/sabey/sabey-3040.png',
    specs: ['Acciaio 440', '40 denti', 'Misura 6.0"', 'Sfoltitura circa 30%'],
    testo: 'Sfoltitrice professionale per alleggerire la massa in modo progressivo. Lavora sulle connessioni, ammorbidisce le transizioni e riduce il volume senza un intervento aggressivo.',
    tecniche: 'Blending, alleggerimento graduale, connessioni tra lunghezze e rifiniture.',
    beneficio: 'Toglie circa il 30% della massa e lascia le transizioni morbide.',
  },
  {
    id: 'Carly Semi-Offset',
    titolo: 'Ergonomia e texture',
    src: '/assets/img/sabey/sabey-curly-semi-offset.jpg',
    specs: ['Forbice sfoltitrice', 'Impugnatura semi-offset', 'Sfoltitura indicativa 35–40%'],
    testo: 'Sfoltitrice per chi cerca equilibrio tra ergonomia, controllo e alleggerimento. L’impugnatura semi-offset tiene la mano e il pollice in una posizione più naturale durante la sessione.',
    tecniche: 'Riduzione del volume, texture, alleggerimento delle lunghezze e connessioni.',
    beneficio: 'Più comfort in mano e una sfoltitura indicativa del 35–40%, utile per dare movimento.',
  },
  {
    id: '40D',
    titolo: 'Sfoltitura intensa',
    src: '/assets/img/sabey/sabey-40d.png',
    specs: ['Acciaio 440', '40 denti a profilo curvo', 'Sfoltitura circa 50%', 'Struttura più robusta della 40DS'],
    testo: 'Sfoltitrice per una riduzione importante della massa. Il profilo curvo dei denti e la struttura robusta la distinguono dalla versione Slim.',
    tecniche: 'Alleggerimenti importanti, riduzione della densità, volume e texturizzazione.',
    beneficio: 'Alleggerisce le zone più dense con una sfoltitura di circa il 50%.',
  },
  {
    id: '40DS Slim',
    titolo: 'Profilo sottile, controllo e maneggevolezza',
    src: '/assets/img/sabey/sabey-40ds.png',
    specs: ['Acciaio 440', '40 denti', 'Misura 6.0"', 'Sfoltitura circa 50%', 'Versione Slim, pancia più piatta della 40D'],
    testo: 'Variante più sottile della 40D. Stessa sfoltitura nominale, circa il 50%, con un profilo più piatto e snello. Cambia la geometria, non la percentuale.',
    tecniche: 'Alleggerimenti decisi e lavori di precisione.',
    beneficio: 'La stessa capacità della 40D, con una struttura più sottile per chi vuole più controllo in mano.',
  },
  {
    id: 'Black Anthos 6.5',
    titolo: 'Precisione ed ergonomia',
    src: '/assets/img/sabey/sabey-black-anthos.jpg',
    specs: ['Misura 6.5"', 'Impugnatura semi-offset', 'Struttura in titanio', 'Punta particolarmente affilata'],
    testo: 'Geometria appuntita e impugnatura semi-offset. La punta entra nella ciocca con controllo, il manico tiene la mano in una postura più naturale.',
    tecniche: 'Point cutting, freehand, dettagli, precisione e definizione delle forme.',
    beneficio: 'Dettaglio e comfort insieme: controlli l’ingresso della lama e affatichi meno la mano.',
  },
  {
    id: 'Francis 6.0',
    titolo: 'Versatilità e controllo',
    src: '/assets/img/sabey/sabey-francis.png',
    specs: ['Acciaio VG10', 'Misura 6.0"', 'Impugnatura ad anelli pari', 'Struttura simmetrica'],
    testo: 'Geometria tradizionale per chi vuole un controllo diretto. Gli anelli pari restituiscono l’impostazione classica, utile nelle tecniche di precisione.',
    tecniche: 'Forbice su pettine, connessioni, costruzione delle forme, rifiniture e taglio di precisione.',
    beneficio: 'Una 6 pollici in VG10 che resta versatile su più tecniche, con l’impugnatura classica.',
  },
  {
    id: 'Linea GT',
    titolo: 'Precisione, controllo, potenza',
    src: '/assets/img/sabey/sabey-gt.png',
    specs: ['Acciaio 440', 'Impugnatura dritta ad anelli pari', 'Punta ultra-appuntita', 'Finitura lucida', 'Misure 5.0", 6.0", 6.5" e 7.0"'],
    testo: 'Linea per il lavoro tecnico. La punta ultra-appuntita entra nel dettaglio e nella costruzione delle forme. Gli anelli pari danno il controllo tradizionale.',
    tecniche: 'Freehand cutting, forbice su pettine, precision cutting, rifiniture e dettagli nelle sfumature.',
    beneficio: 'Uno strumento diretto quando il taglio chiede precisione estrema.',
  },
  {
    id: 'Linea VR',
    titolo: 'Precisione, ergonomia e fluidità',
    src: '/assets/img/sabey/sabey-vr.png',
    specs: ['Acciaio VG10', 'Impugnatura offset', 'Lavorazione a doppia anima', 'Misure 5.0", 5.5", 6.0", 6.5" e 7.0"'],
    testo: 'VG10 e impugnatura offset, per una posizione più naturale di mano e pollice. Le misure corte aiutano il dettaglio, quelle lunghe il movimento ampio e il taglio su pettine.',
    tecniche: 'Point cutting, tagli geometrici, costruzione delle forme, taglio su pettine e rifiniture.',
    beneficio: 'Scegli la misura sulla tua tecnica: dal dettaglio al gesto largo, con la stessa ergonomia.',
  },
];

const WA = waLink(WA_KEPLERO, 'Salve, vorrei informazioni su una forbice Sabey.');

export default function SabeySection() {
  return (
    <section id="sabey" className="py-24 relative overflow-hidden bg-gradient-to-b from-[#111111] via-[#181818] to-[#111111]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-amber-500/30">
            <span className="text-[11px] uppercase tracking-[0.25em] text-amber-400 font-bold">
              SABEY SCISSORS
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-display font-bold text-white tracking-tight">
            Lo strumento è parte{' '}
            <span className="font-serif italic font-normal gold-text-gradient">
              del professionista.
            </span>
          </h2>

          <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
            Sabey Scissors propone forbici professionali.
            La scelta la fai con Keplero, a partire dalla tua mano e dal lavoro di ogni giorno.
          </p>
        </div>

        <div className="glass-panel-gold rounded-3xl p-8 sm:p-12 border border-amber-500/30 mb-16 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

            <div className="lg:col-span-7 space-y-6">

              <div className="flex items-center gap-4">
                <a href={brandLinks.sabey} target="_blank" rel="noopener noreferrer" className="logo-link" aria-label="Sabey Scissors Europa su Instagram (si apre in una nuova scheda)">
                  <img loading="lazy"
                    src="/assets/loghi/sabey.webp"
                    alt="Sabey Scissors Italy Hand Made"
                    width="1549" height="240"
                    className="h-14 sm:h-16 w-auto object-contain"
                  />
                </a>
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

              <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-amber-200">
                <span className="px-3.5 py-1.5 rounded-xl bg-black/40 border border-white/10">La tua mano</span>
                <span className="hidden sm:inline text-amber-500" aria-hidden="true">•</span>
                <span className="px-3.5 py-1.5 rounded-xl bg-black/40 border border-white/10">La tua tecnica</span>
                <span className="hidden sm:inline text-amber-500" aria-hidden="true">•</span>
                <span className="px-3.5 py-1.5 rounded-xl bg-black/40 border border-white/10">Il tuo strumento</span>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-4">
                <a
                  href="#modelli"
                  className="px-7 py-3.5 rounded-full btn-gold text-xs uppercase font-bold tracking-wider text-center shadow-gold-glow"
                >
                  Vedi i modelli
                </a>
                <a
                  href={WA}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-7 py-3.5 rounded-full btn-glass text-xs uppercase font-bold tracking-wider text-center text-amber-300 border-amber-500/30 flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4 text-amber-400" />
                  <span>Aiutami a scegliere la mia Sabey</span>
                </a>
              </div>

            </div>

            <div className="lg:col-span-5 flex flex-col items-center justify-center">
              <img loading="lazy"
                src="/assets/img/sabey-brand-ambassador.webp"
                alt="Sabey Scissors, Brand Ambassador Strategist: Maurizio Pizzuto"
                width="800" height="791"
                className="w-64 h-auto sm:w-72 lg:w-80 object-contain"
              />
              <div className="mt-4 text-[11px] uppercase tracking-[0.2em] text-gray-400 text-center font-semibold">
                Certificazione Ufficiale Brand Ambassador
              </div>
            </div>

          </div>
        </div>

        <div id="modelli" className="glass-panel rounded-3xl p-8 sm:p-12 border border-white/10">
          <span id="trova-forbice" className="block scroll-mt-24" />
          <div className="max-w-2xl mb-8">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-amber-400 mb-2">
              <Scissors className="w-4 h-4" />
              <span>Forbici professionali</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-display font-bold text-white">
              Modelli dal catalogo Sabey
            </h3>
            <p className="text-xs sm:text-sm text-gray-400 mt-2 leading-relaxed">
              Non esiste una forbice perfetta per tutto. Esiste lo strumento più adatto alla tecnica, alla mano e al risultato che vuoi ottenere.
            </p>
          </div>

          <ul className="grid grid-cols-1 lg:grid-cols-2 gap-4 list-none p-0 m-0">
            {modelli.map((m) => (
              <li key={m.id} className="rounded-2xl border border-white/10 bg-black/40 overflow-hidden flex flex-col">
                <div className="bg-white p-4">
                  <img
                    src={m.src}
                    alt={`Forbice Sabey ${m.id}`}
                    width="400"
                    height="400"
                    loading="lazy"
                    className="w-full h-44 sm:h-52 object-contain"
                  />
                </div>
                <div className="p-5 sm:p-6 flex flex-col gap-3 flex-1">
                  <div>
                    <h4 className="text-lg sm:text-xl font-display font-bold text-white leading-tight">Sabey {m.id}</h4>
                    <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-amber-400 font-bold">{m.titolo}</p>
                  </div>
                  <ul className="flex flex-wrap gap-2 list-none p-0 m-0">
                    {m.specs.map((spec) => (
                      <li key={spec} className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px] text-gray-200">{spec}</li>
                    ))}
                  </ul>
                  <p className="text-sm text-gray-300 leading-relaxed">{m.testo}</p>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    <span className="text-amber-200 font-semibold">Tecniche consigliate. </span>{m.tecniche}
                  </p>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    <span className="text-amber-200 font-semibold">Per il barber. </span>{m.beneficio}
                  </p>
                  <a
                    href={waLink(WA_KEPLERO, `Salve, vorrei informazioni sulla forbice Sabey ${m.id}.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full btn-glass text-xs uppercase font-bold tracking-wider text-amber-300 border-amber-500/30"
                  >
                    <MessageSquare className="w-4 h-4 text-amber-400" />
                    Chiedi su WhatsApp
                  </a>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="text-xs text-gray-400 max-w-xl">
              Sabey è un marchio di strumenti professionali. Per un modello scrivi a Keplero e indica la forbice.
            </p>
            <a
              href={WA}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-full btn-gold text-xs uppercase font-bold tracking-wider whitespace-nowrap shadow-gold-glow text-center"
            >
              Chiedi informazioni a Keplero
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
