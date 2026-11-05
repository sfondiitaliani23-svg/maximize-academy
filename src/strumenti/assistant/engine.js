// Motore dell'assistente (J1, J2): funzioni pure, nessun testo del negozio nel codice.
// Tutto ciò che dice viene da data/assistant.json (testi) e data/knowledge.json (dati). Si prova con node:test.
import { computeOpenStatus } from '../open-now.js';
import { activeOffers } from '../offers-rules.js';
import { matchDocument, matchFaq, needsHuman, operatorsOnline } from './training.js';

const ORDER = ['lun', 'mar', 'mer', 'gio', 'ven', 'sab', 'dom'];
const DAYS_BY_LANG = {
  it: { lun: 'lunedì', mar: 'martedì', mer: 'mercoledì', gio: 'giovedì', ven: 'venerdì', sab: 'sabato', dom: 'domenica' },
  en: { lun: 'Monday', mar: 'Tuesday', mer: 'Wednesday', gio: 'Thursday', ven: 'Friday', sab: 'Saturday', dom: 'Sunday' },
};
const WORDS = { it: { and: 'e', closed: 'chiuso', soon: 'informazione in arrivo', none: 'nessun dato' }, en: { and: 'and', closed: 'closed', soon: 'information coming soon', none: 'no data' } };
const DAY_IT_TO_EN = { lunedì: 'Monday', martedì: 'Tuesday', mercoledì: 'Wednesday', giovedì: 'Thursday', venerdì: 'Friday', sabato: 'Saturday', domenica: 'Sunday', oggi: 'today', domani: 'tomorrow' };
const isPlaceholder = (v) => typeof v !== 'string' || v.includes('[DA COMPLETARE]');

// --- Orari in una riga: "martedì–venerdì 08:00–13:00 e 15:00–20:00; sabato 08:00–20:00; lunedì e domenica chiuso"
export function formatWeek(week, lang = 'it') {
  const DAY = DAYS_BY_LANG[lang] || DAYS_BY_LANG.it; const W = WORDS[lang] || WORDS.it;
  const slots = (d) => (week[d] || []).map(([a, b]) => `${a}–${b}`).join(` ${W.and} `);
  const open = []; const closed = [];
  ORDER.forEach((d) => {
    const t = slots(d);
    if (!t) { closed.push(DAY[d]); return; }
    const last = open[open.length - 1];
    if (last && last.t === t && ORDER.indexOf(last.days[last.days.length - 1]) === ORDER.indexOf(d) - 1) last.days.push(d);
    else open.push({ t, days: [d] });
  });
  const parts = open.map(({ t, days }) => `${days.length > 1 ? `${DAY[days[0]]}–${DAY[days[days.length - 1]]}` : DAY[days[0]]} ${t}`);
  if (closed.length) parts.push(`${closed.join(` ${W.and} `)} ${W.closed}`);
  return parts.join('; ');
}

// --- Dati di conoscenza
export { activeOffers };
export const entriesOf = (knowledge, cat) => (knowledge?.entries || []).filter((e) => e.categoria === cat && e.fonte !== 'faq.json');
export const categories = (knowledge) => [...new Set((knowledge?.entries || []).filter((e) => e.prezzo !== null && e.prezzo !== undefined && e.categoria !== 'Massaggi').map((e) => e.categoria))];
export const datiOf = (knowledge, id) => knowledge?.entries?.find((e) => e.id === id)?.dati || {};
export const whatsappLink = (knowledge, text) => {
  const digits = String(datiOf(knowledge, 'contatti').whatsapp || '').replace(/\D/g, '');
  return digits ? `https://wa.me/${digits}${text ? `?text=${encodeURIComponent(text)}` : ''}` : null;
};
export const bookingUrl = (knowledge) => datiOf(knowledge, 'prenotazione').url || null;

const line = (e) => {
  const extra = [e.durata ? `${e.durata} min` : null, e.barbiere || null].filter(Boolean).join(', ');
  return `${e.titolo} ${e.prezzo} €${extra ? ` (${extra})` : ''}`;
};

// Testo di "aperto ora" nella lingua della pagina (in italiano è quello già pronto)
export function statusText(st, lang = 'it') {
  if (lang !== 'en') return st.text;
  if (st.open) return `Open now · closes at ${st.closesAt}`;
  if (st.next) return `Closed · reopens ${DAY_IT_TO_EN[st.next.day] || st.next.day} at ${st.next.at}`;
  return 'Closed';
}

// --- Modelli: {lista:Categoria} {orari} {aperto} {indirizzo} {team} {offerte}
export function render(template, ctx) {
  const { knowledge, hours, holidays, offers, now = new Date(), lang = 'it' } = ctx; const W = WORDS[lang] || WORDS.it;
  return template.replace(/\{([a-z]+)(?::([^}]+))?\}/g, (_, key, arg) => {
    switch (key) {
      case 'lista': return entriesOf(knowledge, arg).map(line).join('; ') || W.none;
      case 'orari': return hours?.week ? formatWeek(hours.week, lang) : W.soon;
      case 'aperto': return hours?.week ? statusText(computeOpenStatus(now, hours, holidays), lang) : W.soon;
      case 'telefono': return datiOf(knowledge, 'contatti').telefono || W.soon;
      case 'provider': return datiOf(knowledge, 'prenotazione').provider || '';
      case 'indirizzo': return datiOf(knowledge, 'contatti').indirizzo || W.soon;
      case 'team': return entriesOf(knowledge, 'team').map((e) => e.testo.replace(/\.$/, '')).join('; ') || W.soon;
      case 'nomi': return entriesOf(knowledge, 'team').map((e) => e.titolo).join(', ') || W.soon;
      case 'offerte': return activeOffers(offers?.items, now).map((o) => `${o.titolo}: ${o.testo}`).join('; ');
      default: return `{${key}}`;
    }
  });
}

export function resolveHref(href, knowledge) {
  return href === '{prenota_url}' ? bookingUrl(knowledge) : href;
}

// --- Intenti visibili: "offerte" solo se ce ne sono di attive
export function visibleIntents(assistant, ctx) {
  return (assistant.items || []).filter((i) => i.solo_se !== 'offerte_attive' || activeOffers(ctx.offers?.items, ctx.now).length > 0);
}

// Risposta a un intento. Restituisce { text, link, figli }.
export function answer(intent, ctx) {
  const link = intent.link ? { ...intent.link, etichetta: render(intent.link.etichetta, ctx), href: resolveHref(intent.link.href, ctx.knowledge) } : null;
  return { id: intent.id, text: render(intent.modello, ctx), link: link && link.href ? link : null, figli: intent.figli === 'categorie' ? categories(ctx.knowledge) : [], azione: intent.azione || null };
}
export const answerCategory = (category, ctx) => ({
  id: `prezzi-${category}`, text: `${ctx.assistant.categorie?.[category] || category}: ${render(`{lista:${category}}`, ctx)}.`, link: { etichetta: render(ctx.assistant.messaggi.link_servizi, ctx), href: ctx.assistant.messaggi.href_servizi || '/servizi/' }, figli: [], azione: null,
});

// --- Dati personali (J3): telefono o email nel testo
export function hasPersonalData(text) {
  return /[\w.+-]+@[\w-]+\.[\w.-]+/.test(text) || /(?:\+?\d[\s./-]?){8,}/.test(text);
}

// --- Router a parole chiave per il testo libero. Oggi serve alle 20 domande di prova (docs/DOMANDE-TEST.md)
// e come ripiego quando il motore AI non risponde. Non indovina: se non riconosce, non risponde.
const has = (t, ...words) => words.some((w) => t.includes(w));
export function routeQuestion(text) {
  const t = text.toLowerCase();
  if (hasPersonalData(text)) return { intent: 'dati_personali' };
  if (has(t, 'ignora', 'istruzioni', 'sconto', 'le tue regole')) return { intent: 'regole' };
  if (has(t, 'cellulite', 'dimagr', 'medic', 'dolore', 'guarire', 'cura la')) return { intent: 'salute' };
  if (has(t, 'carta', 'pagare', 'pagamento', 'contanti', 'bancomat')) return { intent: 'pagamento' };
  if (has(t, 'non trovo posto', 'lista d\'attesa', 'tutto pieno')) return { intent: 'lista_attesa' };
  if (has(t, 'posto', 'disponibil', 'libero') && has(t, 'domani', 'oggi', 'stasera', 'alle', 'sabato', 'venerdì')) return { intent: 'disponibilita' };
  if (has(t, 'decontratturante')) return { intent: 'categoria', arg: 'Massaggi', filtro: 'decontratturante' };
  if (has(t, 'massagg', 'relax', 'linfodrenante')) return { intent: 'categoria', arg: 'Massaggi', filtro: has(t, 'relax') ? 'relax' : null };
  if (has(t, 'bambin')) return { intent: 'categoria', arg: 'Bambini' };
  if (has(t, 'colore', 'colorazione', 'tinta')) return { intent: 'categoria', arg: 'Colore' };
  if (has(t, 'donna')) return { intent: 'servizio', arg: 'Taglio Donna Luxury' };
  if (has(t, 'rasatura', 'traditional')) return { intent: 'servizio', arg: 'Barba Traditional Shave' };
  if (has(t, 'deluxe')) return { intent: 'servizio', arg: 'Trattamento Barba Deluxe' };
  if (has(t, 'taglio e barba', 'taglio + barba', 'insieme', 'barba e taglio')) return { intent: 'servizio', arg: 'Taglio + Shampoo + Barba', anche: 'Taglio Classic + Barba + Colorazione Discreta' };
  if (has(t, 'quanto costa', 'prezzo', 'prezzi', 'costa') && has(t, 'taglio')) return { intent: 'categoria', arg: 'Taglio' };
  if (has(t, 'prezzi', 'listino', 'quanto costa')) return { intent: 'prezzi' };
  if (has(t, 'orari', 'aperto', 'aperti', 'chiuso', 'lunedì', 'domenica')) return { intent: 'orari' };
  if (has(t, 'dove', 'indirizzo', 'come arrivo', 'parcheggio')) return { intent: 'arrivare' };
  if (has(t, 'telefono', 'numero', 'chiamare', 'whatsapp')) return { intent: 'contatti' };
  if (has(t, 'prenot')) return { intent: 'prenota' };
  return { intent: 'fuori_tema' };
}

// Risposta completa a una domanda libera: { text, link }
export function respond(text, ctx) {
  const m = ctx.assistant.messaggi;
  const route = routeQuestion(text);
  const link = (key, href, extra = {}) => ({ etichetta: render(m[key], ctx), href, ...extra });
  const book = link('link_prenota', bookingUrl(ctx.knowledge), { esterno: true, evento: 'prenotazione' });
  const massaggi = link('link_massaggi', '/benessere/');
  const servizi = link('link_servizi', '/servizi/');
  const wa = { etichetta: ctx.assistant.persona.etichetta, href: whatsappLink(ctx.knowledge, ctx.assistant.persona.testo_whatsapp), esterno: true, evento: 'whatsapp' };
  const byTitle = (t) => ctx.knowledge.entries.find((e) => e.titolo === t);
  // Addestramento dal portale (Eliseo): passaggio a una persona, FAQ, documenti. Le regole di sicurezza vengono prima.
  const tr = ctx.training;
  const human = () => ({ text: operatorsOnline(tr.orari, ctx.now || new Date()) ? m.passaggio_online : m.passaggio_offline, link: wa, passaggio: true });
  const safe = ['dati_personali', 'regole', 'salute'].includes(route.intent);
  if (tr && !safe) {
    if (tr.escalation && needsHuman(text, tr.regole)) return human();
    const faq = matchFaq(text, tr.faq);
    if (faq) return { text: faq.r, link: null, faq: faq.d };
  }
  if (tr && route.intent === 'fuori_tema') {
    const doc = matchDocument(text, tr.documenti);
    if (doc) return { text: `${m.da_documento || ''} ${doc.frase}`.trim(), link: null, documento: doc.titolo };
    if (tr.escalation) return human();
  }
  switch (route.intent) {
    case 'dati_personali': return { text: m.dati_personali, link: wa };
    case 'regole': return { text: m.regole, link: book };
    case 'salute': return { text: m.salute, link: massaggi };
    case 'pagamento': return { text: m.pagamento, link: wa };
    case 'lista_attesa': return { text: m.lista_attesa, link: book };
    case 'disponibilita': return { text: `${m.disponibilita} ${render('Orari: {orari}.', ctx)}`, link: book };
    case 'categoria': {
      const list = entriesOf(ctx.knowledge, route.arg).filter((e) => !route.filtro || e.titolo.toLowerCase().includes(route.filtro));
      const note = route.arg === 'Massaggi' ? ` ${m.nota_massaggi}` : '';
      return { text: `${list.map(line).join('; ')}.${note}`, link: route.arg === 'Massaggi' ? massaggi : servizi };
    }
    case 'servizio': {
      const items = [byTitle(route.arg), route.anche && byTitle(route.anche)].filter(Boolean);
      return { text: `${items.map(line).join('; ')}.`, link: servizi };
    }
    case 'contatti': return { text: render(m.contatti, ctx), link: wa };
    case 'fuori_tema': return { text: m.fuori_tema, link: null };
    default: {
      const intent = (ctx.assistant.items || []).find((i) => i.id === route.intent);
      return intent ? answer(intent, ctx) : { text: m.nessun_dato, link: wa };
    }
  }
}

// Frasi di una risposta (per il limite di 3 frasi, J1)
export const sentences = (text) => text.split(/(?<=[.!?])\s+(?=[A-ZÀ-Ý])/).filter(Boolean);
export { isPlaceholder };
