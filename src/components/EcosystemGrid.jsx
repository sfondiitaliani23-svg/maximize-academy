import React from 'react';
import { GraduationCap, TrendingUp, Scissors, Calendar, Users, Rocket, ArrowUpRight } from 'lucide-react';

export default function EcosystemGrid() {
  const steps = [
    {
      num: '01',
      action: 'IMPARA',
      category: 'FORMAZIONE',
      title: 'Alza il livello.',
      desc: 'Educator, tecnica pura e confronto internazionale con i migliori maestri.',
      link: '#formazione',
      icon: GraduationCap,
      goldAccent: true
    },
    {
      num: '02',
      action: 'MIGLIORA',
      category: 'BUSINESS',
      title: 'Cambia prospettiva.',
      desc: 'Vendita, organizzazione e crescita dell’attività con il metodo Barber Reset.',
      link: '#barber-reset',
      icon: TrendingUp,
      highlight: true
    },
    {
      num: '03',
      action: 'ATTREZZATI',
      category: 'STRUMENTI & PRODOTTI',
      title: 'Scegli con criterio.',
      desc: 'Sabey Scissors artigianali e soluzioni professionali ANAQA per valorizzare il servizio.',
      link: '#sabey',
      icon: Scissors
    },
    {
      num: '04',
      action: 'ORGANIZZATI',
      category: 'INNOVAZIONE',
      title: 'Ripensa l’agenda.',
      desc: 'Prenotazioni online h24 e gestione digitale semplificata con Treatwell.',
      link: '#treatwell',
      icon: Calendar
    },
    {
      num: '05',
      action: 'CONFRONTATI',
      category: 'NETWORK & EVENTI',
      title: 'Esci. Incontra. Cresci.',
      desc: 'Porta il tuo talento sul palco di Barber Match e negli eventi Men’s Events.',
      link: '#barber-match',
      icon: Users
    },
    {
      num: '06',
      action: 'CRESCI',
      category: 'MAXIMIZE ACADEMY',
      title: 'Evolvi come leader.',
      desc: 'Un percorso su misura guidato direttamente dall’esperienza di Maurizio Pizzuto.',
      link: '#contatti',
      icon: Rocket,
      goldAccent: true
    }
  ];

  return (
    <section id="ecosistema" className="py-24 relative overflow-hidden">
      {/* Background Decor */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-amber-500/30">
            <span className="text-[11px] uppercase tracking-[0.25em] text-amber-400 font-bold">
              L'ECOSISTEMA MAXIMIZE
            </span>
          </div>
          
          <h2 className="text-3xl sm:text-5xl font-display font-bold text-white tracking-tight">
            Un professionista.{' '}
            <span className="font-serif italic font-normal gold-text-gradient">
              Infinite direzioni.
            </span>
          </h2>
          
          <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
            Il tuo prossimo passo può essere una nuova competenza, uno strumento migliore o una connessione che apre possibilità. Partiamo da ciò che serve a te.
          </p>
        </div>

        {/* Grid Responsive (ottimizzata: 1 colonna mobile per evitare troncamenti di 'ORGANIZZATI' e 'CONFRONTATI') */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <a
                key={idx}
                href={step.link}
                className={`group relative p-7 rounded-2xl transition-all duration-400 flex flex-col justify-between ${
                  step.highlight 
                    ? 'glass-panel-gold border-amber-500/40 shadow-gold-glow hover:border-amber-400' 
                    : 'glass-card hover:border-amber-500/40'
                }`}
              >
                {/* Header Card */}
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2.5">
                      <span className="font-display font-extrabold text-xs tracking-widest text-amber-400">
                        {step.num}
                      </span>
                      <span className="text-white/20">/</span>
                      {/* Titolo Azione (Organizzati, Confrontati) con nowrap ed elastico */}
                      <span className="text-xs font-bold uppercase tracking-[0.18em] text-white whitespace-nowrap">
                        {step.action}
                      </span>
                    </div>

                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                      step.highlight 
                        ? 'bg-amber-400 text-black shadow-gold-glow' 
                        : 'bg-white/5 text-amber-300 border border-white/10'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="text-[10px] uppercase tracking-[0.2em] text-amber-400/80 font-semibold mb-2">
                    {step.category}
                  </div>

                  <h3 className="text-xl sm:text-2xl font-display font-bold text-white group-hover:text-amber-300 transition-colors mb-3">
                    {step.title}
                  </h3>

                  <p className="text-sm text-gray-400 leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                {/* Footer Card with Action Link */}
                <div className="pt-6 mt-4 border-t border-white/10 flex items-center justify-between text-xs font-semibold text-amber-400 group-hover:text-amber-200">
                  <span className="tracking-wider uppercase text-[11px]">Scopri di più</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </a>
            );
          })}
        </div>

      </div>
    </section>
  );
}
