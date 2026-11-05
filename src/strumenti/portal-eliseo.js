// Eliseo · Contatti e campagne: il CRM del portale (solo admin e co-founder).
// Funzioni come Keplero (rubrica, vista a colonne per fasi, campagne), grafica del sito. Tabelle in supabase/eliseo.sql.
// Regole: i contatti si aggiungono a mano o dagli iscritti al sito; nessun dato da Treatwell o Keplero.
// Il consenso marketing parte da «no». Le campagne vanno solo a chi ha detto sì e ha attivato le notifiche: lo controlla il server.
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

const PAGES = [['/', 'Home'], ['/#prenota', 'Prenota (dalla Home)'], ['/servizi/', 'Servizi'], ['/offerte/', 'Offerte'], ['/journal/', 'Journal'], ['/contatti/', 'Orari e contatti'], ['/formazione/', 'Formazione'], ['/galleria/', 'Galleria']];
const label = (list, v) => (list.find(([k]) => k === v) || [v, v])[1];
const when = (iso) => (iso ? new Date(iso).toLocaleDateString('it-IT', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Europe/Rome' }) : '—');

export function mount(box, root) {
  const auth = root.closest('[data-auth-page]');
  const url = auth.dataset.authUrl;
  const key = auth.dataset.authKey;
  const sbc = client({ url, key });
  const post = pushApi(root);
  let team = []; try { team = JSON.parse(root.dataset.team || '[]'); } catch { team = []; }
  let rows = [];
  let tab = 'casella';
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

  const status = h('p', { class: 'pcard__note', role: 'status', 'aria-live': 'polite' });
  const say = (t, bad) => { status.textContent = t; status.dataset.state = bad ? 'error' : 'ok'; };
  const body = h('div', { class: 'el-body' });
  const statsBox = h('div', { class: 'pd-stats pd-stats--4' });
  const tabs = h('div', { class: 'el-tabs', role: 'tablist', 'aria-label': 'Sezioni di Eliseo' });
  [['casella', 'Casella'], ['elenco', 'Contatti'], ['colonne', 'Fasi'], ['campagne', 'Campagne'], ['modelli', 'Modelli'], ['addestramento', 'Addestramento'], ['automazioni', 'Automazioni'], ['prova', 'Prova chatbot']].forEach(([id, t]) => {
    const b = h('button', { type: 'button', class: 'el-tab', role: 'tab', 'aria-selected': id === tab ? 'true' : 'false', 'data-tab': id, text: t });
    b.addEventListener('click', () => { tab = id; tabs.querySelectorAll('[data-tab]').forEach((x) => x.setAttribute('aria-selected', x.dataset.tab === tab ? 'true' : 'false')); draw(); });
    tabs.append(b);
  });
  const head = h('section', { class: 'pcard el-head' },
    h('div', { class: 'el-brand' }, h('span', { class: 'el-mark', 'aria-hidden': 'true', text: 'E' }), h('div', null, h('h3', { class: 'pcard__title', text: 'Eliseo' }), h('p', { class: 'pcard__note', text: 'Casella, contatti, campagne, addestramento e automazioni. Solo admin e co-founder.' }))),
    tabs);
  box.replaceChildren(head, statsBox, body, status);

  const stat = (l, v, n) => h('section', { class: 'pcard pstat pd-stat' }, h('p', { class: 'pstat__label', text: l }), h('p', { class: 'pstat__value', text: String(v) }), h('p', { class: 'pcard__note', text: n }));
  function drawStats() {
    const s = summary(rows);
    statsBox.replaceChildren(stat('Contatti', s.totale, 'in rubrica'), stat('Con consenso', s.consenso, 'possono ricevere campagne'), stat('Nuovi', s.nuovi, 'negli ultimi 7 giorni'), stat('Da richiamare', s.richiamare, 'da sentire presto'));
  }

  async function load() {
    try {
      rows = await call('/rest/v1/eliseo_contatti?select=*&order=aggiornato_il.desc&limit=2000') || [];
      hasTags = rows.length ? 'etichette' in rows[0] : await call('/rest/v1/eliseo_contatti?select=etichette&limit=1').then(() => true, () => false);
      modelli = await call('/rest/v1/eliseo_modelli?select=*&order=categoria,nome').catch(() => null);
      drawStats(); draw();
    } catch (e) {
      statsBox.replaceChildren();
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

  function toolbar() {
    const q = h('input', { type: 'search', class: 'el-search', placeholder: 'Cerca nome, email o telefono', 'aria-label': 'Cerca un contatto', value: filters.q });
    const fs = select('fase', [['', 'Tutte le fasi'], ...FASI], filters.fase, { 'aria-label': 'Filtra per fase' });
    const fo = select('fonte', [['', 'Tutte le fonti'], ...FONTI], filters.fonte, { 'aria-label': 'Filtra per fonte' });
    q.addEventListener('input', () => { filters.q = q.value; drawList(); });
    fs.addEventListener('change', () => { filters.fase = fs.value; drawList(); });
    fo.addEventListener('change', () => { filters.fonte = fo.value; drawList(); });
    const tagsAll = hasTags ? allTags(rows) : [];
    const et = tagsAll.length ? select('etichetta', [['', 'Tutte le etichette'], ...tagsAll.map((t) => [t, t])], filters.etichetta, { 'aria-label': 'Filtra per etichetta' }) : null;
    et?.addEventListener('change', () => { filters.etichetta = et.value; drawList(); });
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
    return h('div', { class: 'el-tools' }, q, fs, fo, et, h('div', { class: 'el-tools__act' }, add, imp, csv));
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
    FASI.forEach(([id, t]) => {
      const items = rows.filter((r) => r.fase === id);
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
    const hist = h('div', null, h('p', { class: 'pempty', text: 'Carico…' }));
    call('/rest/v1/eliseo_campagne?select=creato_il,nome,titolo,fasi,destinatari,inviati,falliti&order=creato_il.desc&limit=20').then((list) => {
      if (!list?.length) { hist.replaceChildren(h('p', { class: 'pempty', text: 'Nessuna campagna ancora.' })); return; }
      hist.replaceChildren(h('ul', { class: 'plist' }, list.map((c) => h('li', null, h('strong', { text: c.nome }), h('span', { text: `${when(c.creato_il)} · ${c.fasi.map((x) => label(FASI, x)).join(', ')} · ${c.inviati} inviati` })))));
    }).catch(() => hist.replaceChildren(h('p', { class: 'pempty', text: 'Storico non disponibile.' })));
    return [card('Nuova campagna', h('p', { class: 'pcard__note', text: 'Arriva come avviso sul telefono (gratis). Solo ai contatti che hanno dato il consenso, hanno un account sul sito e hanno attivato le notifiche.' }), f), card('Campagne inviate', hist)];
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

  // Casella unica (come la casella di Keplero): chat del sito e richieste del modulo, con stato e assegnazione.
  const STATI = [['aperta', 'Aperta'], ['in_corso', 'In corso'], ['chiusa', 'Chiusa']];
  const MOTIVI = { informazioni: 'Informazioni', formazione: 'Formazione', lavoro: 'Lavoro', regalo: 'Regalo' };
  const casellaFiltro = { vista: 'tutte', chi: '', q: '' };
  function drawCasella() {
    const wrap = h('div', null, h('p', { class: 'pempty', text: 'Carico…' }));
    (async () => {
      let chats = [], reqs = [], stati = [], reqOk = true, perche = '';
      try { chats = await call('/rest/v1/chat_clienti?select=cliente_id,nome,ultimo_msg,ultimo_da_cliente,letto_admin&order=ultimo_msg.desc.nullslast&limit=200') || []; } catch { chats = []; }
      try { reqs = await call('/rest/v1/eliseo_richieste?select=*&order=creato_il.desc&limit=200') || []; } catch (e) { reqOk = false; perche = e.message === 'sql' ? 'tabella non trovata' : `errore ${call.last || ''}`.trim(); }
      try { stati = await call('/rest/v1/eliseo_casella_stato?select=*') || []; } catch (e) { reqOk = false; perche = perche || (e.message === 'sql' ? 'tabella non trovata' : `errore ${call.last || ''}`.trim()); }
      const st = new Map(stati.map((x) => [`${x.tipo}:${x.rif}`, x]));
      const items = [
        ...chats.filter((c) => c.ultimo_msg).map((c) => ({ tipo: 'chat', rif: c.cliente_id, nome: c.nome, quando: c.ultimo_msg, nuovo: !!(c.ultimo_da_cliente && (!c.letto_admin || c.ultimo_da_cliente > c.letto_admin)) })),
        ...reqs.map((r) => ({ tipo: 'richiesta', rif: r.id, nome: r.nome, quando: r.creato_il, nuovo: !st.has(`richiesta:${r.id}`), r })),
      ].map((x) => ({ ...x, s: st.get(`${x.tipo}:${x.rif}`) || { stato: 'aperta', assegnato: null, contatto_id: null } }))
        .sort((a, b) => String(b.quando).localeCompare(String(a.quando)));
      const counts = { tutte: items.length, nuove: items.filter((x) => x.nuovo).length, aperte: items.filter((x) => x.s.stato !== 'chiusa').length, chiuse: items.filter((x) => x.s.stato === 'chiusa').length };
      const filt = h('div', { class: 'filters', role: 'group', 'aria-label': 'Filtra la casella' });
      [['tutte', 'Tutte'], ['nuove', 'Da leggere'], ['aperte', 'Aperte'], ['chiuse', 'Chiuse']].forEach(([k, t]) => {
        const b = h('button', { type: 'button', class: 'chip', 'aria-pressed': casellaFiltro.vista === k ? 'true' : 'false', text: `${t} (${counts[k]})` });
        b.addEventListener('click', () => { casellaFiltro.vista = k; draw(); });
        filt.append(b);
      });
      // Come «Team» in Keplero: tutte, non assegnate, oppure di una persona. Più la ricerca per nome o testo.
      const chi = select('chi', [['', 'Tutto il team'], ['__none', `Non assegnate (${items.filter((x) => !x.s.assegnato).length})`], ...team.map((p) => [p.nome, `${p.nome} (${items.filter((x) => x.s.assegnato === p.nome).length})`])], casellaFiltro.chi, { 'aria-label': 'Assegnate a', class: 'el-fase' });
      chi.addEventListener('change', () => { casellaFiltro.chi = chi.value; draw(); });
      const cerca = h('input', { type: 'search', class: 'el-search', placeholder: 'Cerca nome o testo', 'aria-label': 'Cerca nella casella', value: casellaFiltro.q });
      cerca.addEventListener('change', () => { casellaFiltro.q = cerca.value; draw(); });
      const tools = h('div', { class: 'el-tools' }, cerca, chi);
      const q = casellaFiltro.q.trim().toLowerCase();
      const shown = items.filter((x) => casellaFiltro.vista === 'tutte' || (casellaFiltro.vista === 'nuove' && x.nuovo) || (casellaFiltro.vista === 'aperte' && x.s.stato !== 'chiusa') || (casellaFiltro.vista === 'chiuse' && x.s.stato === 'chiusa'))
        .filter((x) => !casellaFiltro.chi || (casellaFiltro.chi === '__none' ? !x.s.assegnato : x.s.assegnato === casellaFiltro.chi))
        .filter((x) => !q || String(x.nome || '').toLowerCase().includes(q) || String(x.r?.messaggio || '').toLowerCase().includes(q));
      const saveState = async (x, patch) => {
        try {
          const [row] = await call('/rest/v1/eliseo_casella_stato?on_conflict=tipo,rif', { method: 'POST', body: { tipo: x.tipo, rif: x.rif, stato: x.s.stato, assegnato: x.s.assegnato, contatto_id: x.s.contatto_id, ...patch }, prefer: 'resolution=merge-duplicates,return=representation' });
          Object.assign(x.s, row); say('Casella aggiornata.');
        } catch (e) { say(e.message === 'sql' ? 'Manca il file supabase/eliseo-casella.sql in Supabase.' : e.message, true); }
      };
      const list = h('div', { class: 'el-inbox' });
      shown.forEach((x) => {
        const stato = select('stato', STATI, x.s.stato, { 'aria-label': `Stato di ${x.nome}`, class: 'el-fase' });
        stato.addEventListener('change', async () => { await saveState(x, { stato: stato.value }); draw(); });
        const ass = select('assegnato', [['', 'Non assegnata'], ...team.map((p) => [p.nome, p.nome])], x.s.assegnato || '', { 'aria-label': `Assegna ${x.nome}`, class: 'el-fase' });
        ass.addEventListener('change', () => saveState(x, { assegnato: ass.value || null }));
        const acts = h('div', { class: 'el-inbox__act' });
        if (x.tipo === 'chat') {
          const open = h('button', { type: 'button', class: 'btn btn--secondary', text: 'Apri la chat' });
          open.addEventListener('click', () => { if (!x.s.contatto_id) saveState(x, {}); root.querySelector('[data-nav="chat"]')?.click(); });
          acts.append(open);
        } else {
          const c = x.r.contatto;
          const base = c.includes('@') ? `mailto:${c}` : `https://wa.me/${((d) => (d.startsWith('39') ? d : `39${d}`))(c.replace(/\D/g, ''))}`;
          const link = h('a', { class: 'btn btn--secondary', href: base, target: '_blank', rel: 'noopener noreferrer', text: c.includes('@') ? 'Rispondi per email' : 'Rispondi su WhatsApp' });
          if (modelli?.length) {
            const pick = select('modello', [['', 'Senza modello'], ...modelli.map((m) => [m.id, m.nome])], '', { 'aria-label': `Modello per ${x.nome}`, class: 'el-fase' });
            pick.addEventListener('change', () => {
              const m = modelli.find((y) => y.id === pick.value);
              const t = m ? encodeURIComponent(fillTemplate(m.testo, { nome: x.r.nome })) : '';
              link.setAttribute('href', !t ? base : c.includes('@') ? `${base}?body=${t}` : `${base}?text=${t}`);
            });
            acts.append(pick);
          }
          acts.append(link);
        }
        const linked = x.s.contatto_id || rows.some((r) => (x.tipo === 'chat' && r.user_id === x.rif));
        if (!linked) {
          const add = h('button', { type: 'button', class: 'btn btn--secondary', text: 'Aggiungi ai contatti' });
          add.addEventListener('click', async () => {
            const raw = x.tipo === 'chat' ? { nome: x.nome, fonte: 'sito', fase: 'contattato' } : { nome: x.r.nome, ...(x.r.contatto.includes('@') ? { email: x.r.contatto } : { telefono: x.r.contatto }), fonte: 'sito', fase: 'nuovo', note: `Richiesta dal sito: ${MOTIVI[x.r.motivo] || x.r.motivo}` };
            const { row, ok, errors } = cleanContact(raw);
            if (!ok) { say(Object.values(errors).join(' '), true); return; }
            try {
              const [ins] = await call('/rest/v1/eliseo_contatti', { method: 'POST', body: { ...row, ...(x.tipo === 'chat' ? { user_id: x.rif } : {}) }, prefer: 'return=representation' });
              rows.unshift(ins); drawStats(); await saveState(x, { contatto_id: ins.id }); say(`${ins.nome} aggiunto ai contatti.`); draw();
            } catch (e) { say(e.message, true); }
          });
          acts.append(add);
        }
        list.append(h('article', { class: `el-msg${x.nuovo ? ' is-new' : ''}${x.s.stato === 'chiusa' ? ' is-closed' : ''}` },
          h('header', { class: 'el-msg__head' },
            h('span', { class: `pchip pchip--${x.tipo === 'chat' ? 'ok' : 'wait'}`, text: x.tipo === 'chat' ? 'Chat' : `Modulo · ${MOTIVI[x.r.motivo] || ''}` }),
            h('strong', { text: x.nome }), x.nuovo ? h('span', { class: 'el-dot', text: 'Nuova' }) : null, h('small', { text: when(x.quando) })),
          x.tipo === 'richiesta' ? h('p', { class: 'el-msg__text', text: x.r.messaggio }) : null,
          h('div', { class: 'el-msg__ctrl' }, stato, ass, acts)));
      });
      const note = reqOk ? null : h('p', { class: 'pcard__note', text: perche === 'tabella non trovata' ? 'Per stati e richieste del modulo va eseguito una volta il file supabase/eliseo-casella.sql in Supabase (lo fa Eliseo).' : `Stati e richieste non disponibili ora (${perche}). Ricarica la pagina; se resta, scrivilo a Claude con questo codice.` });
      const off = root.closest('[data-auth-page]')?.dataset.salvaRichieste === '1' ? null : h('p', { class: 'pcard__note', text: 'Le richieste del modulo di contatto per ora arrivano solo per email. Si salveranno anche qui quando l’informativa privacy sarà aggiornata con l’avvocato.' });
      wrap.replaceChildren(...[filt, tools, note, off].filter(Boolean), shown.length ? list : h('p', { class: 'pempty', text: items.length ? 'Niente in questa vista.' : 'La casella è vuota.' }));
    })();
    return [card('Casella', h('p', { class: 'pcard__note', text: 'Chat del sito e richieste del modulo, in un solo posto. Scegli lo stato e a chi assegnarle.' }), wrap)];
  }

  function draw() {
    listBox = null;
    if (tab === 'colonne') { body.replaceChildren(card('Fasi', h('p', { class: 'pcard__note', text: 'Trascina una scheda in un’altra colonna, oppure usa «Sposta in».' }), drawColumns())); return; }
    if (tab === 'campagne') { body.replaceChildren(...drawCampaigns()); return; }
    if (tab === 'casella') { body.replaceChildren(...drawCasella()); return; }
    if (tab === 'modelli') { body.replaceChildren(...drawModelli()); return; }
    if (['addestramento', 'automazioni', 'prova'].includes(tab)) {
      const which = tab;
      body.replaceChildren(card(null, h('p', { class: 'pempty', text: 'Carico…' })));
      import('./portal-eliseo-ai.js').then((m) => { if (tab === which) body.replaceChildren(...m.mountAi(which, { h, card, call, say, select, team })); })
        .catch(() => body.replaceChildren(card(null, h('p', { class: 'pcard__note', text: 'Non riesco a caricare questa sezione. Riprova.' }))));
      return;
    }
    if (tab === 'importa') { openImport(); return; }
    listBox = h('div');
    body.replaceChildren(card('Contatti', toolbar(), listBox));
    drawList();
  }

  body.replaceChildren(card('Eliseo', h('p', { class: 'pempty', text: 'Carico…' })));
  load();
}
