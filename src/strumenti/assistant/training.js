// Addestramento dell'assistente (come «Base di conoscenza» ed «Escalation» di Keplero). Funzioni pure, si provano con node:test.
// I dati arrivano da Supabase (eliseo_assistente_pubblico): FAQ attive, documenti attivi, regole di passaggio, orari degli operatori.
// Nessun dato dei clienti, nessuna istruzione interna.

const STOP = new Set(['che', 'chi', 'cosa', 'come', 'per', 'con', 'una', 'uno', 'gli', 'le', 'lo', 'la', 'il', 'del', 'della', 'dei', 'delle', 'dal', 'dalla', 'nel', 'nella', 'sul', 'sulla', 'non', 'piu', 'anche', 'questo', 'questa', 'quanto', 'quando', 'dove', 'perche', 'sono', 'siete', 'avete', 'fate', 'posso', 'potete', 'vorrei', 'volevo', 'buongiorno', 'ciao', 'salve', 'grazie', 'the', 'and', 'you', 'your', 'can', 'are', 'what', 'how', 'mi', 'si', 'ci', 'vi', 'ne', 'di', 'da', 'in', 'su', 'tra', 'fra', 'ma', 'ed', 'al', 'ai', 'agli', 'alla', 'alle', 'un', 'io', 'tu', 'voi', 'noi', 'mio', 'mia', 'tuo', 'vostro', 'bisogna', 'serve', 'fa']);

export const norm = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
const stem = (w) => (w.length > 5 ? w.slice(0, 5) : w);
export const tokens = (s) => [...new Set(norm(s).split(' ').filter((w) => w.length >= 3 && !STOP.has(w)).map(stem))];
const phrases = (s) => String(s || '').split(',').map(norm).filter((p) => p.length >= 3);

// Quanto una FAQ somiglia alla domanda: le frasi chiave valgono di più delle parole.
export function scoreFaq(question, faq) {
  const q = norm(question);
  const qt = tokens(question);
  if (!qt.length) return 0;
  const hit = phrases(faq.p).filter((p) => ` ${q} `.includes(` ${p} `) || (p.includes(' ') && q.includes(p))).length;
  const ft = tokens(`${faq.d} ${String(faq.p || '').replace(/,/g, ' ')}`);
  const common = qt.filter((w) => ft.includes(w)).length;
  return hit * 3 + common + (common / qt.length);
}

// La FAQ migliore, se è davvero simile: almeno una frase chiave, oppure 2 parole in comune.
export function matchFaq(question, faqs = []) {
  let best = null, top = 0;
  faqs.forEach((f) => { const s = scoreFaq(question, f); if (s > top) { top = s; best = f; } });
  return best && top >= 2.5 ? best : null;
}

// Dai documenti: la frase che contiene più parole della domanda (almeno 2). Torna la frase e il titolo.
export function matchDocument(question, docs = []) {
  const qt = tokens(question);
  if (qt.length < 2) return null;
  let best = null, top = 1;
  docs.forEach((d) => String(d.x || '').split(/(?<=[.!?])\s+|\n+/).forEach((sent) => {
    const s = sent.trim(); if (s.length < 20 || s.length > 400) return;
    const st = tokens(s); const n = qt.filter((w) => st.includes(w)).length;
    if (n > top) { top = n; best = { titolo: d.t, frase: s }; }
  }));
  return best;
}

const DAYS = ['dom', 'lun', 'mar', 'mer', 'gio', 'ven', 'sab'];
// Gli operatori ci sono adesso? orari = { lun: [["09:00","20:00"]], ... } nell'ora di Roma.
export function operatorsOnline(orari = {}, now = new Date()) {
  const p = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Rome', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(now);
  const wd = { Sun: 'dom', Mon: 'lun', Tue: 'mar', Wed: 'mer', Thu: 'gio', Fri: 'ven', Sat: 'sab' }[p.find((x) => x.type === 'weekday').value];
  const hm = `${p.find((x) => x.type === 'hour').value.replace('24', '00')}:${p.find((x) => x.type === 'minute').value}`;
  return (orari[wd] || []).some(([a, b]) => hm >= a && hm < b);
}
export { DAYS };

// Regole di passaggio a una persona: quelle predefinite più quelle scritte dal team (parole separate da virgola).
const VUOLE_PERSONA = ['operatore', 'una persona', 'persona vera', 'umano', 'parlare con', 'parlare a', 'il titolare', 'reclamo'];
export function needsHuman(question, regole = []) {
  const q = ` ${norm(question)} `;
  if (VUOLE_PERSONA.some((w) => q.includes(` ${norm(w)}`))) return { motivo: 'vuole una persona', assegna: null };
  for (const r of regole) {
    const words = phrases(r.quando);
    if (words.some((w) => q.includes(` ${w}`))) return { motivo: r.quando, assegna: r.assegna || null };
  }
  return null;
}
