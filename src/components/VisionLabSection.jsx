import React, { useState } from 'react';
import { ArrowRight, ArrowDown, Theater, Users, Handshake, MapPin, Send, Moon, Sun, CalendarDays, Clock, Scissors, Wallet, UsersRound, CheckCircle2, Film, MessageCircle } from 'lucide-react';
import { WA_MAURIZIO, waLink } from '../routes.js';

// Vision Lab Academy 2027 × Maximize Academy (14/11/2026).
// Testi ufficiali di Maurizio e dati dalle locandine di Luigi Di Domenico: non riscriverli.
// Pagina in BOZZA: fuori da menu, footer e sitemap, con noindex, finché Luigi non la approva.
// Da verificare con Luigi: la locandina Team Vision dice Nando Quaranta il 17 maggio,
// il calendario completo il 19 maggio (Middle Evolution, serale). Qui si segue l'elenco di Maurizio (17 maggio).
// Le richieste del modulo vanno a /api/contact: email al canale Maximize e tabella mx_richieste (area /area).

const IMG = '/assets/img/vision-lab';

const fondatori = ['Luigi Di Domenico', 'Giuseppe Vinacci', 'Nando Quaranta', 'Giovanni Morra'];

// Calendario completo 2027 (locandina ufficiale): 16 incontri. sera = corso serale 21:30–24:00.
const calendario = [
  { g: '11', m: 'Gennaio', t: 'Fade Lab', d: 'Nando Quaranta × BB Skill' },
  { g: '18', m: 'Gennaio', t: 'Il Metodo', d: 'Federico Attura' },
  { g: '27', m: 'Gennaio', t: 'Moda commerciale · Salon Cut', d: 'Giovanni Morra', sera: true },
  { g: '03', m: 'Febbraio', t: 'Curly Evolution · Permanente', d: 'Team Vision', sera: true },
  { g: '08', m: 'Febbraio', t: 'Beyond the Fade', d: 'Nando Quaranta' },
  { g: '15', m: 'Febbraio', t: 'Fade Culture', d: 'Antonio Amico' },
  { g: '24', m: 'Febbraio', t: 'Colorimetria e tecniche di schiaritura', d: 'Team Vision', sera: true },
  { g: '08', m: 'Marzo', t: 'Anglosassone Lab', d: 'Angelo Testa' },
  { g: '17', m: 'Marzo', t: 'Patch cutanea', d: 'Nunzio Verde', sera: true },
  { g: '05', m: 'Aprile', t: 'Geometric Lab', d: 'Giovanni Giuffrida' },
  { g: '14', m: 'Aprile', t: 'Stiratura perfetta', d: 'Team Vision', sera: true },
  { g: '26', m: 'Aprile', t: 'Beard Experience', d: 'Antonio Cardone · Pluricampione Barba Barber Match' },
  { g: '03', m: 'Maggio', t: 'Skyline Method', d: 'Gianluca Barbaro' },
  { g: '10', m: 'Maggio', t: 'White Pearl', d: 'Ciro Rainone' },
  { g: '19', m: 'Maggio', t: 'Middle Evolution', d: 'Nando Quaranta', sera: true },
  { g: '26', m: 'Maggio', t: 'Crea il tuo successo', d: 'Luigi Di Domenico', sera: true },
];

// Team Vision Specialist: 8 giornate (elenco di Maurizio).
const teamVision = [
  { g: '11', m: 'Gennaio', t: 'Fade Experience', d: 'Nando Quaranta' },
  { g: '18', m: 'Gennaio', t: 'Master Experience', d: 'Federico Attura' },
  { g: '08', m: 'Febbraio', t: 'Fade Experience', d: 'Nando Quaranta' },
  { g: '08', m: 'Marzo', t: 'Anglosassone Experience', d: 'Angelo Testa' },
  { g: '05', m: 'Aprile', t: 'Curly e Mullet Experience', d: 'Giovanni Giuffrida' },
  { g: '26', m: 'Aprile', t: 'Beard Fade Experience', d: 'Antonio Cardone' },
  { g: '03', m: 'Maggio', t: 'Skyline Experience', d: 'Gianluca Barbaro' },
  { g: '17', m: 'Maggio', t: 'Fade Experience', d: 'Nando Quaranta' },
];

const formatori = [
  { n: 'Nando Quaranta', s: 'Fade Experience' },
  { n: 'Federico Attura', s: 'Master Experience' },
  { n: 'Angelo Testa', s: 'Anglosassone Experience' },
  { n: 'Giovanni Giuffrida', s: 'Curly e Mullet Experience' },
  { n: 'Antonio Cardone', s: 'Beard Fade Experience' },
  { n: 'Gianluca Barbaro', s: 'Skyline Experience' },
  { n: 'Giovanni Morra', s: 'Moda commerciale · Salon Cut' },
  { n: 'Antonio Amico', s: 'Fade Culture' },
  { n: 'Nunzio Verde', s: 'Patch cutanea · Permanente da competizione' },
  { n: 'Ciro Rainone', s: 'White Pearl' },
  { n: 'Luigi Di Domenico', s: 'Crea il tuo successo' },
];

const PERCORSI = ['Percorso completo – 1.000 €', 'Team Vision Specialist – 800 €', 'Giornata singola – 150 €', 'Non so ancora, voglio un consiglio'];

const offerte = [
  { id: 'percorso-completo', percorso: PERCORSI[0], title: 'Percorso completo', price: '1.000 €', lead: 'Il programma integrale Vision Lab Academy 2027.', points: ['16 incontri formativi, da gennaio a maggio', '7 corsi serali inclusi (21:30–24:00)', 'Tutti i docenti del calendario ufficiale', 'Pagamento rateizzabile'], cta: 'Scopri il percorso completo', top: true },
  { id: 'team-vision', percorso: PERCORSI[1], title: 'Team Vision Specialist', price: '800 €', lead: 'Il percorso dedicato alle specializzazioni del Team Vision.', points: ['8 giornate formative', '6 formatori specialisti', 'Fade, Anglosassone, Curly e Mullet, Beard Fade, Skyline', 'Pagamento rateizzabile'], cta: 'Scopri Team Vision Specialist' },
  { id: 'giornata-singola', percorso: PERCORSI[2], title: 'Giornata singola', price: '150 €', lead: 'Una giornata formativa a tua scelta.', points: ['Scegli la data dal calendario', 'Previa disponibilità dei posti', 'In coordinamento con l’organizzazione'], cta: 'Scegli la tua giornata' },
];

const info = [
  { icon: MapPin, t: 'Sede', d: 'Vision Lab Academy, Via Eduardo De Filippo 18, Sant’Antimo (NA)' },
  { icon: Theater, t: 'Metodo', d: 'Formazione Visual + Workshop: dimostrazione dal vivo e pratica' },
  { icon: Clock, t: 'Orari', d: 'Giornate diurne dalle 10:00. Corsi serali 21:30–24:00' },
  { icon: Scissors, t: 'Pratica', d: 'Su modello reale o testa-modello, a tua scelta. Modelli, testine e attrezzatura a carico del partecipante' },
  { icon: Wallet, t: 'Pagamento', d: 'Percorsi rateizzabili, secondo le modalità concordate' },
  { icon: UsersRound, t: 'Posti', d: 'Disponibilità limitata dalla capienza della sala: massimo 70 partecipanti' },
];

const btnGold = 'inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full btn-gold text-xs uppercase font-bold tracking-wider';
const btnGlass = 'inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full btn-glass text-xs uppercase font-bold tracking-wider';
const eyebrow = 'text-sm font-bold uppercase tracking-[0.16em] text-amber-400';
const h2 = 'mt-3 text-[clamp(1.9rem,1.3rem+2.6vw,3.2rem)] leading-[1.1] font-bold text-white';

function DateList({ items, id }) {
  return (
    <ol className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-px bg-[#3d3d3d] border border-[#3d3d3d] list-none p-0 m-0" aria-labelledby={id}>
      {items.map((x, i) => (
        <li key={`${x.g}-${x.m}-${i}`} className="bg-[#111111] p-4 flex gap-4 items-start">
          <div className="w-14 shrink-0 text-center">
            <span className="block text-3xl font-display font-bold text-amber-400 leading-none">{x.g}</span>
            <span className="block mt-1 text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400">{x.m.slice(0, 3)}</span>
          </div>
          <div className="min-w-0">
            <p className="font-bold text-white leading-snug">{x.t}</p>
            <p className="text-sm text-gray-400">{x.d}</p>
            <p className="mt-1 inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.12em] text-amber-300/90">
              {x.sera ? <><Moon className="w-3.5 h-3.5" aria-hidden="true" /> Serale · 21:30</> : <><Sun className="w-3.5 h-3.5" aria-hidden="true" /> Diurno · 10:00</>}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}

function Poster({ src, alt }) {
  return (
    <a href={src} target="_blank" rel="noopener" className="block rounded-2xl overflow-hidden border border-amber-500/30 shadow-gold-glow">
      <img src={src} alt={alt} width="1024" height="1536" loading="lazy" decoding="async" className="w-full h-auto" />
    </a>
  );
}

function LeadForm({ percorso, setPercorso }) {
  const [f, setF] = useState({ nome: '', cognome: '', telefono: '', citta: '', privacy: false, hp: '' });
  const [state, setState] = useState('idle');
  const [err, setErr] = useState('');
  const upd = (k) => (e) => setF((o) => ({ ...o, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (f.hp) return; // campo trappola per i robot
    if (!f.privacy) { setErr('Per inviare la richiesta serve il consenso all’informativa privacy.'); return; }
    setState('sending'); setErr('');
    try {
      const resp = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${f.nome} ${f.cognome}`.trim(),
          phone: f.telefono,
          type: `Vision Lab 2027 · ${percorso}`,
          message: `Città: ${f.citta}\nPercorso di interesse: ${percorso}\nFonte: pagina Vision Lab Academy (Maximize Academy)`,
        }),
      });
      const data = await resp.json().catch(() => ({}));
      if (resp.ok && data.success) setState('done');
      else { setState('idle'); setErr(data.error || 'Invio non riuscito. Riprova o scrivici su WhatsApp.'); }
    } catch {
      setState('idle'); setErr('Connessione non riuscita: la richiesta non è partita. Riprova o scrivici su WhatsApp.');
    }
  };

  const input = 'w-full min-h-[48px] rounded-xl bg-black/40 border border-white/15 px-4 text-white placeholder:text-gray-500 focus:border-amber-400 focus:outline-none';
  const wa = waLink(WA_MAURIZIO, `Ciao Maurizio, vorrei informazioni su Vision Lab Academy 2027: ${percorso}.`);

  if (state === 'done') {
    return (
      <div className="rounded-3xl glass-panel-gold border border-amber-500/40 p-8 text-center" role="status">
        <CheckCircle2 className="w-10 h-10 mx-auto text-amber-400" aria-hidden="true" />
        <h3 className="mt-4 text-2xl font-bold text-white">Richiesta inviata.</h3>
        <p className="mt-2 text-gray-300">Ti ricontattiamo noi di Maximize Academy per accompagnarti nell’iscrizione.</p>
        <a href={wa} target="_blank" rel="noopener noreferrer" className={`${btnGlass} mt-6`}><MessageCircle className="w-4 h-4" aria-hidden="true" /> Scrivici anche su WhatsApp</a>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="relative rounded-3xl glass-card border border-white/10 p-6 sm:p-8 grid gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="grid gap-1.5 text-sm text-gray-300">Nome<input className={input} name="given-name" autoComplete="given-name" required value={f.nome} onChange={upd('nome')} /></label>
        <label className="grid gap-1.5 text-sm text-gray-300">Cognome<input className={input} name="family-name" autoComplete="family-name" required value={f.cognome} onChange={upd('cognome')} /></label>
        <label className="grid gap-1.5 text-sm text-gray-300">Telefono<input className={input} type="tel" name="tel" autoComplete="tel" inputMode="tel" required pattern="[0-9+ ]{8,}" value={f.telefono} onChange={upd('telefono')} /></label>
        <label className="grid gap-1.5 text-sm text-gray-300">Città<input className={input} name="city" autoComplete="address-level2" required value={f.citta} onChange={upd('citta')} /></label>
      </div>
      <label className="grid gap-1.5 text-sm text-gray-300">Percorso di interesse
        <select className={input} value={percorso} onChange={(e) => setPercorso(e.target.value)}>
          {PERCORSI.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
      </label>
      <input type="text" name="sito" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] w-px h-px" value={f.hp} onChange={upd('hp')} />
      <label className="flex gap-3 items-start text-sm text-gray-300">
        <input type="checkbox" className="mt-1 w-5 h-5 accent-amber-500 shrink-0" checked={f.privacy} onChange={upd('privacy')} required />
        <span>Ho letto l’<a href="/privacy.html" target="_blank" rel="noopener" className="underline text-amber-300">informativa privacy</a> e acconsento a essere ricontattato da Maximize Academy per questa richiesta.</span>
      </label>
      {err && <p className="text-sm text-red-400" role="alert">{err}</p>}
      <div className="flex flex-col sm:flex-row gap-3">
        <button type="submit" disabled={state === 'sending'} className={`${btnGold} disabled:opacity-60`}>
          {state === 'sending' ? 'Invio in corso…' : <>Richiedi informazioni / Iscriviti <Send className="w-4 h-4" aria-hidden="true" /></>}
        </button>
        <a href={wa} target="_blank" rel="noopener noreferrer" className={btnGlass}><MessageCircle className="w-4 h-4" aria-hidden="true" /> Preferisco WhatsApp</a>
      </div>
    </form>
  );
}

export default function VisionLabSection() {
  const [percorso, setPercorso] = useState(PERCORSI[0]);
  const choose = (p) => { setPercorso(p); document.getElementById('iscriviti')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); };

  return (
    <section id="vision-lab" className="relative overflow-hidden bg-gradient-to-b from-[#111111] via-[#161616] to-[#111111]">
      {/* Apertura */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-14">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-10 items-center">
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-amber-500/30 text-[11px] uppercase tracking-[0.2em] text-amber-400 font-bold">Partnership 2027 · Centro UAAMI Napoli</span>
            <h1 className="mt-6 text-[clamp(2.4rem,1.6rem+4vw,4.6rem)] leading-[1.05] font-display font-bold text-white tracking-tight">
              Formazione Vision Lab 2027.
              <span className="block font-serif italic font-normal gold-text-gradient">Entra in Vision, cambia la tua visione.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base sm:text-lg text-gray-300 leading-relaxed">
              Il percorso di crescita di Vision Lab Academy arriva ai professionisti pugliesi con Maximize Academy. Scegli il percorso: ti accompagniamo noi nell’iscrizione.
            </p>
          </div>
          <img src={`${IMG}/logo-vision-lab.webp`} alt="Vision Lab Academy" width="464" height="514" className="w-44 sm:w-56 lg:w-64 h-auto mx-auto lg:mx-0" decoding="async" />
        </div>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <a href="#percorso-completo" className={btnGold}>Scopri il percorso completo <ArrowDown className="w-4 h-4" aria-hidden="true" /></a>
          <a href="#team-vision" className={btnGlass}>Scopri Team Vision Specialist <ArrowDown className="w-4 h-4" aria-hidden="true" /></a>
          <a href="#iscriviti" className={btnGlass}>Richiedi informazioni / Iscriviti</a>
        </div>
        <dl className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-px bg-[#3d3d3d] border border-[#3d3d3d]">
          {[['16', 'incontri nel percorso completo'], ['8', 'giornate Team Vision'], ['70', 'posti al massimo'], ['10:00', 'inizio delle giornate']].map(([k, v]) => (
            <div key={v} className="bg-[#111111] p-4">
              <dt className="text-3xl font-display font-bold text-amber-400">{k}</dt>
              <dd className="mt-1 text-xs uppercase tracking-[0.12em] text-gray-400">{v}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* 1. Presentazione */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16" aria-labelledby="vl-chi">
        <p className={eyebrow}>L’accademia</p>
        <h2 id="vl-chi" className={h2}>Vision Lab <em className="not-italic font-normal text-amber-400">Academy.</em></h2>
        <p className="mt-6 max-w-3xl text-gray-300 leading-relaxed">
          Fondata nel settembre 2026 a Sant’Antimo da Luigi Di Domenico, Giuseppe Vinacci, Nando Quaranta e Giovanni Morra, Vision Lab Academy nasce come sede del Centro UAAMI Napoli, con l’obiettivo di offrire una formazione avanzata, concreta e orientata alla crescita professionale di barbieri e acconciatori.
        </p>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass-card rounded-3xl p-7 border-white/10">
            <Users className="w-6 h-6 text-amber-400" aria-hidden="true" />
            <h3 className="mt-4 text-sm font-bold uppercase tracking-[0.16em] text-amber-400">I fondatori</h3>
            <ul className="mt-3 space-y-1.5 text-white">{fondatori.map((x) => <li key={x}>{x}</li>)}</ul>
          </div>
          <div className="glass-panel-gold rounded-3xl p-7 border border-amber-500/30 md:col-span-2">
            <Theater className="w-6 h-6 text-amber-400" aria-hidden="true" />
            <h3 className="mt-4 text-sm font-bold uppercase tracking-[0.16em] text-amber-400">Il metodo · Visual + Workshop</h3>
            <p className="mt-3 text-gray-200 leading-relaxed">Il cuore dell’accademia è il Vision Theater, uno spazio formativo dove dimostrazioni dal vivo e workshop pratici si integrano, favorendo il confronto diretto tra formatori e partecipanti.</p>
            <p className="mt-3 text-gray-300 leading-relaxed">Dalle tecniche di taglio alle sfumature, dallo styling alle nuove tendenze, ogni percorso è pensato per trasformare le conoscenze acquisite in competenze applicabili nel lavoro quotidiano.</p>
          </div>
        </div>
      </div>

      {/* Partnership */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20" aria-labelledby="vl-partner">
        <div className="rounded-3xl border border-amber-500/30 bg-black/30 p-8 sm:p-12">
          <div className="flex items-center justify-center gap-6 sm:gap-10">
            <img src={`${IMG}/marchio-vision-lab.webp`} alt="Vision Lab Academy" width="280" height="243" className="h-16 sm:h-20 w-auto" loading="lazy" decoding="async" />
            <span className="text-3xl font-light text-amber-400" aria-hidden="true">×</span>
            <img src="/assets/img/logo-maximize.webp" alt="Maximize Academy" className="h-16 sm:h-20 w-auto" loading="lazy" decoding="async" />
          </div>
          <p className="mt-10 text-center text-sm font-bold uppercase tracking-[0.16em] text-amber-400">Vision Lab Academy × Maximize Academy</p>
          <h2 id="vl-partner" className="mt-3 text-center text-[clamp(1.9rem,1.3rem+2.6vw,3.2rem)] leading-[1.1] font-bold text-white">
            Una partnership dedicata alla crescita dei <em className="not-italic font-normal text-amber-400">professionisti pugliesi.</em>
          </h2>
          <div className="mt-8 mx-auto max-w-3xl space-y-4 text-gray-300 leading-relaxed">
            <p>Dalla condivisione di una visione comune nasce la collaborazione tra Vision Lab Academy e Maximize Academy, fondata da Maurizio Pizzuto.</p>
            <p>L’obiettivo è creare un collegamento diretto tra l’offerta formativa di Vision Lab Academy e i professionisti della Puglia, facilitando l’accesso ai percorsi, alle informazioni e alle opportunità di aggiornamento.</p>
            <p>Attraverso Maximize Academy, i barber pugliesi potranno conoscere i programmi formativi, approfondire i contenuti e ricevere supporto nella scelta del percorso più adatto alle proprie esigenze.</p>
          </div>
          <div className="mt-8 flex flex-col items-center text-center">
            <Handshake className="w-6 h-6 text-amber-400" aria-hidden="true" />
            <p className="mt-2 text-lg text-white">La formazione crea competenze. Il confronto genera crescita.</p>
          </div>
        </div>
      </div>

      {/* 2. Tre possibilità */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20" aria-labelledby="vl-offerte">
        <p className={eyebrow}>Offerta formativa 2027</p>
        <h2 id="vl-offerte" className={h2}>Tre possibilità, <em className="not-italic font-normal text-amber-400">una visione.</em></h2>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
          {offerte.map((o) => (
            <article key={o.id} className={`flex flex-col rounded-3xl p-7 border ${o.top ? 'glass-panel-gold border-amber-500/50' : 'glass-card border-white/10'}`}>
              <h3 className="text-xl font-bold text-white">{o.title}</h3>
              <p className="mt-3 text-4xl font-display font-bold text-amber-400">{o.price}</p>
              <p className="mt-3 text-sm text-gray-300">{o.lead}</p>
              <ul className="mt-4 space-y-2 text-sm text-gray-300 flex-1">
                {o.points.map((p) => <li key={p} className="flex gap-2"><CheckCircle2 className="w-4 h-4 mt-0.5 text-amber-400 shrink-0" aria-hidden="true" />{p}</li>)}
              </ul>
              <div className="mt-6 grid gap-2">
                <button type="button" onClick={() => choose(o.percorso)} className={btnGold}>Iscriviti <ArrowRight className="w-4 h-4" aria-hidden="true" /></button>
                <a href={`#${o.id}`} className={btnGlass}>{o.cta}</a>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Percorso completo */}
      <div id="percorso-completo" className="scroll-mt-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_22rem] gap-10 items-start">
          <div>
            <p className={eyebrow}>Percorso completo · 1.000 €</p>
            <h2 id="vl-cal" className={h2}>Il calendario <em className="not-italic font-normal text-amber-400">2027.</em></h2>
            <p className="mt-3 text-gray-400 max-w-2xl">16 incontri da gennaio a maggio, inclusi i corsi serali (21:30–24:00). Giornate diurne dalle 10:00.</p>
            <DateList items={calendario} id="vl-cal" />
            <div className="mt-6 rounded-2xl border border-amber-500/30 bg-amber-500/[0.06] p-5">
              <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.14em] text-amber-400"><CalendarDays className="w-4 h-4" aria-hidden="true" /> Giugno e luglio</p>
              <p className="mt-2 text-gray-200">Shooting dei lavori svolti · Preparazione Barber Match e Mondiale OMC</p>
              <p className="text-sm text-gray-400">Nunzio Verde · Permanente da competizione</p>
            </div>
            <button type="button" onClick={() => choose(PERCORSI[0])} className={`${btnGold} mt-8`}>Iscriviti al percorso completo <ArrowRight className="w-4 h-4" aria-hidden="true" /></button>
          </div>
          <Poster src={`${IMG}/locandina-calendario-2027.webp`} alt="Locandina ufficiale Formazione Vision Lab 2027 con il calendario degli incontri" />
        </div>
      </div>

      {/* Team Vision Specialist */}
      <div id="team-vision" className="scroll-mt-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_22rem] gap-10 items-start">
          <div>
            <p className={eyebrow}>Team Vision Specialist · 800 €</p>
            <h2 id="vl-team" className={h2}>8 giornate, <em className="not-italic font-normal text-amber-400">6 specialisti.</em></h2>
            <p className="mt-3 text-gray-400 max-w-2xl">Il percorso dedicato alle specializzazioni del Team Vision. Giornate dalle 10:00.</p>
            <DateList items={teamVision} id="vl-team" />
            <button type="button" onClick={() => choose(PERCORSI[1])} className={`${btnGold} mt-8`}>Iscriviti a Team Vision Specialist <ArrowRight className="w-4 h-4" aria-hidden="true" /></button>
          </div>
          <Poster src={`${IMG}/locandina-team-vision-2027.webp`} alt="Locandina ufficiale Team Vision Specialist 2027 con i formatori" />
        </div>
      </div>

      {/* Giornata singola */}
      <div id="giornata-singola" className="scroll-mt-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="glass-card rounded-3xl border-white/10 p-8 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 items-center">
          <div>
            <p className={eyebrow}>Giornata singola · 150 €</p>
            <h2 className="mt-3 text-2xl sm:text-3xl font-bold text-white">Una giornata, la tua scelta.</h2>
            <p className="mt-3 text-gray-300 max-w-2xl">Puoi partecipare a una singola giornata formativa del calendario, previa disponibilità dei posti e coordinamento con l’organizzazione.</p>
          </div>
          <button type="button" onClick={() => choose(PERCORSI[2])} className={btnGold}>Chiedi la tua giornata <ArrowRight className="w-4 h-4" aria-hidden="true" /></button>
        </div>
      </div>

      {/* 3. Informazioni pratiche */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20" aria-labelledby="vl-info">
        <p className={eyebrow}>Informazioni pratiche</p>
        <h2 id="vl-info" className={h2}>Tutto quello che <em className="not-italic font-normal text-amber-400">ti serve sapere.</em></h2>
        <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 list-none p-0 m-0">
          {info.map((x) => (
            <li key={x.t} className="glass-card rounded-2xl border-white/10 p-6">
              <x.icon className="w-5 h-5 text-amber-400" aria-hidden="true" />
              <h3 className="mt-3 font-bold text-white">{x.t}</h3>
              <p className="mt-1 text-sm text-gray-300 leading-relaxed">{x.d}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* 5. Formatori e video */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20" aria-labelledby="vl-formatori">
        <p className={eyebrow}>I formatori</p>
        <h2 id="vl-formatori" className={h2}>Chi sale sul <em className="not-italic font-normal text-amber-400">Vision Theater.</em></h2>
        {/* Foto dei formatori: da aggiungere in /assets/img/vision-lab/formatori/ quando arrivano. */}
        <ul className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-px bg-[#3d3d3d] border border-[#3d3d3d] list-none p-0 m-0">
          {formatori.map((x) => (
            <li key={x.n} className="bg-[#111111] p-5">
              <p className="font-bold text-white leading-snug">{x.n}</p>
              <p className="mt-1 text-sm text-gray-400">{x.s}</p>
            </li>
          ))}
        </ul>
        <div className="mt-10">
          <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-amber-400"><Film className="w-4 h-4" aria-hidden="true" /> Video</p>
          {/* Reel promozionali: 3 riquadri 9:16 pronti per i file .mp4 di Vision Lab. */}
          <div className="mt-4 grid grid-cols-3 gap-3 max-w-xl">
            {[1, 2, 3].map((n) => (
              <div key={n} className="aspect-[9/16] rounded-2xl border border-dashed border-white/20 grid place-items-center text-center text-[11px] uppercase tracking-[0.14em] text-gray-500 p-2">Reel in arrivo</div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Modulo */}
      <div id="iscriviti" className="scroll-mt-24 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <p className={`${eyebrow} text-center`}>Richiedi informazioni / Iscriviti</p>
        <h2 className={`${h2} text-center`}>Il tuo posto in <em className="not-italic font-normal text-amber-400">Vision.</em></h2>
        <p className="mt-3 mb-8 text-center text-gray-400">Lascia i tuoi dati: ti ricontatta Maximize Academy e ti accompagna nella scelta e nell’iscrizione. Massimo 70 posti.</p>
        <LeadForm percorso={percorso} setPercorso={setPercorso} />
      </div>
    </section>
  );
}
