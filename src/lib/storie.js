import { SB_URL as URL_, SB_KEY as KEY } from './sb.js';
// Storie in home di Maximize Academy (stile Instagram): cerchio dorato «Novità», visore a schermo intero.
// Stesso visore di Maurizio Barber Shop, ma dati separati: progetto Supabase di Maximize, gestione su /gestione.
// Chiave pubblica: legge solo le storie attive oggi.
// Senza storie caricate si vedono le storie di base di Maximize. Tutti i nodi sono costruiti a mano.

const EN = false;
const T = (it, en) => (EN ? en : it);
const SEEN = 'maximize-storie-viste';

const h = (tag, attrs, ...kids) => {
  const el = document.createElement(tag);
  Object.entries(attrs || {}).forEach(([k, v]) => {
    if (v === false || v == null) return;
    if (k === 'text') el.textContent = v;
    else el.setAttribute(k, v === true ? '' : v);
  });
  kids.flat(Infinity).forEach((k) => { if (k != null) el.append(k); });
  return el;
};
const svg = (d, size = 22) => {
  const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  s.setAttribute('viewBox', '0 0 24 24'); s.setAttribute('width', size); s.setAttribute('height', size);
  s.setAttribute('fill', 'none'); s.setAttribute('stroke', 'currentColor'); s.setAttribute('stroke-width', '1.8');
  s.setAttribute('stroke-linecap', 'round'); s.setAttribute('stroke-linejoin', 'round'); s.setAttribute('aria-hidden', 'true');
  d.split('|').forEach((p) => { const path = document.createElementNS('http://www.w3.org/2000/svg', 'path'); path.setAttribute('d', p); s.append(path); });
  return s;
};
const ICON = { close: 'M6 6l12 12|M18 6L6 18', mute: 'M11 5L6 9H3v6h3l5 4z|M22 9l-6 6|M16 9l6 6', sound: 'M11 5L6 9H3v6h3l5 4z|M15.5 8.5a5 5 0 010 7|M18.5 5.5a9 9 0 010 13', arrow: 'M9 6l6 6-6 6' };

/** Data di oggi a Roma, "AAAA-MM-GG". */
export const romeToday = (ms = Date.now()) => new Date(ms).toLocaleDateString('en-CA', { timeZone: 'Europe/Rome' });
/** Storia visibile nel giorno indicato? */
export const isLive = (s, day) => s.dal <= day && (!s.al || s.al >= day);
/** Link del pulsante: solo pagine del sito o https. */
export const safeLink = (v) => { const x = String(v || '').trim(); if (/^\/(?!\/)/.test(x)) return x; if (/^https:\/\/\S+$/i.test(x)) return x; return null; };
/** Solo formato verticale 9:16 (es. 1080x1920), con tolleranza del 2%. */
export const isStoryRatio = (w, h) => w > 0 && h > 0 && Math.abs(w / h - 9 / 16) / (9 / 16) <= 0.02;
/** Riga del database → storia per il visore (testi nella lingua della pagina). */
export function toSlide(r, en = EN, base = URL_) {
  const pick = (it, eng) => String((en && eng && String(eng).trim()) ? eng : it || '').trim();
  const media = r.media_path && base ? `${base.replace(/\/$/, '')}/storage/v1/object/public/storie/${String(r.media_path).split('/').map(encodeURIComponent).join('/')}` : null;
  return { id: r.id, tipo: r.tipo, titolo: pick(r.titolo, r.titolo_en), testo: pick(r.testo, r.testo_en), numero: String(r.numero || '').trim(), media, pulsante: pick(r.pulsante, r.pulsante_en), link: safeLink(r.link), durata: r.tipo === 'testo' || r.tipo === 'numero' ? 6000 : 5000 };
}

async function load() {
  if (!URL_ || !KEY) return [];
  const c = new AbortController(); const t = setTimeout(() => c.abort(), 4000);
  try {
    const get = (q) => fetch(`${URL_}/rest/v1/storie?select=*${q}&order=ordine.asc,creato_il.asc&limit=60`, { headers: { apikey: KEY }, cache: 'no-store', signal: c.signal });
    const r = await get('');
    if (!r.ok) return []; // tabella non ancora creata: solo le storie di base
    const day = romeToday();
    return (await r.json()).filter((s) => isLive(s, day) && ((s.tipo !== 'foto' && s.tipo !== 'video') || s.media_path)).map((s) => toSlide(s));
  } catch { return []; } finally { clearTimeout(t); }
}

const readSeen = () => { try { return new Set(JSON.parse(localStorage.getItem(SEEN) || '[]')); } catch { return new Set(); } };
const writeSeen = (set) => { try { localStorage.setItem(SEEN, JSON.stringify([...set].slice(-200))); } catch { /* memoria non disponibile */ } };

/** Visore a schermo intero. Tocco a destra avanti, a sinistra indietro, tieni premuto per fermare, Esc per chiudere. */
export function openViewer(slides, { label, onSeen = () => {}, onClose = () => {} } = {}) {
  let i = 0, progress = 0, paused = false, raf = 0, last = 0, muted = true, video = null, closed = false;
  const bars = h('div', { class: 'story-bars', 'aria-hidden': 'true' }, slides.map(() => h('span', null, h('i'))));
  const muteBtn = h('button', { type: 'button', class: 'story-icon', hidden: true });
  const closeBtn = h('button', { type: 'button', class: 'story-icon', 'aria-label': T('Chiudi', 'Close') }, svg(ICON.close));
  const head = h('div', { class: 'story-head', 'data-story-ui': true }, h('span', { class: 'story-head__label', text: label }), h('div', { class: 'story-head__actions' }, muteBtn, closeBtn));
  const stage = h('div', { class: 'story-stage' });
  const footBox = h('div', { class: 'story-foot', 'data-story-ui': true });
  const pausedTag = h('span', { class: 'story-paused', text: T('In pausa', 'Paused'), hidden: true });
  const frame = h('div', { class: 'story-frame' }, bars, head, stage, footBox, pausedTag);
  const overlay = h('div', { class: 'story-overlay', role: 'dialog', 'aria-modal': 'true', 'aria-label': label }, frame);
  const prevOverflow = document.body.style.overflow;
  const opener = document.activeElement;

  const setBars = () => [...bars.children].forEach((b, k) => { b.firstChild.style.width = `${k < i ? 100 : k === i ? Math.round(progress * 100) : 0}%`; });
  const setMuteIcon = () => { muteBtn.replaceChildren(svg(muted ? ICON.mute : ICON.sound, 20)); muteBtn.setAttribute('aria-label', muted ? T('Attiva l’audio', 'Unmute') : T('Togli l’audio', 'Mute')); };

  function render() {
    const s = slides[i];
    progress = 0; video = null; setBars();
    onSeen(s.id);
    const kids = [];
    if (s.tipo === 'foto' && s.media) kids.push(h('img', { class: 'story-media', src: s.media, alt: s.titolo || 'Storia di Maximize Academy', draggable: 'false' }));
    if (s.tipo === 'video' && s.media) {
      video = h('video', { class: 'story-media', src: s.media, playsinline: true, autoplay: true, preload: 'auto' });
      video.muted = muted;
      video.addEventListener('timeupdate', () => { if (video.duration) { progress = video.currentTime / video.duration; setBars(); } });
      video.addEventListener('ended', next); video.addEventListener('error', next);
      kids.push(video);
    }
    if (s.tipo === 'foto' || s.tipo === 'video') kids.push(h('div', { class: 'story-shade', 'aria-hidden': 'true' }));
    const text = h('div', { class: `story-text story-text--${s.tipo}` });
    if (s.tipo === 'numero') text.append(s.titolo ? h('p', { class: 'story-eyebrow', text: s.titolo }) : '', h('p', { class: 'story-big', text: s.numero }), s.testo ? h('p', { class: 'story-body', text: s.testo }) : '');
    else text.append(s.titolo ? h('p', { class: `story-title${s.tipo === 'testo' ? '' : ' story-title--media'}`, text: s.titolo }) : '', s.testo ? h('p', { class: 'story-body', text: s.testo }) : '');
    kids.push(text);
    stage.replaceChildren(...kids);
    muteBtn.hidden = s.tipo !== 'video'; if (!muteBtn.hidden) setMuteIcon();
    footBox.replaceChildren();
    if (s.link && s.pulsante) {
      const ext = s.link.startsWith('https://');
      const cta = h('a', { class: 'story-cta', href: s.link, ...(ext ? { target: '_blank', rel: 'noopener noreferrer' } : {}) }, s.pulsante, svg(ICON.arrow, 18));
      if (!ext) cta.addEventListener('click', () => finish()); // pagina del sito: si chiude il visore e il sito cambia pagina
      footBox.append(cta);
    }
  }
  function next() { if (i < slides.length - 1) { i++; render(); } else close(); }
  function prev() { if (i > 0) { i--; render(); } else { progress = 0; setBars(); } }
  function tick(now) {
    if (closed) return;
    const s = slides[i];
    if (s && s.tipo !== 'video' && !paused) {
      progress += (now - last) / s.durata;
      if (progress >= 1) { last = now; next(); } else setBars();
    }
    last = now;
    if (!closed) raf = requestAnimationFrame(tick);
  }
  function setPaused(v) { paused = v; pausedTag.hidden = !v; if (video) { if (v) video.pause(); else video.play().catch(() => {}); } }
  // Il tasto «Indietro» del telefono chiude le storie e lascia la pagina dov'era (come su Instagram).
  function close() {
    if (closed) return;
    if (history.state && history.state.mxStory) history.back();
    else finish();
  }
  function onPop() { finish(); }
  function finish() {
    if (closed) return;
    closed = true;
    cancelAnimationFrame(raf);
    document.removeEventListener('keydown', onKey);
    window.removeEventListener('popstate', onPop);
    overlay.remove();
    document.body.style.overflow = prevOverflow;
    if (opener && opener.focus) opener.focus();
    onClose();
  }
  function onKey(e) {
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowRight') next();
    else if (e.key === 'ArrowLeft') prev();
    else if (e.key === ' ') { e.preventDefault(); setPaused(!paused); }
  }
  let press = null, hold = 0;
  frame.addEventListener('pointerdown', (e) => {
    if (e.target.closest('[data-story-ui]')) return;
    press = { t: Date.now(), x: e.clientX, y: e.clientY };
    hold = setTimeout(() => setPaused(true), 220);
  });
  frame.addEventListener('pointerup', (e) => {
    clearTimeout(hold);
    const p = press; press = null;
    if (!p) return;
    const held = Date.now() - p.t > 220;
    setPaused(false);
    if (e.clientY - p.y > 90) return close();
    if (held) return;
    const r = frame.getBoundingClientRect();
    if (e.clientX - r.left < r.width / 3) prev(); else next();
  });
  frame.addEventListener('pointercancel', () => { clearTimeout(hold); setPaused(false); });
  closeBtn.addEventListener('click', close);
  muteBtn.addEventListener('click', () => { muted = !muted; if (video) video.muted = muted; setMuteIcon(); });
  document.addEventListener('keydown', onKey);
  try { history.pushState({ ...(history.state || {}), mxStory: true }, ''); } catch {}
  window.addEventListener('popstate', onPop);
  document.body.style.overflow = 'hidden';
  document.body.append(overlay);
  closeBtn.focus();
  render();
  last = performance.now();
  raf = requestAnimationFrame(tick);
  return close;
}

/** Storie di base di Maximize Academy: si vedono quando il team non ne ha caricate per oggi. */
export function baseSlides() {
  const s = (id, tipo, titolo, numero, testo, pulsante, link) => ({ id, tipo, titolo, numero, testo, media: null, pulsante, link, durata: tipo === 'numero' ? 6000 : 7000 });
  return [
    s('mx-base-sabey', 'testo', 'Quale Sabey fa per te?', '', 'Non è la mano che deve adattarsi alla forbice. È la forbice che deve adattarsi alla tua mano.', 'Trova la tua forbice', '/sabey#trova-forbice'),
    s('mx-base-reset', 'testo', 'Barber Reset', '', 'Listino, margini e vendita: scopri quanto puoi recuperare nella tua barberia.', 'Calcola il potenziale', '/barber-reset'),
    s('mx-base-formazione', 'testo', 'Formazione internazionale', '', 'Corsi con Maurizio Pizzuto: tecnica, comunicazione e business.', 'Vedi i corsi', '/formazione'),
    s('mx-base-eventi', 'testo', 'Eventi e networking', '', 'Barber Match e Men’s Events: palco, competizioni e incontri.', 'Scopri gli eventi', '/eventi'),
  ];
}

/** Cerchio «Novità» dentro l'elemento indicato. */
export default async function mountStories(box, logo = '/assets/img/logo-maximize.webp') {
  if (!box) return;
  let slides = await load();
  if (!slides.length) slides = baseSlides();
  const seen = readSeen();
  const label = 'Novità';
  const bubble = h('button', { type: 'button', class: 'story-bubble' },
    h('span', { class: 'story-ring' }, h('span', { class: 'story-ring__inner' }, h('img', { src: logo, alt: '', width: '56', height: '56', decoding: 'async' }))),
    h('span', { class: 'story-bubble__label', text: label }));
  const refresh = () => bubble.classList.toggle('is-seen', slides.every((x) => seen.has(x.id)));
  refresh();
  bubble.addEventListener('click', () => openViewer(slides, { label, onSeen: (id) => { seen.add(id); writeSeen(seen); }, onClose: refresh }));
  box.replaceChildren(bubble);
  box.hidden = false;
}
