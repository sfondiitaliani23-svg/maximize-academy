// Eliseo · regole pure (senza browser): fasi, fonti, controlli dei campi, filtri, riepilogo. Usate da js/portal-eliseo.js e dai test.
export const FASI = [['nuovo', 'Nuovo'], ['contattato', 'Contattato'], ['cliente', 'Cliente'], ['da_richiamare', 'Da richiamare'], ['perso', 'Perso']];
export const FONTI = [['sito', 'Sito'], ['whatsapp', 'WhatsApp'], ['instagram', 'Instagram'], ['negozio', 'In negozio'], ['passaparola', 'Passaparola'], ['treatwell', 'Treatwell'], ['altro', 'Altro']];

// Controlli dei campi, uguali a quelli del database (supabase/eliseo.sql). Esportati per i test.
export function cleanContact(raw) {
  const s = (v, max) => String(v ?? '').replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max);
  const nome = s(raw.nome, 120);
  const email = s(raw.email, 200).toLowerCase();
  const telefono = s(raw.telefono, 40);
  const errors = {};
  if (!nome) errors.nome = 'Scrivi il nome.';
  if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) errors.email = 'Email non valida.';
  if (telefono && !/^[0-9 +().-]+$/.test(telefono)) errors.telefono = 'Solo numeri, spazi e + ( ) . -';
  const fonte = FONTI.some(([k]) => k === raw.fonte) ? raw.fonte : 'altro';
  const fase = FASI.some(([k]) => k === raw.fase) ? raw.fase : 'nuovo';
  const note = String(raw.note ?? '').replace(/[\u0000-\u0008\u000b-\u001f\u007f]/g, ' ').trim().slice(0, 500);
  const row = { nome, email: email || null, telefono: telefono || null, fonte, fase, barbiere: s(raw.barbiere, 60) || null, consenso_marketing: raw.consenso_marketing === true, note: note || null };
  return { row, errors, ok: !Object.keys(errors).length };
}

// Filtro dell'elenco: testo libero su nome, email e telefono; fase e fonte. Esportato per i test.
export function filterContacts(rows, { q = '', fase = '', fonte = '', etichetta = '' } = {}) {
  const k = q.trim().toLowerCase();
  return rows.filter((r) => (!fase || r.fase === fase) && (!fonte || r.fonte === fonte) && (!etichetta || (r.etichette || []).includes(etichetta))
    && (!k || [r.nome, r.email, r.telefono].some((v) => String(v || '').toLowerCase().includes(k))));
}

export function summary(rows, now = Date.now()) {
  const week = now - 7 * 864e5;
  return {
    totale: rows.length,
    consenso: rows.filter((r) => r.consenso_marketing).length,
    nuovi: rows.filter((r) => new Date(r.creato_il).getTime() >= week).length,
    richiamare: rows.filter((r) => r.fase === 'da_richiamare').length,
  };
}

// Etichette (come le liste di Keplero): massimo 10, ognuna fino a 30 caratteri, minuscole, senza doppioni.
export function cleanTags(v) {
  const list = Array.isArray(v) ? v : String(v ?? '').split(',');
  const out = [];
  list.forEach((t) => { const x = String(t).replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase().slice(0, 30); if (x && !out.includes(x) && out.length < 10) out.push(x); });
  return out;
}
export const allTags = (rows) => [...new Set(rows.flatMap((r) => r.etichette || []))].sort((a, b) => a.localeCompare(b, 'it'));

// CSV (anche quello esportato da Keplero o da un foglio Google): separatore , ; o tab, virgolette, righe vuote.
export function parseCsv(text) {
  const src = String(text ?? '').replace(/^﻿/, '');
  const first = src.split(/\r?\n/).find((l) => l.trim()) || '';
  const sep = [';', '\t', ','].map((c) => [c, first.split(c).length]).sort((a, b) => b[1] - a[1])[0][0];
  const rows = []; let row = [], cell = '', quoted = false;
  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (quoted) { if (ch === '"' && src[i + 1] === '"') { cell += '"'; i++; } else if (ch === '"') quoted = false; else cell += ch; continue; }
    if (ch === '"' && cell === '') quoted = true;
    else if (ch === sep) { row.push(cell); cell = ''; }
    else if (ch === '\n' || ch === '\r') { if (ch === '\r' && src[i + 1] === '\n') i++; row.push(cell); rows.push(row); row = []; cell = ''; }
    else cell += ch;
  }
  if (cell !== '' || row.length) { row.push(cell); rows.push(row); }
  return rows.filter((r) => r.some((c) => c.trim()));
}

const COL = { nome: /^(nome( e cognome)?|name|full ?name|contatto|cliente)$/i, cognome: /^(cognome|last ?name|surname)$/i, email: /^(e-?mail|indirizzo email)$/i, telefono: /^(telefono|tel|cellulare|phone|mobile|numero|whatsapp)$/i, note: /^(note|notes)$/i };
const telKey = (t) => { const d = String(t || '').replace(/\D/g, ''); return d.length >= 9 ? d.slice(-10) : ''; };

// Dal CSV ai contatti da aggiungere. Il consenso marketing resta sempre «no»: importare non vuol dire avere il consenso.
// Chi c'è già (stessa email o stesso telefono) non si tocca.
export function mapImport(table, existing = [], { fonte = 'altro', etichetta = '' } = {}) {
  const [head = [], ...lines] = table;
  const idx = {}; head.forEach((hd, i) => { const k = Object.keys(COL).find((c) => COL[c].test(String(hd).trim())); if (k && idx[k] === undefined) idx[k] = i; });
  const res = { nuovi: [], doppi: 0, scartati: 0, colonne: Object.keys(idx) };
  if (idx.nome === undefined && idx.email === undefined && idx.telefono === undefined) return { ...res, scartati: lines.length, errore: 'Non trovo le colonne: servono almeno Nome, Email o Telefono nella prima riga.' };
  const seenE = new Set(existing.map((r) => (r.email || '').toLowerCase()).filter(Boolean));
  const seenT = new Set(existing.map((r) => telKey(r.telefono)).filter(Boolean));
  const tags = cleanTags(etichetta);
  lines.forEach((l) => {
    const g = (k) => (idx[k] === undefined ? '' : String(l[idx[k]] ?? '').trim());
    const telRaw = g('telefono').replace(/[^0-9 +().-]/g, '');
    const nome = [g('nome'), g('cognome')].filter(Boolean).join(' ') || g('email').split('@')[0] || telRaw;
    const { row, ok } = cleanContact({ nome, email: g('email'), telefono: telRaw, fonte, fase: 'nuovo', note: g('note') });
    if (!ok || (!row.email && !row.telefono)) { res.scartati++; return; }
    const e = (row.email || '').toLowerCase(); const t = telKey(row.telefono);
    if ((e && seenE.has(e)) || (t && seenT.has(t))) { res.doppi++; return; }
    if (e) seenE.add(e); if (t) seenT.add(t);
    res.nuovi.push({ ...row, consenso_marketing: false, ...(tags.length ? { etichette: tags } : {}) });
  });
  return res;
}

// Modelli di messaggio (come le FAQ-modello di Keplero). {nome} e {barbiere} si riempiono da soli.
export const CATEGORIE = [['benvenuto', 'Benvenuto'], ['promemoria', 'Promemoria'], ['follow_up', 'Dopo il servizio'], ['feedback', 'Feedback'], ['recensione', 'Recensione'], ['ritorno', 'Ritorno del cliente'], ['upsell', 'Servizio in più'], ['altro', 'Altro']];
export function fillTemplate(testo, c = {}) {
  const nome = String(c.nome || '').trim().split(/\s+/)[0] || '';
  return String(testo || '').replace(/\{nome\}/g, nome).replace(/\{barbiere\}/g, String(c.barbiere || '').trim().split(/\s+/)[0] || 'noi').replace(/ +,/g, ',').replace(/  +/g, ' ').trim();
}
export function cleanTemplate(raw) {
  const nome = String(raw.nome ?? '').replace(/\s+/g, ' ').trim().slice(0, 60);
  const testo = String(raw.testo ?? '').replace(/[\u0000-\u0008\u000b-\u001f\u007f]/g, ' ').trim().slice(0, 1000);
  const categoria = CATEGORIE.some(([k]) => k === raw.categoria) ? raw.categoria : 'altro';
  const errors = {};
  if (!nome) errors.nome = 'Scrivi il nome del modello.';
  if (!testo) errors.testo = 'Scrivi il testo.';
  return { row: { nome, testo, categoria }, errors, ok: !Object.keys(errors).length };
}
