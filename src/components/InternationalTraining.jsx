import React from 'react';
import { Award, ArrowRight, Sparkles } from 'lucide-react';

export default function InternationalTraining() {
  return (
    <section id="formazione" className="py-24 relative overflow-hidden bg-gradient-to-b from-[#111111] via-[#181818] to-[#111111]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-amber-500/30">
            <span className="text-[11px] uppercase tracking-[0.25em] text-amber-400 font-bold">
              FORMAZIONE
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-display font-bold text-white tracking-tight">
            Il percorso formativo è{' '}
            <span className="font-serif italic font-normal gold-text-gradient">
              Maximize Academy e UAAMI.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
            Solo questi due. La collaborazione per il 2027 è ancora in fase di definizione.
            Sabey Scissors propone forbici professionali, ANAQA i prodotti professionali, M×E Barber Lab i siti e le soluzioni digitali.
          </p>
        </div>

        <div className="glass-panel-gold rounded-3xl p-8 sm:p-10 border border-amber-500/30 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-amber-300">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>PERCORSO PROFESSIONALE E FORMATIVO</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-display font-bold text-white">
                Maximize Academy e UAAMI
              </h3>
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                Maurizio Pizzuto è entrato nella famiglia <strong className="text-amber-300">UAAMI</strong> (Unione Artistica Acconciatori Misti Italiani, dal 1957) come <strong className="text-amber-300">Centro UAAMI Foggia</strong>.
                Il percorso formativo è rappresentato solo da Maximize Academy e da UAAMI.
                La collaborazione per il 2027 è ancora in fase di definizione.
              </p>
              <ul className="space-y-2 pt-2 text-sm text-gray-300 list-none p-0 m-0">
                <li className="flex items-start gap-2"><Award className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" aria-hidden="true" /> <span><strong className="text-white">Sabey Scissors</strong> — forbici professionali.</span></li>
                <li className="flex items-start gap-2"><Award className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" aria-hidden="true" /> <span><strong className="text-white">ANAQA</strong> — prodotti professionali.</span></li>
                <li className="flex items-start gap-2"><Award className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" aria-hidden="true" /> <span><a href="/mxe" className="text-white font-bold hover:text-amber-300">M×E Barber Lab</a> — siti web e soluzioni digitali per le barberie.</span></li>
              </ul>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-4 items-center justify-center bg-black/40 p-6 rounded-2xl border border-white/10">
              <img loading="lazy"
                src="/assets/img/logo-maximize.webp"
                alt="Maximize Academy"
                width="181" height="224"
                className="h-24 sm:h-28 w-auto object-contain"
              />
              <div className="w-16 h-[1px] bg-white/10" />
              <img loading="lazy"
                src="/assets/loghi/uaami.webp"
                alt="UAAMI – Unione Artistica Acconciatori Misti Italiani"
                width="600" height="600"
                className="h-28 sm:h-32 w-auto object-contain"
              />
            </div>

          </div>

          <div className="mt-8 pt-6 border-t border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-gray-400 text-center sm:text-left">
              Vuoi partecipare al prossimo corso o organizzare una tappa nella tua città?
            </span>
            <a
              href="https://wa.me/393245878724?text=Salve,%20vorrei%20informazioni%20sulle%20prossime%20date%20dei%20corsi%20di%20Formazione"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-full btn-gold text-xs uppercase font-bold tracking-wider whitespace-nowrap shadow-gold-glow"
            >
              Parla con l'operatore formazione
            </a>
          </div>

        </div>

        <a href="/barber-national-academy" className="group mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-dashed border-white/25 p-6 sm:p-8 hover:border-amber-400/60 transition-colors">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400">Progetto 2027 · collaborazione in definizione</span>
            <h3 className="mt-2 text-xl sm:text-2xl font-display font-bold text-white group-hover:text-amber-300 transition-colors">Barber National Academy</h3>
            <p className="mt-1 text-sm text-gray-400">Dal settore giovanile alla Nazionale. Il ruolo di UAAMI nel 2027 non è ancora chiuso.</p>
          </div>
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-amber-400 whitespace-nowrap">Scopri il progetto <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></span>
        </a>

      </div>
    </section>
  );
}
