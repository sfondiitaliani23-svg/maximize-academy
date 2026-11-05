// Eliseo · Addestramento, Automazioni e Prova del chatbot (come le sezioni di Keplero). Tabelle in supabase/eliseo-addestramento.sql.
// Quello che si scrive in FAQ, documenti, regole e orari lo legge l'assistente del sito: mai dati dei clienti.
import { respond } from './assistant/engine.js';
import { operatorsOnline } from './assistant/training.js';
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
        call('/rest/v1/eliseo_assistente_versioni?select=*&order=creato_il.desc&limit=15'),
      ]);
    } catch (e) { fail(e); return; }
    const views = { faq: () => faqView(faq), sito: siteView, documenti: () => docsView(docs), istruzioni: () => promptView(conf, vers), passaggio: () => handoffView(conf) };
    wrap.replaceChildren(...[].concat(views[sub]()));
  }

  function faqView(list) {
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
      const acts = h('div', { class: 'actions' }, save);
      if (f) {
        let armed = false; const del = h('button', { type: 'button', class: 'btn btn--secondary el-del', text: 'Elimina' });
        del.addEventListener('click', async () => { if (!armed) { armed = true; del.textContent = 'Conferma: elimina'; del.classList.add('is-armed'); return; } try { await call(`/rest/v1/eliseo_faq?id=eq.${f.id}`, { method: 'DELETE' }); say('FAQ eliminata.'); drawTraining(); } catch (e) { err.textContent = e.message; } });
        acts.append(del);
      }
      el.append(h('div', { class: 'el-grid' }, field('Cartella', h('span', null, cartella, dl)), field('Domanda', domanda)), field('Parole chiave', parole, 'Separate da virgola: altri modi in cui i clienti lo chiedono. Aiutano l’assistente a riconoscere la domanda.'), field('Risposta', risposta, 'Breve e chiara. Massimo 1000 caratteri. Niente promesse sulla salute.'), h('label', { class: 'el-consent' }, attiva, h('span', { text: 'Attiva (la usa l’assistente del sito)' })), err, acts);
      el.addEventListener('submit', async (e) => {
        e.preventDefault();
        const row = { cartella: cartella.value.trim().slice(0, 40) || 'Generale', domanda: domanda.value.trim().slice(0, 200), parole: parole.value.trim().slice(0, 300), risposta: risposta.value.trim().slice(0, 1000), attiva: attiva.checked };
        if (row.domanda.length < 3 || !row.risposta) { err.textContent = 'Scrivi domanda e risposta.'; return; }
        save.disabled = true;
        try { await call(f ? `/rest/v1/eliseo_faq?id=eq.${f.id}` : '/rest/v1/eliseo_faq', { method: f ? 'PATCH' : 'POST', body: row, prefer: 'return=minimal' }); say('FAQ salvata.'); drawTraining(); }
        catch (ex) { err.textContent = ex.message; save.disabled = false; }
      });
      return el;
    };
    const q = h('input', { type: 'search', class: 'el-search', placeholder: 'Trova FAQ', 'aria-label': 'Trova FAQ' });
    const box = h('div', { class: 'el-models' });
    const paint = () => {
      const k = q.value.trim().toLowerCase();
      const shown = list.filter((f) => !k || `${f.domanda} ${f.risposta} ${f.parole}`.toLowerCase().includes(k));
      box.replaceChildren();
      if (!shown.length) box.append(h('p', { class: 'pempty', text: list.length ? 'Nessuna FAQ trovata.' : 'Nessuna FAQ. Aggiungine una qui sotto.' }));
      [...new Set(shown.map((f) => f.cartella))].forEach((c) => {
        box.append(h('h4', { class: 'el-models__cat', text: c }));
        shown.filter((f) => f.cartella === c).forEach((f) => box.append(h('details', { class: 'el-model' }, h('summary', null, h('strong', { text: `${f.attiva ? '' : '(spenta) '}${f.domanda}` }), h('span', { text: f.risposta.slice(0, 90) + (f.risposta.length > 90 ? '…' : '') })), form(f))));
      });
    };
    q.addEventListener('input', paint); paint();
    return [card('FAQ', h('p', { class: 'pcard__note', text: 'Domande e risposte su cui si basa l’assistente, in cartelle.' }), h('div', { class: 'el-tools' }, q), box), card('Nuova FAQ', form(null))];
  }

  function siteView() {
    const box = h('div');
    const k = knowledgeData;
    const map = sitemapXml;
    {
      const pages = [...map.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
      const cats = {}; (k.entries || []).forEach((e) => { cats[e.categoria] = (cats[e.categoria] || 0) + 1; });
      box.replaceChildren(
        h('ul', { class: 'plist' },
          h('li', null, h('strong', { text: `maurizio-barbershop.it` }), h('span', { text: `${pages.length} pagine nella mappa del sito · aggiornato a ogni pubblicazione` })),
          h('li', null, h('strong', { text: 'Dati che l’assistente usa' }), h('span', { text: Object.entries(cats).map(([c, n]) => `${c} (${n})`).join(' · ') }))),
        h('p', { class: 'pcard__note', text: 'A differenza di Keplero non serve «rileggere» il sito: listino, orari, team e offerte arrivano dagli stessi file con cui è fatto il sito, quindi sono sempre giusti.' }));
    }
    return [card('Sito web', box)];
  }

  function docsView(list) {
    const form = (d) => {
      const el = h('form', { class: 'el-form', novalidate: true });
      const titolo = h('input', { name: 'titolo', maxlength: 120, value: d?.titolo || '', required: true, placeholder: 'es. Listino prodotti ANAQA' });
      const testo = h('textarea', { name: 'testo', maxlength: 20000, rows: 8, required: true }); testo.value = d?.testo || '';
      const count = h('p', { class: 'field__hint', 'aria-live': 'polite' });
      const upd = () => { count.textContent = `${testo.value.length} / 20.000 caratteri`; }; testo.addEventListener('input', upd); upd();
      const file = h('input', { type: 'file', accept: '.txt,.md,.csv,.tsv,text/plain,text/csv', 'aria-label': 'Carica un file di testo' });
      file.addEventListener('change', async () => { const f = file.files?.[0]; if (!f) return; if (f.size > 200_000) { say('File troppo grande (massimo 200 KB di testo).', true); return; } testo.value = (await f.text()).slice(0, 20000); if (!titolo.value) titolo.value = f.name.replace(/\.[^.]+$/, '').slice(0, 120); upd(); });
      const attivo = h('input', { type: 'checkbox', name: 'attivo' }); attivo.checked = d ? d.attivo : true;
      const err = h('p', { class: 'field__error', role: 'alert' });
      const save = h('button', { type: 'submit', class: 'btn btn--primary', text: d ? 'Salva' : 'Aggiungi documento' });
      const acts = h('div', { class: 'actions' }, save);
      if (d) {
        let armed = false; const del = h('button', { type: 'button', class: 'btn btn--secondary el-del', text: 'Elimina' });
        del.addEventListener('click', async () => { if (!armed) { armed = true; del.textContent = 'Conferma: elimina'; del.classList.add('is-armed'); return; } try { await call(`/rest/v1/eliseo_documenti?id=eq.${d.id}`, { method: 'DELETE' }); say('Documento eliminato.'); drawTraining(); } catch (e) { err.textContent = e.message; } });
        acts.append(del);
      }
      el.append(field('Titolo', titolo), field('Carica un file di testo (facoltativo)', file, 'Per i PDF: aprili, seleziona tutto, copia e incolla qui sotto.'), field('Testo', testo), count, h('label', { class: 'el-consent' }, attivo, h('span', { text: 'Attivo (lo legge l’assistente del sito: solo informazioni pubbliche)' })), err, acts);
      el.addEventListener('submit', async (e) => {
        e.preventDefault();
        const row = { titolo: titolo.value.trim().slice(0, 120), testo: testo.value.trim().slice(0, 20000), attivo: attivo.checked };
        if (!row.titolo || !row.testo) { err.textContent = 'Scrivi titolo e testo.'; return; }
        save.disabled = true;
        try { await call(d ? `/rest/v1/eliseo_documenti?id=eq.${d.id}` : '/rest/v1/eliseo_documenti', { method: d ? 'PATCH' : 'POST', body: row, prefer: 'return=minimal' }); say('Documento salvato.'); drawTraining(); }
        catch (ex) { err.textContent = ex.message; save.disabled = false; }
      });
      return el;
    };
    const box = h('div', { class: 'el-models' });
    if (!list.length) box.append(h('p', { class: 'pempty', text: 'Nessun documento.' }));
    list.forEach((d) => box.append(h('details', { class: 'el-model' }, h('summary', null, h('strong', { text: `${d.attivo ? '' : '(spento) '}${d.titolo}` }), h('span', { text: `${d.testo.length} caratteri` })), form(d))));
    return [card('File', h('p', { class: 'pcard__note', text: 'Listini, schede prodotto, biografie: come i «File» di Keplero. L’assistente risponde con la frase più adatta. Metti solo informazioni che possono leggere tutti (niente profili interni, funnel o strategie).' }), box), card('Nuovo file', form(null))];
  }

  function promptView(conf, vers) {
    const ta = h('textarea', { name: 'istruzioni', maxlength: 10000, rows: 14 }); ta.value = conf.istruzioni || '';
    const count = h('p', { class: 'field__hint', 'aria-live': 'polite' });
    const upd = () => { count.textContent = `${ta.value.length} / 10.000`; }; ta.addEventListener('input', upd); upd();
    const tips = h('div', { class: 'filters', role: 'group', 'aria-label': 'Aggiunte rapide' });
    [['Risposte brevi', 'Rispondi in modo breve: al massimo 3 frasi.'], ['Tono caldo', 'Usa un tono caldo e amichevole, dai del tu.'], ['Tono formale', 'Usa un tono cortese e formale, dai del lei.'], ['Elenchi', 'Nelle risposte lunghe usa elenchi puntati.'], ['Chiudi con una domanda', 'Chiudi sempre con una domanda.']].forEach(([t, add]) => {
      const b = h('button', { type: 'button', class: 'chip', text: `+ ${t}` });
      b.addEventListener('click', () => { if (!ta.value.includes(add)) { ta.value = `${ta.value.trim()}\n${add}`.trim(); upd(); } });
      tips.append(b);
    });
    const save = h('button', { type: 'button', class: 'btn btn--primary', text: 'Salva le istruzioni' });
    save.addEventListener('click', async () => { save.disabled = true; try { await call('/rest/v1/eliseo_assistente?id=eq.1', { method: 'PATCH', body: { istruzioni: ta.value.slice(0, 10000) }, prefer: 'return=minimal' }); say('Istruzioni salvate. La versione di prima è nella cronologia.'); drawTraining(); } catch (e) { say(e.message, true); save.disabled = false; } });
    const hist = h('ul', { class: 'plist' });
    if (!vers.length) hist.append(h('li', null, h('span', { text: 'Nessuna versione precedente.' })));
    vers.forEach((v) => {
      const back = h('button', { type: 'button', class: 'btn btn--secondary', text: 'Rimetti questa' });
      back.addEventListener('click', () => { ta.value = v.istruzioni; upd(); say('Versione caricata nel riquadro: premi «Salva le istruzioni» per usarla.'); });
      hist.append(h('li', null, h('strong', { text: new Date(v.creato_il).toLocaleString('it-IT', { timeZone: 'Europe/Rome' }) }), h('span', { text: `${v.istruzioni.slice(0, 80)}…` }), back));
    });
    return [card('Prompt', h('p', { class: 'pcard__note', text: 'Chi è, come parla, cosa deve e non deve fare (come il «Prompt» di Keplero). Servono quando si accende l’assistente con l’IA: oggi l’assistente risponde con FAQ, documenti e dati del sito. Le istruzioni non le vede nessun cliente.' }), tips, field('Istruzioni', ta), count, h('div', { class: 'actions' }, save)), card(`Cronologia versioni (${vers.length})`, hist)];
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
        row('WhatsApp', 'Sul sito del negozio', 'Il passaggio al team usa il numero del negozio. Su Maximize i pulsanti commerciali non usano quel numero.'),
        row('Prenotazioni', 'Treatwell', 'Gli appuntamenti restano su Treatwell. Qui non c’è un calendario.'),
        row('Email', 'Non collegata', 'Nessuna casella email collegata.'),
        row('Messenger', 'Non collegato', 'Nessun collegamento.'),
        row('Instagram', 'Non collegato', 'Nessun collegamento.'),
        row('Voce', 'Non collegata', 'Nessun collegamento.'))));
  }

  ({ addestramento: drawTraining, automazioni: drawAuto, prova: drawTest, integrazioni: drawLinks })[kind]();
  return [wrap];
}
