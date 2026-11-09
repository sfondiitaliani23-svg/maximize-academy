// Eliseo · Contatti e campagne: il CRM del portale (solo admin e co-founder).
// Stesse funzioni di prima, presentazione chiara come la console di Keplero. Tabelle in supabase/eliseo.sql.
// Regole: i contatti si aggiungono a mano, da CSV o dagli iscritti al sito; nessun dato copiato da Treatwell o Keplero.
// Il consenso marketing parte da «no». Le campagne vanno solo a chi ha detto sì e ha attivato le notifiche: lo controlla il server.
// Il calendario delle prenotazioni resta Treatwell: qui non c'è un secondo sistema di appuntamenti.
import { client } from './auth-session.js';
import { api as pushApi } from './push-api.js';
import { FASI, FONTI, CATEGORIE, allTags, cleanContact, cleanTags, cleanTemplate, fillTemplate, filterContacts, mapImport, parseCsv, summary } from './eliseo-rules.js';

const h = (tag, attrs, ...kids) => {
  const el = document.createElement(tag);
  Object.entries(attrs || {}).forEach(([k, v]) => { if (v === false || v == null) return; if (k === 'text') el.textContent = v; else el.setAttribute(k, v === true ? '' : v); });
  kids.flat(Infinity).forEach((k) => { if (k != null) el.append(k); });
  return el;
};
const card = (title, ...body) => h('section', { class: 'pcard' }, title ? h('h3', { class: 'pcard__title', text: title }) : null, ...body);

// Voci di Profilo e Impostazioni (stesso elenco di js/portal-eliseo-settings.js, qui per non caricarlo prima del clic).
const SETTINGS_IDS = ['generali', 'lingua', 'team', 'collegati', 'analisi-imp', 'c-widget', 'c-whatsapp', 'c-messenger', 'c-instagram', 'c-email', 'c-telefono', 'account', 'fatturazione', 'sicurezza', 'legale', 'assistenti'];
const PAGES = [['/', 'Home'], ['/#prenota', 'Prenota (dalla Home)'], ['/servizi/', 'Servizi'], ['/offerte/', 'Offerte'], ['/journal/', 'Journal'], ['/contatti/', 'Orari e contatti'], ['/formazione/', 'Formazione'], ['/galleria/', 'Galleria']];
const label = (list, v) => (list.find(([k]) => k === v) || [v, v])[1];
const when = (iso) => (iso ? new Date(iso).toLocaleDateString('it-IT', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Europe/Rome' }) : '—');

const NS = 'http://www.w3.org/2000/svg';
const ICONS = {
  folder: [['path', { d: 'M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-6l-2-2H5a2 2 0 0 0-2 2z' }]],
  checkCircle: [['circle', { cx: '12', cy: '12', r: '9' }], ['path', { d: 'M8.5 12.5l2.5 2.5 5-5' }]],
  alertCircle: [['circle', { cx: '12', cy: '12', r: '9' }], ['path', { d: 'M12 8v4M12 16h.01' }]],
  headset: [['path', { d: 'M3 18v-6a9 9 0 0 1 18 0v6' }], ['path', { d: 'M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z' }]],
  whatsapp: [['path', { d: 'M17.6 6.4A8 8 0 0 0 4.2 16.9L3 21l4.2-1.1a8 8 0 0 0 10.4-13.5z' }], ['path', { d: 'M15.5 14.2c-.3-.1-1.6-.8-1.8-.9-.3-.1-.5-.1-.7.2-.2.3-.8.9-1 1.1-.2.2-.4.2-.7.1-.3-.2-1.3-.5-2.5-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.7.1-.2.3-.4.5-.6.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5-.1-.1-.7-1.7-1-2.3-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4s-1.2 1.2-1.2 2.8 1.2 3.2 1.4 3.4c.2.3 2.4 3.7 5.8 5.1.8.4 1.5.6 2 .7.8.3 1.6.2 2.2.1.7-.1 2.1-.9 2.4-1.7.3-.8.3-1.6.2-1.7-.1-.2-.3-.3-.6-.5z' }]],
  plus: [['path', { d: 'M12 5v14M5 12h14' }]],
  mail: [['rect', { x: '3', y: '5', width: '18', height: '14', rx: '2' }], ['path', { d: 'M3 7l9 6 9-6' }]],
  refresh: [['path', { d: 'M23 4v6h-6' }], ['path', { d: 'M1 20v-6h6' }], ['path', { d: 'M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15' }]],
  search: [['circle', { cx: '11', cy: '11', r: '7' }], ['path', { d: 'M21 21l-4.35-4.35' }]],
  funnel: [['polygon', { points: '22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3' }]],
  chat: [['path', { d: 'M5 6.5h14a1 1 0 0 1 1 1V15a1 1 0 0 1-1 1H9l-4 3v-3H5a1 1 0 0 1-1-1V7.5a1 1 0 0 1 1-1z' }]],
  book: [['path', { d: 'M5 5.2A2.2 2.2 0 0 1 7.2 3H19v15.2H7.2A2.2 2.2 0 0 0 5 20.4z' }], ['path', { d: 'M5 5.2A2.2 2.2 0 0 1 7.2 7.4H19' }]],
  flow: [['circle', { cx: '6', cy: '6', r: '2' }], ['circle', { cx: '18', cy: '12', r: '2' }], ['circle', { cx: '6', cy: '18', r: '2' }], ['path', { d: 'M8 6h6a2 2 0 0 1 2 2v2M8 18h6a2 2 0 0 0 2-2v-2M6 8v8' }]],
  person: [['circle', { cx: '12', cy: '8', r: '3' }], ['path', { d: 'M5.5 19.2a6.5 6.5 0 0 1 13 0' }]],
  cal: [['rect', { x: '4', y: '5', width: '16', height: '15', rx: '2' }], ['path', { d: 'M4 10h16M8 3.5V6M16 3.5V6' }]],
  bot: [['rect', { x: '5', y: '8', width: '14', height: '11', rx: '3' }], ['path', { d: 'M12 8V5.2M9 13h.01M15 13h.01M9.5 16.5h5' }], ['circle', { cx: '12', cy: '4.2', r: '.9' }]],
  chart: [['path', { d: 'M5 19V10M12 19V5M19 19v-6' }]],
  gear: [['circle', { cx: '12', cy: '12', r: '3' }], ['path', { d: 'M12.2 2h-.4a2 2 0 0 0-2 2v.2a2 2 0 0 1-1 1.7l-.4.3a2 2 0 0 1-2 0l-.2-.1a2 2 0 0 0-2.7.7l-.2.4a2 2 0 0 0 .7 2.7l.2.1a2 2 0 0 1 1 1.7v.5a2 2 0 0 1-1 1.7l-.2.1a2 2 0 0 0-.7 2.7l.2.4a2 2 0 0 0 2.7.7l.2-.1a2 2 0 0 1 2 0l.4.3a2 2 0 0 1 1 1.7V20a2 2 0 0 0 2 2h.4a2 2 0 0 0 2-2v-.2a2 2 0 0 1 1-1.7l.4-.3a2 2 0 0 1 2 0l.2.1a2 2 0 0 0 2.7-.7l.2-.4a2 2 0 0 0-.7-2.7l-.2-.1a2 2 0 0 1-1-1.7v-.5a2 2 0 0 1 1-1.7l.2-.1a2 2 0 0 0 .7-2.7l-.2-.4a2 2 0 0 0-2.7-.7l-.2.1a2 2 0 0 1-2 0l-.4-.3a2 2 0 0 1-1-1.7V4a2 2 0 0 0-2-2z' }]],
  ask: [['circle', { cx: '12', cy: '12', r: '8' }], ['path', { d: 'M9.6 9.4a2.4 2.4 0 1 1 3.3 2.2c-.7.4-1.1.9-1.1 1.6M12 16.6h.01' }]],
  globe: [['circle', { cx: '12', cy: '12', r: '8' }], ['path', { d: 'M4 12h16M12 4c2.2 2.4 3.3 5.1 3.3 8s-1.1 5.6-3.3 8c-2.2-2.4-3.3-5.1-3.3-8s1.1-5.6 3.3-8z' }]],
  doc: [['path', { d: 'M7 3.5h7l4 4V20.5H7z' }], ['path', { d: 'M14 3.5V8h4' }]],
  prompt: [['path', { d: 'M6 4.5h12v15H6z' }], ['path', { d: 'M9 9h6M9 12.5h6M9 16h4' }]],
  branch: [['circle', { cx: '7', cy: '6', r: '2' }], ['circle', { cx: '17', cy: '8', r: '2' }], ['circle', { cx: '7', cy: '18', r: '2' }], ['path', { d: 'M7 8v8M9 7h5.2A2.8 2.8 0 0 1 17 9.8' }]],
  puzzle: [['path', { d: 'M8 3v4M16 3v4M6 7h12v5a6 6 0 0 1-12 0zM12 18v3' }]],
  megaphone: [['path', { d: 'M5 10v4h3l8 4V6L8 10z' }], ['path', { d: 'M16 9.5a3 3 0 0 1 0 5' }]],
  user: [['circle', { cx: '12', cy: '12', r: '9' }], ['circle', { cx: '12', cy: '10', r: '3' }], ['path', { d: 'M6.8 18.2a6 6 0 0 1 10.4 0' }]],
};
const icon = (name) => {
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '1.8');
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  (ICONS[name] || []).forEach(([tag, attrs]) => {
    const node = document.createElementNS(NS, tag);
    Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
    svg.append(node);
  });
  return svg;
};

export function mount(box, root) {
  const auth = root.closest('[data-auth-page]');
  const url = auth.dataset.authUrl;
  const key = auth.dataset.authKey;
  const sbc = client({ url, key });
  const post = pushApi(root);
  let team = []; try { team = JSON.parse(root.dataset.team || '[]'); } catch { team = []; }
  let rows = [];
  let tab = 'casella';
  try { if (sessionStorage.getItem('mx-eliseo-tab') === 'campagne') tab = 'campagne'; } catch { /* la sessione del browser non è disponibile */ }
  const filters = { q: '', fase: '', fonte: '', etichetta: '' };
  // Etichette e modelli arrivano con supabase/eliseo-liste-modelli.sql: finché manca, quelle parti restano nascoste.
  let hasTags = false, modelli = null;

  async function call(path, { method = 'GET', body, prefer } = {}) {
    const token = await sbc.token();
    if (!token) throw new Error('La sessione è scaduta. Accedi di nuovo.');
    const res = await fetch(`${url}${path}`, { method, headers: { apikey: key, Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', ...(prefer ? { Prefer: prefer } : {}) }, body: body === undefined ? undefined : JSON.stringify(body) });
    if (!res.ok) {
      let msg = '', code = ''; try { const j = await res.json(); msg = j.message || ''; code = j.code || ''; } catch { msg = ''; }
      call.last = `${res.status}${code ? ' ' + code : ''}`;
      if (/(eliseo_\w*|relation \S+) does not exist|schema cache/i.test(msg)) throw new Error('sql');
      if (/duplicate key|eliseo_contatti_email|unique/i.test(msg)) throw new Error('C’è già un contatto con questa email.');
      throw new Error(res.status === 401 || res.status === 403 ? 'Non hai il permesso, oppure la sessione è scaduta.' : 'Operazione non riuscita. Riprova.');
    }
    return res.status === 204 ? null : res.json().catch(() => null);
  }

  const status = h('p', { class: 'el-status', role: 'status', 'aria-live': 'polite' });
  const say = (t, bad) => { status.textContent = t; status.dataset.state = bad ? 'error' : 'ok'; };
  const body = h('div', { class: 'el-body' });
  // Barra di icone dentro Eliseo. Il menu scuro dell'area riservata resta al suo posto.
  const rails = [
    ['casella', 'Conversazioni', 'chat', null],
    ['faq', 'Addestramento', 'book', [
      ['Base di conoscenza', [['faq', 'FAQ'], ['sito', 'Sito web'], ['documenti', 'File']]],
      ['Agente Chat', [['istruzioni', 'Prompt'], ['passaggio', 'Escalation']]],
      ['', [['integrazioni', 'Integrazioni']]],
    ]],
    ['automazioni', 'Automazioni', 'flow', null],
    ['elenco', 'Contatti', 'person', [
      ['', [['elenco', 'Contatti'], ['campagne', 'Campagne'], ['modelli', 'Modelli']]],
    ]],
    ['prenota', 'Prenotazioni', 'cal', null],
    ['prova', 'Chatbot', 'bot', null],
    ['analisi', 'Analisi', 'chart', null],
    // Profilo e Impostazioni come in Keplero (09/11/2026): js/portal-eliseo-settings.js
    ['account', 'Profilo', 'user', [
      ['', [['account', 'Account'], ['fatturazione', 'Fatturazione'], ['sicurezza', 'Sicurezza'], ['legale', 'Note legali'], ['assistenti', 'Assistenti AI']]],
    ]],
    ['generali', 'Impostazioni', 'gear', [
      ['', [['generali', 'Generali'], ['lingua', 'Lingua e Privacy'], ['team', 'Team'], ['collegati', 'Account collegati'], ['analisi-imp', 'Analisi'], ['integrazioni', 'Integrazioni']]],
      ['Canali', [['c-widget', 'Widget chat web'], ['c-whatsapp', 'WhatsApp'], ['c-messenger', 'Messenger'], ['c-instagram', 'Instagram'], ['c-email', 'Email'], ['c-telefono', 'Telefono']]],
    ]],
  ];
  const owns = (item, id) => item[0] === id
    || (item[3] || []).some((g) => g[1].some(([k]) => k === id))
    || (item[0] === 'elenco' && (id === 'colonne' || id === 'importa'));
  const app = h('div', { class: 'el-app' });
  const railNav = h('div', { class: 'el-rail__nav' });
  const side = h('aside', { class: 'el-side' });
  const sideNav = h('div', { class: 'el-side__nav' });
  side.append(sideNav);
  const rail = h('nav', { class: 'el-rail', 'aria-label': 'Eliseo' },
    h('span', { class: 'el-mark', 'aria-hidden': 'true', text: 'E' }),
    railNav);
  const syncNav = () => {
    const current = rails.find((item) => owns(item, tab)) || rails[0];
    rail.querySelectorAll('.el-rail__btn').forEach((b) => {
      b.setAttribute('aria-pressed', b.dataset.tab === current[0] ? 'true' : 'false');
    });
    sideNav.replaceChildren();
    if (!current[3]) {
      side.hidden = true;
      app.classList.remove('has-sub');
      return;
    }
    side.hidden = false;
    app.classList.add('has-sub');
    if (!current[3].some(([title]) => title)) sideNav.append(h('p', { class: 'el-side__title', text: current[1] }));
    const groupIcon = { 'Base di conoscenza': 'book', 'Agente Chat': 'person' };
    const navIcon = { faq: 'ask', sito: 'globe', documenti: 'doc', istruzioni: 'prompt', passaggio: 'branch', integrazioni: 'puzzle', elenco: 'person', campagne: 'megaphone', modelli: 'doc' };
    current[3].forEach(([title, items]) => {
      if (title) sideNav.append(h('p', { class: 'el-group' }, groupIcon[title] ? icon(groupIcon[title]) : null, h('span', { text: title })));
      const nav = h('div', { class: 'el-navs', role: 'tablist', 'aria-label': title || current[1] });
      items.forEach(([id, nome]) => {
        const on = id === tab || (id === 'elenco' && (tab === 'colonne' || tab === 'importa'));
        const b = h('button', { type: 'button', class: 'el-nav', role: 'tab', 'data-tab': id, 'aria-selected': on ? 'true' : 'false' }, navIcon[id] ? icon(navIcon[id]) : null, h('span', { text: nome }));
        b.addEventListener('click', () => { tab = id; syncNav(); draw(); });
        nav.append(b);
      });
      sideNav.append(nav);
    });
  };
  rails.forEach((item) => {
    const b = h('button', {
      type: 'button', class: 'el-rail__btn', 'data-tab': item[0],
      'aria-label': item[1], title: item[1], 'aria-pressed': 'false',
    });
    b.append(icon(item[2]));
    b.addEventListener('click', () => {
      if (owns(item, tab)) return;
      tab = item[3]?.[0]?.[1]?.[0]?.[0] || item[0];
      syncNav();
      draw();
    });
    (item[2] === 'gear' || item[2] === 'user' ? rail : railNav).append(b);
  });
  app.append(rail, side, h('div', { class: 'el-stage' }, body, status));
  syncNav();
  box.replaceChildren(app);

  function drawStats() { if (tab === 'analisi') draw(); }
  function pageHead(title, ...extra) {
    return h('header', { class: 'el-pagehead' }, h('h2', { text: title }), extra.length ? h('div', { class: 'el-pagehead__act' }, ...extra) : null);
  }

  async function load() {
    try {
      rows = await call('/rest/v1/eliseo_contatti?select=*&order=aggiornato_il.desc&limit=2000') || [];
      hasTags = rows.length ? 'etichette' in rows[0] : await call('/rest/v1/eliseo_contatti?select=etichette&limit=1').then(() => true, () => false);
      modelli = await call('/rest/v1/eliseo_modelli?select=*&order=categoria,nome').catch(() => null);
      drawStats(); draw();
    } catch (e) {
      body.replaceChildren(card('Eliseo non ancora attivo', h('p', { class: 'pcard__note', text: e.message === 'sql' ? 'Manca un passaggio una tantum: va eseguito il file supabase/eliseo.sql in Supabase (SQL Editor → New query → Run). Lo fa Eliseo. Poi ricarica questa pagina.' : e.message })));
    }
  }

  const select = (name, list, value, extra = {}) => { const s = h('select', { name, ...extra }); list.forEach(([k, t]) => { const o = h('option', { value: k, text: t }); if (k === value) o.selected = true; s.append(o); }); return s; };

  async function setFase(id, fase) {
    const r = rows.find((x) => x.id === id); if (!r || r.fase === fase) return;
    const prev = r.fase; r.fase = fase; draw();
    try { const [upd] = await call(`/rest/v1/eliseo_contatti?id=eq.${id}`, { method: 'PATCH', body: { fase }, prefer: 'return=representation' }); Object.assign(r, upd); drawStats(); say(`${r.nome}: ora è «${label(FASI, fase)}».`); }
    catch (e) { r.fase = prev; draw(); say(e.message, true); }
  }

  // Scheda del contatto: nuovo o modifica. Elimina chiede una seconda conferma.
  function openForm(r) {
    const isNew = !r;
    const c = r || { nome: '', email: '', telefono: '', fonte: 'negozio', fase: 'nuovo', barbiere: '', consenso_marketing: false, note: '' };
    const field = (lab, input, hint) => h('div', { class: 'field' }, h('label', null, h('span', { text: lab }), input), hint ? h('p', { class: 'field__hint', text: hint }) : null);
    const f = h('form', { class: 'el-form', novalidate: true });
    const nome = h('input', { name: 'nome', required: true, maxlength: 120, value: c.nome || '', autocomplete: 'off' });
    const email = h('input', { name: 'email', type: 'email', maxlength: 200, value: c.email || '', autocomplete: 'off' });
    const tel = h('input', { name: 'telefono', type: 'tel', maxlength: 40, value: c.telefono || '', autocomplete: 'off' });
    const barb = select('barbiere', [['', '—'], ...team.map((p) => [p.nome, p.nome])], c.barbiere || '');
    const cons = h('input', { type: 'checkbox', name: 'consenso' }); cons.checked = !!c.consenso_marketing;
    const note = h('textarea', { name: 'note', maxlength: 500, rows: 3 }); note.value = c.note || '';
    const tags = h('input', { name: 'etichette', maxlength: 200, value: (c.etichette || []).join(', '), autocomplete: 'off', list: 'el-tags-list', placeholder: 'es. keplero, corso sfumatura' });
    const tagList = h('datalist', { id: 'el-tags-list' }, allTags(rows).map((t) => h('option', { value: t })));
    const err = h('p', { class: 'field__error', role: 'alert' });
    f.append(
      h('div', { class: 'el-grid' },
        field('Nome *', nome), field('Telefono', tel), field('Email', email),
        field('Da dove arriva', select('fonte', FONTI, c.fonte)), field('Fase', select('fase', FASI, c.fase)), field('Barbiere preferito', barb)),
      h('label', { class: 'el-consent' }, cons, h('span', { text: 'Ha detto sì a ricevere promozioni e novità (consenso marketing)' })),
      h('p', { class: 'field__hint', text: c.consenso_il ? `Consenso registrato il ${when(c.consenso_il)}. Spunta solo se il cliente l’ha detto chiaramente.` : 'Spunta solo se il cliente l’ha detto chiaramente: la data si salva da sola.' }),
      hasTags ? field('Etichette', h('span', null, tags, tagList), 'Separate da virgola, al massimo 10. Servono per raggruppare (come le liste di Keplero).') : null,
      field('Note', note, 'Massimo 500 caratteri. Niente dati sulla salute.'),
      err);
    const save = h('button', { type: 'submit', class: 'btn btn--primary', text: isNew ? 'Aggiungi contatto' : 'Salva' });
    const cancel = h('button', { type: 'button', class: 'btn btn--secondary', text: 'Chiudi' });
    const del = isNew ? null : h('button', { type: 'button', class: 'btn btn--secondary el-del', text: 'Elimina' });
    f.append(h('div', { class: 'actions' }, save, cancel, del));
    cancel.addEventListener('click', () => draw());
    if (del) {
      let armed = false;
      del.addEventListener('click', async () => {
        if (!armed) { armed = true; del.textContent = 'Conferma: elimina per sempre'; del.classList.add('is-armed'); return; }
        try { await call(`/rest/v1/eliseo_contatti?id=eq.${r.id}`, { method: 'DELETE' }); rows = rows.filter((x) => x.id !== r.id); drawStats(); draw(); say('Contatto eliminato.'); }
        catch (e) { err.textContent = e.message; }
      });
    }
    f.addEventListener('submit', async (e) => {
      e.preventDefault();
      const { row, errors, ok } = cleanContact({ nome: nome.value, email: email.value, telefono: tel.value, fonte: f.fonte.value, fase: f.fase.value, barbiere: barb.value, consenso_marketing: cons.checked, note: note.value });
      [nome, email, tel].forEach((i) => i.removeAttribute('aria-invalid'));
      if (!ok) { Object.keys(errors).forEach((k) => ({ nome, email, telefono: tel })[k]?.setAttribute('aria-invalid', 'true')); err.textContent = Object.values(errors).join(' '); return; }
      if (hasTags) row.etichette = cleanTags(tags.value);
      save.disabled = true;
      try {
        if (isNew) { const [ins] = await call('/rest/v1/eliseo_contatti', { method: 'POST', body: row, prefer: 'return=representation' }); rows.unshift(ins); say(`${ins.nome} aggiunto.`); }
        else { const [upd] = await call(`/rest/v1/eliseo_contatti?id=eq.${r.id}`, { method: 'PATCH', body: row, prefer: 'return=representation' }); Object.assign(r, upd); say('Contatto salvato.'); }
        drawStats(); draw();
      } catch (ex) { err.textContent = ex.message; save.disabled = false; }
    });
    body.replaceChildren(card(isNew ? 'Nuovo contatto' : c.nome, f));
    nome.focus();
  }

  function toolbar(withFase) {
    const q = h('input', { type: 'search', class: 'el-search', placeholder: 'Cerca nome, email o telefono', 'aria-label': 'Cerca un contatto', value: filters.q });
    q.addEventListener('input', () => {
      filters.q = q.value;
      if (tab !== 'colonne') { drawList(); return; }
      const old = q.closest('.el-book__main')?.querySelector('.el-cols');
      if (old) old.replaceWith(drawColumns());
    });
    const fs = withFase ? select('fase', [['', 'Tutte le fasi'], ...FASI], filters.fase, { 'aria-label': 'Filtra per fase', class: 'el-fase' }) : null;
    fs?.addEventListener('change', () => { filters.fase = fs.value; drawList(); });
    const csv = h('button', { type: 'button', class: 'btn btn--secondary', text: 'Importa da CSV' });
    csv.addEventListener('click', () => openImport());
    const add = h('button', { type: 'button', class: 'btn btn--primary', text: 'Nuovo contatto' });
    add.addEventListener('click', () => openForm(null));
    const imp = h('button', { type: 'button', class: 'btn btn--secondary', text: 'Copia gli iscritti al sito' });
    imp.addEventListener('click', async () => {
      imp.disabled = true;
      try { const n = await call('/rest/v1/rpc/eliseo_importa_iscritti', { method: 'POST', body: {} }); say(n ? `${n} iscritti copiati nei contatti (consenso: no).` : 'Nessun iscritto nuovo da copiare.'); await load(); }
      catch (e) { say(e.message === 'sql' ? 'Manca il file supabase/eliseo.sql.' : e.message, true); }
      imp.disabled = false;
    });
    return h('div', { class: 'el-tools' }, q, fs, h('div', { class: 'el-tools__act' }, add, imp, csv));
  }

  function folderNav() {
    const box = h('div', { class: 'el-folders', role: 'group', 'aria-label': 'Cartelle' });
    const add = (kind, key, nome, n) => {
      const on = kind === 'tutti' ? !filters.fonte && !filters.etichetta : kind === 'fonte' ? filters.fonte === key && !filters.etichetta : filters.etichetta === key;
      const b = h('button', { type: 'button', class: 'el-folder', 'aria-pressed': on ? 'true' : 'false' }, h('span', { text: nome }), h('b', { text: String(n) }));
      b.addEventListener('click', () => {
        filters.fonte = kind === 'fonte' ? key : '';
        filters.etichetta = kind === 'etichetta' ? key : '';
        draw();
      });
      box.append(b);
    };
    add('tutti', '', 'Tutti', rows.length);
    FONTI.forEach(([k, t]) => {
      const n = rows.filter((r) => r.fonte === k).length;
      if (n || filters.fonte === k) add('fonte', k, t, n);
    });
    if (hasTags) allTags(rows).forEach((t) => add('etichetta', t, t, rows.filter((r) => (r.etichette || []).includes(t)).length));
    return box;
  }

  let listBox = null;
  function drawList() {
    const list = filterContacts(rows, filters);
    if (!listBox) return;
    if (!rows.length) { listBox.replaceChildren(h('p', { class: 'pempty', text: 'Nessun contatto. Aggiungine uno o copia gli iscritti al sito.' })); return; }
    if (!list.length) { listBox.replaceChildren(h('p', { class: 'pempty', text: 'Nessun contatto con questi filtri.' })); return; }
    const tb = h('tbody');
    list.forEach((r) => {
      const name = h('button', { type: 'button', class: 'link-button el-name', text: r.nome });
      name.addEventListener('click', () => openForm(r));
      const fase = select('fase', FASI, r.fase, { 'aria-label': `Fase di ${r.nome}`, class: 'el-fase' });
      fase.addEventListener('change', () => setFase(r.id, fase.value));
      tb.append(h('tr', null,
        h('td', null, name, (r.etichette || []).length ? h('span', { class: 'el-tags' }, r.etichette.map((t) => h('span', { class: 'el-tag', text: t }))) : null),
        h('td', { text: r.telefono || r.email || '—' }),
        h('td', { text: label(FONTI, r.fonte) }),
        h('td', null, fase),
        h('td', { text: r.barbiere || '—' }),
        h('td', null, h('span', { class: `pchip pchip--${r.consenso_marketing ? 'ok' : 'wait'}`, text: r.consenso_marketing ? 'Sì' : 'No' })),
        h('td', { text: when(r.aggiornato_il) })));
    });
    listBox.replaceChildren(h('div', { class: 'table-wrap', tabindex: '0', role: 'region', 'aria-label': 'Elenco dei contatti' },
      h('table', { class: 'ptable el-table' }, h('thead', null, h('tr', null, ['Nome', 'Contatto', 'Fonte', 'Fase', 'Barbiere', 'Consenso', 'Aggiornato'].map((t) => h('th', { scope: 'col', text: t })))), tb)),
      h('p', { class: 'pcard__note', text: `${list.length} di ${rows.length} contatti.` }));
  }

  // Vista a colonne (come il Kanban di Keplero): si trascina la scheda, oppure si usa il menu «Sposta in».
  function drawColumns() {
    const cols = h('div', { class: 'el-cols' });
    const pool = filterContacts(rows, { q: filters.q, fonte: filters.fonte, etichetta: filters.etichetta });
    FASI.forEach(([id, t]) => {
      const items = pool.filter((r) => r.fase === id);
      const zone = h('div', { class: 'el-col__list', 'data-fase': id });
      items.forEach((r) => {
        const move = select('sposta', FASI, r.fase, { 'aria-label': `Sposta ${r.nome} in`, class: 'el-move' });
        move.addEventListener('change', () => setFase(r.id, move.value));
        const open = h('button', { type: 'button', class: 'link-button el-name', text: r.nome });
        open.addEventListener('click', () => { tab = 'elenco'; openForm(r); });
        const c = h('article', { class: 'el-card', draggable: 'true', 'data-id': r.id },
          open, h('p', { class: 'el-card__meta', text: [label(FONTI, r.fonte), r.barbiere].filter(Boolean).join(' · ') }),
          (r.etichette || []).length ? h('span', { class: 'el-tags' }, r.etichette.map((t) => h('span', { class: 'el-tag', text: t }))) : null,
          r.consenso_marketing ? h('span', { class: 'pchip pchip--ok', text: 'Consenso' }) : null, move);
        c.addEventListener('dragstart', (e) => { e.dataTransfer.setData('text/plain', r.id); c.classList.add('is-drag'); });
        c.addEventListener('dragend', () => c.classList.remove('is-drag'));
        zone.append(c);
      });
      if (!items.length) zone.append(h('p', { class: 'el-col__empty', text: 'Vuota' }));
      zone.addEventListener('dragover', (e) => { e.preventDefault(); zone.classList.add('is-over'); });
      zone.addEventListener('dragleave', () => zone.classList.remove('is-over'));
      zone.addEventListener('drop', (e) => { e.preventDefault(); zone.classList.remove('is-over'); const rid = e.dataTransfer.getData('text/plain'); if (rid) setFase(rid, id); });
      cols.append(h('section', { class: 'el-col', 'aria-label': t }, h('header', { class: 'el-col__head' }, h('span', { text: t }), h('span', { class: 'el-col__n', text: String(items.length) })), zone));
    });
    return cols;
  }

  // Campagne: avviso sul telefono ai contatti delle fasi scelte, solo con consenso e notifiche attive.
  function drawCampaigns() {
    const f = h('form', { class: 'el-form', novalidate: true });
    const nome = h('input', { name: 'nome', maxlength: 80, required: true, placeholder: 'Es. Ritorno clienti di ottobre' });
    const titolo = h('input', { name: 'titolo', maxlength: 60, required: true, placeholder: 'Titolo dell’avviso (max 60)' });
    const testo = h('textarea', { name: 'testo', maxlength: 160, rows: 3, required: true, placeholder: 'Testo dell’avviso (max 160). Mai dati personali.' });
    const pagina = select('url', PAGES, '/#prenota');
    const fasi = h('fieldset', { class: 'el-fasi' }, h('legend', { text: 'A chi (fasi)' }), FASI.map(([k, t]) => h('label', null, h('input', { type: 'checkbox', name: 'fasi', value: k, ...(k === 'cliente' ? { checked: true } : {}) }), h('span', { text: t }))));
    const count = h('p', { class: 'pcard__note', 'aria-live': 'polite', text: 'Scegli le fasi per vedere quante persone la ricevono.' });
    const err = h('p', { class: 'field__error', role: 'alert' });
    const send = h('button', { type: 'submit', class: 'btn btn--primary', text: 'Invia la campagna' });
    const field = (lab, input) => h('div', { class: 'field' }, h('label', null, h('span', { text: lab }), input));
    f.append(field('Nome della campagna', nome), fasi, field('Titolo', titolo), field('Testo', testo), field('Pagina che si apre', pagina), count, err, h('div', { class: 'actions' }, send));
    const chosen = () => [...f.querySelectorAll('input[name="fasi"]:checked')].map((i) => i.value);
    let ready = 0;
    const recount = async () => {
      const ff = chosen(); if (!ff.length) { count.textContent = 'Scegli almeno una fase.'; ready = 0; return; }
      count.textContent = 'Conto…';
      try { const r = await post({ action: 'conta', campagna: { fasi: ff } }); ready = r.contatti; count.textContent = `${r.conConsenso ?? 0} contatti con consenso e account sul sito · ${r.contatti} con le notifiche attive (${r.dispositivi} dispositivi). Riceve solo chi ha detto sì.`; }
      catch (e) { ready = 0; count.textContent = e.status === 503 ? 'Manca il file supabase/eliseo.sql, oppure le notifiche non sono attive.' : 'Non riesco a contare i destinatari.'; }
    };
    fasi.addEventListener('change', recount);
    recount();
    f.addEventListener('submit', async (e) => {
      e.preventDefault(); err.textContent = '';
      const m = { titolo: titolo.value.trim(), testo: testo.value.trim(), url: pagina.value };
      if (!nome.value.trim() || !m.titolo || !m.testo) { err.textContent = 'Compila nome, titolo e testo.'; return; }
      const ff = chosen(); if (!ff.length) { err.textContent = 'Scegli almeno una fase.'; return; }
      if (!ready) { err.textContent = 'Nessun destinatario: servono contatti con consenso e notifiche attive.'; return; }
      send.disabled = true; send.textContent = 'Invio…';
      let inviati = 0, falliti = 0, dopo = '';
      const segnale = Date.now().toString(36);
      try {
        for (let i = 0; i < 50; i++) { const r = await post({ action: 'invia', ...m, campagna: { fasi: ff }, dopo, segnale }); inviati += r.inviati; falliti += r.falliti; if (!r.restanti) break; dopo = r.dopo; }
        await post({ action: 'registra', ...m, inviati, falliti }).catch(() => {});
        await call('/rest/v1/eliseo_campagne', { method: 'POST', body: { nome: nome.value.trim().slice(0, 80), ...m, fasi: ff, destinatari: ready, inviati, falliti } }).catch(() => {});
        say(`Campagna inviata: ${inviati} avvisi partiti${falliti ? `, ${falliti} non consegnati` : ''}.`); draw();
      } catch (ex) { err.textContent = 'Invio non riuscito. Riprova.'; send.disabled = false; send.textContent = 'Invia la campagna'; }
    });
    const cerca = h('input', { type: 'search', class: 'el-search', placeholder: 'Cerca campagne', 'aria-label': 'Cerca campagne' });
    const hist = h('div', null, h('p', { class: 'pempty', text: 'Carico…' }));
    let tutte = [];
    const paint = () => {
      const k = cerca.value.trim().toLowerCase();
      const list = tutte.filter((c) => !k || `${c.nome} ${c.titolo || ''}`.toLowerCase().includes(k));
      if (!list.length) { hist.replaceChildren(h('p', { class: 'pempty', text: tutte.length ? 'Nessuna campagna con questo nome.' : 'Nessuna campagna ancora.' })); return; }
      const tb = h('tbody');
      list.forEach((c) => tb.append(h('tr', null,
        h('td', { text: c.nome }),
        h('td', { text: when(c.creato_il) }),
        h('td', { text: (c.fasi || []).map((x) => label(FASI, x)).join(', ') || '—' }),
        h('td', { text: String(c.inviati ?? 0) }),
        h('td', { text: String(c.falliti ?? 0) }))));
      hist.replaceChildren(h('div', { class: 'table-wrap', tabindex: '0', role: 'region', 'aria-label': 'Campagne inviate' },
        h('table', { class: 'ptable' }, h('thead', null, h('tr', null, ['Nome', 'Data', 'Fasi', 'Inviati', 'Non consegnati'].map((t) => h('th', { scope: 'col', text: t })))), tb)));
    };
    cerca.addEventListener('input', paint);
    call('/rest/v1/eliseo_campagne?select=creato_il,nome,titolo,fasi,destinatari,inviati,falliti&order=creato_il.desc&limit=20').then((list) => { tutte = list || []; paint(); }).catch(() => hist.replaceChildren(h('p', { class: 'pempty', text: 'Storico non disponibile.' })));
    return [pageHead('Campagne', cerca), card('Nuova campagna', h('p', { class: 'pcard__note', text: 'Arriva come avviso sul telefono (gratis). Solo ai contatti che hanno dato il consenso, hanno un account sul sito e hanno attivato le notifiche.' }), f), hist];
  }


  // Importazione da CSV (per esempio i contatti esportati da Keplero). Il consenso resta «no» per tutti.
  function openImport() {
    const file = h('input', { type: 'file', accept: '.csv,.tsv,.txt,text/csv', 'aria-label': 'File CSV' });
    const fonte = select('fonte', FONTI, 'whatsapp');
    const etic = h('input', { name: 'etichetta', maxlength: 30, value: 'keplero', autocomplete: 'off' });
    const info = h('p', { class: 'pcard__note', 'aria-live': 'polite', text: 'Scegli il file. Nella prima riga servono i nomi delle colonne: Nome, Email, Telefono (anche Cognome e Note).' });
    const go = h('button', { type: 'button', class: 'btn btn--primary', text: 'Importa', disabled: true });
    const back = h('button', { type: 'button', class: 'btn btn--secondary', text: 'Chiudi' });
    back.addEventListener('click', () => { tab = 'elenco'; draw(); });
    let table = null, plan = null;
    const replan = () => {
      if (!table) return;
      plan = mapImport(table, rows, { fonte: fonte.value, etichetta: hasTags ? etic.value : '' });
      if (!hasTags) plan.nuovi.forEach((r) => delete r.etichette);
      info.textContent = plan.errore || `${plan.nuovi.length} contatti nuovi · ${plan.doppi} già presenti (non toccati) · ${plan.scartati} righe senza nome, email o telefono validi. Il consenso marketing resta «no» per tutti.`;
      go.disabled = !plan.nuovi.length;
    };
    file.addEventListener('change', async () => {
      const f = file.files?.[0]; if (!f) return;
      if (f.size > 2_000_000) { info.textContent = 'File troppo grande (massimo 2 MB).'; return; }
      table = parseCsv(await f.text()); replan();
    });
    fonte.addEventListener('change', replan); etic.addEventListener('change', replan);
    go.addEventListener('click', async () => {
      if (!plan?.nuovi.length) return;
      go.disabled = true; let fatti = 0;
      try {
        for (let i = 0; i < plan.nuovi.length; i += 200) {
          const part = await call('/rest/v1/eliseo_contatti', { method: 'POST', body: plan.nuovi.slice(i, i + 200), prefer: 'return=representation' }) || [];
          fatti += part.length; info.textContent = `Importo… ${fatti} di ${plan.nuovi.length}`;
        }
        say(`${fatti} contatti importati (consenso: no).`); await load(); tab = 'elenco'; draw();
      } catch (e) { info.textContent = `Importazione fermata dopo ${fatti} contatti: ${e.message}`; await load(); }
    });
    const field = (lab, input, hint) => h('div', { class: 'field' }, h('label', null, h('span', { text: lab }), input), hint ? h('p', { class: 'field__hint', text: hint }) : null);
    body.replaceChildren(card('Importa contatti da CSV',
      h('p', { class: 'pcard__note', text: 'Per esempio i contatti esportati da Keplero o da un foglio Google. Chi c’è già (stessa email o stesso telefono) non viene toccato.' }),
      h('div', { class: 'el-grid' }, field('File', file), field('Da dove arrivano', fonte), hasTags ? field('Etichetta per tutti', etic, 'Così li ritrovi dopo.') : null),
      info, h('div', { class: 'actions' }, go, back)));
  }

  // Modelli di messaggio: testi pronti da usare nella casella (WhatsApp ed email) e nelle campagne.
  function drawModelli() {
    if (!modelli) return [card('Modelli', h('p', { class: 'pcard__note', text: 'Manca un passaggio una tantum: va eseguito il file supabase/eliseo-liste-modelli.sql in Supabase (lo fa Eliseo). Poi ricarica la pagina.' }))];
    const field = (lab, input, hint) => h('div', { class: 'field' }, h('label', null, h('span', { text: lab }), input), hint ? h('p', { class: 'field__hint', text: hint }) : null);
    const form = (m) => {
      const f = h('form', { class: 'el-form', novalidate: true });
      const nome = h('input', { name: 'nome', maxlength: 60, value: m?.nome || '', required: true });
      const cat = select('categoria', CATEGORIE, m?.categoria || 'altro');
      const testo = h('textarea', { name: 'testo', maxlength: 1000, rows: 4, required: true }); testo.value = m?.testo || '';
      const prova = h('p', { class: 'pcard__note el-preview' });
      const upd = () => { prova.textContent = testo.value ? `Anteprima: ${fillTemplate(testo.value, { nome: 'Luca Rossi', barbiere: team[0]?.nome || 'Maurizio' })}` : ''; };
      testo.addEventListener('input', upd); upd();
      const err = h('p', { class: 'field__error', role: 'alert' });
      const save = h('button', { type: 'submit', class: 'btn btn--primary', text: m ? 'Salva' : 'Aggiungi modello' });
      const acts = h('div', { class: 'actions' }, save);
      if (m) {
        let armed = false; const del = h('button', { type: 'button', class: 'btn btn--secondary el-del', text: 'Elimina' });
        del.addEventListener('click', async () => {
          if (!armed) { armed = true; del.textContent = 'Conferma: elimina'; del.classList.add('is-armed'); return; }
          try { await call(`/rest/v1/eliseo_modelli?id=eq.${m.id}`, { method: 'DELETE' }); modelli = modelli.filter((x) => x.id !== m.id); say('Modello eliminato.'); draw(); } catch (e) { err.textContent = e.message; }
        });
        const copy = h('button', { type: 'button', class: 'btn btn--secondary', text: 'Copia il testo' });
        copy.addEventListener('click', async () => { try { await navigator.clipboard.writeText(m.testo); say('Testo copiato.'); } catch { say('Non riesco a copiare: seleziona il testo a mano.', true); } });
        acts.append(copy, del);
      }
      f.append(h('div', { class: 'el-grid' }, field('Nome', nome), field('Tipo', cat)), field('Testo', testo, '{nome} diventa il nome del cliente, {barbiere} il barbiere. Massimo 1000 caratteri. Mai dati sulla salute.'), prova, err, acts);
      f.addEventListener('submit', async (e) => {
        e.preventDefault();
        const { row, ok, errors } = cleanTemplate({ nome: nome.value, categoria: cat.value, testo: testo.value });
        if (!ok) { err.textContent = Object.values(errors).join(' '); return; }
        save.disabled = true;
        try {
          if (m) { const [u] = await call(`/rest/v1/eliseo_modelli?id=eq.${m.id}`, { method: 'PATCH', body: row, prefer: 'return=representation' }); Object.assign(m, u); }
          else { const [n] = await call('/rest/v1/eliseo_modelli', { method: 'POST', body: row, prefer: 'return=representation' }); modelli.push(n); }
          say('Modello salvato.'); draw();
        } catch (ex) { err.textContent = ex.message; save.disabled = false; }
      });
      return f;
    };
    const list = h('div', { class: 'el-models' });
    if (!modelli.length) list.append(h('p', { class: 'pempty', text: 'Nessun modello. Aggiungine uno qui sotto.' }));
    CATEGORIE.forEach(([k, t]) => {
      const group = modelli.filter((m) => m.categoria === k);
      if (!group.length) return;
      list.append(h('h4', { class: 'el-models__cat', text: t }));
      group.forEach((m) => list.append(h('details', { class: 'el-model' }, h('summary', null, h('strong', { text: m.nome }), h('span', { text: m.testo.slice(0, 90) + (m.testo.length > 90 ? '…' : '') })), form(m))));
    });
    return [card('Modelli di messaggio', h('p', { class: 'pcard__note', text: 'Testi pronti, come le FAQ-modello di Keplero. Nella casella scegli un modello e si apre WhatsApp o l’email con il testo già scritto.' }), list), card('Nuovo modello', form(null))];
  }

  // Casella unica: chat del sito e richieste del modulo, stile console Keplero completa
  const STATI = [['aperta', 'Aperta'], ['in_corso', 'In corso'], ['chiusa', 'Chiusa']];
  const MOTIVI = { informazioni: 'Informazioni', formazione: 'Formazione', lavoro: 'Lavoro', regalo: 'Regalo' };
  const casellaFiltro = { vista: 'tutte', chi: '', q: '', cartella: '', ord: 'recenti' };
  let casellaPick = '';
  const iniziale = (nome) => (String(nome || '?').trim().charAt(0) || '?').toUpperCase();
  const tono = (nome) => Array.from(String(nome || '?')).reduce((n, ch) => n + ch.charCodeAt(0), 0) % 5;

  function drawCasella() {
    const wrap = h('div', { class: 'el-conv' }, h('p', { class: 'pempty', text: 'Carico…' }));
    (async () => {
      let chats = [], reqs = [], stati = [], reqOk = true, perche = '';
      try { chats = await call('/rest/v1/chat_clienti?select=cliente_id,nome,ultimo_msg,ultimo_da_cliente,letto_admin&order=ultimo_msg.desc.nullslast&limit=200') || []; } catch { chats = []; }
      try { reqs = await call('/rest/v1/eliseo_richieste?select=*&order=creato_il.desc&limit=200') || []; } catch (e) { reqOk = false; perche = e.message === 'sql' ? 'tabella non trovata' : `errore ${call.last || ''}`.trim(); }
      try { stati = await call('/rest/v1/eliseo_casella_stato?select=*') || []; } catch (e) { reqOk = false; perche = perche || (e.message === 'sql' ? 'tabella non trovata' : `errore ${call.last || ''}`.trim()); }
      const st = new Map(stati.map((x) => [`${x.tipo}:${x.rif}`, x]));

      const items = [
        ...chats.filter((c) => c.ultimo_msg).map((c) => ({ tipo: 'chat', rif: c.cliente_id, nome: c.nome, quando: c.ultimo_msg, nuovo: !!(c.ultimo_da_cliente && (!c.letto_admin || c.ultimo_da_cliente > c.letto_admin)) })),
        ...reqs.map((r) => ({ tipo: 'richiesta', rif: r.id, nome: r.nome, quando: r.creato_il, nuovo: !st.has(`richiesta:${r.id}`), r })),
      ].map((x) => ({ ...x, s: st.get(`${x.tipo}:${x.rif}`) || { stato: 'aperta', assegnato: null, contatto_id: null, cartella: null }, key: '' }));

      items.forEach((x) => { x.key = `${x.tipo}:${x.rif}`; });

      // Cartelle disponibili
      const cartelleDisp = [...new Set(stati.map((x) => x.cartella).filter(Boolean))].sort();

      const nelTeam = (x) => !casellaFiltro.chi || (casellaFiltro.chi === '__none' ? !x.s.assegnato : x.s.assegnato === casellaFiltro.chi);
      const inVista = (x) => casellaFiltro.vista === 'tutte'
        || (casellaFiltro.vista === 'nuove' && x.nuovo)
        || (casellaFiltro.vista === 'aperte' && x.s.stato !== 'chiusa')
        || (casellaFiltro.vista === 'richieste' && x.tipo === 'richiesta')
        || (casellaFiltro.vista === 'chiuse' && x.s.stato === 'chiusa');
      const inCartella = (x) => !casellaFiltro.cartella || (x.s.cartella || '') === casellaFiltro.cartella;

      const teamRows = items.filter(nelTeam);
      const counts = {
        tutte: teamRows.length,
        nuove: teamRows.filter((x) => x.nuovo).length,
        aperte: teamRows.filter((x) => x.s.stato !== 'chiusa').length,
        richieste: teamRows.filter((x) => x.tipo === 'richiesta').length,
        chiuse: teamRows.filter((x) => x.s.stato === 'chiusa').length
      };

      const saveState = async (x, patch) => {
        try {
          const [row] = await call('/rest/v1/eliseo_casella_stato?on_conflict=tipo,rif', {
            method: 'POST',
            body: { tipo: x.tipo, rif: x.rif, stato: x.s.stato, assegnato: x.s.assegnato, contatto_id: x.s.contatto_id, cartella: x.s.cartella || null, ...patch },
            prefer: 'resolution=merge-duplicates,return=representation'
          });
          Object.assign(x.s, row);
          say('Casella aggiornata.');
        } catch (e) {
          say(e.message === 'sql' ? 'Manca il file supabase/eliseo-casella.sql in Supabase.' : e.message, true);
        }
      };

      let waConnected = false;
      try { waConnected = localStorage.getItem('eliseo_wa_connected') === '1'; } catch (_) {}
      let waPairToken = Date.now().toString(36);

      function openChannelModal() {
        const overlay = h('div', { class: 'el-chan-modal-overlay' });
        const modal = h('div', { class: 'el-chan-modal', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'el-chan-title' });

        const renderPick = () => {
          const head = h('div', { class: 'el-chan-modal__head' },
            h('strong', { id: 'el-chan-title', text: 'Scegli un canale per iniziare una nuova conversazione' }),
            h('button', { type: 'button', class: 'el-chan-modal__close', title: 'Chiudi', 'aria-label': 'Chiudi', text: '✕' })
          );
          head.querySelector('.el-chan-modal__close').addEventListener('click', () => overlay.remove());

          const btnWa = h('button', { type: 'button', class: 'el-chan-btn el-chan-btn--wa' }, icon('whatsapp'), h('span', { text: 'WhatsApp' }));
          btnWa.addEventListener('click', () => renderWaForm());

          const btnMail = h('button', { type: 'button', class: 'el-chan-btn el-chan-btn--email' }, icon('mail'), h('span', { text: 'Email' }));
          btnMail.addEventListener('click', () => renderMailForm());

          const grid = h('div', { class: 'el-chan-grid' }, btnWa, btnMail);
          const body = h('div', { class: 'el-chan-modal__body' }, grid);

          modal.replaceChildren(head, body);
        };

        const renderWaForm = () => {
          const head = h('div', { class: 'el-chan-modal__head' },
            h('strong', { id: 'el-chan-title', text: 'Nuova conversazione WhatsApp' }),
            h('button', { type: 'button', class: 'el-chan-modal__close', title: 'Chiudi', 'aria-label': 'Chiudi', text: '✕' })
          );
          head.querySelector('.el-chan-modal__close').addEventListener('click', () => overlay.remove());

          const selContatto = select('destinatario', [
            ['', '— Inserisci nuovo numero —'],
            ...rows.filter((r) => r.telefono).map((r) => [r.telefono, `${r.nome} (${r.telefono})`])
          ], '', { class: 'field__input', 'aria-label': 'Seleziona contatto' });

          const telInp = h('input', { type: 'tel', class: 'field__input', placeholder: '+39 3...', value: '+39 ' });
          const nomeInp = h('input', { type: 'text', class: 'field__input', placeholder: 'Nome cliente (es. Mario)' });
          const msgInp = h('textarea', { class: 'field__input', rows: '3', placeholder: 'Scrivi un messaggio iniziale (opzionale)...' });

          selContatto.addEventListener('change', () => {
            if (selContatto.value) {
              const f = rows.find((r) => r.telefono === selContatto.value);
              if (f) {
                telInp.value = f.telefono;
                nomeInp.value = f.nome;
              }
            }
          });

          const sendBtn = h('button', { type: 'button', class: 'btn btn--primary', text: 'Avvia conversazione WhatsApp' });
          sendBtn.addEventListener('click', () => {
            const cleanTel = telInp.value.replace(/[^\d+]/g, '');
            if (!cleanTel || cleanTel.length < 8) {
              say('Inserisci un numero di telefono valido.', true);
              return;
            }
            const nomeFinal = nomeInp.value.trim() || 'Cliente WhatsApp';
            const msgFinal = msgInp.value.trim() || 'Conversazione WhatsApp avviata';
            const rif = 'wa_' + cleanTel.replace(/\+/g, '');
            const key = 'chat:' + rif;

            let existing = items.find((it) => it.key === key || it.rif === rif);
            if (!existing) {
              existing = {
                key,
                tipo: 'chat',
                rif,
                nome: nomeFinal,
                contatto: cleanTel,
                preview: msgFinal,
                quando: new Date().toISOString(),
                nuovo: false,
                s: { stato: 'aperta', assegnato: null, cartella: null, contatto_id: null }
              };
              items.unshift(existing);
            } else {
              existing.preview = msgFinal;
              existing.quando = new Date().toISOString();
            }

            casellaPick = existing.key;
            overlay.remove();
            say(`Conversazione con ${nomeFinal} pronta su Eliseo.`);
            paint();
          });

          const formBox = h('div', { class: 'el-chan-modal__body el-chan-form' },
            h('label', { class: 'field' }, h('span', { text: 'Contatto salvato' }), selContatto),
            h('label', { class: 'field' }, h('span', { text: 'Numero WhatsApp' }), telInp),
            h('label', { class: 'field' }, h('span', { text: 'Nome' }), nomeInp),
            h('label', { class: 'field' }, h('span', { text: 'Messaggio iniziale' }), msgInp),
            h('div', { class: 'el-chan-form__acts' },
              h('button', { type: 'button', class: 'btn btn--secondary', text: 'Indietro', click: () => renderPick() }),
              sendBtn
            )
          );
          formBox.querySelector('button.btn--secondary').addEventListener('click', () => renderPick());
          modal.replaceChildren(head, formBox);
        };

        const renderMailForm = () => {
          const head = h('div', { class: 'el-chan-modal__head' },
            h('strong', { id: 'el-chan-title', text: 'Nuova email dal CRM' }),
            h('button', { type: 'button', class: 'el-chan-modal__close', title: 'Chiudi', 'aria-label': 'Chiudi', text: '✕' })
          );
          head.querySelector('.el-chan-modal__close').addEventListener('click', () => overlay.remove());

          const selContatto = select('destinatario', [
            ['', '— Inserisci nuova email —'],
            ...rows.filter((r) => r.email).map((r) => [r.email, `${r.nome} (${r.email})`])
          ], '', { class: 'field__input', 'aria-label': 'Seleziona contatto' });

          const emailInp = h('input', { type: 'email', class: 'field__input', placeholder: 'cliente@email.it' });
          const nomeInp = h('input', { type: 'text', class: 'field__input', placeholder: 'Nome cliente' });
          const oggInp = h('input', { type: 'text', class: 'field__input', placeholder: 'Oggetto' });
          const testoInp = h('textarea', { class: 'field__input', rows: '4', placeholder: 'Messaggio...' });

          selContatto.addEventListener('change', () => {
            if (selContatto.value) {
              const f = rows.find((r) => r.email === selContatto.value);
              if (f) {
                emailInp.value = f.email;
                nomeInp.value = f.nome;
              }
            }
          });

          const sendBtn = h('button', { type: 'button', class: 'btn btn--primary', text: 'Prepara email' });
          sendBtn.addEventListener('click', () => {
            if (!emailInp.value || !emailInp.value.includes('@')) {
              say('Inserisci un indirizzo email valido.', true);
              return;
            }
            const nomeFinal = nomeInp.value.trim() || 'Cliente';
            const oggFinal = oggInp.value.trim() || 'Comunicazione da Maurizio Barber Shop';
            const testoFinal = testoInp.value.trim();
            const mailto = `mailto:${encodeURIComponent(emailInp.value)}?subject=${encodeURIComponent(oggFinal)}&body=${encodeURIComponent(testoFinal)}`;
            window.open(mailto, '_blank');
            overlay.remove();
            say(`Email preparata per ${nomeFinal}.`);
          });

          const formBox = h('div', { class: 'el-chan-modal__body el-chan-form' },
            h('label', { class: 'field' }, h('span', { text: 'Contatto' }), selContatto),
            h('label', { class: 'field' }, h('span', { text: 'Email' }), emailInp),
            h('label', { class: 'field' }, h('span', { text: 'Nome' }), nomeInp),
            h('label', { class: 'field' }, h('span', { text: 'Oggetto' }), oggInp),
            h('label', { class: 'field' }, h('span', { text: 'Messaggio' }), testoInp),
            h('div', { class: 'el-chan-form__acts' },
              h('button', { type: 'button', class: 'btn btn--secondary', text: 'Indietro' }),
              sendBtn
            )
          );
          formBox.querySelector('button.btn--secondary').addEventListener('click', () => renderPick());
          modal.replaceChildren(head, formBox);
        };

        renderPick();
        overlay.append(modal);
        overlay.addEventListener('click', (ev) => {
          if (ev.target === overlay) overlay.remove();
        });
        root.append(overlay);
      }

      // --- ASIDE: MENU LATERALE DELLA CASELLA (STILE KEPLERO) ---
      const side = h('aside', { class: 'el-conv__side' });

      // Header laterale con "+" per nuovo messaggio/contatto
      const sideHead = h('div', { class: 'el-conv__sidehead' },
        h('strong', { text: 'Conversazioni' }),
        h('button', {
          type: 'button',
          class: 'el-side-iconbtn',
          title: 'Nuovo contatto o messaggio',
          'aria-label': 'Nuovo contatto o messaggio'
        }, icon('plus'))
      );
      sideHead.querySelector('button').addEventListener('click', () => openChannelModal());

      // Sezione TEAM con avatar colorati
      const teamHead = h('p', { class: 'el-group el-group--collapsible' }, h('span', { text: 'Team' }), h('span', { class: 'el-group__chev', text: '▾' }));
      const teamBox = h('div', { class: 'el-folders', role: 'group', 'aria-label': 'Team' });

      const teamBtn = (val, nome, n, initial = '', tone = 0, isSpecial = false) => {
        const av = isSpecial
          ? h('span', { class: 'el-side-av el-side-av--muted' }, initial ? h('span', { text: initial }) : null)
          : h('span', { class: 'el-side-av', 'data-tone': String(tone) }, h('span', { text: initial || iniziale(nome) }));
        const b = h('button', {
          type: 'button',
          class: 'el-folder el-folder--av',
          'aria-pressed': casellaFiltro.chi === val ? 'true' : 'false'
        }, av, h('span', { class: 'el-folder__txt', text: nome }), h('b', { text: String(n) }));
        b.addEventListener('click', () => { casellaFiltro.chi = val; draw(); });
        teamBox.append(b);
      };

      teamBtn('', 'Tutti', items.length, '', 0, true);
      teamBtn('__none', 'Non assegnato', items.filter((x) => !x.s.assegnato).length, '', 0, true);
      team.forEach((p, idx) => {
        teamBtn(p.nome, p.nome, items.filter((x) => x.s.assegnato === p.nome).length, iniziale(p.nome), idx % 5);
      });

      // Sezione STATI con icone colorate autentiche stile Keplero
      const statiHead = h('p', { class: 'el-group el-group--collapsible' }, h('span', { text: 'Stati' }), h('span', { class: 'el-group__chev', text: '▾' }));
      const statiBox = h('div', { class: 'el-folders', role: 'group', 'aria-label': 'Stati' });

      const STATI_CFG = [
        ['aperte', 'Aperti', 'checkCircle', 'st-aperti'],
        ['nuove', 'Da Leggere', 'alertCircle', 'st-nuove'],
        ['richieste', 'Richieste di supporto', 'headset', 'st-richieste'],
        ['chiuse', 'Chiuso', 'checkCircle', 'st-chiuse']
      ];

      STATI_CFG.forEach(([k, t, icName, cssClass]) => {
        const ic = h('span', { class: `el-status-ic ${cssClass}` }, icon(icName));
        const b = h('button', {
          type: 'button',
          class: 'el-folder el-folder--st',
          'aria-pressed': casellaFiltro.vista === k ? 'true' : 'false'
        }, ic, h('span', { class: 'el-folder__txt', text: t }), h('b', { text: String(counts[k] ?? 0) }));
        b.addEventListener('click', () => { casellaFiltro.vista = k; draw(); });
        statiBox.append(b);
      });

      // Sezione CARTELLE con ricerca e creazione rapida
      let cartellaSearchOpen = false;
      const cartellaSearchInput = h('input', {
        type: 'search',
        class: 'el-search el-cartella-search',
        placeholder: 'Cerca cartella…',
        'aria-label': 'Cerca cartella'
      });
      cartellaSearchInput.style.display = 'none';

      const searchCartellaBtn = h('button', {
        type: 'button',
        class: 'el-side-iconbtn',
        title: 'Cerca cartella',
        'aria-label': 'Cerca cartella'
      }, icon('search'));

      const addCartellaBtn = h('button', {
        type: 'button',
        class: 'el-side-iconbtn',
        title: 'Nuova cartella',
        'aria-label': 'Nuova cartella'
      }, icon('plus'));

      searchCartellaBtn.addEventListener('click', () => {
        cartellaSearchOpen = !cartellaSearchOpen;
        cartellaSearchInput.style.display = cartellaSearchOpen ? 'block' : 'none';
        if (cartellaSearchOpen) cartellaSearchInput.focus();
        else { cartellaSearchInput.value = ''; redrawCartelle(); }
      });

      addCartellaBtn.addEventListener('click', () => {
        const nome = prompt('Nome della nuova cartella:');
        if (!nome?.trim()) return;
        const val = nome.trim().slice(0, 60);
        if (!cartelleDisp.includes(val)) {
          cartelleDisp.push(val);
          cartelleDisp.sort();
        }
        redrawCartelle(cartellaSearchInput.value);
      });

      const cartelleHead = h('div', { class: 'el-group el-group--tools' },
        h('span', { text: 'Cartelle' }),
        h('div', { class: 'el-group__acts' }, searchCartellaBtn, addCartellaBtn)
      );

      const cartelleBox = h('div', { class: 'el-folders', role: 'group', 'aria-label': 'Cartelle' });

      const redrawCartelle = (q = '') => {
        cartelleBox.replaceChildren();
        const foldIc = h('span', { class: 'el-status-ic st-folder' }, icon('folder'));
        const tutteB = h('button', {
          type: 'button',
          class: 'el-folder el-folder--cart',
          'aria-pressed': !casellaFiltro.cartella ? 'true' : 'false'
        }, foldIc, h('span', { class: 'el-folder__txt', text: 'Tutte le cartelle' }), h('b', { text: String(items.length) }));
        tutteB.addEventListener('click', () => { casellaFiltro.cartella = ''; draw(); });
        cartelleBox.append(tutteB);

        const qLow = q.toLowerCase();
        (qLow ? cartelleDisp.filter((c) => c.toLowerCase().includes(qLow)) : cartelleDisp).forEach((c) => {
          const num = items.filter((x) => (x.s.cartella || '') === c).length;
          const subIc = h('span', { class: 'el-status-ic st-folder' }, icon('folder'));
          const b = h('button', {
            type: 'button',
            class: 'el-folder el-folder--cart',
            'aria-pressed': casellaFiltro.cartella === c ? 'true' : 'false'
          }, subIc, h('span', { class: 'el-folder__txt', text: c }), h('b', { text: String(num) }));
          b.addEventListener('click', () => { casellaFiltro.cartella = c; draw(); });
          cartelleBox.append(b);
        });
      };

      redrawCartelle();
      cartellaSearchInput.addEventListener('input', () => redrawCartelle(cartellaSearchInput.value));

      side.append(
        sideHead,
        teamHead, teamBox,
        statiHead, statiBox,
        cartelleHead, cartellaSearchInput, cartelleBox
      );

      // --- COLONNA CENTRALE: LISTA CONVERSAZIONI ---
      const listCol = h('div', { class: 'el-conv__list' });
      const topRow = h('div', { class: 'el-conv__top' },
        h('div', { class: 'el-conv__titlebox' },
          icon('chat'),
          h('strong', { text: 'Conversazioni' })),
        h('div', { class: 'el-conv__topacts' },
          h('button', { type: 'button', class: 'el-top-iconbtn', title: 'Cerca', 'aria-label': 'Cerca' }, icon('search')),
          h('button', { type: 'button', class: 'el-top-iconbtn', title: 'Filtra', 'aria-label': 'Filtra' }, icon('funnel')))
      );

      // Selettore ordinamento (es. "Dai più recenti ▾")
      const sortSel = select('ordine', [['recenti', 'Dai più recenti ▾'], ['meno_recenti', 'Dai meno recenti ▾']], casellaFiltro.ord, { class: 'el-conv__sort', 'aria-label': 'Ordinamento' });
      sortSel.addEventListener('change', () => {
        casellaFiltro.ord = sortSel.value;
        paint();
      });

      const sortBar = h('div', { class: 'el-conv__sortbar' }, sortSel);

      const cerca = h('input', {
        type: 'search',
        class: 'el-search el-conv__searchfield',
        placeholder: 'Cerca nome, numero o messaggio',
        'aria-label': 'Cerca nella casella',
        value: casellaFiltro.q
      });

      const rowsBox = h('div', { class: 'el-conv__rows' });
      const detail = h('div', { class: 'el-conv__detail' });

      const note = reqOk ? null : h('p', { class: 'pcard__note', text: perche === 'tabella non trovata' ? 'Per stati e richieste del modulo va eseguito il file supabase/eliseo-casella.sql in Supabase.' : `Stati e richieste non disponibili ora (${perche}).` });
      const off = root.closest('[data-auth-page]')?.dataset.salvaRichieste === '1' ? null : h('p', { class: 'pcard__note', text: 'Le richieste del modulo di contatto per ora arrivano per email. Si salveranno anche qui quando l’informativa privacy sarà aggiornata con l’avvocato.' });

      function paintDetail(shown) {
        const x = shown.find((it) => it.key === casellaPick);
        if (!x) {
          const pairCard = h('div', { class: 'el-wa-pair' },
            h('div', { class: 'el-wa-pair__header' },
              h('div', { class: 'el-wa-badge' }, icon('whatsapp'), h('span', { text: 'WhatsApp del Salone' })),
              h('div', { class: `el-wa-status ${waConnected ? 'el-wa-status--connected' : 'el-wa-status--waiting'}` },
                h('span', { class: waConnected ? 'el-wa-status__dot' : 'el-wa-status__pulse' }),
                h('span', { text: waConnected ? 'Connesso: +39 347 186 1673' : 'In attesa di scansione...' })
              )
            ),
            h('div', { class: 'el-wa-pair__titles' },
              h('h3', { text: 'Collega il WhatsApp di Maurizio a Eliseo' }),
              h('p', { text: 'Inquadra il codice QR con lo smartphone del salone da WhatsApp → Dispositivi collegati per ricevere e rispondere a tutti i messaggi direttamente dentro Eliseo.' })
            ),
            h('div', { class: 'el-wa-pair__content' },
              h('div', { class: 'el-wa-qr__col' },
                h('div', { class: 'el-wa-qr__box' },
                  h('p', { class: 'pcard__note', text: 'Caricamento codice QR live...' })
                ),
                h('div', { class: 'el-wa-qr__acts' },
                  h('button', { type: 'button', class: 'btn btn--secondary btn--sm', title: 'Aggiorna QR' }, icon('refresh'), h('span', { text: 'Aggiorna QR' })),
                  h('button', { type: 'button', class: 'btn btn--secondary btn--sm', text: waConnected ? 'Scollega' : 'Verifica stato' })
                )
              ),
              h('div', { class: 'el-wa-steps' },
                h('div', { class: 'el-wa-step' },
                  h('span', { class: 'el-wa-step__num', text: '1' }),
                  h('div', null, h('strong', { text: 'Apri WhatsApp' }), h('p', { text: 'Sul telefono del salone (+39 347 186 1673)' }))
                ),
                h('div', { class: 'el-wa-step' },
                  h('span', { class: 'el-wa-step__num', text: '2' }),
                  h('div', null, h('strong', { text: 'Menu o Impostazioni' }), h('p', { text: 'Tocca i tre puntini ⋮ (Android) o Impostazioni ⚙️ (iPhone)' }))
                ),
                h('div', { class: 'el-wa-step' },
                  h('span', { class: 'el-wa-step__num', text: '3' }),
                  h('div', null, h('strong', { text: 'Dispositivi collegati' }), h('p', { text: 'Tocca "Collega un dispositivo"' }))
                ),
                h('div', { class: 'el-wa-step' },
                  h('span', { class: 'el-wa-step__num', text: '4' }),
                  h('div', null, h('strong', { text: 'Inquadra il codice QR qui sopra' }), h('p', { text: 'La connessione WhatsApp si sincronizzerà direttamente dentro Eliseo' }))
                )
              )
            ),
            h('div', { class: 'el-wa-pair__footer' },
              h('span', { text: '💬 In alternativa, seleziona una conversazione dall’elenco a sinistra per visualizzarla.' })
            )
          );

          const qrBox = pairCard.querySelector('.el-wa-qr__box');
          const refreshBtn = pairCard.querySelectorAll('.el-wa-qr__acts button')[0];
          const verifyBtn = pairCard.querySelectorAll('.el-wa-qr__acts button')[1];

          async function loadLiveQr() {
            qrBox.replaceChildren(h('p', { class: 'pcard__note', text: 'Caricamento QR da Green API...' }));
            try {
              const res = await fetch('/api/wa-login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'qr', phone: '3471861673' }), cache: 'no-store' });
              const data = await res.json();
              if (data.ok && data.state === 'authorized') {
                waConnected = true;
                try { localStorage.setItem('eliseo_wa_connected', '1'); } catch (_) {}
                const statusDiv = pairCard.querySelector('.el-wa-status');
                statusDiv.className = 'el-wa-status el-wa-status--connected';
                statusDiv.replaceChildren(
                  h('span', { class: 'el-wa-status__dot' }),
                  h('span', { text: 'Connesso: +39 347 186 1673' })
                );
                qrBox.replaceChildren(
                  h('div', { class: 'el-wa-connected-box', style: 'text-align: center; padding: 16px;' },
                    icon('checkCircle'),
                    h('p', { style: 'margin: 8px 0 0; font-weight: 700; color: var(--console-ok);', text: 'WhatsApp collegato con successo!' }),
                    h('p', { style: 'margin: 4px 0 0; font-size: 12px; color: var(--console-quiet);', text: 'Tutti i messaggi arrivano direttamente in questa console.' })
                  )
                );
                verifyBtn.textContent = 'Scollega';
                return;
              }

              if (data.ok && data.qrBase64) {
                const img = h('img', {
                  src: 'data:image/png;base64,' + data.qrBase64,
                  alt: 'Codice QR per collegare WhatsApp',
                  style: 'width: 170px; height: 170px; object-fit: contain; display: block;'
                });
                qrBox.replaceChildren(img);
                return;
              }

              // Fallback se Green API non è ancora configurata con token
              const warnBox = h('div', { style: 'text-align: center; padding: 12px;' },
                icon('whatsapp'),
                h('p', { style: 'margin: 8px 0 0; font-size: 12.5px; font-weight: 600;', text: 'In attesa di credenziali Green API' }),
                h('p', { style: 'margin: 4px 0 0; font-size: 11px; color: var(--console-quiet);', text: data.error || 'Configura GREEN_API_URL e GREEN_API_TOKEN su Vercel.' })
              );
              qrBox.replaceChildren(warnBox);
            } catch (err) {
              qrBox.replaceChildren(h('p', { class: 'pcard__note', text: 'Non è stato possibile caricare il QR code al momento.' }));
            }
          }

          refreshBtn.addEventListener('click', () => {
            loadLiveQr();
            say('Aggiornamento QR code in corso...');
          });

          verifyBtn.addEventListener('click', () => {
            if (waConnected) {
              waConnected = false;
              try { localStorage.setItem('eliseo_wa_connected', '0'); } catch (_) {}
              say('WhatsApp scollegato.');
              paintDetail(shown);
            } else {
              loadLiveQr();
              say('Controllo connessione in corso...');
            }
          });

          loadLiveQr();

          detail.replaceChildren(pairCard);
          return;
        }

        const stato = select('stato', STATI, x.s.stato, { 'aria-label': `Stato di ${x.nome}`, class: 'el-fase' });
        stato.addEventListener('change', async () => { await saveState(x, { stato: stato.value }); draw(); });

        const ass = select('assegnato', [['', 'Non assegnata'], ...team.map((p) => [p.nome, p.nome])], x.s.assegnato || '', { 'aria-label': `Assegna ${x.nome}`, class: 'el-fase' });
        ass.addEventListener('change', async () => { await saveState(x, { assegnato: ass.value || null }); draw(); });

        const cartOpts = [['', '— Nessuna cartella —'], ...cartelleDisp.map((c) => [c, c])];
        const cart = select('cartella', cartOpts, x.s.cartella || '', { 'aria-label': `Cartella di ${x.nome}`, class: 'el-fase' });
        cart.addEventListener('change', async () => {
          const val = cart.value || null;
          if (val && !cartelleDisp.includes(val)) { cartelleDisp.push(val); cartelleDisp.sort(); }
          await saveState(x, { cartella: val });
          redrawCartelle(cartellaSearchInput.value);
          draw();
        });

        const acts = h('div', { class: 'el-detail__act' });

        if (x.tipo === 'chat') {
          const open = h('button', { type: 'button', class: 'btn btn--secondary', text: 'Apri la chat' });
          open.addEventListener('click', () => {
            if (!x.s.contatto_id) saveState(x, {});
            root.querySelector('[data-nav="chat"]')?.click();
          });
          acts.append(open);
        } else {
          const contVal = x.r.contatto;
          const isEmail = contVal.includes('@');
          const base = isEmail
            ? `mailto:${contVal}`
            : `https://wa.me/${((d) => (d.startsWith('39') ? d : `39${d}`))(contVal.replace(/\D/g, ''))}`;
          const link = h('a', {
            class: 'btn btn--secondary',
            href: base,
            target: '_blank',
            rel: 'noopener noreferrer',
            text: isEmail ? 'Rispondi per email' : 'Rispondi su WhatsApp'
          });

          if (modelli?.length) {
            const pick = select('modello', [['', 'Senza modello'], ...modelli.map((m) => [m.id, m.nome])], '', { 'aria-label': `Modello per ${x.nome}`, class: 'el-fase' });
            pick.addEventListener('change', () => {
              const m = modelli.find((y) => y.id === pick.value);
              const t = m ? encodeURIComponent(fillTemplate(m.testo, { nome: x.r.nome })) : '';
              link.setAttribute('href', !t ? base : isEmail ? `${base}?body=${t}` : `${base}?text=${t}`);
            });
            acts.append(pick);
          }
          acts.append(link);
        }

        const linked = x.s.contatto_id || rows.some((r) => (x.tipo === 'chat' && r.user_id === x.rif));
        if (!linked) {
          const add = h('button', { type: 'button', class: 'btn btn--secondary', text: 'Aggiungi ai contatti' });
          add.addEventListener('click', async () => {
            const raw = x.tipo === 'chat'
              ? { nome: x.nome, fonte: 'sito', fase: 'contattato' }
              : { nome: x.r.nome, ...(x.r.contatto.includes('@') ? { email: x.r.contatto } : { telefono: x.r.contatto }), fonte: 'sito', fase: 'nuovo', note: `Richiesta dal sito: ${MOTIVI[x.r.motivo] || x.r.motivo}` };
            const { row, ok, errors } = cleanContact(raw);
            if (!ok) { say(Object.values(errors).join(' '), true); return; }
            try {
              const [ins] = await call('/rest/v1/eliseo_contatti', { method: 'POST', body: { ...row, ...(x.tipo === 'chat' ? { user_id: x.rif } : {}) }, prefer: 'return=representation' });
              rows.unshift(ins);
              drawStats();
              await saveState(x, { contatto_id: ins.id });
              say(`${ins.nome} aggiunto ai contatti.`);
              draw();
            } catch (e) { say(e.message, true); }
          });
          acts.append(add);
        }

        const kind = x.tipo === 'chat' ? 'Chat del sito' : `Modulo · ${MOTIVI[x.r.motivo] || ''}`.trim();

        detail.replaceChildren(
          h('header', { class: 'el-detail__head' },
            h('span', { class: 'el-av', 'data-tone': String(tono(x.nome)), 'aria-hidden': 'true', text: iniziale(x.nome) }),
            h('div', null,
              h('h2', { text: x.nome || 'Senza nome' }),
              h('p', { text: `${kind} · ${when(x.quando)}` }))),
          x.nuovo ? h('span', { class: 'el-dot', text: 'Nuova' }) : null,
          x.tipo === 'richiesta'
            ? h('p', { class: 'el-detail__text', text: x.r.messaggio })
            : h('p', { class: 'pcard__note', text: 'Conversazione della chat del sito. Da qui si apre la chat e, se manca, si aggiunge la persona ai contatti.' }),
          h('div', { class: 'el-detail__ctrl' },
            h('label', { class: 'field' }, h('span', { text: 'Stato' }), stato),
            h('label', { class: 'field' }, h('span', { text: 'Assegnata a' }), ass)),
          h('div', { class: 'el-detail__ctrl el-detail__ctrl--full' },
            h('label', { class: 'field' }, h('span', { text: 'Cartella' }), cart)),
          acts
        );
      }

      function paint() {
        const q = cerca.value.trim().toLowerCase();
        casellaFiltro.q = cerca.value;

        let shown = items
          .filter(nelTeam)
          .filter(inVista)
          .filter(inCartella)
          .filter((x) => !q || String(x.nome || '').toLowerCase().includes(q) || String(x.r?.messaggio || '').toLowerCase().includes(q));

        if (casellaFiltro.ord === 'meno_recenti') {
          shown.sort((a, b) => String(a.quando).localeCompare(String(b.quando)));
        } else {
          shown.sort((a, b) => String(b.quando).localeCompare(String(a.quando)));
        }

        rowsBox.replaceChildren();

        if (!shown.length) {
          rowsBox.append(h('p', { class: 'pempty', text: items.length ? 'Nessuna conversazione con questi filtri.' : 'La casella è vuota.' }));
        }

        shown.forEach((x) => {
          const anteprima = x.tipo === 'richiesta' ? String(x.r.messaggio || '').replace(/\s+/g, ' ').slice(0, 80) : 'Chat del sito';
          const isWa = x.tipo === 'richiesta' && !x.r.contatto?.includes('@');
          const chanIc = isWa
            ? h('span', { class: 'el-row__chan el-row__chan--wa', title: 'WhatsApp' }, icon('whatsapp'))
            : h('span', { class: 'el-row__chan el-row__chan--chat', title: 'Chat' }, icon('chat'));

          const dot = x.nuovo
            ? h('span', { class: 'el-row__dot', title: 'Non letto' })
            : (x.tipo === 'richiesta' ? h('span', { class: 'el-row__headset-ic', title: 'Richiesta di supporto' }, icon('headset')) : null);

          const row = h('button', { type: 'button', class: `el-row${x.key === casellaPick ? ' is-on' : ''}` },
            h('span', { class: 'el-av', 'data-tone': String(tono(x.nome)), 'aria-hidden': 'true', text: iniziale(x.nome) }),
            h('span', { class: 'el-row__body' },
              h('span', { class: 'el-row__top' },
                h('strong', { text: x.nome || 'Senza nome' }),
                h('span', { class: 'el-row__meta' }, dot, h('small', { text: when(x.quando) }))),
              h('span', { class: 'el-row__prev' },
                chanIc,
                h('span', { class: 'el-row__snippet', text: anteprima }))));

          row.addEventListener('click', () => { casellaPick = x.key; paint(); });
          rowsBox.append(row);
        });

        paintDetail(shown);
      }

      cerca.addEventListener('input', paint);

      listCol.append(
        topRow,
        sortBar,
        h('div', { class: 'el-conv__search' }, cerca),
        ...[note, off].filter(Boolean),
        rowsBox
      );

      wrap.replaceChildren(side, listCol, detail);
      wrap.classList.add('el-conv');
      paint();
    })();

    return [wrap];
  }

  function drawAnalisi() {
    const s = summary(rows);
    const kpi = (lab, n, nota) => h('article', { class: 'el-kpi' }, h('span', { text: lab }), h('b', { text: String(n) }), h('small', { text: nota }));
    body.replaceChildren(
      pageHead('Analisi'),
      h('p', { class: 'pcard__note', text: 'Questi sono i numeri della rubrica: contatti, consensi, nuovi e da richiamare. Non sono il conteggio delle chat in tempo reale.' }),
      h('div', { class: 'el-kpis' },
        kpi('Contatti', s.totale, 'in rubrica'),
        kpi('Con consenso', s.consenso, 'possono ricevere campagne'),
        kpi('Nuovi', s.nuovi, 'negli ultimi 7 giorni'),
        kpi('Da richiamare', s.richiamare, 'da sentire presto')));
  }

  function drawContatti() {
    const lista = h('button', { type: 'button', 'aria-pressed': tab !== 'colonne' ? 'true' : 'false', text: 'Lista' });
    const kanban = h('button', { type: 'button', 'aria-pressed': tab === 'colonne' ? 'true' : 'false', text: 'Kanban' });
    lista.addEventListener('click', () => { tab = 'elenco'; syncNav(); draw(); });
    kanban.addEventListener('click', () => { tab = 'colonne'; syncNav(); draw(); });
    const head = pageHead('Contatti', h('div', { class: 'el-switch', role: 'group', 'aria-label': 'Vista contatti' }, lista, kanban), h('span', { class: 'el-count', text: `${rows.length} contatti` }));
    const book = h('div', { class: 'el-book' }, h('aside', { class: 'el-book__side' }, h('p', { class: 'el-group', text: 'Cartelle' }), folderNav()));
    if (tab === 'colonne') {
      book.append(h('div', { class: 'el-book__main' }, toolbar(false), h('p', { class: 'pcard__note', text: 'Trascina una scheda in un’altra colonna, oppure usa «Sposta in».' }), drawColumns()));
      body.replaceChildren(head, book);
      return;
    }
    listBox = h('div');
    book.append(h('div', { class: 'el-book__main' }, toolbar(true), listBox));
    body.replaceChildren(head, book);
    drawList();
  }

  function drawPrenota() {
    const href = root.dataset.twUrl || 'https://www.treatwell.it/';
    body.replaceChildren(
      pageHead('Prenotazioni'),
      card(null,
        h('p', { class: 'pcard__note', text: 'Gli appuntamenti restano su Treatwell.' }),
        h('a', { class: 'btn', href, target: '_blank', rel: 'noopener noreferrer', text: 'Apri Treatwell' })));
  }

  function draw() {
    listBox = null;
    syncNav();
    if (tab === 'analisi') { drawAnalisi(); return; }
    if (tab === 'prenota') { drawPrenota(); return; }
    if (tab === 'colonne' || tab === 'elenco') { drawContatti(); return; }
    if (tab === 'campagne') { body.replaceChildren(...drawCampaigns()); return; }
    if (tab === 'casella') { body.replaceChildren(...drawCasella()); return; }
    if (tab === 'modelli') { body.replaceChildren(...drawModelli()); return; }
    const know = ['faq', 'sito', 'documenti', 'istruzioni', 'passaggio'];
    if (know.includes(tab) || ['automazioni', 'prova', 'integrazioni'].includes(tab)) {
      const here = tab;
      const which = know.includes(here) ? 'addestramento' : here;
      const titolo = { automazioni: 'Automazioni', prova: 'Chatbot', integrazioni: 'Integrazioni' }[which];
      body.replaceChildren(...(titolo ? [pageHead(titolo)] : []), h('p', { class: 'pempty', text: 'Carico…' }));
      import('./portal-eliseo-ai.js').then((m) => {
        if (tab !== here) return;
        const nodes = m.mountAi(which, { h, card, call, say, select, team, sub: know.includes(here) ? here : undefined });
        body.replaceChildren(...(titolo ? [pageHead(titolo)] : []), ...nodes);
      }).catch(() => body.replaceChildren(card(null, h('p', { class: 'pcard__note', text: 'Non riesco a caricare questa sezione. Riprova.' }))));
      return;
    }
    if (SETTINGS_IDS.includes(tab)) {
      const here = tab;
      body.replaceChildren(h('p', { class: 'pempty', text: 'Carico…' }));
      Promise.all([import('./portal-eliseo-settings.js'), sbc.user().catch(() => null)]).then(([m, user]) => {
        if (tab !== here) return;
        body.replaceChildren(...m.mountSettings(here, { h, card, call, say, team, user, sbc }));
      }).catch(() => body.replaceChildren(card(null, h('p', { class: 'pcard__note', text: 'Non riesco a caricare questa sezione. Riprova.' }))));
      return;
    }
    if (tab === 'importa') { openImport(); return; }
    drawContatti();
  }

  body.replaceChildren(card('Eliseo', h('p', { class: 'pempty', text: 'Carico…' })));
  load();
}
