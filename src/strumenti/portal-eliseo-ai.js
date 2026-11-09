// Eliseo · Addestramento, Automazioni e Prova del chatbot (come le sezioni di Keplero). Tabelle in supabase/eliseo-addestramento.sql.
// Quello che si scrive in FAQ, documenti, regole e orari lo legge l'assistente del sito: mai dati dei clienti.
import { respond } from './assistant/engine.js';
import { operatorsOnline } from './assistant/training.js';
import { promptsCard, sheetsCard } from './portal-eliseo-settings.js';
import assistantData from './dati/assistant.json';
import knowledgeData from './dati/knowledge.json';
import offersData from './dati/offers.json';
import hoursData from './dati/hours.json';
import sitemapXml from './dati/sitemap.xml?raw';

const DAY_NAMES = { lun: 'Lunedì', mar: 'Martedì', mer: 'Mercoledì', gio: 'Giovedì', ven: 'Venerdì', sab: 'Sabato', dom: 'Domenica' };
const WEEK = ['lun', 'mar', 'mer', 'gio', 'ven', 'sab', 'dom'];
const MOTIVI = [['informazioni', 'Informazioni'], ['formazione', 'Formazione'], ['lavoro', 'Lavoro'], ['regalo', 'Regalo']];
const FONTI = [['sito', 'Sito'], ['whatsapp', 'WhatsApp'], ['instagram', 'Instagram'], ['negozio', 'In negozio'], ['passaparola', 'Passaparola'], ['treatwell', 'Treatwell'], ['altro', 'Altro']];
const FASI = [['nuovo', 'Nuovo'], ['contattato', 'Contattato'], ['cliente', 'Cliente'], ['da_richiamare', 'Da richiamare'], ['perso', 'Perso']];
export const QUANDO = [['nuova_richiesta', 'Arriva una richiesta dal modulo'], ['nuova_chat', 'Un cliente apre la chat del sito'], ['nuovo_contatto', 'Si aggiunge un contatto'], ['cambio_fase', 'Un contatto cambia fase']];
export const AZIONI = {
  nuova_richiesta: [['assegna', 'Assegnala a'], ['crea_contatto', 'Crea il contatto (con etichetta)']],
  nuova_chat: [['assegna', 'Assegnala a']],
  nuovo_contatto: [['etichetta', 'Aggiungi l’etichetta'], ['fase', 'Mettilo nella fase'], ['barbiere', 'Barbiere preferito']],
  cambio_fase: [['etichetta', 'Aggiungi l’etichetta'], ['barbiere', 'Barbiere preferito']],
};
export const CONDIZIONI = { nuova_richiesta: ['Motivo', MOTIVI], nuova_chat: null, nuovo_contatto: ['Fonte', FONTI], cambio_fase: ['Nuova fase', FASI] };

// Testo leggibile di un'automazione: «Quando arriva una richiesta (Formazione) → assegnala a Gino».
export function describe(a) {
  const q = (QUANDO.find(([k]) => k === a.quando) || [0, a.quando])[1];
  const c = CONDIZIONI[a.quando] && a.condizione ? ` (${(CONDIZIONI[a.quando][1].find(([k]) => k === a.condizione) || [0, a.condizione])[1]})` : '';
  const az = ((AZIONI[a.quando] || []).find(([k]) => k === a.azione) || [0, a.azione])[1];
  const v = a.azione === 'fase' ? (FASI.find(([k]) => k === a.valore) || [0, a.valore])[1] : a.valore;
  return `${q}${c} → ${az}${v ? ` ${v}` : ''}`;
}

const FILE_TEXT = 20000;
const FILE_BYTES = 30 * 1024 * 1024;

function asU8(buf) {
  return buf instanceof Uint8Array ? buf : new Uint8Array(buf);
}

function findBytes(hay, needle, from) {
  outer: for (let i = from; i <= hay.length - needle.length; i++) {
    for (let j = 0; j < needle.length; j++) if (hay[i + j] !== needle[j]) continue outer;
    return i;
  }
  return -1;
}

async function inflateZip(data, format) {
  const stream = new Blob([data]).stream().pipeThrough(new DecompressionStream(format));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

async function zipEntry(buf, want) {
  try {
    const u8 = asU8(buf);
    const view = new DataView(u8.buffer, u8.byteOffset, u8.byteLength);
    let eocd = -1;
    for (let i = u8.length - 22; i >= Math.max(0, u8.length - 22 - 65535); i--) {
      if (view.getUint32(i, true) === 0x06054b50) { eocd = i; break; }
    }
    if (eocd < 0) return null;
    const count = view.getUint16(eocd + 10, true);
    let p = view.getUint32(eocd + 16, true);
    for (let n = 0; n < count && n < 4000; n++) {
      if (p + 46 > u8.length || view.getUint32(p, true) !== 0x02014b50) return null;
      const method = view.getUint16(p + 10, true);
      const comp = view.getUint32(p + 20, true);
      const nameLen = view.getUint16(p + 28, true);
      const extra = view.getUint16(p + 30, true);
      const comment = view.getUint16(p + 32, true);
      const local = view.getUint32(p + 42, true);
      const name = new TextDecoder().decode(u8.subarray(p + 46, p + 46 + nameLen));
      p += 46 + nameLen + extra + comment;
      if (name !== want) continue;
      if (local + 30 > u8.length) return null;
      const dataOff = local + 30 + view.getUint16(local + 26, true) + view.getUint16(local + 28, true);
      if (dataOff + comp > u8.length) return null;
      const data = u8.subarray(dataOff, dataOff + comp);
      if (method === 0) return data;
      if (method === 8) return await inflateZip(data, 'deflate-raw');
      return null;
    }
  } catch { /* un file rotto non deve bloccare la schermata */ }
  return null;
}

function xmlDecode(s) {
  return s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&apos;/g, "'");
}

function pdfUnescape(s) {
  return s.replace(/\\([nrtbf()\\]|[0-7]{1,3})/g, (_, e) => {
    if (e === 'n') return '\n';
    if (e === 'r') return '\r';
    if (e === 't') return '\t';
    if (e === 'b') return '\b';
    if (e === 'f') return '\f';
    if (e === '(' || e === ')' || e === '\\') return e;
    return String.fromCharCode(parseInt(e, 8));
  });
}

function pdfPieces(content) {
  if (!content.includes('Tj') && !content.includes('TJ')) return '';
  const out = [];
  const re = /\((?:\\.|[^\\)])*\)|<([0-9A-Fa-f\s]{4,})>/g;
  let m;
  while ((m = re.exec(content))) {
    if (m[0].startsWith('(')) out.push(pdfUnescape(m[0].slice(1, -1)));
    else {
      const hex = m[1].replace(/\s/g, '');
      if (!hex || hex.length % 2) continue;
      const bytes = new Uint8Array(hex.length / 2);
      for (let i = 0; i < bytes.length; i++) bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
      out.push(bytes[0] === 0xfe && bytes[1] === 0xff ? new TextDecoder('utf-16be').decode(bytes.subarray(2)) : new TextDecoder('latin1').decode(bytes));
    }
  }
  return out.join(' ').replace(/[ \t]{2,}/g, ' ').trim();
}

async function pdfText(buf) {
  const u8 = asU8(buf);
  const stream = [115, 116, 114, 101, 97, 109];
  const end = [101, 110, 100, 115, 116, 114, 101, 97, 109];
  const parts = [];
  let i = 0;
  for (let guard = 0; guard < 80 && i < u8.length && parts.join('\n').length < FILE_TEXT; guard++) {
    const at = findBytes(u8, stream, i);
    if (at < 0) break;
    if (at >= 3 && u8[at - 3] === 101 && u8[at - 2] === 110 && u8[at - 1] === 100) { i = at + 6; continue; }
    const head = new TextDecoder('latin1').decode(u8.subarray(Math.max(0, at - 500), at));
    let dataStart = at + 6;
    if (u8[dataStart] === 13) dataStart++;
    if (u8[dataStart] === 10) dataStart++;
    const lens = [...head.matchAll(/\/Length\s+(\d+)/g)];
    const len = lens.length ? Number(lens[lens.length - 1][1]) : 0;
    let dataEnd = dataStart;
    if (len > 0 && dataStart + len <= u8.length) dataEnd = dataStart + len;
    else {
      const stop = findBytes(u8, end, dataStart);
      dataEnd = stop < 0 ? Math.min(u8.length, dataStart + 200000) : stop;
    }
    let content = '';
    try {
      const data = u8.subarray(dataStart, dataEnd);
      const near = head.slice(-180);
      if (/FlateDecode/.test(near)) {
        let inflated;
        try { inflated = await inflateZip(data, 'deflate'); } catch { inflated = await inflateZip(data, 'deflate-raw'); }
        content = new TextDecoder('latin1').decode(inflated.subarray(0, 200000));
      } else if (!/\/(?:Image|DCTDecode|JPXDecode|CCITTFaxDecode)\b/.test(near)) {
        content = new TextDecoder('latin1').decode(data.subarray(0, 200000));
      }
    } catch { content = ''; }
    const piece = pdfPieces(content);
    if (piece) parts.push(piece);
    i = Math.max(dataEnd, at + 6);
  }
  return parts.join('\n').trim();
}

async function docxText(buf) {
  const xml = await zipEntry(buf, 'word/document.xml');
  if (!xml) return '';
  const s = new TextDecoder('utf-8').decode(xml);
  return s.split(/<w:p\b/).slice(1).map((p) => [...p.matchAll(/<w:t\b[^>]*>([^<]*)<\/w:t>/g)].map((m) => xmlDecode(m[1])).join('')).filter((p) => p.trim()).join('\n').trim();
}

// Testo che l'assistente può tenere: al massimo 20.000 caratteri. Il file intero non si salva.
export async function readEliseoFile(name, buf) {
  const kind = (/\.([a-z0-9]+)$/i.exec(name || '') || [])[1]?.toLowerCase() || '';
  if (!['pdf', 'docx', 'csv', 'tsv', 'txt', 'md'].includes(kind)) return { error: 'Accettiamo PDF, DOCX, CSV e TSV.' };
  const u8 = asU8(buf);
  if (u8.byteLength > FILE_BYTES) return { error: 'Il file supera i 30 MB.' };
  if (!u8.byteLength) return { error: 'Questo file è vuoto.' };
  let text = '';
  try {
    if (kind === 'pdf') text = await pdfText(u8);
    else if (kind === 'docx') text = await docxText(u8);
    else text = new TextDecoder('utf-8').decode(u8);
  } catch { text = ''; }
  text = text.replace(/^\uFEFF/, '').replace(/\u0000/g, '').replace(/\r\n/g, '\n').trim();
  const marks = (text.match(/[A-Za-zÀ-ÿ0-9]/g) || []).length;
  if (!text || ((kind === 'pdf' || kind === 'docx') && marks < 8)) {
    return { paste: true, error: 'Da questo file non esce il testo. Aprilo, copia il contenuto e incollalo qui.' };
  }
  return { text: text.slice(0, FILE_TEXT), cut: text.length > FILE_TEXT };
}

export function mountAi(kind, ui) {
  const { h, card, call, say, select, team } = ui;
  const field = (lab, input, hint) => h('div', { class: 'field' }, h('label', null, h('span', { text: lab }), input), hint ? h('p', { class: 'field__hint', text: hint }) : null);
  const missing = () => [card(null, h('p', { class: 'pcard__note', text: 'Manca un passaggio una tantum: va eseguito il file supabase/eliseo-addestramento.sql in Supabase (lo fa Eliseo). Poi ricarica la pagina.' }))];
  const wrap = h('div', { class: 'el-ai' }, h('p', { class: 'pempty', text: 'Carico…' }));
  const fail = (e) => wrap.replaceChildren(...(e.message === 'sql' ? missing() : [card(null, h('p', { class: 'pcard__note', text: e.message }))]));

  // ——— Addestramento: una voce alla volta, scelta dal menu a sinistra ———
  const sub = ui.sub || 'faq';
  async function drawTraining() {
    let faq, docs, conf, vers;
    try {
      [faq, docs, [conf], vers] = await Promise.all([
        call('/rest/v1/eliseo_faq?select=*&order=cartella,domanda'),
        call('/rest/v1/eliseo_documenti?select=*&order=titolo'),
        call('/rest/v1/eliseo_assistente?select=*&id=eq.1'),
        call('/rest/v1/eliseo_assistente_versioni?select=*&order=creato_il.desc&limit=30'),
      ]);
    } catch (e) {
      if (e.message === 'sql' && (sub === 'faq' || sub === 'sito' || sub === 'documenti' || sub === 'istruzioni')) {
        const view = sub === 'faq' ? faqView([], true) : sub === 'sito' ? siteView() : sub === 'documenti' ? docsView([], true) : promptView(null, [], true);
        wrap.replaceChildren(...view);
        return;
      }
      fail(e); return;
    }
    const views = { faq: () => faqView(faq), sito: siteView, documenti: () => [...[].concat(docsView(docs)), sheetsCard(conf, ui, drawTraining)], istruzioni: () => [...promptView(conf, vers), promptsCard(conf, ui)], passaggio: () => handoffView(conf) };
    wrap.replaceChildren(...[].concat(views[sub]()));
  }

  function faqView(list, blocked) {
    const sqlNote = 'Manca un passaggio una tantum: va eseguito il file supabase/eliseo-addestramento.sql in Supabase (lo fa Eliseo). Poi ricarica la pagina.';
    const whenFaq = (iso) => (iso ? new Date(iso).toLocaleDateString('it-IT', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Europe/Rome' }) : '');
    const picked = new Set();
    let armed = false;
    const editor = h('div', { class: 'el-faq__editor' });
    const form = (f) => {
      const el = h('form', { class: 'el-form', novalidate: true });
      const cartella = h('input', { name: 'cartella', maxlength: 40, value: f?.cartella || 'Generale', list: 'el-cartelle' });
      const dl = h('datalist', { id: 'el-cartelle' }, [...new Set(list.map((x) => x.cartella))].map((c) => h('option', { value: c })));
      const domanda = h('input', { name: 'domanda', maxlength: 200, value: f?.domanda || '', required: true });
      const parole = h('input', { name: 'parole', maxlength: 300, value: f?.parole || '', placeholder: 'es. spostare, anticipare, cambiare orario' });
      const risposta = h('textarea', { name: 'risposta', maxlength: 1000, rows: 3, required: true }); risposta.value = f?.risposta || '';
      const attiva = h('input', { type: 'checkbox', name: 'attiva' }); attiva.checked = f ? f.attiva : true;
      const err = h('p', { class: 'field__error', role: 'alert' });
      const save = h('button', { type: 'submit', class: 'btn btn--primary', text: f ? 'Salva' : 'Aggiungi FAQ' });
      const close = h('button', { type: 'button', class: 'btn btn--secondary', text: 'Chiudi' });
      const acts = h('div', { class: 'actions' }, save, close);
      if (f) {
        let delArmed = false; const del = h('button', { type: 'button', class: 'btn btn--secondary el-del', text: 'Elimina' });
        del.addEventListener('click', async () => { if (!delArmed) { delArmed = true; del.textContent = 'Conferma: elimina'; del.classList.add('is-armed'); return; } try { await call(`/rest/v1/eliseo_faq?id=eq.${f.id}`, { method: 'DELETE' }); say('FAQ eliminata.'); drawTraining(); } catch (e) { err.textContent = e.message; } });
        acts.append(del);
      }
      close.addEventListener('click', () => editor.replaceChildren());
      el.append(h('div', { class: 'el-grid' }, field('Cartella', h('span', null, cartella, dl)), field('Domanda', domanda)), field('Parole chiave', parole, 'Separate da virgola: altri modi in cui i clienti lo chiedono. Aiutano l’assistente a riconoscere la domanda.'), field('Risposta', risposta, 'Breve e chiara. Massimo 1000 caratteri. Niente promesse sulla salute.'), h('label', { class: 'el-consent' }, attiva, h('span', { text: 'Attiva (la usa l’assistente del sito)' })), err, acts);
      el.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (blocked) { err.textContent = sqlNote; return; }
        const row = { cartella: cartella.value.trim().slice(0, 40) || 'Generale', domanda: domanda.value.trim().slice(0, 200), parole: parole.value.trim().slice(0, 300), risposta: risposta.value.trim().slice(0, 1000), attiva: attiva.checked };
        if (row.domanda.length < 3 || !row.risposta) { err.textContent = 'Scrivi domanda e risposta.'; return; }
        save.disabled = true;
        try { await call(f ? `/rest/v1/eliseo_faq?id=eq.${f.id}` : '/rest/v1/eliseo_faq', { method: f ? 'PATCH' : 'POST', body: row, prefer: 'return=minimal' }); say('FAQ salvata.'); drawTraining(); }
        catch (ex) { err.textContent = ex.message; save.disabled = false; }
      });
      domanda.focus();
      return el;
    };
    const showEditor = (f) => {
      editor.replaceChildren(h('section', { class: 'pcard' }, h('h3', { class: 'pcard__title', text: f ? 'Modifica FAQ' : 'Nuova FAQ' }), form(f)));
    };
    const q = h('input', { type: 'search', class: 'el-search', placeholder: 'Trova FAQ', 'aria-label': 'Trova FAQ' });
    const lens = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    lens.setAttribute('viewBox', '0 0 24 24');
    lens.setAttribute('class', 'el-faq__lens');
    lens.setAttribute('aria-hidden', 'true');
    lens.setAttribute('fill', 'none');
    lens.setAttribute('stroke', 'currentColor');
    lens.setAttribute('stroke-width', '1.8');
    lens.setAttribute('stroke-linecap', 'round');
    const ring = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    ring.setAttribute('cx', '11'); ring.setAttribute('cy', '11'); ring.setAttribute('r', '6');
    const stick = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    stick.setAttribute('d', 'M16 16.5 20 20.5');
    lens.append(ring, stick);
    const find = h('label', { class: 'el-faq__find' }, lens, q);

    // Dropdown "+ Nuovo" in stile Keplero con opzioni: Nuova FAQ, Nuova cartella, Importa CSV
    const dropWrap = h('div', { class: 'el-faq__dropdown-wrap' });
    const nuovoBtn = h('button', {
      type: 'button',
      class: 'btn el-faq__btn-nuovo',
      'aria-haspopup': 'true',
      'aria-expanded': 'false',
      text: '+ Nuovo'
    });

    const dropMenu = h('div', { class: 'el-faq__dropdown', role: 'menu', hidden: true });

    const closeMenu = () => {
      dropMenu.hidden = true;
      nuovoBtn.setAttribute('aria-expanded', 'false');
    };
    const toggleMenu = (e) => {
      e.stopPropagation();
      const open = dropMenu.hidden;
      dropMenu.hidden = !open;
      nuovoBtn.setAttribute('aria-expanded', String(open));
    };
    nuovoBtn.addEventListener('click', toggleMenu);
    document.addEventListener('click', (e) => {
      if (!dropWrap.contains(e.target)) closeMenu();
    });

    const svgIcon = (paths) => {
      const el = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      el.setAttribute('viewBox', '0 0 24 24');
      el.setAttribute('fill', 'none');
      el.setAttribute('stroke', 'currentColor');
      el.setAttribute('stroke-width', '1.8');
      el.setAttribute('stroke-linecap', 'round');
      el.setAttribute('stroke-linejoin', 'round');
      el.setAttribute('aria-hidden', 'true');
      paths.forEach(([tag, attrs]) => {
        const n = document.createElementNS('http://www.w3.org/2000/svg', tag);
        Object.entries(attrs).forEach(([k, v]) => n.setAttribute(k, v));
        el.append(n);
      });
      return el;
    };

    const makeMenuItem = (label, iconPaths, onClick) => {
      const btn = h('button', { type: 'button', class: 'el-faq__dropdown-item', role: 'menuitem' },
        h('span', { class: 'el-faq__dropdown-ic' }, svgIcon(iconPaths)),
        h('span', { class: 'el-faq__dropdown-text', text: label })
      );
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeMenu();
        onClick();
      });
      return btn;
    };

    // 1. Nuova FAQ
    const itemNuovaFaq = makeMenuItem('Nuova FAQ', [
      ['circle', { cx: '12', cy: '12', r: '9' }],
      ['path', { d: 'M9.6 9.4a2.4 2.4 0 1 1 3.3 2.2c-.7.4-1.1.9-1.1 1.6M12 16.6h.01' }]
    ], () => showEditor(null));

    // 2. Nuova cartella
    const itemNuovaCartella = makeMenuItem('Nuova cartella', [
      ['path', { d: 'M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-6l-2-2H5a2 2 0 0 0-2 2z' }]
    ], () => {
      const nome = window.prompt('Inserisci il nome della nuova cartella per le FAQ:');
      if (nome && nome.trim()) {
        showEditor({ cartella: nome.trim() });
      }
    });

    // 3. Importa CSV
    const fileCsvInput = h('input', { type: 'file', accept: '.csv,text/csv', hidden: true });
    fileCsvInput.addEventListener('change', async () => {
      const file = fileCsvInput.files?.[0];
      if (!file) return;
      if (blocked) { say(sqlNote, true); return; }
      try {
        const text = await file.text();
        const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
        if (!lines.length) { say('Il file CSV è vuoto.', true); return; }

        let imported = 0;
        const startIndex = lines[0].toLowerCase().includes('domanda') || lines[0].toLowerCase().includes('question') ? 1 : 0;
        for (let i = startIndex; i < lines.length; i++) {
          const parts = lines[i].split(',').map((p) => p.replace(/^"|"$/g, '').trim());
          if (parts.length >= 2 && parts[0] && parts[1]) {
            const row = {
              domanda: parts[0].slice(0, 200),
              risposta: parts[1].slice(0, 1000),
              cartella: (parts[2] || 'Generale').slice(0, 40),
              parole: (parts[3] || '').slice(0, 300),
              attiva: true
            };
            await call('/rest/v1/eliseo_faq', { method: 'POST', body: row, prefer: 'return=minimal' });
            imported++;
          }
        }
        if (imported > 0) {
          say(`${imported} FAQ importate con successo!`);
          drawTraining();
        } else {
          say('Nessuna riga valida trovata nel file CSV. Formato atteso: Domanda,Risposta[,Cartella,Parole]', true);
        }
      } catch (err) {
        say('Errore durante l\'importazione: ' + (err.message || 'file non valido'), true);
      } finally {
        fileCsvInput.value = '';
      }
    });

    const itemImportaCsv = makeMenuItem('Importa CSV', [
      ['path', { d: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' }],
      ['polyline', { points: '17 8 12 3 7 8' }],
      ['line', { x1: '12', y1: '3', x2: '12', y2: '15' }]
    ], () => fileCsvInput.click());

    dropMenu.append(itemNuovaFaq, itemNuovaCartella, itemImportaCsv);
    dropWrap.append(nuovoBtn, dropMenu, fileCsvInput);
    const wipe = h('button', { type: 'button', class: 'btn btn--secondary', text: 'Elimina', hidden: true });
    const syncWipe = () => {
      wipe.hidden = picked.size === 0;
      if (!picked.size) { armed = false; wipe.textContent = 'Elimina'; return; }
      if (!armed) wipe.textContent = `Elimina ${picked.size}`;
    };
    wipe.addEventListener('click', async () => {
      if (!picked.size || blocked) return;
      if (!armed) { armed = true; wipe.textContent = `Conferma: elimina ${picked.size}`; return; }
      wipe.disabled = true;
      try {
        for (const id of picked) await call(`/rest/v1/eliseo_faq?id=eq.${id}`, { method: 'DELETE' });
        say(picked.size === 1 ? 'FAQ eliminata.' : 'FAQ eliminate.');
        drawTraining();
      } catch (e) { say(e.message, true); wipe.disabled = false; }
    });
    const box = h('div', { class: 'el-faq__list' });
    const paint = () => {
      const k = q.value.trim().toLowerCase();
      const shown = list.filter((f) => !k || `${f.domanda} ${f.risposta} ${f.parole} ${f.cartella}`.toLowerCase().includes(k))
        .slice().sort((a, b) => String(b.aggiornato_il || b.creato_il || '').localeCompare(String(a.aggiornato_il || a.creato_il || '')));
      box.replaceChildren();
      if (!shown.length) box.append(h('p', { class: 'pempty', text: blocked ? sqlNote : (list.length ? 'Nessuna FAQ trovata.' : 'Nessuna FAQ. Premi Nuovo per scriverne una.') }));
      shown.forEach((f) => {
        const tick = h('input', { type: 'checkbox', 'aria-label': `Seleziona «${f.domanda}»` });
        tick.checked = picked.has(f.id);
        tick.addEventListener('change', () => { if (tick.checked) picked.add(f.id); else picked.delete(f.id); syncWipe(); });
        const preview = f.risposta.length > 140 ? `${f.risposta.slice(0, 140)}…` : f.risposta;
        const open = h('button', { type: 'button', class: 'el-faq__open' },
          h('span', { class: 'el-faq__top' }, h('strong', { text: f.domanda }), h('time', { text: whenFaq(f.aggiornato_il || f.creato_il) })),
          h('span', { class: 'el-faq__prev', text: preview }));
        open.addEventListener('click', () => showEditor(f));
        box.append(h('article', { class: 'el-faq__row' }, tick, h('span', { class: 'el-faq__mark', 'aria-hidden': 'true', text: '✓', 'data-off': f.attiva ? false : '' }), open));
      });
      syncWipe();
    };
    q.addEventListener('input', paint); paint();
    return [
      h('header', { class: 'el-faq__head' }, h('h2', { text: 'FAQ' }), h('p', { text: 'Domande e risposte su cui si basa l’assistente, organizzate in cartelle.' })),
      h('div', { class: 'el-faq__tools' }, find, wipe, dropWrap),
      editor,
      h('p', { class: 'el-faq__all', text: 'Tutte le FAQ' }),
      box,
    ];
  }

  function siteScreen(readMap) {
    const svg = (parts) => {
      const el = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      el.setAttribute('viewBox', '0 0 24 24');
      el.setAttribute('fill', 'none');
      el.setAttribute('stroke', 'currentColor');
      el.setAttribute('stroke-width', '1.8');
      el.setAttribute('stroke-linecap', 'round');
      el.setAttribute('stroke-linejoin', 'round');
      el.setAttribute('aria-hidden', 'true');
      parts.forEach(([tag, attrs]) => {
        const n = document.createElementNS('http://www.w3.org/2000/svg', tag);
        Object.entries(attrs).forEach(([k, v]) => n.setAttribute(k, v));
        el.append(n);
      });
      return el;
    };
    const lens = svg([['circle', { cx: '11', cy: '11', r: '6' }], ['path', { d: 'M16 16.5 20 20.5' }]]);
    lens.setAttribute('class', 'el-faq__lens');
    const q = h('input', { type: 'search', class: 'el-search', placeholder: 'Trova un dominio', 'aria-label': 'Trova un dominio' });
    const find = h('label', { class: 'el-faq__find el-web__find' }, lens, q);
    const browse = h('button', { type: 'button', class: 'el-web__text', text: 'sfoglia le pagine' });
    const intro = h('p', { class: 'el-web__intro' }, 'Il sito pubblicato è già letto dall’assistente. Incolla un link per trovare una pagina, o ', browse, '.');
    const link = svg([['path', { d: 'M10 13a5 5 0 0 0 7.54.54l2-2a5 5 0 0 0-7.07-7.07l-1.15 1.15' }], ['path', { d: 'M14 11a5 5 0 0 0-7.54-.54l-2 2a5 5 0 0 0 7.07 7.07l1.15-1.15' }]]);
    link.setAttribute('class', 'el-faq__lens');
    const url = h('input', { type: 'url', class: 'el-search', placeholder: 'Inserisci un link (es. https://maurizio-barbershop.it/servizi/)', 'aria-label': 'Link del sito' });
    const add = h('button', { type: 'button', class: 'btn btn--secondary', text: '+ Aggiungi sito web' });
    const err = h('p', { class: 'field__error el-web__err', role: 'alert' });
    const all = h('input', { type: 'checkbox', 'aria-label': 'Seleziona i domini visibili' });
    const countLabel = h('span');
    const list = h('div', { class: 'el-faq__list' });
    let pages = [];
    let host = '';
    let whenText = 'a ogni pubblicazione';
    let ready = false;
    let openPages = false;
    let hit = '';
    let picked = false;
    const pathOf = (p) => { try { return new URL(p).pathname.replace(/\/$/, '') || '/'; } catch { return p; } };
    const paint = () => {
      const k = q.value.trim().toLowerCase();
      const show = Boolean(host) && (!k || host.toLowerCase().includes(k));
      countLabel.textContent = show ? '1 dominio' : (ready ? 'Nessun dominio' : 'Carico…');
      all.checked = show && picked;
      all.disabled = !show;
      list.replaceChildren();
      if (!ready) { list.append(h('p', { class: 'pempty', text: 'Carico…' })); return; }
      if (!host) { list.append(h('p', { class: 'pempty', text: 'Non riesco a leggere la mappa del sito.' })); return; }
      if (!show) { list.append(h('p', { class: 'pempty', text: 'Nessun dominio trovato.' })); return; }
      const tick = h('input', { type: 'checkbox', 'aria-label': `Seleziona ${host}` });
      tick.checked = picked;
      const refresh = h('button', { type: 'button', class: 'el-web__icon', 'aria-label': 'Rileggi la mappa del sito', title: 'Rileggi la mappa' }, svg([['path', { d: 'M21 12a9 9 0 0 1-15.5 6.3' }], ['path', { d: 'M3 12a9 9 0 0 1 15.5-6.3' }], ['path', { d: 'M21 4v5h-5' }], ['path', { d: 'M3 20v-5h5' }]]));
      const pencil = h('button', { type: 'button', class: 'el-web__icon', 'aria-label': 'Vedi le pagine', title: 'Vedi le pagine', 'aria-pressed': openPages ? 'true' : 'false' }, svg([['path', { d: 'M12 20h9' }], ['path', { d: 'M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z' }]]));
      refresh.addEventListener('click', () => reload(true));
      pencil.addEventListener('click', () => { openPages = !openPages; hit = ''; paint(); });
      const row = h('article', { class: picked ? 'el-web__row is-on' : 'el-web__row' },
        tick,
        h('strong', { class: 'el-web__host', text: host }),
        h('span', { class: 'el-web__meta' }, h('span', { text: `${pages.length} pagine` }), h('span', { text: whenText })),
        h('span', { class: 'el-web__icons' }, refresh, pencil));
      tick.addEventListener('change', () => { picked = tick.checked; all.checked = picked; row.classList.toggle('is-on', picked); });
      list.append(row);
      if (!openPages) return;
      const pagesBox = h('div', { class: 'el-web__pages' });
      pages.forEach((p) => {
        const a = h('a', { href: p, target: '_blank', rel: 'noopener noreferrer', text: pathOf(p) });
        if (hit && p === hit) a.classList.add('is-hit');
        pagesBox.append(a);
      });
      list.append(pagesBox);
      const marked = pagesBox.querySelector('.is-hit');
      if (marked) {
        const top = marked.getBoundingClientRect().top - pagesBox.getBoundingClientRect().top;
        pagesBox.scrollTop += top - 8;
      }
    };
    async function reload(announce) {
      err.textContent = '';
      try {
        const got = await readMap();
        pages = [...String(got.map || '').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
        try { host = new URL(pages[0]).hostname.replace(/^www\./, ''); } catch { host = ''; }
        whenText = got.when || 'a ogni pubblicazione';
        if (!pages.length || !host) throw new Error('mappa');
        url.placeholder = `Inserisci un link (es. https://${host}/servizi/)`;
        if (announce) say('Mappa riletta.');
      } catch {
        pages = [];
        host = '';
        if (announce) say('Non riesco a leggere la mappa del sito.', true);
      }
      ready = true;
      paint();
    }
    const findPage = () => {
      err.textContent = '';
      const raw = url.value.trim();
      if (!raw) { err.textContent = 'Inserisci un link.'; return; }
      let parsed;
      try { parsed = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`); }
      catch { err.textContent = 'Questo link non è valido.'; return; }
      const name = parsed.hostname.replace(/^www\./, '');
      if (!host || name.toLowerCase() !== host.toLowerCase()) {
        err.textContent = host ? `L’assistente legge solo il sito pubblicato, ${host}.` : 'Non riesco a leggere la mappa del sito.';
        return;
      }
      const path = parsed.pathname.replace(/\/$/, '') || '/';
      q.value = '';
      if (path === '/') { openPages = false; hit = ''; say(`${host} è già il sito che l’assistente legge.`); paint(); return; }
      const found = pages.find((p) => pathOf(p) === path);
      if (!found) { openPages = true; hit = ''; err.textContent = 'Questa pagina non è nella mappa pubblicata.'; paint(); return; }
      openPages = true;
      hit = found;
      say('Pagina trovata.');
      paint();
    };
    add.addEventListener('click', findPage);
    url.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); findPage(); } });
    browse.addEventListener('click', () => { openPages = true; paint(); });
    q.addEventListener('input', paint);
    all.addEventListener('change', () => { picked = all.checked; paint(); });
    reload(false);
    return [
      h('header', { class: 'el-faq__head' }, h('h2', { text: 'Sito web' }), h('p', { text: 'Le pagine del sito che l’assistente legge per rispondere, allineate ai contenuti online.' })),
      find,
      intro,
      h('div', { class: 'el-web__add' }, h('label', { class: 'el-faq__find' }, link, url), add),
      err,
      h('p', { class: 'el-web__count' }, all, countLabel),
      list,
    ];
  }

  function siteView() {
    return siteScreen(async () => ({ map: sitemapXml, when: 'a ogni pubblicazione' }));
  }

  function docsView(list, blocked) {
    const sqlNote = 'Manca un passaggio una tantum: va eseguito il file supabase/eliseo-addestramento.sql in Supabase (lo fa Eliseo). Poi ricarica la pagina.';
    const svg = (parts) => {
      const el = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      el.setAttribute('viewBox', '0 0 24 24');
      el.setAttribute('fill', 'none');
      el.setAttribute('stroke', 'currentColor');
      el.setAttribute('stroke-width', '1.8');
      el.setAttribute('stroke-linecap', 'round');
      el.setAttribute('stroke-linejoin', 'round');
      el.setAttribute('aria-hidden', 'true');
      parts.forEach(([tag, attrs]) => {
        const n = document.createElementNS('http://www.w3.org/2000/svg', tag);
        Object.entries(attrs).forEach(([k, v]) => n.setAttribute(k, v));
        el.append(n);
      });
      return el;
    };
    const google = () => {
      const el = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      el.setAttribute('viewBox', '0 0 48 48');
      el.setAttribute('aria-hidden', 'true');
      [['#FFC107', 'M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 8 3.1l5.7-5.7C34.2 6.1 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z'],
        ['#FF3D00', 'M6.3 14.7l6.6 4.8C14.7 16 19 12 24 12c3.1 0 5.8 1.2 8 3.1l5.7-5.7C34.2 6.1 29.4 4 24 4 16.3 4 9.6 8.3 6.3 14.7z'],
        ['#4CAF50', 'M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.3 0-9.7-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z'],
        ['#1976D2', 'M43.6 20.5H42V20H24v8h11.3c-1.1 3.2-3.5 5.7-6.5 7.1l6.2 5.2C37.4 38.4 44 34 44 24c0-1.3-.1-2.7-.4-3.5z'],
      ].forEach(([fill, d]) => {
        const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        p.setAttribute('fill', fill);
        p.setAttribute('d', d);
        el.append(p);
      });
      return el;
    };
    const sizeLabel = (text) => {
      const n = new TextEncoder().encode(text || '').length;
      if (n >= 100000) return `${(n / 1000000).toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MB`;
      if (n >= 1000) return `${Math.round(n / 1000).toLocaleString('it-IT')} KB`;
      return `${n.toLocaleString('it-IT')} B`;
    };
    const whenFile = (iso) => (iso ? new Date(iso).toLocaleString('it-IT', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Rome' }) : '');
    const err = h('p', { class: 'field__error el-web__err', role: 'alert' });
    const note = h('p', { class: 'el-file__note' });
    const editor = h('div', { class: 'el-faq__editor' });
    const box = h('div', { class: 'el-file__list' });
    let busy = false;
    let armed = null;
    const openEditor = (d, preset) => {
      const el = h('form', { class: 'el-form', novalidate: true });
      const titolo = h('input', { name: 'titolo', maxlength: 120, value: d?.titolo || preset?.titolo || '', required: true });
      const testo = h('textarea', { name: 'testo', maxlength: 20000, rows: 8, required: true });
      testo.value = d?.testo || '';
      const count = h('p', { class: 'field__hint', 'aria-live': 'polite' });
      const upd = () => { count.textContent = `${testo.value.length} / 20.000 caratteri`; };
      testo.addEventListener('input', upd); upd();
      const attiva = h('input', { type: 'checkbox', name: 'attivo' });
      attiva.checked = d ? d.attivo : true;
      const formErr = h('p', { class: 'field__error', role: 'alert' });
      if (preset?.error) formErr.textContent = preset.error;
      const save = h('button', { type: 'submit', class: 'btn btn--primary', text: d ? 'Salva' : 'Aggiungi file' });
      const close = h('button', { type: 'button', class: 'btn btn--secondary', text: 'Chiudi' });
      close.addEventListener('click', () => editor.replaceChildren());
      el.append(field('Nome', titolo), field('Testo', testo, 'Solo informazioni che possono leggere tutti. L’assistente usa questo testo per rispondere.'), count, h('label', { class: 'el-consent' }, attiva, h('span', { text: 'Attivo: l’assistente lo legge' })), formErr, h('div', { class: 'actions' }, save, close));
      el.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (blocked) { formErr.textContent = sqlNote; return; }
        const row = { titolo: titolo.value.trim().slice(0, 120), testo: testo.value.trim().slice(0, 20000), attivo: attiva.checked };
        if (!row.titolo || !row.testo) { formErr.textContent = 'Scrivi il nome e il testo.'; return; }
        save.disabled = true;
        try {
          await call(d ? `/rest/v1/eliseo_documenti?id=eq.${d.id}` : '/rest/v1/eliseo_documenti', { method: d ? 'PATCH' : 'POST', body: row, prefer: 'return=minimal' });
          say(testo.value.trim().length > 20000 ? 'File salvato: ho tenuto i primi 20.000 caratteri, il massimo che l’assistente legge.' : 'File salvato. L’assistente lo legge.');
          drawTraining();
        } catch (ex) { formErr.textContent = ex.message === 'sql' ? sqlNote : ex.message; save.disabled = false; }
      });
      editor.replaceChildren(h('section', { class: 'pcard' }, h('h3', { class: 'pcard__title', text: d ? 'Testo del file' : 'Incolla il testo' }), el));
      testo.focus();
    };
    const paint = () => {
      const rows = list.slice().sort((a, b) => String(b.aggiornato_il || b.creato_il || '').localeCompare(String(a.aggiornato_il || a.creato_il || '')));
      box.replaceChildren();
      if (!rows.length) box.append(h('p', { class: 'pempty', text: blocked ? sqlNote : 'Nessun file caricato.' }));
      rows.forEach((d) => {
        const open = h('button', { type: 'button', class: 'el-file__open' }, h('strong', { text: d.titolo }), h('time', { text: whenFile(d.aggiornato_il || d.creato_il) }));
        open.addEventListener('click', () => openEditor(d));
        const glyph = svg([['path', { d: 'M7 3.5h7l4 4V20.5H7z' }], ['path', { d: 'M14 3.5V8h4M9 12h6M9 16h4' }]]);
        glyph.setAttribute('class', 'el-file__glyph');
        const del = h('button', { type: 'button', class: 'el-web__icon el-file__del', 'aria-label': `Elimina ${d.titolo}` }, svg([['path', { d: 'M4 7h16M9 7V5h6v2M7 7l1 13h8l1-13M10 11v6M14 11v6' }]]));
        del.dataset.label = `Elimina ${d.titolo}`;
        del.addEventListener('click', async () => {
          if (blocked) { err.textContent = sqlNote; return; }
          if (armed !== d.id) {
            armed = d.id;
            box.querySelectorAll('.el-file__del').forEach((n) => { n.classList.remove('is-armed'); n.setAttribute('aria-label', n.dataset.label); });
            del.classList.add('is-armed');
            del.setAttribute('aria-label', `Conferma: elimina ${d.titolo}`);
            return;
          }
          del.disabled = true;
          try { await call(`/rest/v1/eliseo_documenti?id=eq.${d.id}`, { method: 'DELETE' }); say('File eliminato.'); drawTraining(); }
          catch (ex) { err.textContent = ex.message === 'sql' ? sqlNote : ex.message; del.disabled = false; }
        });
        box.append(h('article', { class: 'el-file__row' }, h('span', { class: 'el-faq__mark', 'aria-hidden': 'true', text: '✓', 'data-off': d.attivo ? false : '' }), glyph, open, h('span', { class: 'el-file__size', text: sizeLabel(d.testo) }), del));
      });
    };
    const input = h('input', { type: 'file', class: 'el-file__pick', multiple: true, accept: '.pdf,.docx,.csv,.tsv,.txt,.md,application/pdf,text/csv,text/plain', 'aria-label': 'Scegli un file' });
    const takeFiles = async (files) => {
      const arr = [...(files || [])];
      if (!arr.length || busy) return;
      note.textContent = '';
      err.textContent = '';
      if (blocked) { err.textContent = sqlNote; input.value = ''; return; }
      busy = true;
      let saved = 0;
      let cut = false;
      let paste = false;
      try {
        for (const file of arr) {
          const read = await readEliseoFile(file.name, await file.arrayBuffer());
          if (read.error) {
            err.textContent = read.error;
            if (read.paste) { paste = true; openEditor(null, { titolo: (file.name || 'File').slice(0, 120), error: read.error }); }
            break;
          }
          await call('/rest/v1/eliseo_documenti', { method: 'POST', body: { titolo: (file.name || 'File').slice(0, 120), testo: read.text, attivo: true }, prefer: 'return=minimal' });
          saved += 1;
          cut = cut || read.cut;
        }
      } catch (ex) {
        err.textContent = ex.message === 'sql' ? sqlNote : ex.message;
      }
      busy = false;
      input.value = '';
      if (saved && !paste) {
        say(cut ? 'File salvato: ho tenuto i primi 20.000 caratteri, il massimo che l’assistente legge.' : (saved > 1 ? 'File salvati. L’assistente li legge.' : 'File salvato. L’assistente lo legge.'));
        drawTraining();
      } else if (saved) say('Ho salvato i file letti. Per l’ultimo, incolla il testo nel riquadro.');
    };
    input.addEventListener('change', () => takeFiles(input.files));
    const dropIcon = svg([['path', { d: 'M7 3.5h7l4 4V20.5H7z' }], ['path', { d: 'M14 3.5V8h4M9 13h6M9 16.5h4' }]]);
    dropIcon.setAttribute('class', 'el-file__ico');
    const zone = h('div', { class: 'el-file__drop', role: 'button', tabindex: '0', 'aria-label': 'Carica o trascina il tuo file qui' }, dropIcon, h('strong', { text: 'Carica o trascina il tuo file qui' }), h('span', { text: 'Accettiamo .pdf .docx .csv .tsv fino a 30MB' }), input);
    zone.addEventListener('click', (e) => { if (e.target !== input) input.click(); });
    zone.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); input.click(); } });
    zone.addEventListener('dragover', (e) => { e.preventDefault(); zone.classList.add('is-over'); });
    zone.addEventListener('dragleave', () => zone.classList.remove('is-over'));
    zone.addEventListener('drop', (e) => { e.preventDefault(); zone.classList.remove('is-over'); takeFiles(e.dataTransfer?.files); });
    const sheet = h('button', { type: 'button', class: 'el-file__sheet' }, google(), h('span', { text: 'Collega Google Sheet' }));
    sheet.addEventListener('click', () => { err.textContent = ''; note.textContent = 'Google Sheet non è collegato. Esporta il foglio in CSV o TSV e trascinalo qui.'; });
    paint();
    return [
      h('header', { class: 'el-faq__head' }, h('h2', { text: 'File' }), h('p', { text: 'Documenti e fogli di calcolo che l’assistente legge per rispondere.' })),
      zone,
      h('p', { class: 'el-file__or' }, h('span', { text: 'o' })),
      h('div', { class: 'el-file__sheetwrap' }, sheet),
      note,
      err,
      editor,
      h('p', { class: 'el-faq__all', text: 'File di testo' }),
      box,
    ];
  }

  function promptView(conf, vers, blocked) {
    const sqlNote = 'Manca un passaggio una tantum: va eseguito il file supabase/eliseo-addestramento.sql in Supabase (lo fa Eliseo). Poi ricarica la pagina.';
    const svg = (parts) => {
      const el = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      el.setAttribute('viewBox', '0 0 24 24');
      el.setAttribute('fill', 'none');
      el.setAttribute('stroke', 'currentColor');
      el.setAttribute('stroke-width', '1.8');
      el.setAttribute('stroke-linecap', 'round');
      el.setAttribute('stroke-linejoin', 'round');
      el.setAttribute('aria-hidden', 'true');
      parts.forEach(([tag, attrs]) => {
        const n = document.createElementNS('http://www.w3.org/2000/svg', tag);
        Object.entries(attrs).forEach(([k, v]) => n.setAttribute(k, v));
        el.append(n);
      });
      return el;
    };
    const list = Array.isArray(vers) ? vers : [];
    const stored = (conf && conf.istruzioni) || '';
    const note = h('p', { class: 'el-file__note' });
    const err = h('p', { class: 'el-web__err', role: 'alert' });
    const ta = h('textarea', { class: 'el-prompt__text', maxlength: 10000, rows: 14, 'aria-label': 'Prompt' });
    ta.value = stored;
    const count = h('span', { class: 'el-prompt__count' });
    const label = h('span', { text: 'Salvato' });
    const state = h('span', { class: 'el-prompt__state' }, h('i', { class: 'el-prompt__dot', 'aria-hidden': 'true' }), label);
    const save = h('button', { type: 'button', class: 'btn btn--primary el-prompt__save', text: 'Salva' });
    const mark = () => {
      count.textContent = `${ta.value.length.toLocaleString('it-IT')} / 10.000`;
      const dirty = ta.value !== stored;
      label.textContent = blocked ? 'In attesa' : (dirty ? 'Modificato' : 'Salvato');
      if (blocked) state.dataset.wait = '1'; else delete state.dataset.wait;
      if (dirty && !blocked) state.dataset.dirty = '1'; else delete state.dataset.dirty;
      save.disabled = blocked || !dirty;
    };
    ta.addEventListener('input', mark);
    save.addEventListener('click', async () => {
      if (blocked) { err.textContent = sqlNote; return; }
      save.disabled = true;
      try {
        await call('/rest/v1/eliseo_assistente?id=eq.1', { method: 'PATCH', body: { istruzioni: ta.value.slice(0, 10000) }, prefer: 'return=minimal' });
        say('Istruzioni salvate. La versione di prima è nella cronologia.');
        drawTraining();
      } catch (e) { err.textContent = e.message === 'sql' ? sqlNote : e.message; save.disabled = false; }
    });
    const ask = h('textarea', { class: 'el-prompt__ask', rows: 2, maxlength: 300, placeholder: 'Es. "Rispondi in modo più breve e chiudi sempre con una domanda"', 'aria-label': 'Cosa cambiare nel prompt' });
    const apply = () => {
      err.textContent = '';
      if (blocked) { err.textContent = sqlNote; return; }
      const phrase = ask.value.trim().replace(/\s+/g, ' ').slice(0, 300);
      if (!phrase) { err.textContent = 'Scrivi cosa cambiare.'; return; }
      if (ta.value.includes(phrase)) { note.textContent = 'Questa frase è già nel prompt.'; return; }
      const next = `${ta.value.trim()}\n${phrase}`.trim();
      ta.value = next.slice(0, 10000);
      ask.value = '';
      note.textContent = next.length > 10000
        ? 'Ho aggiunto la frase e ho tenuto i primi 10.000 caratteri. Leggila e premi Salva.'
        : 'La riscrittura automatica è spenta. Ho aggiunto la frase nel prompt: leggila e premi Salva.';
      mark();
    };
    ask.addEventListener('keydown', (e) => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); apply(); } });
    const onKey = (e) => {
      if (!ask.isConnected) { wrap.removeEventListener('keydown', onKey); return; }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k' && !e.shiftKey && !e.altKey) { e.preventDefault(); ask.focus(); }
    };
    if (wrap._pk) wrap.removeEventListener('keydown', wrap._pk);
    wrap._pk = onKey;
    wrap.addEventListener('keydown', onKey);
    const go = h('button', { type: 'button', class: 'el-prompt__go' }, svg([['path', { d: 'M12 3.2 13.1 8.2 18 9.2 13.1 10.3 12 15.2 10.9 10.3 6 9.2 10.9 8.2z' }]]), h('span', { text: 'Migliora' }));
    go.addEventListener('click', apply);
    const chips = h('div', { class: 'el-prompt__chips', role: 'group', 'aria-label': 'Frasi pronte' });
    ['Rispondi in modo più breve', 'Usa un tono più caldo e amichevole', 'Usa un tono più formale', 'Usa elenchi puntati nelle risposte lunghe', 'Chiedi sempre nome ed email del cliente'].forEach((phrase) => {
      const b = h('button', { type: 'button', class: 'el-prompt__chip', text: phrase });
      b.addEventListener('click', () => { ask.value = phrase; apply(); });
      chips.append(b);
    });
    const spark = svg([['path', { d: 'M12 3.2 13.1 8.2 18 9.2 13.1 10.3 12 15.2 10.9 10.3 6 9.2 10.9 8.2z' }], ['path', { d: 'M18 14.2 18.5 16 20.3 16.5 18.5 17 18 18.8 17.5 17 15.7 16.5 17.5 16z' }]]);
    const clock = svg([['circle', { cx: '12', cy: '12', r: '8' }], ['path', { d: 'M12 8v4.5l2.5 1.5' }]]);
    clock.setAttribute('class', 'el-prompt__clock');
    const log = h('div', { class: 'el-prompt__log', hidden: true });
    if (blocked) log.append(h('p', { text: sqlNote }));
    else if (!list.length) log.append(h('p', { text: 'Nessuna versione precedente.' }));
    list.forEach((v) => {
      const when = v.creato_il ? new Date(v.creato_il).toLocaleString('it-IT', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Rome' }) : '';
      const preview = (v.istruzioni || '').replace(/\s+/g, ' ').trim();
      const use = h('button', { type: 'button', class: 'el-prompt__use', text: 'Usa questa versione' });
      use.addEventListener('click', () => {
        ta.value = v.istruzioni || '';
        err.textContent = '';
        note.textContent = 'Versione caricata nel riquadro. Premi Salva per usarla.';
        mark();
      });
      log.append(h('div', { class: 'el-prompt__ver' }, h('div', null, h('strong', { text: when }), h('span', { text: preview.length > 90 ? `${preview.slice(0, 90)}…` : preview })), use));
    });
    const hist = h('button', { type: 'button', class: 'el-prompt__hist', 'aria-expanded': 'false' }, clock, h('span', { text: 'Cronologia versioni' }), h('b', { text: String(list.length) }));
    hist.addEventListener('click', () => {
      const open = log.hasAttribute('hidden');
      if (open) log.removeAttribute('hidden'); else log.setAttribute('hidden', '');
      hist.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    if (blocked) note.textContent = sqlNote;
    mark();
    return [
      h('div', { class: 'el-prompt__top' }, h('header', { class: 'el-faq__head' }, h('h2', { text: 'Prompt dell’assistente' }), h('p', { text: 'Le istruzioni che l’assistente segue in ogni conversazione: chi è, come parla, cosa deve e non deve fare.' })), hist),
      log,
      h('section', { class: 'el-prompt__card' },
        h('div', { class: 'el-prompt__aihead' }, h('span', { class: 'el-prompt__spark' }, spark), h('div', null, h('h3', { text: 'Migliora con l’AI' }), h('p', { text: 'Descrivi con parole tue cosa cambiare. La frase viene aggiunta al prompt, così la leggi prima di salvare.' })), h('span', { class: 'el-prompt__keys' }, h('kbd', { text: 'Ctrl' }), h('kbd', { text: 'K' }))),
        ask,
        h('div', { class: 'el-prompt__apply' }, h('p', { class: 'el-prompt__hint' }, h('kbd', { text: 'Ctrl' }), h('kbd', { text: '↵' }), h('span', { text: 'per applicare' })), go),
        chips,
        note,
        err),
      h('section', { class: 'el-prompt__card el-prompt__editor' },
        h('div', { class: 'el-prompt__bar' }, h('div', { class: 'el-prompt__name' }, h('strong', { text: 'Prompt' }), state), h('div', { class: 'el-prompt__meta' }, save, count)),
        ta),
    ];
  }

  function handoffView(conf) {
    const esc = h('input', { type: 'checkbox', name: 'escalation' }); esc.checked = conf.escalation_attiva;
    const free = h('input', { type: 'checkbox', name: 'testo_libero' }); free.checked = conf.testo_libero;
    let regole = Array.isArray(conf.regole) ? conf.regole.map((r) => ({ ...r })) : [];
    const rb = h('div', { class: 'el-models' });
    const paintRules = () => {
      rb.replaceChildren(h('ul', { class: 'plist' },
        h('li', null, h('strong', { text: 'Il cliente vuole parlare con una persona' }), h('span', { text: 'Regola predefinita, sempre attiva' })),
        h('li', null, h('strong', { text: 'L’assistente non trova la risposta' }), h('span', { text: 'Regola predefinita, sempre attiva' })),
        regole.map((r, i) => { const x = h('button', { type: 'button', class: 'btn btn--secondary', text: 'Togli' }); x.addEventListener('click', () => { regole.splice(i, 1); paintRules(); }); return h('li', null, h('strong', { text: `Quando scrive: ${r.quando}` }), h('span', { text: r.assegna ? `Assegna a ${r.assegna}` : 'Qualsiasi persona del team' }), x); })));
    };
    paintRules();
    const nq = h('input', { maxlength: 120, placeholder: 'es. rimborso, reclamo, allergia' });
    const na = select('assegna', [['', 'Qualsiasi persona'], ...team.map((p) => [p.nome, p.nome])], '');
    const add = h('button', { type: 'button', class: 'btn btn--secondary', text: 'Aggiungi regola' });
    add.addEventListener('click', () => { const q = nq.value.trim().slice(0, 120); if (!q) return; if (regole.length >= 30) { say('Al massimo 30 regole.', true); return; } regole.push({ quando: q, assegna: na.value || null }); nq.value = ''; paintRules(); });
    const orari = JSON.parse(JSON.stringify(conf.orari || {}));
    const grid = h('div', { class: 'el-hours' });
    WEEK.forEach((d) => {
      const slot = (orari[d] || [])[0] || ['09:00', '20:00'];
      const open = h('input', { type: 'checkbox', 'aria-label': `${DAY_NAMES[d]} disponibili` }); open.checked = !!(orari[d] || []).length;
      const a = h('input', { type: 'time', value: slot[0], 'aria-label': `${DAY_NAMES[d]} dalle` });
      const b = h('input', { type: 'time', value: slot[1], 'aria-label': `${DAY_NAMES[d]} alle` });
      const sync = () => { orari[d] = open.checked && a.value && b.value && a.value < b.value ? [[a.value, b.value]] : []; };
      [open, a, b].forEach((x) => x.addEventListener('change', sync));
      grid.append(h('label', { class: 'el-hours__row' }, open, h('span', { text: DAY_NAMES[d] }), a, h('span', { text: '–' }), b));
    });
    const now = h('p', { class: 'pcard__note', text: operatorsOnline(orari) ? 'Adesso il team risulta in linea.' : 'Adesso il team risulta fuori orario.' });
    const save = h('button', { type: 'button', class: 'btn btn--primary', text: 'Salva' });
    save.addEventListener('click', async () => {
      save.disabled = true;
      try { await call('/rest/v1/eliseo_assistente?id=eq.1', { method: 'PATCH', body: { escalation_attiva: esc.checked, testo_libero: free.checked, regole, orari }, prefer: 'return=minimal' }); say('Impostazioni salvate. L’assistente del sito le usa da subito.'); drawTraining(); }
      catch (e) { say(e.message, true); save.disabled = false; }
    });
    return [card('Escalation', h('p', { class: 'pcard__note', text: 'Quando l’assistente passa il cliente a una persona del team (su WhatsApp). Come l’«Escalation» di Keplero. Qui ci sono solo gli interruttori veri: passaggio al team, testo libero, regole e orari.' }),
      h('label', { class: 'el-consent' }, esc, h('span', { text: 'Attivo: l’assistente segue le regole qui sotto e passa il cliente al team' })),
      h('label', { class: 'el-consent' }, free, h('span', { text: 'I clienti possono anche scrivere le domande (oltre ai pulsanti). Accendilo dopo averlo provato in «Prova».' })),
      h('h4', { class: 'el-models__cat', text: 'Quando passare il cliente' }), rb, h('div', { class: 'el-tools' }, nq, na, add),
      h('h4', { class: 'el-models__cat', text: 'Orari degli operatori' }), grid, now, h('div', { class: 'actions' }, save))];
  }

  // ——— Automazioni ———
  async function drawAuto() {
    let list;
    try { list = await call('/rest/v1/eliseo_automazioni?select=*&order=creato_il'); } catch (e) { fail(e); return; }
    const box = h('div', { class: 'el-models' });
    if (!list.length) box.append(h('p', { class: 'pempty', text: 'Nessuna automazione. Creane una qui sotto.' }));
    list.forEach((a) => {
      const on = h('input', { type: 'checkbox', 'aria-label': `Attiva ${a.nome}` }); on.checked = a.attiva;
      on.addEventListener('change', async () => { try { await call(`/rest/v1/eliseo_automazioni?id=eq.${a.id}`, { method: 'PATCH', body: { attiva: on.checked }, prefer: 'return=minimal' }); say(on.checked ? 'Automazione accesa.' : 'Automazione spenta.'); } catch (e) { on.checked = !on.checked; say(e.message, true); } });
      let armed = false; const del = h('button', { type: 'button', class: 'btn btn--secondary el-del', text: 'Elimina' });
      del.addEventListener('click', async () => { if (!armed) { armed = true; del.textContent = 'Conferma'; del.classList.add('is-armed'); return; } try { await call(`/rest/v1/eliseo_automazioni?id=eq.${a.id}`, { method: 'DELETE' }); say('Automazione eliminata.'); drawAuto(); } catch (e) { say(e.message, true); } });
      box.append(h('article', { class: 'el-auto' }, h('label', { class: 'el-consent' }, on, h('strong', { text: a.nome })), h('p', { class: 'el-auto__rule', text: describe(a) }), h('p', { class: 'pcard__note', text: a.eseguite ? `Eseguita ${a.eseguite} ${a.eseguite === 1 ? 'volta' : 'volte'} · ultima ${new Date(a.ultima).toLocaleString('it-IT', { timeZone: 'Europe/Rome' })}` : 'Mai eseguita finora.' }), del));
    });
    // Nuova automazione: i menu cambiano in base a «Quando».
    const f = h('form', { class: 'el-form', novalidate: true });
    const nome = h('input', { name: 'nome', maxlength: 80, required: true, placeholder: 'es. Richieste corsi a Gino' });
    const quando = select('quando', QUANDO, 'nuova_richiesta');
    const condBox = h('div'); const azBox = h('div'); const valBox = h('div');
    let cond = null, az = null, val = null;
    const teamSel = () => select('valore', team.map((p) => [p.nome, p.nome]), team[0]?.nome || '');
    const paintVal = () => {
      val = az.value === 'assegna' || az.value === 'barbiere' ? teamSel() : az.value === 'fase' ? select('valore', FASI, 'contattato') : h('input', { name: 'valore', maxlength: 30, placeholder: az.value === 'crea_contatto' ? 'etichetta (facoltativa), es. modulo' : 'es. corso' });
      valBox.replaceChildren(field(az.value === 'crea_contatto' ? 'Etichetta' : 'Con', val));
    };
    const paint = () => {
      const c = CONDIZIONI[quando.value];
      cond = c ? select('condizione', [['', 'Sempre'], ...c[1]], '') : null;
      condBox.replaceChildren(...(c ? [field(`Solo se · ${c[0]}`, cond)] : []));
      az = select('azione', AZIONI[quando.value], AZIONI[quando.value][0][0]);
      az.addEventListener('change', paintVal);
      azBox.replaceChildren(field('Allora', az)); paintVal();
    };
    quando.addEventListener('change', paint); paint();
    const err = h('p', { class: 'field__error', role: 'alert' });
    const save = h('button', { type: 'submit', class: 'btn btn--primary', text: 'Crea automazione' });
    f.append(field('Nome', nome), h('div', { class: 'el-grid' }, field('Quando', quando), condBox, azBox, valBox), err, h('div', { class: 'actions' }, save));
    f.addEventListener('submit', async (e) => {
      e.preventDefault();
      const row = { nome: nome.value.trim().slice(0, 80), quando: quando.value, condizione: cond?.value || null, azione: az.value, valore: (val.value || '').trim().slice(0, 60) || null, attiva: true };
      if (!row.nome) { err.textContent = 'Scrivi il nome.'; return; }
      if (['assegna', 'barbiere', 'etichetta', 'fase'].includes(row.azione) && !row.valore) { err.textContent = row.azione === 'etichetta' ? 'Scrivi l’etichetta.' : 'Scegli una persona del team.'; return; }
      save.disabled = true;
      try { await call('/rest/v1/eliseo_automazioni', { method: 'POST', body: row, prefer: 'return=minimal' }); say('Automazione creata: parte da sola.'); drawAuto(); }
      catch (ex) { err.textContent = ex.message; save.disabled = false; }
    });
    const off = document.querySelector('[data-auth-page]')?.dataset.salvaRichieste === '1' ? null : h('p', { class: 'pcard__note', text: 'Nota: le richieste del modulo per ora arrivano solo per email, quindi le automazioni «Arriva una richiesta» partiranno quando si accende il salvataggio (dopo l’informativa aggiornata).' });
    wrap.replaceChildren(card('Automazioni', h('p', { class: 'pcard__note', text: 'Regole «quando succede questo, fai quello». Girano da sole nel database, anche con il portale chiuso.' }), off, box), card('Nuova automazione', f));
  }

  // ——— Prova del chatbot ———
  async function drawTest() {
    let tr;
    try { tr = await call('/rest/v1/rpc/eliseo_assistente_pubblico', { method: 'POST', body: {} }); } catch (e) { fail(e); return; }
    const assistant = assistantData;
    const knowledge = knowledgeData;
    const offers = offersData;
    const hd = hoursData;
    const ctx = { assistant, knowledge, offers, hours: hd.hours, holidays: hd.holidays, lang: 'it', training: tr };
    const log = h('div', { class: 'el-chat', 'aria-live': 'polite' });
    const bubble = (who, text, why) => { log.append(h('div', { class: `el-chat__msg el-chat__msg--${who}` }, h('p', { text }), why ? h('small', { text: why }) : null)); log.scrollTop = log.scrollHeight; };
    bubble('bot', assistant.saluto || assistant.messaggi?.come_aiutare || 'Ciao! Come posso aiutarti?');
    const input = h('input', { type: 'text', maxlength: 300, placeholder: 'Scrivi una domanda come farebbe un cliente', 'aria-label': 'Domanda di prova' });
    const send = h('button', { type: 'submit', class: 'btn btn--primary', text: 'Invia' });
    const f = h('form', { class: 'el-chat__form' }, input, send);
    f.addEventListener('submit', (e) => {
      e.preventDefault(); const t = input.value.trim(); if (!t) return; input.value = '';
      bubble('user', t);
      const r = respond(t, ctx);
      const why = r.passaggio ? 'Perché: passaggio a una persona (regola o risposta non trovata)' : r.faq ? `Perché: FAQ «${r.faq}»` : r.documento ? `Perché: documento «${r.documento}»` : 'Perché: dati del sito (listino, orari, contatti)';
      bubble('bot', `${r.text}${r.link?.etichetta ? ` → ${r.link.etichetta}` : ''}`, why);
    });
    const examples = h('div', { class: 'filters', role: 'group', 'aria-label': 'Domande di esempio' });
    ['Quanto costa un taglio?', 'Siete aperti domenica?', 'Posso spostare l’appuntamento?', 'Voglio parlare con una persona', ...tr.faq.slice(0, 2).map((x) => x.d)].forEach((t) => { const b = h('button', { type: 'button', class: 'chip', text: t }); b.addEventListener('click', () => { input.value = t; f.requestSubmit(); }); examples.append(b); });
    const state = h('p', { class: 'pcard__note', text: `${tr.faq.length} FAQ attive · ${tr.documenti.length} documenti attivi · passaggio a una persona ${tr.escalation ? 'acceso' : 'spento'} · domande scritte sul sito ${tr.testo_libero ? 'accese' : 'spente (si accendono in Escalation)'}` });
    wrap.replaceChildren(card('Prova il chatbot', h('p', { class: 'pcard__note', text: 'Fai le domande come un cliente e guarda cosa risponde l’assistente e perché. Usa le FAQ e i documenti salvati.' }), state, examples, log, f));
  }

  function drawLinks() {
    const row = (name, state, note) => h('li', null,
      h('strong', { text: name }),
      h('span', { text: state }),
      note ? h('span', { text: note }) : null);
    wrap.replaceChildren(card(null,
      h('p', { class: 'pcard__note', text: 'Qui si vede solo quello che Eliseo usa davvero. Uno stato è «in uso» solo se il collegamento c’è già.' }),
      h('ul', { class: 'plist' },
        row('Sito del negozio', 'In uso', 'L’assistente legge le pagine, il listino e gli orari pubblicati sul sito.'),
        row('FAQ e file', 'In uso', 'Sono quelli scritti in Base di conoscenza.'),
        row('WhatsApp', 'Numero del negozio', 'Il passaggio al team apre il numero del negozio. I messaggi non arrivano da soli in questa casella.'),
        row('Prenotazioni', 'Treatwell', 'Gli appuntamenti restano su Treatwell. Qui non c’è un calendario.'),
        row('Email', 'Non collegata', 'Nessuna casella email collegata.'),
        row('Messenger', 'Non collegato', 'Nessun collegamento.'),
        row('Instagram', 'Non collegato', 'Nessun collegamento.'),
        row('Voce', 'Non collegata', 'Nessun collegamento.'))));
  }

  ({ addestramento: drawTraining, automazioni: drawAuto, prova: drawTest, integrazioni: drawLinks })[kind]();
  return [wrap];
}
