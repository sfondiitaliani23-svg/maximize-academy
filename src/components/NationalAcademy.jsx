import React from 'react';
import { Award, Handshake, Hammer, Brain, Sparkles, MessageCircle, Scissors, GraduationCap, Globe, ClipboardList, BookOpen, Users, ArrowRight, ArrowUpRight, Trophy, Sprout } from 'lucide-react';

// Barber National Academy (03/11/2026): progetto formativo 2027 di Maurizio Pizzuto.
// Regola di Maurizio: tenere separato ciò che è ufficiale, le collaborazioni e ciò che è ancora in sviluppo.
// La partecipazione di UAAMI al programma 2027 è in definizione: non scriverla come già decisa.
// I questionari restano interni: qui si dice solo che esistono, nessun dato raccolto dal sito.

const WA = 'https://wa.me/393245878724?text=';
const msgCollaboratore = encodeURIComponent('Salve, vorrei entrare nella lista d’attesa della Barber National Academy 2027.');
const msgTitolare = encodeURIComponent('Salve, sono titolare di una barberia: vorrei informazioni sulla Barber National Academy 2027 per i miei collaboratori.');

const stato = [
  {
    icon: Award,
    tag: 'Percorso formativo',
    title: 'Solo Maximize Academy e UAAMI',
    items: [
      'Maximize Academy di Maurizio Pizzuto',
      'UAAMI, Centro UAAMI Foggia (Unione Artistica Acconciatori Misti Italiani)',
      'La collaborazione per il 2027 è ancora in fase di definizione',
    ],
    tone: 'border-amber-400/60 bg-amber-500/10',
  },
  {
    icon: Handshake,
    tag: 'Altri ruoli',
    title: 'Non sono formazione',
    items: [
      'Sabey Scissors: solo strumenti professionali e forbici',
      'ANAQA: prodotti professionali',
      'M×E Barber Lab: progettazione e sviluppo di siti web e soluzioni digitali per le barberie',
    ],
    tone: 'border-white/15 bg-white/[0.03]',
  },
  {
    icon: Hammer,
    tag: 'In sviluppo',
    title: 'Barber National Academy 2027',
    items: ['Programma, sedi e date in definizione', 'La collaborazione con UAAMI per il 2027 non è ancora chiusa'],
    tone: 'border-dashed border-white/25 bg-transparent',
  },
];

const moduli = [
  { icon: Sparkles, n: '01', title: 'Priming e atteggiamento', text: 'Come si entra in barberia, come ci si prepara alla giornata e al cliente. Lo stato emotivo giusto prima della tecnica.' },
  { icon: Trophy, n: '02', title: 'I 5 pilastri del carisma', text: 'Fiducia, passione, immagine, impatto e straordinarietà: cosa sono e come si allenano, ogni giorno.' },
  { icon: Brain, n: '03', title: 'Le 6 intelligenze', text: 'Strategica, comportamentale, ambientale, linguistica, emotiva e relazionale, applicate al lavoro alla poltrona.' },
  { icon: Users, n: '04', title: 'Stare in barberia', text: 'Comportamento, squadra, rapporto con il titolare e con il cliente. Professionalità che si vede.' },
  { icon: MessageCircle, n: '05', title: 'Vendita in barberia', text: 'Consigliare servizi e prodotti con naturalezza, senza forzare. Il valore prima del prezzo.' },
  { icon: Scissors, n: '06', title: 'Linea stilistica', text: 'Taglio geometrico, separazioni in verticale e in orizzontale, dissolvenze. Per ogni scelta: cosa vuoi ottenere e perché.' },
  { icon: GraduationCap, n: '07', title: 'Come si affronta un corso', text: 'Cosa osservare, quali domande fare ai formatori, come prendere appunti. Preparazione al corso di formazione di fine 2027.' },
  { icon: Globe, n: '08', title: 'Barberia e digitale', text: 'Perché una barberia ha bisogno di un sito che lavora: prenotazioni, contatti, fiducia. I siti li progetta M×E Barber Lab, che non è un ente di formazione.' },
];

const metodo = [
  { icon: ClipboardList, title: 'Questionario d’ingresso', text: 'Prima di iniziare: punto di partenza, obiettivi, cosa vuoi migliorare. Resta riservato e serve solo a costruire il percorso.' },
  { icon: BookOpen, title: 'Esercizi a casa', text: 'Dopo ogni giornata, esercizi da ripassare. La crescita si fa tra un incontro e l’altro.' },
  { icon: Award, title: 'Verifica e attestato', text: 'A fine percorso, verifica di quello che hai imparato e attestato di partecipazione Maximize Academy.' },
];

const fasi = [
  { n: 'Fase 1', title: 'Settore giovanile', text: 'Ciclo di 6-7 giornate per collaboratori e ragazzi che lavorano in barberia. Si parte da Foggia e provincia.' },
  { n: 'Fase 2', title: 'La Nazionale', text: 'I partecipanti più motivati e costanti vengono convocati in un gruppo ristretto, con lavoro più avanzato.' },
  { n: 'Fase 3', title: 'Incontro con i titolari', text: 'I collaboratori invitano i loro titolari: riepilogo del percorso e il ruolo del digitale nella crescita della barberia.' },
  { n: 'Ott – Nov 2027', title: 'Corso di formazione', text: 'Il gruppo arriva preparato al corso di formazione di fine anno: sa cosa guardare e cosa chiedere.' },
];

export default function NationalAcademy() {
  return (
    <section id="national-academy" className="relative overflow-hidden bg-gradient-to-b from-[#111111] via-[#161616] to-[#111111]">
      {/* Apertura */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-amber-500/30 text-[11px] uppercase tracking-[0.25em] text-amber-400 font-bold">Progetto formativo 2027</span>
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-dashed border-white/30 text-[11px] uppercase tracking-[0.2em] text-gray-300 font-bold">
            <Hammer className="w-3.5 h-3.5" aria-hidden="true" /> In sviluppo
          </span>
        </div>
        <h1 className="mt-6 text-[clamp(2.4rem,1.6rem+4vw,4.6rem)] leading-[1.05] font-display font-bold text-white tracking-tight">
          Barber National Academy.
          <span className="block font-serif italic font-normal gold-text-gradient">Dal settore giovanile alla Nazionale.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-base sm:text-lg text-gray-300 leading-relaxed">
          Come nel calcio: i talenti nascono nel settore giovanile, i migliori vengono convocati in Nazionale.
          Un percorso per i collaboratori che vogliono crescere, ideato da Maurizio Pizzuto con Maximize Academy.
          Prima le basi: atteggiamento, comportamento, vendita, metodo. Poi la tecnica, con il perché di ogni gesto.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <a href={WA + msgCollaboratore} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full btn-gold text-xs uppercase font-bold tracking-wider shadow-gold-glow">
            Entra nella lista d’attesa <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </a>
          <a href={WA + msgTitolare} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full btn-glass text-xs uppercase font-bold tracking-wider">
            Sono un titolare
          </a>
        </div>
      </div>

      {/* Stato del progetto */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20" aria-labelledby="na-stato">
        <h2 id="na-stato" className="text-sm font-bold uppercase tracking-[0.16em] text-amber-400">A che punto siamo</h2>
        <p className="mt-2 text-gray-400 text-sm max-w-2xl">Il percorso formativo è solo Maximize Academy e UAAMI. La collaborazione per il 2027 è ancora in fase di definizione. Gli altri marchi hanno un ruolo diverso, e non insegnano.</p>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {stato.map((s) => (
            <div key={s.tag} className={`rounded-2xl border p-6 ${s.tone}`}>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-amber-300">
                <s.icon className="w-4 h-4" aria-hidden="true" /> {s.tag}
              </div>
              <h3 className="mt-3 text-xl font-bold text-white">{s.title}</h3>
              <ul className="mt-3 space-y-2 text-sm text-gray-300">
                {s.items.map((it) => <li key={it} className="flex gap-2"><span className="text-amber-400" aria-hidden="true">·</span>{it}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Settore giovanile e Nazionale */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="glass-card rounded-3xl p-8 border-white/10">
            <Sprout className="w-7 h-7 text-amber-400" aria-hidden="true" />
            <h2 className="mt-4 text-2xl sm:text-3xl font-display font-bold text-white">Il settore giovanile</h2>
            <p className="mt-3 text-gray-300 leading-relaxed">È dove parte tutto. Qui si formano i collaboratori: le basi che spesso nessuno insegna, prima ancora della tecnica. Un titolare può mandare i suoi ragazzi per farli crescere.</p>
          </div>
          <div className="glass-panel-gold rounded-3xl p-8 border border-amber-500/30">
            <Trophy className="w-7 h-7 text-amber-400" aria-hidden="true" />
            <h2 className="mt-4 text-2xl sm:text-3xl font-display font-bold text-white">La Nazionale</h2>
            <p className="mt-3 text-gray-300 leading-relaxed">Come quando i migliori di ogni squadra vengono convocati. Un gruppo di professionisti che si allena insieme, impara il metodo di Maurizio Pizzuto e lo porta nella propria barberia, oggi da collaboratore, domani magari da titolare.</p>
          </div>
        </div>
      </div>

      {/* Programma */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20" aria-labelledby="na-programma">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-amber-400">Il programma</p>
        <h2 id="na-programma" className="mt-3 text-[clamp(1.9rem,1.3rem+2.6vw,3.2rem)] leading-[1.1] font-bold text-white">
          Otto aree, <em className="not-italic font-normal text-amber-400">6-7 giornate.</em>
        </h2>
        <p className="mt-3 text-sm text-gray-400 max-w-2xl">Contenuti in definizione: l’ordine e la durata di ogni area possono cambiare nel programma finale.</p>
        <ul className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[#3d3d3d] border border-[#3d3d3d] list-none p-0 m-0">
          {moduli.map((m) => (
            <li key={m.n} className="bg-[#111111] p-6 flex flex-col">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold tracking-[0.16em] text-amber-400">{m.n}</span>
                <m.icon className="w-5 h-5 text-amber-400/80" aria-hidden="true" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-white">{m.title}</h3>
              <p className="mt-2 text-sm text-gray-400 leading-relaxed">{m.text}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Metodo */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20" aria-labelledby="na-metodo">
        <h2 id="na-metodo" className="text-sm font-bold uppercase tracking-[0.16em] text-amber-400">Come funziona</h2>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {metodo.map((m) => (
            <div key={m.title} className="rounded-2xl border border-white/10 bg-black/30 p-6">
              <m.icon className="w-6 h-6 text-amber-400" aria-hidden="true" />
              <h3 className="mt-3 text-lg font-bold text-white">{m.title}</h3>
              <p className="mt-2 text-sm text-gray-400 leading-relaxed">{m.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Percorso 2027 */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20" aria-labelledby="na-fasi">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-amber-400">Il percorso 2027</p>
        <h2 id="na-fasi" className="mt-3 text-[clamp(1.9rem,1.3rem+2.6vw,3.2rem)] leading-[1.1] font-bold text-white">Dai ragazzi ai titolari.</h2>
        <ol className="mt-10 grid grid-cols-1 md:grid-cols-4 gap-4 list-none p-0 m-0">
          {fasi.map((f, i) => (
            <li key={f.n} className="relative rounded-2xl border border-white/10 bg-[#141414] p-6">
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-amber-400">{f.n}</span>
              <h3 className="mt-3 text-lg font-bold text-white">{f.title}</h3>
              <p className="mt-2 text-sm text-gray-400 leading-relaxed">{f.text}</p>
              {i < fasi.length - 1 && <ArrowRight className="hidden md:block absolute -right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-400/70 bg-[#111111] rounded-full" aria-hidden="true" />}
            </li>
          ))}
        </ol>
        <p className="mt-4 text-sm text-gray-500">Date e sedi verranno comunicate qui e a chi è in lista d’attesa.</p>
      </div>

      {/* Chiusura */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="glass-panel-gold rounded-3xl p-8 sm:p-10 border border-amber-500/30 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-white">Vuoi essere convocato?</h2>
            <p className="mt-3 text-gray-300 leading-relaxed">Lascia il tuo nome nella lista d’attesa: ti scriviamo appena il programma è definitivo. Nessun impegno.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <a href={WA + msgCollaboratore} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full btn-gold text-xs uppercase font-bold tracking-wider whitespace-nowrap">
              Lista d’attesa <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
            </a>
            <a href="/formazione" className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full btn-glass text-xs uppercase font-bold tracking-wider whitespace-nowrap">
              Formazione attiva
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
