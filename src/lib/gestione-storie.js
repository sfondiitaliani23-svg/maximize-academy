// Gestione delle storie di Maximize Academy (pagina /gestione): scegli il giorno, carica, metti in ordine.
// Stessa logica del portale di Maurizio Barber Shop, ma sul progetto Supabase di Maximize (supabase/storie.sql).
// Il database decide i permessi: solo admin e co-founder.
import { SB_URL, SB_KEY, token } from './sb.js';
import { openViewer, toSlide, isLive, romeToday, isStoryRatio } from './storie.js';

const h = (tag, attrs, ...kids) => {
  const el = document.createElement(tag);
  Object.entries(attrs || {}).forEach(([k, v]) => { if (v === false || v == null) return; if (k === 'text') el.textContent = v; else el.setAttribute(k, v === true ? '' : v); });
  kids.flat(Infinity).forEach((k) => { if (k != null) el.append(k); });
  return el;
};
const TIPI = { foto: 'Foto', video: 'Video', testo: 'Testo o promo', numero: 'Numero' };
const AIUTO = {
  foto: 'Solo verticale 9:16 (es. 1080x1920). JPG, PNG o WebP fino a 8 MB.',
  video: 'Solo verticale 9:16 (es. 1080x1920), fino a 15 secondi e 20 MB.',
  testo: 'Un annuncio, una promo, un orario speciale.',
  numero: 'Stile Wrapped: un numero grande, per esempio "1.862 recensioni".',
};
const IMG = ['image/jpeg', 'image/png', 'image/webp'];
const VID = ['video/mp4', 'video/webm', 'video/quicktime'];
const EXT = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'video/mp4': 'mp4', 'video/webm': 'webm', 'video/quicktime': 'mov' };
const addDays = (day, n) => { const d = new Date(`${day}T12:00:00Z`); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
const fmtDay = (day) => new Date(`${day}T12:00:00Z`).toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' });
const jwt = (t) => { try { return JSON.parse(atob(t.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))); } catch { return {}; } };
const size = (file, video) => new Promise((ok) => {
  const u = URL.createObjectURL(file);
  const done = (w, h) => { URL.revokeObjectURL(u); ok({ w, h }); };
  if (video) { const v = document.createElement('video'); v.preload = 'metadata'; v.onloadedmetadata = () => done(v.videoWidth, v.videoHeight); v.onerror = () => done(0, 0); v.src = u; }
  else { const i = new Image(); i.onload = () => done(i.naturalWidth, i.naturalHeight); i.onerror = () => done(0, 0); i.src = u; }
});
const seconds = (file) => new Promise((ok) => { const v = document.createElement('video'); const u = URL.createObjectURL(file); v.preload = 'metadata'; v.onloadedmetadata = () => { URL.revokeObjectURL(u); ok(v.duration || 0); }; v.onerror = () => { URL.revokeObjectURL(u); ok(0); }; v.src = u; });

export function mount(box) {
  const url = SB_URL;
  const key = SB_KEY;
  const api = { token };
  const today = romeToday();
  let day = today, rows = [], me = { id: '', admin: false };

  async function call(path, { method = 'GET', body, headers = {}, raw } = {}) {
    const token = await api.token();
    if (!token) throw new Error('La sessione è scaduta. Accedi di nuovo.');
    const p = jwt(token); me = { id: p.sub, admin: ['admin', 'cofounder'].includes(p.app_metadata?.role) };
    const res = await fetch(`${url}${path}`, { method, headers: { apikey: key, Authorization: `Bearer ${token}`, ...(raw ? {} : { 'Content-Type': 'application/json' }), ...headers }, body: raw || (body === undefined ? undefined : JSON.stringify(body)) });
    if (!res.ok) {
      let msg = ''; try { msg = (await res.json()).message || ''; } catch { msg = ''; }
      if (/storie.*does not exist|relation|schema cache|Bucket not found/i.test(msg)) throw new Error('Manca il file SQL storie.sql in Supabase. Va eseguito una volta.');
      throw new Error(res.status === 401 || res.status === 403 ? 'Non hai il permesso, oppure la sessione è scaduta.' : 'Operazione non riuscita. Riprova.');
    }
    return res.status === 204 ? null : res.json().catch(() => null);
  }
  const media = (p) => (p ? `${url}/storage/v1/object/public/storie/${p}` : null);

  const status = h('p', { class: 'pcard__note', role: 'status', 'aria-live': 'polite' });
  const say = (t, bad) => { status.textContent = t; status.dataset.state = bad ? 'error' : 'ok'; };
  const days = h('div', { class: 'filters', role: 'group', 'aria-label': 'Giorno' });
  const pick = h('input', { type: 'date', class: 'pst-date', 'aria-label': 'Altro giorno' });
  const list = h('div');
  const formBox = h('div');
  const nuovo = h('button', { class: 'btn btn--primary', type: 'button', text: 'Nuova storia' });
  const anteprima = h('button', { class: 'btn btn--secondary', type: 'button', text: 'Anteprima del giorno' });
  box.replaceChildren(h('div', { class: 'pcontent' },
    h('section', { class: 'pcard' }, h('h3', { class: 'pcard__title', text: 'Storie' }),
      h('p', { class: 'pcard__note', text: 'Foto, video, promo e numeri che i visitatori vedono nel cerchio dorato «Novità» nella home di Maximize Academy. Online subito, senza aggiornare il sito.' }),
      days, h('div', { class: 'actions' }, nuovo, anteprima), status),
    formBox, list));

  const ofDay = () => rows.filter((r) => isLive(r, day)).sort((a, b) => a.ordine - b.ordine || a.creato_il.localeCompare(b.creato_il));
  const canEdit = (r) => me.admin || r.creato_da === me.id;

  function drawDays() {
    const chips = [];
    for (let k = -3; k <= 14; k++) {
      const d = addDays(today, k); const n = rows.filter((r) => isLive(r, d)).length;
      if (!n && k !== 0 && k !== 1 && d !== day) continue;
      const b = h('button', { type: 'button', class: 'chip', 'aria-pressed': d === day ? 'true' : 'false', text: `${d === today ? 'Oggi' : d === addDays(today, 1) ? 'Domani' : fmtDay(d)} · ${n}` });
      b.addEventListener('click', () => { day = d; draw(); });
      chips.push(b);
    }
    pick.value = day;
    days.replaceChildren(...chips, pick);
  }
  pick.addEventListener('change', () => { if (pick.value) { day = pick.value; draw(); } });

  function drawList() {
    const items = ofDay();
    anteprima.hidden = !items.length;
    list.replaceChildren(h('section', { class: 'pcard' }, h('h3', { class: 'pcard__title', text: `${day === today ? 'Oggi' : fmtDay(day)}: ${items.length} ${items.length === 1 ? 'storia' : 'storie'}, in quest’ordine` }),
      items.length ? h('ol', { class: 'pst-list' }, items.map((r, k) => {
        const thumb = r.tipo === 'foto' ? h('img', { src: media(r.media_path), alt: '', loading: 'lazy' }) : r.tipo === 'video' ? h('video', { src: media(r.media_path), muted: true, playsinline: true, preload: 'metadata' }) : h('span', { text: r.tipo === 'numero' ? r.numero : 'Aa' });
        const btn = (text, fn, dis) => { const b = h('button', { type: 'button', class: 'btn btn--secondary pst-btn', text, disabled: dis || false }); b.addEventListener('click', fn); return b; };
        const periodo = r.al === r.dal ? `solo ${fmtDay(r.dal)}` : r.al ? `${fmtDay(r.dal)} → ${fmtDay(r.al)}` : `dal ${fmtDay(r.dal)}, senza fine`;
        return h('li', { class: 'pst-item' }, h('span', { class: 'pst-n', text: String(k + 1) }), h('span', { class: 'pst-thumb' }, thumb),
          h('span', { class: 'pst-info' }, h('strong', { text: r.titolo || r.testo || TIPI[r.tipo] }), h('small', { text: `${TIPI[r.tipo]} · ${periodo}` })),
          h('span', { class: 'pst-actions' }, btn('↑', () => move(r.id, -1), k === 0), btn('↓', () => move(r.id, 1), k === items.length - 1),
            canEdit(r) ? btn('Modifica', () => form(r)) : null, canEdit(r) ? btn('Elimina', () => remove(r)) : null));
      })) : h('p', { class: 'pempty', text: 'Nessuna storia per questo giorno.' }),
      null));
  }
  function draw() { drawDays(); drawList(); }

  async function load() {
    try { rows = (await call('/rest/v1/storie?select=*&order=dal.desc,ordine.asc&limit=300')) || []; say(''); }
    catch (e) { rows = []; say(e.message, true); }
    draw();
  }

  async function move(id, dir) {
    const ids = ofDay().map((r) => r.id); const i = ids.indexOf(id); const j = i + dir;
    if (j < 0 || j >= ids.length) return;
    [ids[i], ids[j]] = [ids[j], ids[i]];
    ids.forEach((x, k) => { const r = rows.find((y) => y.id === x); if (r) r.ordine = k; });
    drawList();
    try { await call('/rest/v1/rpc/riordina_storie', { method: 'POST', body: { ids } }); say('Ordine salvato.'); } catch (e) { say(e.message, true); }
  }

  async function remove(r) {
    if (!confirm('Eliminare questa storia? Anche il file viene cancellato.')) return;
    try {
      await call(`/rest/v1/storie?id=eq.${r.id}`, { method: 'DELETE' });
      if (r.media_path) await call(`/storage/v1/object/storie/${r.media_path}`, { method: 'DELETE' }).catch(() => {});
      rows = rows.filter((x) => x.id !== r.id); draw(); say('Storia eliminata.');
    } catch (e) { say(e.message, true); }
  }

  function form(r) {
    const edit = !!r;
    let tipo = r?.tipo || 'foto', mediaPath = r?.media_path || null;
    const field = (id, label, control, hint) => h('div', { class: 'field' }, h('label', { for: id, text: label }), control, hint ? h('span', { class: 'field__hint', text: hint }) : null);
    const inp = (id, max, val, extra = {}) => { const x = h('input', { id, type: 'text', maxlength: max, ...extra }); x.value = val || ''; return x; };
    const tipi = h('div', { class: 'filters', role: 'group', 'aria-label': 'Tipo di storia' });
    const aiuto = h('p', { class: 'field__hint' });
    const file = h('input', { id: 'st-file', type: 'file' });
    const prev = h('span', { class: 'pst-thumb pst-thumb--big' });
    const lib = h('label', { class: 'portal-switch' }, h('input', { type: 'checkbox', id: 'st-lib' }), h('span', { text: 'Non ci sono persone riconoscibili, oppure ho la liberatoria firmata (obbligatorio).' }));
    lib.querySelector('input').checked = !!r?.liberatoria;
    const numero = inp('st-num', 24, r?.numero, { placeholder: 'es. 1.862' });
    const titolo = inp('st-tit', 90, r?.titolo); const testo = inp('st-txt', 280, r?.testo);
    const titoloEn = inp('st-tit-en', 90, r?.titolo_en, { lang: 'en' }); const testoEn = inp('st-txt-en', 280, r?.testo_en, { lang: 'en' });
    const pulsante = inp('st-btn', 30, r?.pulsante, { placeholder: 'es. Scopri' }); const pulsanteEn = inp('st-btn-en', 30, r?.pulsante_en, { lang: 'en', placeholder: 'e.g. Book' });
    const link = inp('st-link', 300, r?.link, { placeholder: '/sabey oppure https://…' });
    const dal = h('input', { id: 'st-dal', type: 'date' }); dal.value = r?.dal || day;
    const durata = h('select', { id: 'st-dur' }, [['giorno', 'Solo quel giorno'], ['fino', 'Fino al giorno…'], ['sempre', 'Finché non la tolgo']].map(([v, t]) => h('option', { value: v, text: t })));
    durata.value = !r ? 'giorno' : !r.al ? 'sempre' : r.al === r.dal ? 'giorno' : 'fino';
    const al = h('input', { id: 'st-al', type: 'date' }); al.value = r?.al || dal.value;
    const alBox = field('st-al', 'Fino al', al);
    const avvisoTesto = h('span');
    const avviso = h('div', { class: 'pst-avviso', role: 'note' }, h('span', { class: 'pst-avviso__ic', 'aria-hidden': 'true', text: '9:16' }), h('span', null, h('strong', { text: 'Solo formato verticale 9:16' }), avvisoTesto));
    const mediaBox = h('div', null, avviso, field('st-file', 'File', file), prev, lib);
    const numBox = field('st-num', 'Numero grande', numero);
    const sync = () => {
      [...tipi.children].forEach((b) => b.setAttribute('aria-pressed', b.dataset.t === tipo ? 'true' : 'false'));
      aiuto.textContent = AIUTO[tipo];
      mediaBox.hidden = tipo !== 'foto' && tipo !== 'video';
      avvisoTesto.textContent = `${tipo === 'video' ? 'Il video deve essere verticale, come una storia di Instagram (es. 1080x1920), e durare al massimo 15 secondi.' : 'La foto deve essere verticale, come una storia di Instagram (es. 1080x1920).'} Foto e video in altri formati (quadrati, 4:5, orizzontali) vengono rifiutati.`;
      file.accept = (tipo === 'video' ? VID : IMG).join(',');
      numBox.hidden = tipo !== 'numero';
      alBox.hidden = durata.value !== 'fino';
      prev.replaceChildren(mediaPath ? (tipo === 'video' ? h('video', { src: media(mediaPath), muted: true, playsinline: true }) : h('img', { src: media(mediaPath), alt: '' })) : '');
    };
    Object.entries(TIPI).forEach(([t, label]) => { const b = h('button', { type: 'button', class: 'chip', 'data-t': t, text: label, disabled: edit }); b.addEventListener('click', () => { tipo = t; mediaPath = null; sync(); }); tipi.append(b); });
    durata.addEventListener('change', sync);
    file.addEventListener('change', async () => {
      const f = file.files[0]; file.value = '';
      if (!f) return;
      const isV = VID.includes(f.type), isI = IMG.includes(f.type);
      try {
        if (tipo === 'video' && !isV) throw new Error('Scegli un video MP4, WebM o MOV.');
        if (tipo === 'foto' && !isI) throw new Error('Scegli una foto JPG, PNG o WebP.');
        if (f.size > (isV ? 20 : 8) * 1024 * 1024) throw new Error(isV ? 'Il video supera 20 MB.' : 'La foto supera 8 MB.');
        const dim = await size(f, isV);
        if (!isStoryRatio(dim.w, dim.h)) throw new Error(`Formato non valido (${dim.w}x${dim.h}). Servono foto e video verticali 9:16, per esempio 1080x1920.`);
        if (isV) { const s = await seconds(f); if (s > 15.5) throw new Error(`Il video dura ${Math.round(s)} secondi: il massimo è 15.`); }
        say('Carico il file…');
        const path = `${dal.value || today}/${crypto.randomUUID()}.${EXT[f.type]}`;
        await call(`/storage/v1/object/storie/${path}`, { method: 'POST', raw: f, headers: { 'Content-Type': f.type } });
        mediaPath = path; sync(); say('File caricato.');
      } catch (e) { say(e.message, true); }
    });
    const salva = h('button', { class: 'btn btn--primary', type: 'submit', text: edit ? 'Salva modifiche' : 'Pubblica' });
    const annulla = h('button', { class: 'btn btn--secondary', type: 'button', text: 'Annulla' });
    annulla.addEventListener('click', () => formBox.replaceChildren());
    const el = h('form', { class: 'pcard pst-form' }, h('h3', { class: 'pcard__title', text: edit ? 'Modifica storia' : 'Nuova storia' }), tipi, aiuto, mediaBox, numBox,
      field('st-tit', `Titolo ${tipo === 'testo' ? '(obbligatorio)' : '(facoltativo)'}`, titolo), field('st-txt', 'Testo (facoltativo)', testo),
      field('st-btn', 'Pulsante (facoltativo)', pulsante), field('st-link', 'Link del pulsante', link),
      h('details', null, h('summary', { text: 'Testi in inglese (facoltativi: se vuoti si usa l’italiano)' }), field('st-tit-en', 'Title', titoloEn), field('st-txt-en', 'Text', testoEn), field('st-btn-en', 'Button', pulsanteEn)),
      field('st-dal', 'Dal giorno', dal), field('st-dur', 'Durata', durata), alBox,
      h('div', { class: 'actions' }, salva, annulla));
    el.addEventListener('submit', async (e) => {
      e.preventDefault();
      try {
        const v = (x) => x.value.trim() || null;
        if ((tipo === 'foto' || tipo === 'video') && !mediaPath) throw new Error(tipo === 'video' ? 'Carica il video.' : 'Carica la foto.');
        if ((tipo === 'foto' || tipo === 'video') && !lib.querySelector('input').checked) throw new Error('Conferma la liberatoria (o che non ci sono persone riconoscibili).');
        if (tipo === 'numero' && !v(numero)) throw new Error('Scrivi il numero da mostrare.');
        if (tipo === 'testo' && !v(titolo)) throw new Error('Scrivi il titolo.');
        const l = v(link);
        if (l && !/^(\/[^/]|\/$|https:\/\/)/.test(l)) throw new Error('Il link deve iniziare con / oppure https://');
        const fine = durata.value === 'sempre' ? null : durata.value === 'giorno' ? dal.value : al.value;
        if (fine && fine < dal.value) throw new Error('La fine deve essere uguale o dopo l’inizio.');
        const row = { tipo, titolo: v(titolo), testo: v(testo), titolo_en: v(titoloEn), testo_en: v(testoEn), numero: tipo === 'numero' ? v(numero) : null, media_path: tipo === 'foto' || tipo === 'video' ? mediaPath : null, pulsante: l ? v(pulsante) : null, pulsante_en: l ? v(pulsanteEn) : null, link: l, dal: dal.value, al: fine, liberatoria: (tipo === 'foto' || tipo === 'video') && lib.querySelector('input').checked };
        say('Salvo…');
        if (edit) await call(`/rest/v1/storie?id=eq.${r.id}`, { method: 'PATCH', body: row, headers: { Prefer: 'return=minimal' } });
        else await call('/rest/v1/storie', { method: 'POST', body: { ...row, ordine: rows.filter((x) => x.dal === dal.value).length }, headers: { Prefer: 'return=minimal' } });
        day = dal.value; formBox.replaceChildren(); say(edit ? 'Storia aggiornata.' : 'Storia pubblicata. È già online.');
        await load();
      } catch (err) { say(err.message, true); }
    });
    sync();
    formBox.replaceChildren(el);
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  nuovo.addEventListener('click', () => form(null));
  anteprima.addEventListener('click', () => { const items = ofDay(); if (items.length) openViewer(items.map((r) => toSlide(r, false, url)), { label: 'Anteprima' }); });
  load();
}
