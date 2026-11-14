import React, { useCallback, useEffect, useState } from 'react';
import { hasSession, login, logout, token, chiSono, iscriviti, recuperaPassword, googleUrl, sessioneDaIndirizzo, nuovaPassword, utente, serveCodice, confermaCodice, riserva, linkViaEmail, googleRitorno } from '../lib/account';
import { rest, caricaFile, apriFile, cancellaFile, fmtData, fmtQuando } from '../lib/area';
import GoogleButton from './GoogleButton';
import StrumentiRiservati from './StrumentiRiservati';
import '../area.css';

// Pagina /area (02/11/2026): area privata di Maximize Academy, come un'app.
// Allievi: corsi e date, materiali, attestati, avvisi, profilo. Admin (ruolo admin o cofounder): richieste, allievi, corsi, avvisi.
// Chi vede cosa lo decide il database (supabase/area-privata.sql). Nessun dato personale finisce nei log.

const P = {
  home: 'M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z',
  corsi: 'M4 5h16v14H4zM4 9h16M9 5v4',
  file: 'M7 3h7l5 5v13H7zM14 3v5h5',
  award: 'M12 3a6 6 0 1 1 0 12 6 6 0 0 1 0-12zM9 14l-2 7 5-3 5 3-2-7',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0',
  inbox: 'M3 13l3-8h12l3 8v6H3zM3 13h5l1 3h6l1-3h5',
  people: 'M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM2 20a7 7 0 0 1 14 0M16 4.5a3.5 3.5 0 0 1 0 6.5M18 14a6 6 0 0 1 4 6',
  bell: 'M6 16V11a6 6 0 0 1 12 0v5l2 2H4zM10 20a2 2 0 0 0 4 0',
  more: 'M5 12h.01M12 12h.01M19 12h.01',
  play: 'M8 5v14l11-7z',
  link: 'M10 14a4 4 0 0 0 6 0l3-3a4 4 0 0 0-6-6l-1 1M14 10a4 4 0 0 0-6 0l-3 3a4 4 0 0 0 6 6l1-1',
  plus: 'M12 5v14M5 12h14',
  chat: 'M4 5h16v11H8l-4 4z',
  eliseo: 'M4 4h16v16H4zM4 9h16M8 13h5M8 16h8',
  maverik: 'M12 3l2.2 4.6 5 .7-3.6 3.5.9 5.1L12 14.8 7.5 16.9l.9-5.1L4.8 8.3l5-.7z',
};
const Ic = ({ d, size = 22 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={d === P.more ? 3.4 : 1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>
);

function useLargo() {
  const q = '(min-width: 960px)';
  const [largo, setLargo] = useState(() => window.matchMedia(q).matches);
  useEffect(() => { const m = window.matchMedia(q); const f = () => setLargo(m.matches); m.addEventListener?.('change', f); return () => m.removeEventListener?.('change', f); }, []);
  return largo;
}

const oggi = () => new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Rome' });
const periodo = (c) => (c?.data_inizio ? (c.data_fine && c.data_fine !== c.data_inizio ? `${fmtData(c.data_inizio)} – ${fmtData(c.data_fine)}` : fmtData(c.data_inizio)) : 'Date da definire');
const waLink = (tel) => { let n = String(tel || '').replace(/\D/g, ''); if (n.startsWith('00')) n = n.slice(2); if (n.length <= 10) n = `39${n}`; return `https://wa.me/${n}`; };
const tipoDa = (f) => (f.type === 'application/pdf' ? 'pdf' : f.type.startsWith('video/') ? 'video' : 'file');

// Apre la finestra subito (al tocco), poi ci mette l'indirizzo: così il telefono non la blocca.
async function apri(m) {
  const w = window.open('', '_blank');
  try {
    const url = m.tipo === 'link' ? m.url : await apriFile(m.path);
    if (w) { w.opener = null; w.location.href = url; } else window.location.href = url;
  } catch (e) { if (w) w.close(); throw e; }
}

/* ---------- pezzi comuni ---------- */
function useDati(path, deps = []) {
  const [dati, setDati] = useState(null);
  const [errore, setErrore] = useState('');
  const carica = useCallback(() => {
    if (!path) return;
    rest(path).then((d) => { setDati(d || []); setErrore(''); }).catch((e) => setErrore(e.message));
  }, [path]);
  useEffect(carica, [carica, ...deps]);
  return [dati, errore, carica];
}

function Sheet({ title, onClose, children }) {
  useEffect(() => {
    const k = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', k);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', k); document.body.style.overflow = ''; };
  }, [onClose]);
  return (
    <>
      <div className="ap-veil" onClick={onClose} />
      <div className="ap-sheet" role="dialog" aria-modal="true" aria-label={title}>
        <span className="ap-grip" />
        <h2 className="ap-h2" style={{ marginTop: 0 }}>{title}</h2>
        {children}
      </div>
    </>
  );
}

const Stato = ({ errore, dati, vuoto }) => {
  if (errore) return <p className="ap-msg ap-msg--err" role="alert">{errore}</p>;
  if (!dati) return <p className="ap-soft">Caricamento…</p>;
  if (!dati.length) return <div className="ap-card"><p className="ap-soft" style={{ margin: 0 }}>{vuoto}</p></div>;
  return null;
};

function Riga({ icon, soft, title, sub, right, onClick }) {
  return (
    <li>
      <button type="button" className="ap-row" onClick={onClick}>
        <span className={`ap-ic${soft ? ' ap-ic--soft' : ''}`}><Ic d={icon} /></span>
        <span className="ap-row-main"><strong>{title}</strong>{sub && <span>{sub}</span>}</span>
        {right ?? <span className="ap-chev"><Ic d="M9 6l6 6-6 6" size={18} /></span>}
      </button>
    </li>
  );
}

function Campo({ label, id, ...p }) {
  const El = p.as || 'input';
  const { as, ...rest } = p;
  return <div className="ap-field"><label htmlFor={id}>{label}</label><El id={id} name={id} {...rest} /></div>;
}

function Head({ sezione, profilo, onAvatar }) {
  const iniz = (profilo?.nome || profilo?.email || '?').trim().charAt(0).toUpperCase();
  return (
    <header className="ap-top">
      <a href="/" aria-label="Torna al sito"><img className="ap-logo" src="/assets/img/logo-maximize.webp" alt="" width="40" height="40" /></a>
      <span className="ap-pill">{sezione}</span>
      <button type="button" className="ap-avatar" onClick={onAvatar} aria-label="Profilo">{iniz}</button>
    </header>
  );
}

const Titolo = ({ oro, bianco, sotto }) => <h1 className="ap-title"><em>{oro}</em>{bianco}{sotto && <small>{sotto}</small>}</h1>;

const GoogleIc = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="#4285F4" d="M22.6 12.3c0-.8-.1-1.5-.2-2.3H12v4.3h5.9a5 5 0 0 1-2.2 3.3v2.7h3.6c2.1-1.9 3.3-4.8 3.3-8z" /><path fill="#34A853" d="M12 23c3 0 5.5-1 7.3-2.7l-3.6-2.7c-1 .7-2.2 1-3.7 1-2.9 0-5.3-1.9-6.2-4.5H2.1v2.8A11 11 0 0 0 12 23z" /><path fill="#FBBC05" d="M5.8 14.1a6.6 6.6 0 0 1 0-4.2V7.1H2.1a11 11 0 0 0 0 9.8z" /><path fill="#EA4335" d="M12 5.4c1.6 0 3 .6 4.2 1.6l3.1-3.1A11 11 0 0 0 2.1 7.1l3.7 2.8C6.7 7.3 9.1 5.4 12 5.4z" /></svg>
);

/* ---------- accesso ---------- */
// Secondo passaggio (10/11/2026): chi ha attivato il codice di Google Authenticator lo scrive dopo la password.
// Senza telefono: un codice di riserva, oppure il link via email (si entra, la verifica si toglie, nuova password).
function Codice({ fatto, esci }) {
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);
  const [modo, setModo] = useState('app');
  // Tempo (10/11/2026): il codice dell'app cambia ogni 30 secondi. La schermata resta aperta 60 secondi,
  // poi l'accesso si chiude e bisogna ricaricare la pagina. Si ferma se parte il link via email o se si entra.
  const [resto, setResto] = useState(60);
  const [fermo, setFermo] = useState(false);
  const [fine] = useState(() => Date.now() + 60000);
  const scaduto = resto <= 0;
  useEffect(() => {
    if (fermo || scaduto) return undefined;
    const t = setInterval(() => setResto(Math.max(0, Math.ceil((fine - Date.now()) / 1000))), 1000);
    return () => clearInterval(t);
  }, [fermo, scaduto, fine]);
  useEffect(() => { if (scaduto && !fermo) logout().catch(() => {}); }, [scaduto, fermo]);
  const errore = (testo) => setMsg({ testo, ok: false });
  const submit = async (e) => {
    e.preventDefault();
    const raw = String(new FormData(e.currentTarget).get('codice') || '');
    if (modo === 'riserva') {
      const rc = raw.toUpperCase().replace(/[^A-Z0-9]/g, '');
      if (rc.length !== 10) { errore('Il codice di riserva ha 10 caratteri.'); return; }
      setBusy(true); setMsg(null);
      try {
        const r = await riserva('usa', rc);
        setFermo(true);
        setMsg({ ok: true, testo: `Entrato. La verifica è stata tolta: riattivala dal Profilo. Codici rimasti: ${r.rimasti}.` });
        setTimeout(fatto, 2500);
      } catch (err) { errore(err.message || 'Codice non valido o già usato.'); setBusy(false); }
      return;
    }
    const code = raw.replace(/\s/g, '');
    if (!/^\d{6}$/.test(code)) { errore('Scrivi le 6 cifre dell\'app.'); return; }
    setBusy(true); setMsg(null);
    try {
      const u = await utente();
      const f = (u?.factors || []).find((x) => x.status === 'verified' && x.factor_type === 'totp');
      if (!f) { fatto(); return; }
      await confermaCodice(f.id, code);
      setFermo(true);
      fatto();
    } catch { errore('Codice non valido. Usa quello nuovo dell\'app.'); } finally { setBusy(false); }
  };
  const email = async () => {
    setBusy(true); setMsg(null);
    try {
      const dove = await linkViaEmail();
      setFermo(true);
      setMsg({ ok: true, testo: `Ti abbiamo scritto a ${dove}. Apri il link entro un'ora: entri, scegli una password nuova e la verifica si toglie.` });
    } catch (err) { errore(err.message || 'Invio non riuscito. Riprova.'); } finally { setBusy(false); }
  };
  const riservaOn = modo === 'riserva';
  if (scaduto && !fermo) {
    return (
      <div className="ap-wrap ap-login ap-fade" style={{ paddingBottom: 40 }}>
        <Titolo oro="Verifica" bianco="in due passaggi" sotto="Il codice dell'app cambia ogni 30 secondi." />
        <div className="ap-card ap-form">
          <p className="ap-msg ap-msg--err" role="alert">Tempo scaduto: per sicurezza l'accesso è stato chiuso. Ricarica la pagina e riprova.</p>
          <button className="ap-btn ap-btn--block" type="button" onClick={() => window.location.reload()}>Ricarica la pagina</button>
        </div>
      </div>
    );
  }
  return (
    <div className="ap-wrap ap-login ap-fade" style={{ paddingBottom: 40 }}>
      <Titolo oro="Verifica" bianco="in due passaggi" sotto={riservaOn ? 'Scrivi uno dei codici di riserva salvati (es. ABCDE‑23456). Vale una volta sola.' : 'Scrivi il codice di 6 cifre dell\'app di autenticazione.'} />
      <form className="ap-card ap-form" onSubmit={submit} key={modo}>
        {!fermo && <p className={`ap-soft ap-timer${resto <= 15 ? ' is-low' : ''}`} aria-live="off">Tempo rimasto: {resto} s · il codice cambia ogni 30 s</p>}
        <Campo label={riservaOn ? 'Codice di riserva' : 'Codice'} id="codice" inputMode={riservaOn ? 'text' : 'numeric'} autoComplete={riservaOn ? 'off' : 'one-time-code'} maxLength={riservaOn ? 12 : 7} required />
        <button className="ap-btn ap-btn--block" type="submit" disabled={busy}>{busy ? 'Attendi…' : 'Conferma'}</button>
        {msg && <p className={`ap-msg ${msg.ok ? 'ap-msg--ok' : 'ap-msg--err'}`} role="status">{msg.testo}</p>}
        <button type="button" className="ap-link" style={{ justifySelf: 'start' }} onClick={() => { setModo(riservaOn ? 'app' : 'riserva'); setMsg(null); }}>
          {riservaOn ? 'Ho il telefono: usa il codice dell\'app' : 'Non hai il telefono? Usa un codice di riserva'}
        </button>
        <button type="button" className="ap-link" style={{ justifySelf: 'start' }} onClick={email} disabled={busy}>Ricevi un link via email per entrare</button>
        <button type="button" className="ap-link" style={{ justifySelf: 'start' }} onClick={esci}>Esci</button>
        {riservaOn && <p className="ap-soft" style={{ fontSize: 13 }}>Niente codici? Usa il link via email, oppure scrivi a Maurizio: toglie lui la verifica dal profilo.</p>}
      </form>
    </div>
  );
}

function Accesso({ onEntrato, avviso }) {
  const [modo, setModo] = useState(() => (window.location.hash === '#registrati' ? 'nuovo' : 'entra'));
  const [msg, setMsg] = useState(avviso || '');
  const [err, setErr] = useState(Boolean(avviso));
  const [busy, setBusy] = useState(false);
  const cambia = (m) => { setModo(m); setMsg(''); setErr(false); };

  const submit = async (e) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const email = String(f.get('email') || '').trim();
    setBusy(true); setErr(false); setMsg('');
    try {
      if (modo === 'entra') { await login(email, String(f.get('password'))); onEntrato(); return; }
      if (modo === 'recupera') { await recuperaPassword(email); setMsg('Se l\'email è registrata, ti arriva il link per una nuova password.'); return; }
      const pw = String(f.get('password'));
      if (pw.length < 10 || !/[a-z]/i.test(pw) || !/\d/.test(pw)) throw new Error('Password: almeno 10 caratteri, con lettere e numeri.');
      if (!f.get('privacy')) throw new Error('Serve il consenso al trattamento dei dati.');
      const r = await iscriviti({ nome: String(f.get('nome')).trim().slice(0, 120), email, password: pw });
      if (r.entrato) onEntrato();
      else { cambia('entra'); setMsg('Ti abbiamo mandato un\'email: conferma l\'indirizzo, poi accedi.'); }
    } catch (x) { setErr(true); setMsg(x.message); } finally { setBusy(false); }
  };

  return (
    <div className="ap-wrap ap-login ap-fade" style={{ paddingBottom: 40 }}>
      <header className="ap-top">
        <a href="/" aria-label="Torna al sito"><img className="ap-logo" src="/assets/img/logo-maximize.webp" alt="" width="40" height="40" /></a>
        <span className="ap-pill">Area privata</span>
        <a className="ap-link" href="/">Sito</a>
      </header>
      <div className="ap-login-intro">
      <Titolo oro="Maximize" bianco="Academy" sotto="I tuoi corsi, i materiali e gli attestati in un posto solo." />
      <div className="ap-hero" style={{ marginBottom: 16 }}>
        <span className="ap-eyebrow">Un solo account</span>
        <span className="ap-lead">Sei già registrato su Maurizio Barber Shop? Entra con la stessa email e la stessa password, o con Google.</span>
      </div>
      </div>
      <div className="ap-login-form">
      {modo !== 'recupera' && (
        <div className="ap-seg" style={{ marginBottom: 14 }}>
          <button type="button" aria-pressed={modo === 'entra'} onClick={() => cambia('entra')}>Accedi</button>
          <button type="button" aria-pressed={modo === 'nuovo'} onClick={() => cambia('nuovo')}>Registrati</button>
        </div>
      )}
      <form className="ap-card ap-form" onSubmit={submit}>
        {modo !== 'recupera' && <GoogleButton onEntrato={onEntrato} onErrore={(m) => { setErr(true); setMsg(m); }} />}
        {modo !== 'recupera' && <div className="ap-or">oppure</div>}
        {modo === 'nuovo' && <Campo label="Nome e cognome" id="nome" required maxLength={120} autoComplete="name" />}
        <Campo label="Email" id="email" type="email" required autoComplete={modo === 'nuovo' ? 'email' : 'username'} />
        {modo !== 'recupera' && <Campo label="Password" id="password" type="password" required minLength={modo === 'nuovo' ? 10 : undefined} autoComplete={modo === 'nuovo' ? 'new-password' : 'current-password'} />}
        {modo === 'nuovo' && (
          <label className="ap-check">
            <input type="checkbox" name="privacy" /> <span>Ho letto la <a className="ap-link" href="/privacy.html" target="_blank" rel="noopener">privacy</a> e acconsento al trattamento dei dati per i corsi. L'account vale anche su Maurizio Barber Shop.</span>
          </label>
        )}
        <button className="ap-btn ap-btn--block" type="submit" disabled={busy}>{busy ? 'Attendi…' : modo === 'entra' ? 'Entra' : modo === 'nuovo' ? 'Crea account' : 'Mandami il link'}</button>
        {msg && <p className={`ap-msg${err ? ' ap-msg--err' : ''}`} role="status">{msg}</p>}
        {modo === 'entra' && <button type="button" className="ap-link" style={{ justifySelf: 'start' }} onClick={() => cambia('recupera')}>Password dimenticata?</button>}
        {modo === 'recupera' && <button type="button" className="ap-link" style={{ justifySelf: 'start' }} onClick={() => cambia('entra')}>Torna all'accesso</button>}
      </form>
      </div>
      <div className="ap-login-steps">
      <h2 className="ap-h2">Come funziona</h2>
      <ol className="ap-steps">
        <li>Entra o crea il tuo account</li>
        <li>Maximize ti aggiunge al tuo corso</li>
        <li>Trovi date, materiali e avvisi</li>
        <li>A fine corso scarichi l'attestato</li>
      </ol>
      </div>
    </div>
  );
}

function NuovaPassword({ fatto }) {
  const [msg, setMsg] = useState('');
  const submit = async (e) => {
    e.preventDefault();
    const pw = String(new FormData(e.currentTarget).get('password'));
    if (pw.length < 10 || !/[a-z]/i.test(pw) || !/\d/.test(pw)) { setMsg('Password: almeno 10 caratteri, con lettere e numeri.'); return; }
    try { await nuovaPassword(pw); fatto(); } catch (x) { setMsg(x.message); }
  };
  return (
    <div className="ap-wrap ap-fade">
      <Titolo oro="Nuova" bianco="password" sotto="Vale per Maximize Academy e per Maurizio Barber Shop." />
      <form className="ap-card ap-form" onSubmit={submit}>
        <Campo label="Nuova password" id="password" type="password" required minLength={10} autoComplete="new-password" />
        <button className="ap-btn ap-btn--block" type="submit">Salva</button>
        {msg && <p className="ap-msg ap-msg--err" role="alert">{msg}</p>}
      </form>
    </div>
  );
}

/* ---------- allievo ---------- */
function AllievoHome({ profilo, iscr, vai }) {
  const [avvisi, errA] = useDati('mx_avvisi?select=id,titolo,testo,creato_il,mx_corsi(titolo)&order=creato_il.desc&limit=20');
  const t = oggi();
  const prossimo = (iscr || []).map((i) => i.mx_corsi).filter((c) => c && (c.data_fine || c.data_inizio || '') >= t).sort((a, b) => (a.data_inizio || '').localeCompare(b.data_inizio || ''))[0];
  const fatti = (iscr || []).filter((i) => i.stato === 'completato').length;
  return (
    <>
      <div className="ap-hero">
        <span className="ap-eyebrow">Prossimo corso</span>
        {prossimo ? <><span className="ap-big">{prossimo.titolo}</span><span className="ap-soft">{periodo(prossimo)}{prossimo.luogo ? ` · ${prossimo.luogo}` : ''}</span></>
          : <><span className="ap-big">Nessun corso in programma</span><span className="ap-soft">Quando Maximize ti iscrive a un corso, lo trovi qui.</span><a className="ap-btn ap-btn--sm" style={{ justifySelf: 'start' }} href="/formazione">Guarda i corsi</a></>}
      </div>
      <div className="ap-grid2" style={{ marginTop: 12 }}>
        <button type="button" className="ap-stat" onClick={() => vai('corsi')}><span className="ap-num">{iscr ? iscr.length : '–'}</span><span>Corsi</span></button>
        <button type="button" className="ap-stat" onClick={() => vai('attestati')}><span className="ap-num">{iscr ? fatti : '–'}</span><span>Attestati</span></button>
      </div>
      <h2 className="ap-h2">Novità</h2>
      <Stato errore={errA} dati={avvisi} vuoto="Nessun avviso per ora." />
      {avvisi?.map((a) => (
        <article key={a.id} className="ap-card">
          <span className="ap-chip">{a.mx_corsi?.titolo || 'Per tutti'} · {fmtQuando(a.creato_il)}</span>
          <strong className="ap-strong">{a.titolo}</strong>
          {a.testo && <p className="ap-soft" style={{ margin: 0, whiteSpace: 'pre-line' }}>{a.testo}</p>}
        </article>
      ))}
      {profilo && !profilo.nome && <p className="ap-soft" style={{ marginTop: 16 }}>Completa il tuo nome nel <button type="button" className="ap-link" onClick={() => vai('profilo')}>profilo</button>: serve per l'attestato.</p>}
    </>
  );
}

function AllievoCorsi({ iscr, errore }) {
  const [aperto, setAperto] = useState(null);
  return (
    <>
      <Stato errore={errore} dati={iscr} vuoto="Non sei ancora iscritto a nessun corso. Scrivici dalla pagina Contatti." />
      {iscr?.length > 0 && (
        <ul className="ap-list">
          {iscr.map((i) => <Riga key={i.id} icon={P.corsi} title={i.mx_corsi?.titolo} sub={periodo(i.mx_corsi)} right={<span className={`ap-chip${i.stato === 'completato' ? ' ap-chip--ok' : ''}`}>{i.stato === 'completato' ? 'Completato' : 'Iscritto'}</span>} onClick={() => setAperto(i.mx_corsi)} />)}
        </ul>
      )}
      {aperto && (
        <Sheet title={aperto.titolo} onClose={() => setAperto(null)}>
          <div className="ap-card"><span className="ap-eyebrow">Quando</span><span>{periodo(aperto)}</span>{aperto.luogo && <><span className="ap-eyebrow">Dove</span><span>{aperto.luogo}</span></>}</div>
          {aperto.descrizione && <p className="ap-soft" style={{ whiteSpace: 'pre-line' }}>{aperto.descrizione}</p>}
        </Sheet>
      )}
    </>
  );
}

function ListaMateriali({ dati, onDelete }) {
  const [err, setErr] = useState('');
  return (
    <>
      {err && <p className="ap-msg ap-msg--err" role="alert">{err}</p>}
      <ul className="ap-list">
        {dati.map((m) => (
          <Riga key={m.id} soft icon={m.tipo === 'video' ? P.play : m.tipo === 'link' ? P.link : P.file} title={m.titolo}
            sub={[m.mx_corsi?.titolo, m.tipo === 'pdf' ? 'PDF' : m.tipo === 'video' ? 'Video' : m.tipo === 'link' ? 'Link' : 'File'].filter(Boolean).join(' · ')}
            right={onDelete && <span className="ap-btn ap-btn--danger ap-btn--sm" role="button" tabIndex={0} onClick={(e) => { e.stopPropagation(); onDelete(m); }}>Elimina</span>}
            onClick={() => { setErr(''); apri(m).catch((e) => setErr(e.message)); }} />
        ))}
      </ul>
    </>
  );
}

function AllievoMateriali() {
  const [dati, errore] = useDati('mx_materiali?select=id,titolo,tipo,path,url,creato_il,mx_corsi(titolo)&order=creato_il.desc');
  return (
    <>
      <p className="ap-soft">Dispense, video e file dei tuoi corsi. I file si aprono con un link valido un'ora.</p>
      <Stato errore={errore} dati={dati} vuoto="Ancora nessun materiale per i tuoi corsi." />
      {dati?.length > 0 && <ListaMateriali dati={dati} />}
    </>
  );
}

function Attestato({ nome, corso, data }) {
  return (
    <div className="ap-attestato">
      <img src="/assets/img/logo-maximize.webp" alt="" width="64" height="64" style={{ justifySelf: 'center' }} />
      <h3>Attestato di partecipazione</h3>
      <p>Si attesta che</p>
      <div className="nome">{nome || '—'}</div>
      <p>ha completato il corso</p>
      <p style={{ fontSize: 22, fontWeight: 700 }}>{corso.titolo}</p>
      <p>{periodo(corso)}{corso.luogo ? ` · ${corso.luogo}` : ''}</p>
      {data && <p style={{ fontSize: 14 }}>Completato il {fmtData(data)}</p>}
      <p style={{ marginTop: 10, letterSpacing: '.1em', textTransform: 'uppercase', fontSize: 13 }}>Maximize Academy</p>
    </div>
  );
}

function AllievoAttestati({ iscr, errore, profilo }) {
  const fatti = iscr?.filter((i) => i.stato === 'completato') || null;
  const [aperto, setAperto] = useState(null);
  const stampa = () => { document.body.classList.add('ap-stampa'); window.print(); setTimeout(() => document.body.classList.remove('ap-stampa'), 500); };
  return (
    <>
      <p className="ap-soft">Quando completi un corso, qui trovi l'attestato da salvare in PDF.</p>
      <Stato errore={errore} dati={fatti} vuoto="Nessun attestato per ora." />
      {fatti?.length > 0 && (
        <ul className="ap-list">
          {fatti.map((i) => <Riga key={i.id} icon={P.award} title={i.mx_corsi?.titolo} sub={i.completato_il ? `Completato il ${fmtData(i.completato_il)}` : 'Completato'} onClick={() => setAperto(i)} />)}
        </ul>
      )}
      {aperto && (
        <Sheet title="Attestato" onClose={() => setAperto(null)}>
          <Attestato nome={profilo?.nome} corso={aperto.mx_corsi} data={aperto.completato_il} />
          <div className="ap-actions" style={{ marginTop: 14 }}><button type="button" className="ap-btn" onClick={stampa}>Stampa o salva PDF</button></div>
          {!profilo?.nome && <p className="ap-msg ap-msg--err">Manca il tuo nome: aggiungilo nel profilo.</p>}
        </Sheet>
      )}
    </>
  );
}

function Profilo({ profilo, ricarica, esci, admin, vai }) {
  const [msg, setMsg] = useState('');
  const salva = async (e) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    try {
      await rest(`mx_profili?id=eq.${profilo.id}`, { method: 'PATCH', body: { nome: String(f.get('nome')).trim().slice(0, 120), telefono: String(f.get('telefono')).trim().slice(0, 40) } });
      setMsg('Salvato.'); ricarica();
    } catch (x) { setMsg(x.message); }
  };
  return (
    <>
      {profilo && (
        <form className="ap-card ap-form" onSubmit={salva}>
          <Campo label="Nome e cognome (va sull'attestato)" id="nome" defaultValue={profilo.nome || ''} maxLength={120} autoComplete="name" />
          <Campo label="Telefono" id="telefono" type="tel" defaultValue={profilo.telefono || ''} maxLength={40} autoComplete="tel" />
          <div className="ap-field"><label>Email</label><span>{profilo.email}</span></div>
          <button className="ap-btn" type="submit">Salva</button>
          {msg && <p className="ap-msg" role="status">{msg}</p>}
        </form>
      )}
      <ul className="ap-list" style={{ marginTop: 12 }}>
        {admin && <Riga soft icon={P.eliseo} title="Eliseo" sub="Contatti, campagne e prova del chatbot" onClick={() => vai('eliseo')} />}
        {admin && <Riga soft icon={P.maverik} title="Maverik" sub="Radar, crescita, simulatore e copilota" onClick={() => vai('maverik')} />}
        {admin && <Riga soft icon={P.play} title="Storie del sito" sub="Pubblica e riordina le storie" onClick={() => { window.location.href = '/gestione'; }} />}
        <Riga soft icon={P.chat} title="Scrivici su WhatsApp" sub="324 587 8724" onClick={() => window.open('https://wa.me/393245878724', '_blank', 'noopener')} />
        <Riga soft icon={P.home} title="Vai al sito" onClick={() => { window.location.href = '/'; }} />
        <Riga soft icon={P.user} title="Esci" onClick={esci} />
      </ul>
    </>
  );
}

/* ---------- gestione ---------- */
const STATI = ['Nuovo', 'Contattato', 'Chiuso'];
function AdminRichieste() {
  const [filtro, setFiltro] = useState('Nuovo');
  const [dati, errore, carica] = useDati('mx_richieste?select=id,created_at,name,phone,email,type,message,status&order=created_at.desc&limit=200');
  const [aperta, setAperta] = useState(null);
  const lista = dati?.filter((l) => filtro === 'Tutte' || l.status === filtro) || null;
  const cambia = async (l, status) => {
    try { await rest(`mx_richieste?id=eq.${l.id}`, { method: 'PATCH', body: { status } }); setAperta({ ...l, status }); carica(); } catch (e) { alert(e.message); } // eslint-disable-line no-alert
  };
  return (
    <>
      <div className="ap-seg" style={{ marginBottom: 12 }}>
        {[...STATI, 'Tutte'].map((s) => <button key={s} type="button" aria-pressed={filtro === s} onClick={() => setFiltro(s)}>{s}{dati && s !== 'Tutte' ? ` ${dati.filter((l) => l.status === s).length}` : ''}</button>)}
      </div>
      <Stato errore={errore} dati={lista} vuoto="Nessuna richiesta qui." />
      {lista?.length > 0 && (
        <ul className="ap-list">
          {lista.map((l) => <Riga key={l.id} icon={P.inbox} soft={l.status !== 'Nuovo'} title={l.name} sub={`${l.type || 'Richiesta'} · ${fmtQuando(l.created_at)}`} onClick={() => setAperta(l)} />)}
        </ul>
      )}
      {aperta && (
        <Sheet title={aperta.name} onClose={() => setAperta(null)}>
          <div className="ap-card">
            <span className="ap-chip">{aperta.type || 'Richiesta'} · {fmtQuando(aperta.created_at)}</span>
            {aperta.message && <p style={{ margin: 0, whiteSpace: 'pre-line' }}>{aperta.message}</p>}
          </div>
          <div className="ap-actions" style={{ margin: '12px 0' }}>
            {aperta.phone && <a className="ap-btn" href={waLink(aperta.phone)} target="_blank" rel="noopener noreferrer">WhatsApp</a>}
            {aperta.phone && <a className="ap-btn ap-btn--ghost" href={`tel:${aperta.phone.replace(/[^\d+]/g, '')}`}>Chiama</a>}
            {aperta.email && <a className="ap-btn ap-btn--ghost" href={`mailto:${aperta.email}`}>Email</a>}
          </div>
          <div className="ap-seg">{STATI.map((s) => <button key={s} type="button" aria-pressed={aperta.status === s} onClick={() => cambia(aperta, s)}>{s}</button>)}</div>
        </Sheet>
      )}
    </>
  );
}

function SchedaAllievo({ a, corsi, onClose }) {
  const [iscr, errore, carica] = useDati(`mx_iscrizioni?select=id,stato,completato_il,corso,mx_corsi(titolo)&allievo=eq.${a.id}&order=creato_il.desc`);
  const [msg, setMsg] = useState('');
  const fai = (p) => p.then(() => { setMsg(''); carica(); }).catch((e) => setMsg(e.message));
  const liberi = (corsi || []).filter((c) => !(iscr || []).some((i) => i.corso === c.id));
  return (
    <Sheet title={a.nome || a.email} onClose={onClose}>
      <div className="ap-card">
        <span className="ap-soft">{a.email}</span>
        {a.telefono && <span className="ap-soft">{a.telefono}</span>}
        <div className="ap-actions">
          {a.telefono && <a className="ap-btn ap-btn--sm" href={waLink(a.telefono)} target="_blank" rel="noopener noreferrer">WhatsApp</a>}
          {a.email && <a className="ap-btn ap-btn--ghost ap-btn--sm" href={`mailto:${a.email}`}>Email</a>}
        </div>
      </div>
      <h2 className="ap-h2">Corsi</h2>
      <Stato errore={errore} dati={iscr} vuoto="Non è iscritto a nessun corso." />
      {iscr?.map((i) => (
        <div key={i.id} className="ap-card">
          <strong className="ap-strong">{i.mx_corsi?.titolo}</strong>
          <span className={`ap-chip${i.stato === 'completato' ? ' ap-chip--ok' : ''}`}>{i.stato === 'completato' ? `Completato${i.completato_il ? ` il ${fmtData(i.completato_il)}` : ''}` : 'Iscritto'}</span>
          <div className="ap-actions">
            {i.stato === 'completato'
              ? <button type="button" className="ap-btn ap-btn--ghost ap-btn--sm" onClick={() => fai(rest(`mx_iscrizioni?id=eq.${i.id}`, { method: 'PATCH', body: { stato: 'iscritto', completato_il: null } }))}>Togli completato</button>
              : <button type="button" className="ap-btn ap-btn--sm" onClick={() => fai(rest(`mx_iscrizioni?id=eq.${i.id}`, { method: 'PATCH', body: { stato: 'completato', completato_il: oggi() } }))}>Segna completato (attestato)</button>}
            <button type="button" className="ap-btn ap-btn--danger ap-btn--sm" onClick={() => { if (window.confirm('Togliere l\'iscrizione a questo corso?')) fai(rest(`mx_iscrizioni?id=eq.${i.id}`, { method: 'DELETE' })); }}>Togli</button>
          </div>
        </div>
      ))}
      {liberi.length > 0 && (
        <form className="ap-card ap-form" style={{ marginTop: 12 }} onSubmit={(e) => { e.preventDefault(); const c = new FormData(e.currentTarget).get('corso'); if (c) fai(rest('mx_iscrizioni', { method: 'POST', body: { allievo: a.id, corso: c } })); }}>
          <Campo label="Iscrivi a un corso" id="corso" as="select" defaultValue="">
            <option value="" disabled>Scegli il corso</option>
            {liberi.map((c) => <option key={c.id} value={c.id}>{c.titolo}{c.data_inizio ? ` · ${fmtData(c.data_inizio)}` : ''}</option>)}
          </Campo>
          <button className="ap-btn" type="submit">Iscrivi</button>
        </form>
      )}
      {msg && <p className="ap-msg ap-msg--err" role="alert">{msg}</p>}
    </Sheet>
  );
}

function AdminAllievi() {
  const [dati, errore] = useDati('mx_profili?select=id,nome,email,telefono,creato_il&order=creato_il.desc&limit=500');
  const [corsi] = useDati('mx_corsi?select=id,titolo,data_inizio&order=data_inizio.desc.nullslast');
  const [q, setQ] = useState('');
  const [aperto, setAperto] = useState(null);
  const s = q.trim().toLowerCase();
  const lista = dati?.filter((a) => !s || `${a.nome} ${a.email} ${a.telefono}`.toLowerCase().includes(s)) || null;
  return (
    <>
      <div className="ap-field" style={{ marginBottom: 12 }}><input type="search" placeholder="Cerca per nome, email o telefono" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Cerca allievo" /></div>
      <Stato errore={errore} dati={lista} vuoto="Nessun allievo. Gli allievi si registrano da questa pagina (Registrati)." />
      {lista?.length > 0 && <ul className="ap-list">{lista.map((a) => <Riga key={a.id} icon={P.user} soft title={a.nome || a.email} sub={a.nome ? a.email : `Registrato il ${fmtQuando(a.creato_il)}`} onClick={() => setAperto(a)} />)}</ul>}
      {aperto && <SchedaAllievo a={aperto} corsi={corsi} onClose={() => setAperto(null)} />}
    </>
  );
}

function SchedaCorso({ corso, onClose, onSaved }) {
  const nuovo = !corso.id;
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  const [mat, errM, caricaM] = useDati(nuovo ? '' : `mx_materiali?select=id,titolo,tipo,path,url&corso=eq.${corso.id}&order=creato_il.desc`);
  const salva = async (e) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const body = { titolo: String(f.get('titolo')).trim(), descrizione: String(f.get('descrizione')).trim() || null, luogo: String(f.get('luogo')).trim() || null, data_inizio: f.get('data_inizio') || null, data_fine: f.get('data_fine') || null, attivo: Boolean(f.get('attivo')) };
    try {
      if (nuovo) await rest('mx_corsi', { method: 'POST', body });
      else await rest(`mx_corsi?id=eq.${corso.id}`, { method: 'PATCH', body });
      onSaved(); onClose();
    } catch (x) { setMsg(x.message); }
  };
  const aggiungiFile = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    const file = f.get('file');
    const url = String(f.get('url') || '').trim();
    const titolo = String(f.get('titolo_m') || '').trim() || (file?.name || url).slice(0, 160);
    setBusy(true); setMsg('');
    try {
      if (file && file.size) {
        if (file.size > 52428800) throw new Error('Il file supera 50 MB.');
        const path = await caricaFile(corso.id, file);
        try { await rest('mx_materiali', { method: 'POST', body: { corso: corso.id, titolo, tipo: tipoDa(file), path } }); } catch (x) { await cancellaFile(path); throw x; }
      } else if (/^https:\/\//.test(url)) {
        await rest('mx_materiali', { method: 'POST', body: { corso: corso.id, titolo, tipo: 'link', url } });
      } else throw new Error('Scegli un file oppure incolla un link che inizia con https://');
      form.reset(); caricaM();
    } catch (x) { setMsg(x.message); } finally { setBusy(false); }
  };
  const elimina = async (m) => {
    if (!window.confirm(`Eliminare «${m.titolo}»?`)) return;
    try { await rest(`mx_materiali?id=eq.${m.id}`, { method: 'DELETE' }); if (m.path) await cancellaFile(m.path); caricaM(); } catch (x) { setMsg(x.message); }
  };
  return (
    <Sheet title={nuovo ? 'Nuovo corso' : corso.titolo} onClose={onClose}>
      <form className="ap-card ap-form" onSubmit={salva}>
        <Campo label="Titolo" id="titolo" required minLength={2} maxLength={120} defaultValue={corso.titolo || ''} />
        <div className="ap-grid2">
          <Campo label="Dal" id="data_inizio" type="date" defaultValue={corso.data_inizio || ''} />
          <Campo label="Al" id="data_fine" type="date" defaultValue={corso.data_fine || ''} />
        </div>
        <Campo label="Luogo" id="luogo" maxLength={160} defaultValue={corso.luogo || ''} />
        <Campo label="Descrizione per gli allievi" id="descrizione" as="textarea" maxLength={2000} defaultValue={corso.descrizione || ''} />
        <label className="ap-soft" style={{ display: 'flex', gap: 10 }}><input type="checkbox" name="attivo" defaultChecked={corso.attivo !== false} /> Corso attivo</label>
        <button className="ap-btn" type="submit">{nuovo ? 'Crea corso' : 'Salva'}</button>
      </form>
      {!nuovo && (
        <>
          <h2 className="ap-h2">Materiali</h2>
          <Stato errore={errM} dati={mat} vuoto="Nessun materiale. Aggiungi un PDF, un video o un link." />
          {mat?.length > 0 && <ListaMateriali dati={mat} onDelete={elimina} />}
          <form className="ap-card ap-form" style={{ marginTop: 12 }} onSubmit={aggiungiFile}>
            <Campo label="Titolo del materiale" id="titolo_m" maxLength={160} placeholder="Es. Dispensa sfumature" />
            <Campo label="File (PDF, video, immagini, ZIP · max 50 MB)" id="file" type="file" accept="application/pdf,video/mp4,video/webm,video/quicktime,image/jpeg,image/png,image/webp,application/zip" />
            <Campo label="Oppure un link (YouTube, Drive…)" id="url" type="url" placeholder="https://" />
            <button className="ap-btn" type="submit" disabled={busy}>{busy ? 'Caricamento…' : 'Aggiungi'}</button>
          </form>
          <button type="button" className="ap-btn ap-btn--danger" style={{ marginTop: 16 }} onClick={async () => { if (!window.confirm('Eliminare il corso? Si cancellano anche iscrizioni e materiali.')) return; try { (mat || []).forEach((m) => m.path && cancellaFile(m.path)); await rest(`mx_corsi?id=eq.${corso.id}`, { method: 'DELETE' }); onSaved(); onClose(); } catch (x) { setMsg(x.message); } }}>Elimina corso</button>
        </>
      )}
      {msg && <p className="ap-msg ap-msg--err" role="alert">{msg}</p>}
    </Sheet>
  );
}

function AdminCorsi() {
  const [dati, errore, carica] = useDati('mx_corsi?select=*&order=data_inizio.desc.nullslast');
  const [aperto, setAperto] = useState(null);
  return (
    <>
      <button type="button" className="ap-btn" style={{ width: '100%', marginBottom: 12 }} onClick={() => setAperto({})}><Ic d={P.plus} size={18} /> Nuovo corso</button>
      <Stato errore={errore} dati={dati} vuoto="Nessun corso. Creane uno." />
      {dati?.length > 0 && <ul className="ap-list">{dati.map((c) => <Riga key={c.id} icon={P.corsi} soft={!c.attivo} title={c.titolo} sub={`${periodo(c)}${c.luogo ? ` · ${c.luogo}` : ''}`} right={!c.attivo && <span className="ap-chip">Spento</span>} onClick={() => setAperto(c)} />)}</ul>}
      {aperto && <SchedaCorso corso={aperto} onClose={() => setAperto(null)} onSaved={carica} />}
    </>
  );
}

function AdminAvvisi() {
  const [dati, errore, carica] = useDati('mx_avvisi?select=id,titolo,testo,creato_il,corso,mx_corsi(titolo)&order=creato_il.desc&limit=100');
  const [corsi] = useDati('mx_corsi?select=id,titolo&order=data_inizio.desc.nullslast');
  const [msg, setMsg] = useState('');
  const crea = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    try {
      await rest('mx_avvisi', { method: 'POST', body: { titolo: String(f.get('titolo')).trim(), testo: String(f.get('testo')).trim() || null, corso: f.get('corso') || null } });
      form.reset(); setMsg('Pubblicato.'); carica();
    } catch (x) { setMsg(x.message); }
  };
  return (
    <>
      <form className="ap-card ap-form" onSubmit={crea}>
        <Campo label="Titolo" id="titolo" required minLength={2} maxLength={120} placeholder="Es. Cambio orario sabato" />
        <Campo label="Testo" id="testo" as="textarea" maxLength={1500} />
        <Campo label="Per chi" id="corso" as="select" defaultValue="">
          <option value="">Tutti gli allievi</option>
          {(corsi || []).map((c) => <option key={c.id} value={c.id}>Solo: {c.titolo}</option>)}
        </Campo>
        <button className="ap-btn" type="submit">Pubblica avviso</button>
        {msg && <p className="ap-msg" role="status">{msg}</p>}
      </form>
      <h2 className="ap-h2">Pubblicati</h2>
      <Stato errore={errore} dati={dati} vuoto="Nessun avviso." />
      {dati?.map((a) => (
        <article key={a.id} className="ap-card">
          <span className="ap-chip">{a.mx_corsi?.titolo || 'Per tutti'} · {fmtQuando(a.creato_il)}</span>
          <strong className="ap-strong">{a.titolo}</strong>
          {a.testo && <p className="ap-soft" style={{ margin: 0, whiteSpace: 'pre-line' }}>{a.testo}</p>}
          <button type="button" className="ap-btn ap-btn--danger ap-btn--sm" style={{ justifySelf: 'start' }} onClick={() => { if (window.confirm('Eliminare l\'avviso?')) rest(`mx_avvisi?id=eq.${a.id}`, { method: 'DELETE' }).then(carica).catch((x) => setMsg(x.message)); }}>Elimina</button>
        </article>
      ))}
    </>
  );
}

/* Bacheca (solo computer): riquadri come un pannello di gestione classico */
function Box({ titolo, children, azione }) {
  return (
    <section className="ap-box">
      <header className="ap-box-head"><h2>{titolo}</h2>{azione}</header>
      <div className="ap-box-body">{children}</div>
    </section>
  );
}

function AdminBacheca({ vai, nome }) {
  const [rich] = useDati('mx_richieste?select=id,created_at,name,type,status&order=created_at.desc&limit=50');
  const [allievi] = useDati('mx_profili?select=id&limit=1000');
  const [corsi] = useDati('mx_corsi?select=id,titolo,data_inizio,data_fine,luogo,attivo&order=data_inizio.asc.nullslast');
  const [avvisi, , caricaAvvisi] = useDati('mx_avvisi?select=id&limit=1000');
  const [msg, setMsg] = useState('');
  const t = oggi();
  const nuove = rich?.filter((r) => r.status === 'Nuovo') || [];
  const prossimi = (corsi || []).filter((c) => c.attivo && (c.data_fine || c.data_inizio || '') >= t).slice(0, 5);
  const n = (x) => (x ? x.length : '–');
  const pubblica = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    try { await rest('mx_avvisi', { method: 'POST', body: { titolo: String(f.get('titolo')).trim(), testo: String(f.get('testo')).trim() || null } }); form.reset(); setMsg('Avviso pubblicato per tutti gli allievi.'); caricaAvvisi(); } catch (x) { setMsg(x.message); }
  };
  return (
    <div className="ap-dash">
      <div className="ap-dash-col">
        <Box titolo="Eliseo e Maverik">
          <ul className="ap-list">
            <Riga icon={P.eliseo} title="Eliseo" sub="Contatti, campagne, addestramento e prova del chatbot" onClick={() => vai('eliseo')} />
            <Riga icon={P.maverik} title="Maverik" sub="Radar clienti, crescita, simulatore e copilota" onClick={() => vai('maverik')} />
          </ul>
          <p className="ap-box-note">Gli stessi strumenti dell'area riservata di Maurizio Barber Shop. I contatti sono quelli già salvati lì.</p>
        </Box>
        <Box titolo="In sintesi">
          <ul className="ap-glance">
            <li><button type="button" onClick={() => vai('richieste')}><Ic d={P.inbox} size={18} /><span><b>{nuove.length}</b> richieste nuove</span></button></li>
            <li><button type="button" onClick={() => vai('allievi')}><Ic d={P.people} size={18} /><span><b>{n(allievi)}</b> allievi</span></button></li>
            <li><button type="button" onClick={() => vai('corsi')}><Ic d={P.corsi} size={18} /><span><b>{n(corsi)}</b> corsi</span></button></li>
            <li><button type="button" onClick={() => vai('avvisi')}><Ic d={P.bell} size={18} /><span><b>{n(avvisi)}</b> avvisi</span></button></li>
          </ul>
          <p className="ap-box-note">Bentornato{nome ? `, ${nome}` : ''}. Gli allievi entrano con lo stesso account di Maurizio Barber Shop.</p>
        </Box>
        <Box titolo="Ultime richieste" azione={<button type="button" className="ap-box-link" onClick={() => vai('richieste')}>Vedi tutte</button>}>
          {!rich ? <p className="ap-soft">Caricamento…</p> : !rich.length ? <p className="ap-soft">Nessuna richiesta per ora.</p> : (
            <table className="ap-table"><tbody>
              {rich.slice(0, 6).map((r) => <tr key={r.id}><td><button type="button" className="ap-box-link" onClick={() => vai('richieste')}>{r.name}</button><div className="ap-sub">{r.type || 'Richiesta'}</div></td><td className="ap-right">{r.status === 'Nuovo' ? <span className="ap-chip ap-chip--new">Nuovo</span> : <span className="ap-sub">{r.status}</span>}<div className="ap-sub">{fmtQuando(r.created_at)}</div></td></tr>)}
            </tbody></table>
          )}
        </Box>
      </div>
      <div className="ap-dash-col">
        <Box titolo="Avviso rapido">
          <form className="ap-form" onSubmit={pubblica}>
            <Campo label="Titolo" id="q-titolo" name="titolo" required minLength={2} maxLength={120} />
            <Campo label="Testo" id="q-testo" name="testo" as="textarea" maxLength={1500} placeholder="Cosa devono sapere gli allievi?" />
            <div><button className="ap-btn ap-btn--sm" type="submit">Pubblica</button></div>
            {msg && <p className="ap-msg" role="status">{msg}</p>}
          </form>
        </Box>
        <Box titolo="Prossimi corsi" azione={<button type="button" className="ap-box-link" onClick={() => vai('corsi')}>Gestisci</button>}>
          {!corsi ? <p className="ap-soft">Caricamento…</p> : !prossimi.length ? <p className="ap-soft">Nessun corso in programma. <button type="button" className="ap-box-link" onClick={() => vai('corsi')}>Crea un corso</button></p> : (
            <table className="ap-table"><tbody>
              {prossimi.map((c) => <tr key={c.id}><td><b>{c.titolo}</b><div className="ap-sub">{c.luogo || ''}</div></td><td className="ap-right ap-sub">{periodo(c)}</td></tr>)}
            </tbody></table>
          )}
        </Box>
      </div>
    </div>
  );
}

/* ---------- pagina ---------- */
const TAB_ALLIEVO = [['home', 'Home', P.home], ['corsi', 'Corsi', P.corsi], ['materiali', 'Materiali', P.file], ['attestati', 'Attestati', P.award], ['profilo', 'Profilo', P.user]];
const TAB_ADMIN = [['richieste', 'Richieste', P.inbox], ['allievi', 'Allievi', P.people], ['corsi', 'Corsi', P.corsi], ['avvisi', 'Avvisi', P.bell], ['profilo', 'Altro', P.more]];
const TITOLI = {
  corsi: ['I miei', 'corsi', 'Date, luogo e programma.'], materiali: ['I tuoi', 'materiali'], attestati: ['I tuoi', 'attestati'], profilo: ['Il tuo', 'profilo'],
  richieste: ['Nuove', 'richieste', 'Dal modulo contatti del sito.'], allievi: ['Gli', 'allievi', 'Chi è entrato nell\'area privata.'], admin_corsi: ['I', 'corsi', 'Date, materiali e attestati.'], avvisi: ['Avvisi', 'agli allievi'], admin_profilo: ['Altro', ''], bacheca: ['Bacheca', ''],
  eliseo: ['Eliseo', '', 'Contatti, fasi, campagne e prova del chatbot.'],
  maverik: ['Maverik', '', 'Strategia, analisi clienti e copilota.'],
};

export default function AreaPrivata() {
  const [ritorno] = useState(() => sessioneDaIndirizzo());
  const [stato, setStato] = useState(() => (ritorno?.tipo === 'recovery' ? 'recovery' : hasSession() ? 'check' : 'login'));
  const [io, setIo] = useState(null);
  const [tab, setTab] = useState('');
  const largo = useLargo();

  useEffect(() => {
    const robots = document.createElement('meta');
    robots.name = 'robots'; robots.content = 'noindex, nofollow';
    document.head.append(robots);
    document.title = 'Area privata | Maximize Academy';
    return () => robots.remove();
  }, []);

  // Ritorno da Google con id_token (piano B del pulsante, 14/11/2026)
  const [erroreGoogle, setErroreGoogle] = useState('');
  useEffect(() => {
    googleRitorno().then((r) => { if (r === true) setStato('check'); else if (r) setErroreGoogle(r); });
  }, []);

  useEffect(() => {
    if (stato !== 'check') return;
    token().then(async (t) => {
      if (!t) { setStato('login'); return; }
      if (await serveCodice().catch(() => false)) { setStato('codice'); return; }
      const me = chiSono(t);
      const admin = ['admin', 'cofounder'].includes(me.ruolo);
      // Primo ingresso: la riga del profilo Maximize la crea l'utente stesso (se c'è già, non cambia nulla)
      await rest('mx_profili?on_conflict=id', { method: 'POST', prefer: 'resolution=ignore-duplicates,return=minimal', body: { id: me.id, email: me.email.slice(0, 200), nome: me.nome.slice(0, 120) || null } }).catch(() => {});
      setIo({ ...me, admin }); setTab((x) => x || (admin ? (window.matchMedia('(min-width: 960px)').matches ? 'bacheca' : 'richieste') : 'home')); setStato('ok');
    });
  }, [stato]);

  const ok = stato === 'ok' && io;
  const [profili, , ricaricaProfilo] = useDati(ok ? `mx_profili?select=id,nome,email,telefono&id=eq.${io.id}` : '');
  const [iscr, errIscr] = useDati(ok && !io.admin ? `mx_iscrizioni?select=id,stato,completato_il,mx_corsi(*)&allievo=eq.${io.id}&order=creato_il.desc` : '');
  const profilo = profili?.[0] || null;

  const vai = (t) => { setTab(t); window.scrollTo({ top: 0, behavior: 'smooth' }); try { navigator.vibrate?.(8); } catch { /* niente vibrazione */ } };
  const apriEliseo = useCallback(() => { setTab('eliseo'); window.scrollTo({ top: 0, behavior: 'smooth' }); }, []);
  const esci = () => logout().then(() => { setIo(null); setTab(''); setStato('login'); });

  // Arrivato dal link via email con la verifica attiva: la si toglie, così si può scegliere la password nuova.
  useEffect(() => {
    if (stato !== 'recovery') return;
    serveCodice().then((serve) => (serve ? riserva('sblocca') : null)).catch(() => {});
  }, [stato]);

  if (stato === 'recovery') return <div className="ap"><NuovaPassword fatto={() => setStato('check')} /></div>;
  if (stato === 'login') return <div className="ap"><Accesso key={erroreGoogle || 'a'} avviso={erroreGoogle || ritorno?.errore || ''} onEntrato={() => setStato('check')} /></div>;
  if (stato === 'codice') return <div className="ap"><Codice fatto={() => setStato('check')} esci={() => logout().then(() => setStato('login'))} /></div>;
  if (!ok || !tab) return <div className="ap"><div className="ap-wrap"><p className="ap-soft">Caricamento…</p></div></div>;

  const admin = io.admin;
  if (!largo && tab === 'bacheca') setTimeout(() => setTab('richieste'), 0);
  const strumenti = [['eliseo', 'Eliseo', P.eliseo], ['maverik', 'Maverik', P.maverik]];
  const tabs = admin
    ? (largo
      ? [['bacheca', 'Bacheca', P.home], ...TAB_ADMIN.slice(0, 4), ...strumenti, ['profilo', 'Profilo', P.user]]
      : [...TAB_ADMIN.slice(0, 4), ...strumenti, TAB_ADMIN[4]])
    : TAB_ALLIEVO;
  const nome = (profilo?.nome || io.nome || '').split(' ')[0];
  const t = tab === 'home' ? ['Ciao', nome || 'allievo', 'Ecco cosa c\'è di nuovo.'] : TITOLI[admin && (tab === 'corsi' || tab === 'profilo') ? (largo && tab === 'profilo' ? 'profilo' : `admin_${tab}`) : tab];
  const sezione = admin ? 'Gestione' : 'Allievo';

  return (
    <div className="ap">
      <div className="ap-adminbar" aria-hidden={!largo}>
        <a href="/" className="ap-adminbar-site"><img src="/assets/img/logo-maximize.webp" alt="" width="20" height="20" />Maximize Academy</a>
        {admin && <button type="button" onClick={() => vai('corsi')}><Ic d={P.plus} size={16} />Nuovo corso</button>}
        <span className="ap-adminbar-me">Ciao, {nome || io.email}<span className="ap-adminbar-av">{(nome || io.email || '?').charAt(0).toUpperCase()}</span></span>
      </div>
      <div className="ap-wrap" key={tab}>
        <Head sezione={sezione} profilo={profilo || io} onAvatar={() => vai('profilo')} />
        <div className="ap-fade">
          <Titolo oro={t[0]} bianco={t[1]} sotto={t[2]} />
          {admin ? (
            <>
              {tab === 'bacheca' && <AdminBacheca vai={vai} nome={nome} />}
              {tab === 'richieste' && <AdminRichieste />}
              {tab === 'allievi' && <AdminAllievi />}
              {tab === 'corsi' && <AdminCorsi />}
              {tab === 'avvisi' && <AdminAvvisi />}
              {tab === 'eliseo' && <StrumentiRiservati quale="eliseo" onApriEliseo={apriEliseo} />}
              {tab === 'maverik' && <StrumentiRiservati quale="maverik" onApriEliseo={apriEliseo} />}
            </>
          ) : (
            <>
              {tab === 'home' && <AllievoHome profilo={profilo} iscr={iscr} vai={vai} />}
              {tab === 'corsi' && <AllievoCorsi iscr={iscr} errore={errIscr} />}
              {tab === 'materiali' && <AllievoMateriali />}
              {tab === 'attestati' && <AllievoAttestati iscr={iscr} errore={errIscr} profilo={profilo} />}
            </>
          )}
          {tab === 'profilo' && <Profilo profilo={profilo} ricarica={ricaricaProfilo} esci={esci} admin={admin} vai={vai} />}
        </div>
      </div>
      <nav className={`ap-tabbar${tabs.length > 5 ? ' ap-tabbar--scroll' : ''}`} aria-label="Sezioni">
        <a className="ap-side-brand" href="/"><img src="/assets/img/logo-maximize.webp" alt="" width="36" height="36" /><span><strong>Maximize</strong><small>{admin ? 'Gestione' : 'Area allievo'}</small></span></a>
        {tabs.map(([k, l, d]) => (
          <button key={k} type="button" className="ap-tab" aria-current={tab === k ? 'page' : undefined} onClick={() => vai(k)}><Ic d={d} />{l}</button>
        ))}
        <button type="button" className="ap-side-out" onClick={esci}><Ic d={P.user} />Esci</button>
      </nav>
    </div>
  );
}
