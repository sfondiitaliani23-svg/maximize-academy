// Eliseo · Impostazioni, Profilo, prompt aggiuntivi e fogli Google (come Keplero, 09/11/2026).
// Dati nella riga unica di eliseo_assistente (colonne impostazioni, prompts, fogli: supabase/eliseo-impostazioni.sql).
// Qui solo quello che funziona davvero: gli stati «collegato» compaiono solo se il collegamento c'è. Nessun dato dei clienti.

export const LINGUE = [
  ['it', '🇮🇹 Italiano'], ['en', '🇬🇧 English'], ['es', '🇪🇸 Español'], ['fr', '🇫🇷 Français'], ['de', '🇩🇪 Deutsch'],
  ['pt', '🇵🇹 Português'], ['nl', '🇳🇱 Nederlands'], ['pl', '🇵🇱 Polski'], ['ro', '🇷🇴 Română'], ['sq', '🇦🇱 Shqip'],
  ['uk', '🇺🇦 Українська'], ['ru', '🇷🇺 Русский'], ['el', '🇬🇷 Ελληνικά'], ['tr', '🇹🇷 Türkçe'], ['ar', '🇸🇦 العربية'],
  ['zh', '🇨🇳 中文'], ['ja', '🇯🇵 日本語'], ['ko', '🇰🇷 한국어'], ['hi', '🇮🇳 हिन्दी'], ['bn', '🇧🇩 বাংলা'],
  ['ur', '🇵🇰 اردو'], ['fa', '🇮🇷 فارسی'], ['he', '🇮🇱 עברית'], ['sv', '🇸🇪 Svenska'], ['no', '🇳🇴 Norsk'],
  ['da', '🇩🇰 Dansk'], ['fi', '🇫🇮 Suomi'], ['cs', '🇨🇿 Čeština'], ['sk', '🇸🇰 Slovenčina'], ['hu', '🇭🇺 Magyar'],
  ['hr', '🇭🇷 Hrvatski'], ['sr', '🇷🇸 Srpski'], ['bg', '🇧🇬 Български'], ['tl', '🇵🇭 Filipino'], ['vi', '🇻🇳 Tiếng Việt'],
  ['th', '🇹🇭 ไทย'], ['id', '🇮🇩 Bahasa Indonesia'], ['ms', '🇲🇾 Bahasa Melayu'], ['sw', '🇰🇪 Kiswahili'], ['wo', '🇸🇳 Wolof'],
];

export const CANALI = [
  ['c-widget', 'widget', 'Widget chat web', 'La chat dell’assistente sul sito.'],
  ['c-whatsapp', 'whatsapp', 'WhatsApp', 'Numero del negozio. Il passaggio al team apre WhatsApp.'],
  ['c-messenger', 'messenger', 'Messenger', 'Pagina Facebook del negozio.'],
  ['c-instagram', 'instagram', 'Instagram', 'Account Instagram professionale del negozio.'],
  ['c-email', 'email', 'Email', 'Casella del negozio.'],
  ['c-telefono', 'telefono', 'Telefono', 'Agente vocale per le chiamate.'],
];

export const ACCOUNT = [
  ['google_sheets', 'Google Sheets', 'Fogli che l’assistente legge (da File → Collega Google Sheet).'],
  ['google_calendar', 'Google Calendar', 'Copia degli appuntamenti nel calendario Google.'],
  ['outlook', 'Calendario Outlook', 'Copia degli appuntamenti in Outlook.'],
  ['facebook_leads', 'Facebook Leads', 'Contatti dai moduli delle inserzioni Meta.'],
  ['email', 'Email', 'Indirizzo da cui partono campagne e risposte.'],
];

export const SETTINGS_IDS = ['generali', 'lingua', 'team', 'collegati', 'analisi-imp', ...CANALI.map((c) => c[0]), 'account', 'fatturazione', 'sicurezza', 'legale', 'assistenti'];

const obj = (v) => (v && typeof v === 'object' && !Array.isArray(v) ? v : {});
const str = (v, n = 300) => (typeof v === 'string' ? v.trim().slice(0, n) : '');
const bool = (v, d) => (typeof v === 'boolean' ? v : d);
const url = (v) => { const s = str(v, 500); return /^https?:\/\/\S+$/i.test(s) ? s : ''; };

/** Valori sicuri, sempre completi. Funzione pura (si prova con node:test). */
export function cleanSettings(raw, origin = '') {
  const r = obj(raw); const g = obj(r.generali); const l = obj(r.lingua); const a = obj(r.analisi);
  const c = obj(r.canali); const ac = obj(r.account); const p = obj(r.profilo); const lg = obj(r.legale);
  const lingue = new Set(LINGUE.map(([k]) => k));
  const canali = {}; CANALI.forEach(([, k]) => { const v = obj(c[k]); canali[k] = { attivo: bool(v.attivo, k === 'widget'), riferimento: str(v.riferimento, 200) }; });
  const account = {}; ACCOUNT.forEach(([k]) => { account[k] = { riferimento: str(obj(ac[k]).riferimento, 500) }; });
  const min = Number(g.minutiInattivita);
  const cons = Number(l.conservazioneGiorni);
  return {
    generali: {
      widget: bool(g.widget, true), emailObbligatoria: bool(g.emailObbligatoria, false), telefonoObbligatorio: bool(g.telefonoObbligatorio, false),
      messaggiBolla: bool(g.messaggiBolla, true), ritardoRisposta: bool(g.ritardoRisposta, false),
      chiusuraInattivita: bool(g.chiusuraInattivita, false), minutiInattivita: Number.isFinite(min) ? Math.min(10080, Math.max(5, Math.round(min))) : 60,
      chiusuraRisolto: bool(g.chiusuraRisolto, true), promptImmagini: str(g.promptImmagini, 2000),
    },
    lingua: {
      lingua: lingue.has(l.lingua) ? l.lingua : 'it', paese: /^[A-Z]{2}$/.test(l.paese || '') ? l.paese : 'IT',
      fusoOrario: /^[A-Za-z_]+(\/[A-Za-z0-9_+-]+){0,2}$/.test(l.fusoOrario || '') ? l.fusoOrario : 'Europe/Rome',
      linguaNotifiche: lingue.has(l.linguaNotifiche) ? l.linguaNotifiche : 'it',
      privacyUrl: url(l.privacyUrl) || (origin ? `${origin}/privacy/` : ''),
      consensoMarketing: bool(l.consensoMarketing, false),
      conservazioneGiorni: [0, 30, 90, 180, 365, 730].includes(cons) ? cons : 0,
    },
    analisi: { recapSettimanale: bool(a.recapSettimanale, false), tracciaLink: bool(a.tracciaLink, false) },
    canali, account,
    profilo: { nome: str(p.nome, 80), cognome: str(p.cognome, 80), telefono: str(p.telefono, 30), azienda: str(p.azienda, 120) || 'Maurizio Barber Shop', settore: str(p.settore, 80) || 'Barberia e centro estetico', ruolo: str(p.ruolo, 80) },
    legale: {
      ragioneSociale: str(lg.ragioneSociale, 120) || 'M×E Barber Lab',
      partitaIva: /^\d{11}$/.test(lg.partitaIva || '') ? lg.partitaIva : '02147290767', // P.IVA di Maurizio (site.config.js, legal.vat)
      sedeLegale: str(lg.sedeLegale, 200), terminiUrl: url(lg.terminiUrl), privacyUrl: url(lg.privacyUrl) || (origin ? `${origin}/privacy/` : ''),
    },
  };
}

/** Prompt aggiuntivi: fino a 10, ciascuno fino a 10.000 caratteri. */
export function cleanPrompts(raw) {
  return (Array.isArray(raw) ? raw : []).filter((p) => p && typeof p === 'object').slice(0, 10).map((p, i) => ({
    titolo: (str(p.titolo, 80) || `Prompt ${i + 2}`), testo: typeof p.testo === 'string' ? p.testo.slice(0, 10000) : '', attivo: bool(p.attivo, true),
  }));
}

/** Link di un foglio Google → indirizzo CSV che si legge dal browser (gviz permette la lettura da altri siti). */
export function sheetCsvUrl(link) {
  const m = String(link || '').match(/^https:\/\/docs\.google\.com\/spreadsheets\/d\/([a-zA-Z0-9_-]{20,})/);
  if (!m) return null;
  const gid = String(link).match(/[#&?]gid=(\d+)/)?.[1] || '0';
  return `https://docs.google.com/spreadsheets/d/${m[1]}/gviz/tq?tqx=out:csv&gid=${gid}`;
}

// Eliseo dentro l'area di Maximize (/area): stessi account, pagine di accesso e password su Maurizio Barber Shop.
const AREA_ALTRA = typeof location !== 'undefined' && location.pathname.startsWith('/area');

const SQL_NOTE = 'Manca un passaggio una tantum: va eseguito il file supabase/eliseo-impostazioni.sql in Supabase (lo fa Eliseo). Poi ricarica la pagina.';

export function mountSettings(sez, ui) {
  const { h, card, call, say, team = [], user = null } = ui;
  const wrap = h('div', { class: 'es' }, h('p', { class: 'pempty', text: 'Carico…' }));
  const origin = location.origin;
  let saved = null;

  const sw = (on, label, onChange) => {
    const b = h('button', { type: 'button', role: 'switch', class: 'es-switch', 'aria-checked': on ? 'true' : 'false', 'aria-label': label }, h('span'));
    b.addEventListener('click', () => { const v = b.getAttribute('aria-checked') !== 'true'; b.setAttribute('aria-checked', v ? 'true' : 'false'); onChange(v); });
    return b;
  };
  const riga = (titolo, nota, ctl) => h('div', { class: 'es-row' }, h('div', { class: 'es-row__txt' }, h('strong', { text: titolo }), nota ? h('span', { text: nota }) : null), h('div', { class: 'es-row__ctl' }, ctl));
  const input = (val, onInput, attrs = {}) => { const i = h('input', { class: 'es-input', ...attrs }); i.value = val ?? ''; i.addEventListener('input', () => onInput(i.value)); return i; };
  const selectEl = (opts, val, onChange, label) => { const s = h('select', { class: 'es-input', 'aria-label': label }, opts.map(([k, n]) => h('option', { value: k, text: n }))); s.value = String(val); s.addEventListener('change', () => onChange(s.value)); return s; };
  const campo = (lab, ctl, wide) => h('label', { class: `es-field${wide ? ' es-field--wide' : ''}` }, h('span', { text: lab }), ctl);
  const chip = (ok, t) => h('span', { class: `pchip ${ok ? 'pchip--ok' : 'pchip--wait'}`, text: t });
  const head = (t, nota) => [h('h2', { class: 'es-h', text: t }), nota ? h('p', { class: 'es-note', text: nota }) : null];

  async function salva(next, btn) {
    btn.disabled = true;
    try {
      await call('/rest/v1/eliseo_assistente?id=eq.1', { method: 'PATCH', body: { impostazioni: next }, prefer: 'return=minimal' });
      saved = JSON.parse(JSON.stringify(next));
      say('Impostazioni salvate.');
    } catch (e) { say(e.message === 'sql' ? SQL_NOTE : e.message, true); }
    btn.disabled = false;
  }

  function render(d) {
    const set = (k, patch) => { d[k] = { ...d[k], ...patch }; };
    const save = h('button', { type: 'button', class: 'btn btn--primary', text: 'Salva' });
    const undo = h('button', { type: 'button', class: 'btn btn--secondary', text: 'Annulla' });
    save.addEventListener('click', () => salva(d, save));
    undo.addEventListener('click', () => render(cleanSettings(saved, origin)));
    let content = [];
    let conSalva = true;

    if (sez === 'generali') {
      content = [...head('Generali'),
        riga('Widget del sito web', 'La chat dell’assistente sul sito.', sw(d.generali.widget, 'Widget', (v) => { set('generali', { widget: v }); d.canali.widget.attivo = v; })),
        riga('Email obbligatoria', 'Chiedi un’email valida per iniziare una conversazione.', sw(d.generali.emailObbligatoria, 'Email obbligatoria', (v) => set('generali', { emailObbligatoria: v }))),
        riga('Telefono obbligatorio', 'Chiedi un numero valido per iniziare una conversazione.', sw(d.generali.telefonoObbligatorio, 'Telefono obbligatorio', (v) => set('generali', { telefonoObbligatorio: v }))),
        riga('Messaggi a bolle', 'Un messaggio vicino al pulsante della chat.', sw(d.generali.messaggiBolla, 'Messaggi a bolle', (v) => set('generali', { messaggiBolla: v }))),
        riga('Ritardo nella risposta', 'Qualche secondo di attesa prima di rispondere, come una persona.', sw(d.generali.ritardoRisposta, 'Ritardo', (v) => set('generali', { ritardoRisposta: v }))),
        h('h3', { class: 'es-h3', text: 'Lettura immagini' }),
        h('p', { class: 'es-note', text: 'Quali dettagli contano nelle foto mandate in chat.' }),
        (() => { const t = h('textarea', { class: 'es-input es-input--area', rows: 3, maxlength: 2000, placeholder: 'Es. «Descrivi taglio, lunghezza e sfumatura»' }); t.value = d.generali.promptImmagini; t.addEventListener('input', () => set('generali', { promptImmagini: t.value })); return t; })(),
        h('h3', { class: 'es-h3', text: 'Chiusura automatica conversazione' }),
        riga('Chiudi dopo inattività', 'Minuti senza messaggi.', h('span', { class: 'es-inline' }, input(d.generali.minutiInattivita, (v) => set('generali', { minutiInattivita: Number(v) }), { type: 'number', min: 5, max: 10080, class: 'es-input es-input--num', 'aria-label': 'Minuti' }), sw(d.generali.chiusuraInattivita, 'Chiudi dopo inattività', (v) => set('generali', { chiusuraInattivita: v })))),
        riga('Chiudi quando è tutto risolto', 'Riconosce «grazie, ciao» e chiude poco dopo.', sw(d.generali.chiusuraRisolto, 'Chiudi quando risolto', (v) => set('generali', { chiusuraRisolto: v }))),
      ];
    } else if (sez === 'lingua') {
      const paesi = (() => { let dn = null; try { dn = new Intl.DisplayNames(['it'], { type: 'region' }); } catch { dn = null; } return 'IT SM VA CH FR DE ES PT GB IE NL BE LU AT PL CZ SK HU RO BG GR HR SI RS AL MK ME BA MT CY DK SE NO FI EE LV LT UA MD TR US CA MX BR AR AU JP CN KR IN PK BD LK PH VN TH ID MY SG AE SA IL EG MA TN DZ NG SN GH KE ZA'.split(' ').map((c) => [c, dn?.of(c) || c]).sort((x, y) => x[1].localeCompare(y[1], 'it')); })();
      let fusi = ['Europe/Rome']; try { fusi = Intl.supportedValuesOf('timeZone'); } catch { /* browser vecchio */ }
      content = [...head('Lingua e Privacy'),
        h('div', { class: 'es-grid' },
          campo('Lingua', selectEl(LINGUE, d.lingua.lingua, (v) => set('lingua', { lingua: v }), 'Lingua')),
          campo('Paese', selectEl(paesi, d.lingua.paese, (v) => set('lingua', { paese: v }), 'Paese')),
          campo('Fuso orario', selectEl(fusi.map((f) => [f, f.replace(/_/g, ' ')]), d.lingua.fusoOrario, (v) => set('lingua', { fusoOrario: v }), 'Fuso orario')),
          campo('Lingua delle notifiche', selectEl(LINGUE, d.lingua.linguaNotifiche, (v) => set('lingua', { linguaNotifiche: v }), 'Lingua delle notifiche'))),
        h('h3', { class: 'es-h3', text: 'Informativa sulla privacy' }),
        h('p', { class: 'es-note', text: 'Il cliente la deve leggere e accettare per iniziare una nuova conversazione.' }),
        input(d.lingua.privacyUrl, (v) => set('lingua', { privacyUrl: v }), { type: 'url', 'aria-label': 'Link della privacy' }),
        riga('Consenso marketing', 'Casella facoltativa per le promozioni, separata dalla privacy.', sw(d.lingua.consensoMarketing, 'Consenso marketing', (v) => set('lingua', { consensoMarketing: v }))),
        riga('Conservazione dei dati', 'Per quanto tempo si tengono le conversazioni.', selectEl([[0, 'Senza limite'], [30, '30 giorni'], [90, '90 giorni'], [180, '6 mesi'], [365, '1 anno'], [730, '2 anni']], d.lingua.conservazioneGiorni, (v) => set('lingua', { conservazioneGiorni: Number(v) }), 'Conservazione')),
      ];
    } else if (sez === 'team') {
      conSalva = false;
      content = [...head('Team', 'Chi può ricevere le conversazioni passate dall’assistente.'),
        h('ul', { class: 'es-list' },
          user?.email ? h('li', null, h('span', { text: `${user.user_metadata?.full_name || 'Tu'} · ${user.email}` }), chip(true, 'Tu')) : null,
          team.map((t) => h('li', null, h('span', { text: typeof t === 'string' ? t : t.nome || t.name || '' }), chip(false, 'Operatore')))),
        h('p', { class: 'es-note', text: 'Ruoli e accessi si gestiscono nell’area riservata, in Utenti.' })];
    } else if (sez === 'collegati') {
      content = [...head('Account collegati', 'Account esterni usati da campagne, automazioni e integrazioni.'),
        ...ACCOUNT.map(([k, n, nota]) => h('div', { class: 'es-acc' }, h('div', { class: 'es-row__txt' }, h('strong', { text: n }), h('span', { text: nota })),
          chip(k === 'google_sheets' && ui.fogli?.length > 0, k === 'google_sheets' && ui.fogli?.length ? `${ui.fogli.length} collegati` : 'Non connesso'),
          input(d.account[k].riferimento, (v) => { d.account[k] = { riferimento: v }; }, { 'aria-label': `Riferimento ${n}`, placeholder: 'Account o indirizzo' })))];
    } else if (sez === 'analisi-imp') {
      content = [...head('Analisi'),
        riga('Email di recap settimanale', 'Riepilogo degli ultimi 7 giorni.', sw(d.analisi.recapSettimanale, 'Recap', (v) => set('analisi', { recapSettimanale: v }))),
        riga('Tracciamento dei clic sui link', 'Conta quanti aprono i link mandati.', sw(d.analisi.tracciaLink, 'Tracciamento', (v) => set('analisi', { tracciaLink: v })))];
    } else if (sez.startsWith('c-')) {
      const [, k, n, nota] = CANALI.find((c) => c[0] === sez);
      const ok = k === 'widget' ? d.canali.widget.attivo : false;
      content = [...head(n, nota), h('p', null, chip(ok, k === 'widget' ? (ok ? 'Attivo' : 'Spento') : 'Da collegare'))];
      if (k === 'widget') content.push(riga('Chat sul sito', 'Accendi o spegni la chat.', sw(d.canali.widget.attivo, 'Chat sul sito', (v) => { d.canali.widget.attivo = v; d.generali.widget = v; })));
      else {
        content.push(campo(k === 'instagram' ? 'Account (es. @negozio)' : k === 'messenger' ? 'Pagina Facebook' : k === 'email' ? 'Indirizzo email' : k === 'whatsapp' ? 'Numero WhatsApp' : 'Numero di telefono', input(d.canali[k].riferimento, (v) => { d.canali[k] = { ...d.canali[k], riferimento: v }; })));
        content.push(h('p', { class: 'es-note es-note--box', text: k === 'instagram' || k === 'messenger' ? 'Per collegarlo serve l’accesso a Meta Business del negozio. Oggi questi messaggi arrivano su Keplero.' : k === 'whatsapp' ? 'Oggi i messaggi WhatsApp arrivano su Keplero (numeri forniti da Keplero). Qui il passaggio al team apre il numero del negozio.' : k === 'email' ? 'Per leggere e rispondere alle email serve l’accesso alla casella del negozio.' : 'L’agente vocale non è ancora attivo.' }));
      }
    } else if (sez === 'account') {
      content = [...head('Account', 'Il tuo profilo, come ti contattiamo e l’azienda.'),
        h('div', { class: 'es-grid' },
          campo('Nome', input(d.profilo.nome, (v) => set('profilo', { nome: v }))),
          campo('Cognome', input(d.profilo.cognome, (v) => set('profilo', { cognome: v }))),
          campo('Email', (() => { const i = h('input', { class: 'es-input', readonly: true }); i.value = user?.email || ''; return i; })()),
          campo('Telefono', input(d.profilo.telefono, (v) => set('profilo', { telefono: v }), { type: 'tel', placeholder: '+39' })),
          campo('Nome azienda', input(d.profilo.azienda, (v) => set('profilo', { azienda: v }))),
          campo('Settore', input(d.profilo.settore, (v) => set('profilo', { settore: v }))),
          campo('Ruolo', input(d.profilo.ruolo, (v) => set('profilo', { ruolo: v })))),
        h('h3', { class: 'es-h3', text: 'Sessione' }),
        riga('Esci', 'Termina la sessione su questo dispositivo.', (() => {
          const b = h('button', { type: 'button', class: 'btn btn--secondary', text: 'Esci' });
          b.addEventListener('click', async () => { b.disabled = true; try { await ui.sbc?.signOut(); } catch { /* la sessione può essere già chiusa */ } location.href = AREA_ALTRA ? '/area' : '/accedi/'; });
          return b;
        })())];
    } else if (sez === 'fatturazione') {
      conSalva = false;
      content = [...head('Fatturazione'), h('p', { class: 'es-note es-note--box', text: 'Piano, canone e fatture si decidono più avanti. Per ora non c’è nessun pagamento.' })];
    } else if (sez === 'sicurezza') {
      conSalva = false;
      content = [...head('Sicurezza', 'Scegli come accedere e proteggi il tuo account.'),
        h('div', { class: 'es-block' }, h('h3', { class: 'es-h3', text: 'Password' }), h('p', { class: 'es-note', text: 'Almeno 12 caratteri, con maiuscole, minuscole, un numero e un simbolo.' }), h('a', { class: 'btn btn--secondary', href: AREA_ALTRA ? 'https://maurizio-barbershop.it/account/?cambia=1' : '/account/?cambia=1', text: 'Cambia password' })),
        h('div', { class: 'es-block' }, h('h3', { class: 'es-h3', text: 'Passkey' }), h('p', { class: 'es-note', text: 'Accedi con impronta, volto o blocco schermo. Si aggiunge dalla pagina Account di Maurizio Barber Shop (stesso account).' }), h('a', { class: 'btn btn--secondary', href: AREA_ALTRA ? 'https://maurizio-barbershop.it/account/' : '/account/', text: 'Gestisci le passkey' })),
        dueFattori(ui)];
    } else if (sez === 'legale') {
      content = [...head('Note legali', 'I dati dell’azienda che fornisce il servizio e i documenti legali.'),
        h('div', { class: 'es-grid' },
          campo('Nome azienda', input(d.legale.ragioneSociale, (v) => set('legale', { ragioneSociale: v }))),
          campo('Partita IVA', input(d.legale.partitaIva, (v) => set('legale', { partitaIva: v.replace(/\D/g, '') }), { inputmode: 'numeric', maxlength: 11 })),
          campo('Sede legale', input(d.legale.sedeLegale, (v) => set('legale', { sedeLegale: v })), true),
          campo('Termini e condizioni (link)', input(d.legale.terminiUrl, (v) => set('legale', { terminiUrl: v }), { type: 'url' })),
          campo('Informativa privacy (link)', input(d.legale.privacyUrl, (v) => set('legale', { privacyUrl: v }), { type: 'url' }))),
        h('p', { class: 'es-note', text: 'I testi di Termini e Privacy arrivano dall’avvocato.' })];
    } else if (sez === 'assistenti') {
      conSalva = false;
      content = [...head('Assistenti AI', 'Il motore che scrive le risposte. Solo servizi gratuiti.'),
        h('ul', { class: 'es-list' },
          h('li', null, h('span', { text: 'Assistente del sito (regole, FAQ e file)' }), chip(true, 'In uso')),
          h('li', null, h('span', { text: 'Groq (gratuito)' }), chip(false, 'Si accende con la modalità IA')),
          h('li', null, h('span', { text: 'Gemini' }), chip(false, 'Spento: piano gratuito non adatto in Europa')),
          h('li', null, h('span', { text: 'Claude' }), chip(false, 'Non collegato: a pagamento')),
          h('li', null, h('span', { text: 'Grok' }), chip(false, 'Non collegato')))];
    }

    const nodes = content.filter(Boolean);
    if (conSalva) nodes.push(h('div', { class: 'es-actions' }, undo, save));
    wrap.replaceChildren(h('section', { class: 'es-main' }, ...nodes));
  }

  call('/rest/v1/eliseo_assistente?select=impostazioni,fogli&id=eq.1')
    .then(([row]) => { saved = row?.impostazioni || {}; ui.fogli = Array.isArray(row?.fogli) ? row.fogli : []; render(cleanSettings(saved, origin)); })
    .catch((e) => wrap.replaceChildren(card(null, h('p', { class: 'pcard__note', text: e.message === 'sql' || /column/i.test(e.message) ? SQL_NOTE : e.message }))));
  return [wrap];
}

/** Verifica in due passaggi con Google Authenticator (10/11/2026). Chi la attiva, dopo la password scrive il codice. */
function dueFattori(ui) {
  const { h, say, sbc } = ui;
  const box = h('div', { class: 'es-block' });
  async function draw() {
    const user = await sbc?.user().catch(() => null);
    const factors = (user?.factors || []).filter((f) => f.factor_type === 'totp');
    const attivo = factors.find((f) => f.status === 'verified');
    const head = [h('h3', { class: 'es-h3', text: 'Autenticazione a due fattori' }), h('p', { class: 'es-note', text: 'A ogni accesso, oltre alla password, il codice dell’app Google Authenticator (o un’altra app di codici).' })];
    if (attivo) {
      const off = h('button', { type: 'button', class: 'btn btn--secondary', text: 'Disattiva' });
      off.addEventListener('click', async () => {
        off.disabled = true;
        try { await sbc.mfaUnenroll(attivo.id); say('Verifica in due passaggi disattivata.'); draw(); }
        catch (e) { say(e?.message || 'Non riesco a disattivarla.', true); off.disabled = false; }
      });
      box.replaceChildren(...head, h('div', { class: 'es-row' }, h('div', { class: 'es-row__txt' }, h('strong', { text: 'App di autenticazione' }), h('span', { text: 'Attiva' })), off), riserva(user));
      return;
    }
    const on = h('button', { type: 'button', class: 'btn btn--primary', text: 'Attiva 2FA' });
    on.addEventListener('click', async () => {
      on.disabled = true;
      try {
        for (const f of factors.filter((x) => x.status !== 'verified')) await sbc.mfaUnenroll(f.id).catch(() => {});
        const d = await sbc.mfaEnroll();
        const qr = String(d?.totp?.qr_code || '');
        const src = qr.startsWith('data:') ? qr : `data:image/svg+xml;utf-8,${encodeURIComponent(qr)}`;
        const code = h('input', { class: 'es-input es-input--num', inputmode: 'numeric', autocomplete: 'one-time-code', maxlength: 7, placeholder: '123456', 'aria-label': 'Codice di 6 cifre' });
        const ok = h('button', { type: 'button', class: 'btn btn--primary', text: 'Conferma' });
        const no = h('button', { type: 'button', class: 'btn btn--secondary', text: 'Annulla' });
        no.addEventListener('click', async () => { await sbc.mfaUnenroll(d.id).catch(() => {}); draw(); });
        ok.addEventListener('click', async () => {
          const v = code.value.replace(/\s/g, '');
          if (!/^\d{6}$/.test(v)) { say('Scrivi le 6 cifre dell’app.', true); return; }
          ok.disabled = true;
          try { await sbc.mfaVerify(d.id, v); say('Verifica attiva. Ora crea i codici di riserva: servono se perdi il telefono.'); draw(); }
          catch { say('Codice non valido. Usa quello nuovo dell’app.', true); ok.disabled = false; }
        });
        box.replaceChildren(...head,
          h('div', { class: 'es-enroll' },
            h('img', { src, alt: 'Codice QR da inquadrare con l’app di autenticazione', width: 180, height: 180 }),
            h('div', null,
              h('p', { class: 'es-note', text: '1. Apri Google Authenticator e inquadra il QR. 2. Scrivi qui il codice di 6 cifre.' }),
              h('p', { class: 'es-note', text: `Se non puoi inquadrare, inserisci questa chiave: ${d?.totp?.secret || ''}` }),
              code, h('div', { class: 'es-inline' }, ok, no))));
        code.focus();
      } catch (e) { say(e?.message ? `Non riesco ad attivarla: ${e.message}` : 'Non riesco ad attivarla.', true); on.disabled = false; }
    });
    box.replaceChildren(...head, h('div', { class: 'es-row' }, h('div', { class: 'es-row__txt' }, h('strong', { text: 'App di autenticazione' }), h('span', { text: 'Non configurata' })), on));
  }
  // Codici di riserva (10/11/2026): se il telefono si perde, uno di questi fa entrare e toglie la verifica.
  // Si vedono una volta sola; il server tiene solo le impronte.
  function riserva(user) {
    const wrap = h('div', { class: 'es-riserva' });
    if (typeof sbc?.mfaRiserva !== 'function') return wrap;
    const n = Array.isArray(user?.app_metadata?.mfa_riserva) ? user.app_metadata.mfa_riserva.length : 0;
    const btn = h('button', { type: 'button', class: n ? 'btn btn--secondary' : 'btn btn--primary', text: n ? 'Crea codici nuovi' : 'Crea codici di riserva' });
    btn.addEventListener('click', async () => {
      btn.disabled = true;
      try {
        const { codici } = await sbc.mfaRiserva('crea');
        const testo = `Codici di riserva — ${location.hostname}\nOgni codice vale una volta. Tienili in un posto sicuro.\n\n${codici.join('\n')}\n`;
        const copia = h('button', { type: 'button', class: 'btn btn--secondary', text: 'Copia' });
        copia.addEventListener('click', async () => { try { await navigator.clipboard.writeText(testo); say('Codici copiati.'); } catch { say('Non riesco a copiare: selezionali a mano.', true); } });
        const scarica = h('button', { type: 'button', class: 'btn btn--secondary', text: 'Scarica .txt' });
        scarica.addEventListener('click', () => {
          const a = h('a', { href: URL.createObjectURL(new Blob([testo], { type: 'text/plain' })), download: 'codici-di-riserva.txt' });
          document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
        });
        const fatto = h('button', { type: 'button', class: 'btn btn--primary', text: 'Li ho salvati' });
        fatto.addEventListener('click', () => draw());
        wrap.replaceChildren(
          h('strong', { text: 'I tuoi codici di riserva' }),
          h('p', { class: 'es-note', text: 'Salvali adesso: non li vedrai più. Ogni codice vale una volta. I codici vecchi non valgono più.' }),
          h('ol', { class: 'es-codes' }, ...codici.map((c) => h('li', { text: c }))),
          h('div', { class: 'es-inline' }, copia, scarica, fatto));
      } catch (e) { say(e?.message || 'Non riesco a crearli.', true); btn.disabled = false; }
    });
    wrap.append(h('div', { class: 'es-row' },
      h('div', { class: 'es-row__txt' }, h('strong', { text: 'Codici di riserva' }), h('span', { text: n ? `${n} codici ancora validi` : 'Non creati: senza telefono resteresti fuori' })),
      btn));
    return wrap;
  }
  box.append(h('p', { class: 'es-note', text: 'Carico…' }));
  draw();
  return box;
}

/** Prompt aggiuntivi sotto il principale. */
export function promptsCard(conf, ui) {
  const { h, call, say } = ui;
  let list = cleanPrompts(conf?.prompts);
  const box = h('section', { class: 'es-block' });
  const draw = () => {
    const save = h('button', { type: 'button', class: 'btn btn--primary', text: 'Salva prompt aggiuntivi' });
    const add = h('button', { type: 'button', class: 'btn btn--secondary', text: '+ Aggiungi prompt' });
    add.disabled = list.length >= 10;
    add.addEventListener('click', () => { list.push({ titolo: `Prompt ${list.length + 2}`, testo: '', attivo: true }); draw(); });
    save.addEventListener('click', async () => {
      save.disabled = true;
      try { await call('/rest/v1/eliseo_assistente?id=eq.1', { method: 'PATCH', body: { prompts: cleanPrompts(list) }, prefer: 'return=minimal' }); say('Prompt aggiuntivi salvati.'); }
      catch (e) { say(e.message === 'sql' || /column/i.test(e.message) ? SQL_NOTE : e.message, true); }
      save.disabled = false;
    });
    box.replaceChildren(
      h('h3', { class: 'es-h3', text: 'Prompt aggiuntivi' }),
      h('p', { class: 'es-note', text: 'Quando il principale è pieno (10.000 caratteri), continua qui. Fino a 10 prompt da 10.000 caratteri, accesi o spenti uno per uno.' }),
      ...list.map((p, i) => {
        const t = h('input', { class: 'es-input', maxlength: 80, 'aria-label': `Nome del prompt ${i + 2}` }); t.value = p.titolo; t.addEventListener('input', () => { p.titolo = t.value; });
        const n = h('span', { class: 'es-prompt__count', text: `${p.testo.length} / 10.000` });
        const ta = h('textarea', { class: 'el-prompt__text', rows: 8, maxlength: 10000 }); ta.value = p.testo; ta.addEventListener('input', () => { p.testo = ta.value; n.textContent = `${ta.value.length} / 10.000`; });
        const onoff = h('button', { type: 'button', role: 'switch', class: 'es-switch', 'aria-checked': p.attivo ? 'true' : 'false', 'aria-label': 'Prompt attivo' }, h('span'));
        onoff.addEventListener('click', () => { p.attivo = !p.attivo; onoff.setAttribute('aria-checked', p.attivo ? 'true' : 'false'); });
        const del = h('button', { type: 'button', class: 'btn btn--secondary', text: 'Togli' }); del.addEventListener('click', () => { list.splice(i, 1); draw(); });
        return h('div', { class: 'es-prompt' }, h('div', { class: 'es-prompt__bar' }, t, n, onoff, del), ta);
      }),
      h('div', { class: 'es-inline' }, add, save));
  };
  draw();
  return box;
}

/** «Collega Google Sheet» nella sezione File: il foglio diventa un documento dell'assistente; «Aggiorna» lo riscarica. */
export function sheetsCard(conf, ui, onDone) {
  const { h, call, say } = ui;
  let fogli = Array.isArray(conf?.fogli) ? conf.fogli : [];
  const box = h('section', { class: 'es-block' });
  async function collega(link, titolo, btn) {
    const csvUrl = sheetCsvUrl(link);
    if (!csvUrl) { say('Incolla il link di un foglio Google (docs.google.com/spreadsheets/…).', true); return; }
    if (btn) btn.disabled = true;
    try {
      const res = await fetch(csvUrl);
      const type = res.headers.get('content-type') || '';
      if (!res.ok || type.includes('text/html')) throw new Error('Non riesco a leggere il foglio. In Google Sheets: Condividi → «Chiunque abbia il link» → Visualizzatore.');
      const testo = (await res.text()).replace(/\r\n?/g, '\n').trim().slice(0, 20000);
      if (testo.length < 3) throw new Error('Il foglio è vuoto.');
      const nome = (titolo || 'Google Sheet').trim().slice(0, 100);
      const prev = fogli.find((f) => f.url === link);
      const row = { titolo: `${nome} (Google Sheet)`.slice(0, 120), testo, attivo: true };
      let id = prev?.docId;
      if (id) await call(`/rest/v1/eliseo_documenti?id=eq.${id}`, { method: 'PATCH', body: row, prefer: 'return=minimal' });
      else { const [ins] = await call('/rest/v1/eliseo_documenti', { method: 'POST', body: row, prefer: 'return=representation' }); id = ins?.id; }
      fogli = [{ url: link, docId: id, titolo: nome, aggiornato: new Date().toISOString() }, ...fogli.filter((f) => f.url !== link)].slice(0, 30);
      await call('/rest/v1/eliseo_assistente?id=eq.1', { method: 'PATCH', body: { fogli }, prefer: 'return=minimal' });
      say(`Foglio «${nome}» collegato.`);
      onDone?.();
    } catch (e) { say(e.message === 'sql' || /column/i.test(e.message) ? SQL_NOTE : e.message, true); }
    if (btn) btn.disabled = false;
  }
  const link = h('input', { class: 'es-input', type: 'url', placeholder: 'https://docs.google.com/spreadsheets/d/…', 'aria-label': 'Link del foglio' });
  const nome = h('input', { class: 'es-input', maxlength: 100, placeholder: 'Nome (es. Listino prodotti)', 'aria-label': 'Nome del foglio' });
  const go = h('button', { type: 'button', class: 'btn btn--primary', text: 'Collega' });
  go.addEventListener('click', () => collega(link.value.trim(), nome.value, go));
  box.append(
    h('h3', { class: 'es-h3', text: 'Collega Google Sheet' }),
    h('p', { class: 'es-note', text: 'In Google Sheets: Condividi → «Chiunque abbia il link» → Visualizzatore. Poi incolla qui il link.' }),
    h('div', { class: 'es-grid' }, link, nome), h('div', { class: 'es-inline' }, go),
    fogli.length ? h('ul', { class: 'es-list' }, fogli.map((f) => {
      const b = h('button', { type: 'button', class: 'btn btn--secondary', text: 'Aggiorna' });
      b.addEventListener('click', () => collega(f.url, f.titolo, b));
      return h('li', null, h('span', { text: `${f.titolo} · aggiornato il ${new Date(f.aggiornato).toLocaleDateString('it-IT')}` }), b);
    })) : null);
  return box;
}
