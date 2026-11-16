// Maverik · Strategia, analisi clienti, crescita del business e copilota commerciale (solo admin e co-founder).
// Stessa presentazione della console Keplero: colonna dei filtri, elenco, dettaglio.
// Regole: zero librerie esterne, zero innerHTML/eval/document.write, costruzione puramente via DOM.

const h = (tag, attrs, ...kids) => {
  const el = document.createElement(tag);
  Object.entries(attrs || {}).forEach(([k, v]) => {
    if (v === false || v == null) return;
    if (k === 'text') el.textContent = v;
    else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2).toLowerCase(), v);
    else el.setAttribute(k, v === true ? '' : v);
  });
  kids.flat(Infinity).forEach((k) => { if (k != null) el.append(k); });
  return el;
};

const euro = (n) => new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);

export function mount(box, root) {
  let team = [];
  try { team = JSON.parse(root.dataset.team || '[]'); } catch { team = []; }
  void team;

  let tab = 'radar';
  let picked = 0;
  const done = {};

  const status = h('p', { class: 'mav-status', role: 'status', 'aria-live': 'polite' });
  const say = (t, bad) => { status.textContent = t; status.dataset.state = bad ? 'error' : 'ok'; };

  const sections = [
    ['radar', 'Radar Clienti', '0'],
    ['crescita', 'Crescita & KPI', '1'],
    ['simulatore', 'Simulatore', '2'],
    ['copilota', 'Copilota', '3'],
    ['metodo', 'Metodo M×E', '4'],
  ];

  const nav = h('div', { class: 'mav-navs', role: 'tablist', 'aria-label': 'Sezioni di Maverik' });
  sections.forEach(([id, label, tone]) => {
    nav.append(h('button', {
      type: 'button',
      class: 'mav-nav',
      role: 'tab',
      'data-tab': id,
      'data-tone': tone,
      'aria-selected': id === tab ? 'true' : 'false',
      onClick: () => open(id),
    }, h('span', { class: 'mav-nav__dot', 'data-tone': tone }), h('span', { text: label })));
  });

  const listTitle = h('strong', { text: 'Radar Clienti' });
  const listCount = h('span', { class: 'mav-listhead__count' });
  const search = h('input', { type: 'search', class: 'mav-search', placeholder: 'Cerca', 'aria-label': 'Cerca in questa sezione' });
  search.addEventListener('input', () => {
    const q = search.value.trim().toLowerCase();
    list.querySelectorAll('.mav-item').forEach((el) => {
      el.hidden = Boolean(q) && !el.textContent.toLowerCase().includes(q);
    });
  });

  const list = h('div', { class: 'mav-list' });
  const detailBody = h('div', { class: 'mav-detail__body' });

  const app = h('div', { class: 'mav-app' },
    h('aside', { class: 'mav-side' },
      h('div', { class: 'mav-brand' },
        h('span', { class: 'mav-logo', 'aria-hidden': 'true', text: 'M' }),
        h('div', null,
          h('strong', { text: 'Maverik' }),
          h('small', { text: 'Strategia e crescita' })
        )
      ),
      h('p', { class: 'mav-group', text: 'Sezioni' }),
      nav,
      h('p', { class: 'mav-group', text: 'Numeri' }),
      h('div', { class: 'mav-nums' },
        // 16/11/2026: prima qui c'erano numeri inventati. Restano vuoti finché non colleghiamo i dati veri.
        num('Scontrino medio', '—'),
        num('Clienti monitorati', '—'),
        num('A rischio distacco', '—'),
        num('Potenziale crescita', '—')
      )
    ),
    h('div', { class: 'mav-stage' },
      h('section', { class: 'mav-listcol', 'aria-label': 'Elenco' },
        h('header', { class: 'mav-listhead' },
          listTitle,
          listCount,
          search
        ),
        list
      ),
      h('section', { class: 'mav-detail', 'aria-label': 'Dettaglio' }, detailBody, status)
    )
  );

  box.replaceChildren(app);

  function num(label, value) {
    return h('div', { class: 'mav-num' }, h('span', { text: label }), h('b', { text: value }));
  }

  function open(id) {
    tab = id;
    picked = 0;
    search.value = '';
    say('');
    nav.querySelectorAll('[data-tab]').forEach((b) => b.setAttribute('aria-selected', b.dataset.tab === tab ? 'true' : 'false'));
    const label = (sections.find(([k]) => k === id) || [, id])[1];
    listTitle.textContent = label;
    draw();
  }

  function markRows() {
    [...list.querySelectorAll('.mav-row')].forEach((el, i) => {
      const on = i === picked;
      el.classList.toggle('is-on', on);
      el.setAttribute('aria-selected', on ? 'true' : 'false');
    });
  }

  function row(letter, tone, title, meta, preview, onPick) {
    const b = h('button', { type: 'button', class: 'mav-item mav-row' },
      h('span', { class: 'mav-av', 'data-tone': tone, text: letter }),
      h('span', { class: 'mav-row__body' },
        h('span', { class: 'mav-row__top' }, h('strong', { text: title }), h('small', { text: meta })),
        h('span', { class: 'mav-row__prev', text: preview })
      )
    );
    b.addEventListener('click', onPick);
    return b;
  }

  function sheet(kicker, title, ...nodes) {
    detailBody.replaceChildren(h('article', { class: 'mav-sheet' },
      h('p', { class: 'mav-kicker', text: kicker }),
      h('h2', { text: title }),
      h('p', { class: 'mav-note', text: 'Dati non ancora collegati: i numeri compariranno quando collegheremo iscrizioni, corsi e prenotazioni veri.' }),
      ...nodes
    ));
  }

  function drawRadar() {
    const segmenti = [
      { titolo: 'VIP & Ambassador', n: null, lettera: 'V', tone: '0', desc: 'Vengono ogni 2-3 settimane, acquistano combo e prodotti, portano amici. Sono il cuore economico del negozio.', azione: 'Accesso prioritario, anteprime e trattamenti omaggio periodici.' },
      { titolo: 'Regolari Fedeli', n: null, lettera: 'R', tone: '1', desc: 'Taglio e rifinitura regolari (ogni 3-4 settimane). Servizio standard con ottima costanza.', azione: 'Proporre il passaggio a trattamenti completi (Luxury Gold) e abbonamenti.' },
      { titolo: 'Nuovi in Prova (30 gg)', n: null, lettera: 'N', tone: '2', desc: 'Prima visita negli ultimi 30 giorni. È la fase critica in cui si decide se diventeranno clienti stabili o spariranno.', azione: 'Follow-up entro 14 giorni con proposta di controllo barba o secondo taglio.' },
      { titolo: 'Dormienti / A Rischio (>45 gg)', n: null, lettera: 'D', tone: '3', desc: 'Hanno superato la loro frequenza media senza riprenotare. Rischio abbandono verso concorrenti o pigrizia.', azione: 'Campagna riattivazione mirata via Eliseo (promemoria + invito dedicato).' },
    ];
    listCount.textContent = '—';
    const show = () => {
      const s = segmenti[picked];
      sheet('Radar Clienti', s.titolo,
        h('p', { class: 'mav-lead', text: s.n == null ? 'Numero di clienti: da collegare' : `${s.n} clienti` }),
        h('p', { text: s.desc }),
        h('p', { class: 'mav-label', text: 'Strategia consigliata' }),
        h('p', { text: s.azione }),
        h('p', { class: 'mav-note', text: 'Maverik individuerà i clienti a rischio distacco. Con un clic puoi passare il segmento ad Eliseo per inviare loro un promemoria personalizzato o un avviso riservato.' }),
        h('div', { class: 'mav-actions' },
          h('button', {
            type: 'button',
            class: 'btn',
            text: 'Attiva campagna riattivazione in Eliseo',
            onClick: () => {
              say('Segmento inviato ad Eliseo: aperta la sezione Campagne.');
              root.querySelector('[data-nav="eliseo"]')?.click();
            },
          }),
        )
      );
    };
    list.replaceChildren(...segmenti.map((s, i) => row(s.lettera, s.tone, s.titolo, s.n == null ? '—' : `${s.n} clienti`, s.desc, () => { picked = i; markRows(); show(); })));
    markRows();
    show();
  }

  function drawCrescita() {
    const kpis = [
      { label: 'Scontrino Medio Servizi', valore: '—', target: 'Obiettivo da decidere', note: 'Dato da collegare', lettera: 'S', tone: '1' },
      { label: 'Scontrino Combo & Luxury', valore: '—', target: 'Obiettivo da decidere', note: 'Dato da collegare', lettera: 'C', tone: '4' },
      { label: 'Incidenza Vendita Prodotti', valore: '—', target: 'Obiettivo da decidere', note: 'Dato da collegare', lettera: 'P', tone: '3' },
      { label: 'Resa Oraria per Poltrona', valore: '—', target: 'Obiettivo da decidere', note: 'Dato da collegare', lettera: 'R', tone: '0' },
    ];
    listCount.textContent = '4';
    const show = () => {
      const k = kpis[picked];
      sheet('Crescita & KPI', k.label,
        h('p', { class: 'mav-figure', text: k.valore }),
        h('p', { text: `${k.target} · ${k.note}` }),
        h('h3', { text: 'Distribuzione per Categoria' }),
        h('p', { text: 'Comparirà quando collegheremo i dati veri.' }),
        h('h3', { text: 'Consiglio Commerciale di Maverik per il Team' }),
        h('p', { text: 'Proporre in poltrona il prodotto usato durante il servizio aiuta la vendita senza forzature. Misureremo l’effetto quando avremo i dati.' }),
        h('div', { class: 'mav-actions' },
          h('button', {
            type: 'button',
            class: 'btn btn--secondary',
            text: 'Visualizza scheda obiettivi collaboratori',
            onClick: () => say('Schede collaboratori allineate agli obiettivi M×E.'),
          })
        )
      );
    };
    list.replaceChildren(...kpis.map((k, i) => row(k.lettera, k.tone, k.label, k.valore, k.note, () => { picked = i; markRows(); show(); })));
    markRows();
    show();
  }

  function point(title, text) {
    return h('li', null, h('strong', { text: title }), h('span', { text }));
  }

  function drawSimulatore() {
    let clientiMese = 380;
    let prezzoMedio = 24;
    let percProdotti = 14;
    let prezzoProdotto = 18;
    const resMensile = h('strong', { class: 'mav-sim-val' });
    const resAnnuale = h('strong', { class: 'mav-sim-val' });
    const resDelta = h('span', { class: 'mav-delta' });

    function ricalcola() {
      const totaleMese = (clientiMese * prezzoMedio) + (Math.round(clientiMese * (percProdotti / 100)) * prezzoProdotto);
      const baseMese = (350 * 22) + (35 * 18);
      const deltaAnno = (totaleMese - baseMese) * 12;
      resMensile.textContent = euro(totaleMese);
      resAnnuale.textContent = euro(totaleMese * 12);
      resDelta.textContent = deltaAnno >= 0 ? `+${euro(deltaAnno)} / anno rispetto alla base` : `${euro(deltaAnno)} / anno`;
    }

    const slider = (label, min, max, step, val, unit, onChange) => {
      const numOut = h('span', { class: 'mav-slider-num', text: `${val} ${unit}` });
      const input = h('input', {
        type: 'range', class: 'mav-range', min: String(min), max: String(max), step: String(step), value: String(val),
        onInput: (e) => {
          const v = Number(e.target.value);
          numOut.textContent = `${v} ${unit}`;
          onChange(v);
          ricalcola();
        },
      });
      return h('div', { class: 'mav-item mav-control' },
        h('div', { class: 'mav-control__head' }, h('label', { text: label }), numOut),
        input
      );
    };

    listCount.textContent = '';
    list.replaceChildren(
      slider('Clienti serviti al mese', 150, 700, 10, clientiMese, 'clienti', (v) => { clientiMese = v; }),
      slider('Prezzo medio servizio / scontrino', 18, 45, 1, prezzoMedio, '€', (v) => { prezzoMedio = v; }),
      slider('Clienti che acquistano un prodotto', 5, 40, 1, percProdotti, '%', (v) => { percProdotti = v; }),
      slider('Prezzo medio del prodotto', 12, 35, 1, prezzoProdotto, '€', (v) => { prezzoProdotto = v; })
    );
    detailBody.replaceChildren(h('article', { class: 'mav-sheet' },
      h('p', { class: 'mav-kicker', text: 'Simulatore di Crescita Economica M×E' }),
      h('h2', { text: 'Risultato della Simulazione' }),
      h('p', { class: 'mav-label', text: 'Incasso Mensile Stimato' }),
      resMensile,
      h('p', { class: 'mav-label', text: 'Incasso Annuo Stimato' }),
      resAnnuale,
      resDelta,
      h('p', { class: 'mav-note', text: 'Nota: il simulatore calcola solo con i valori che imposti qui sopra. Con i dati veri collegati useremo i numeri reali.' }),
      h('p', { class: 'mav-note', text: 'Modella i parametri per visualizzare l’impatto immediato sul fatturato e sulla marginalità del salone.' })
    ));
    ricalcola();
  }

  function drawCopilota() {
    const priorita = [
      { id: 1, lettera: '1', tone: '4', titolo: '1. Riattivare i clienti che non tornano da tempo', desc: 'Chi ha superato la sua frequenza abituale senza riprenotare è il primo da richiamare: costa meno riattivarlo che trovarne uno nuovo.', azione: 'Preparare in Eliseo un messaggio dedicato e inviarlo a mano.', tempo: 'Quanti sono: da collegare' },
      { id: 2, lettera: '2', tone: '1', titolo: '2. Proporre il servizio completo a chi fa solo il taglio', desc: 'Molti clienti fanno sempre lo stesso servizio per abitudine: una proposta alla consulenza iniziale può farli passare al trattamento completo.', azione: 'Concordare con il team una frase semplice da usare alla consulenza.', tempo: 'Effetto: da misurare' },
      { id: 3, lettera: '3', tone: '3', titolo: '3. Allineamento settimanale sulla vendita prodotti', desc: 'Due domande semplici dopo il servizio aiutano tutti a proporre i prodotti, non solo chi lo fa già.', azione: 'Fare un mini-briefing di 10 minuti a inizio settimana.', tempo: 'Obiettivo: da decidere insieme' },
    ];
    listCount.textContent = '3';
    const show = () => {
      const p = priorita[picked];
      sheet('Il Copilota di Maurizio', p.titolo,
        h('p', { text: p.desc }),
        h('p', { class: 'mav-label', text: 'Mossa' }),
        h('p', { text: p.azione }),
        h('p', { class: 'mav-meta', text: p.tempo }),
        h('p', { class: 'mav-note', text: 'Nessun sovraccarico di dati: solo le 3 mosse concrete che generano il massimo risultato questa settimana.' })
      );
    };
    list.replaceChildren(...priorita.map((p, i) => {
      const check = h('input', { type: 'checkbox' });
      check.checked = Boolean(done[p.id]);
      const b = h('div', { class: `mav-item mav-row${i === picked ? ' is-on' : ''}${done[p.id] ? ' is-done' : ''}` },
        check,
        h('span', { class: 'mav-av', 'data-tone': p.tone, text: p.lettera }),
        h('span', { class: 'mav-row__body' },
          h('span', { class: 'mav-row__top' }, h('strong', { text: p.titolo }), h('small', { text: p.tempo })),
          h('span', { class: 'mav-row__prev', text: p.desc })
        )
      );
      check.addEventListener('change', () => {
        done[p.id] = check.checked;
        b.classList.toggle('is-done', check.checked);
        say(check.checked ? `Priorità #${p.id} segnata come completata!` : `Priorità #${p.id} riaperta.`);
      });
      b.addEventListener('click', (e) => {
        if (e.target === check) return;
        picked = i;
        markRows();
        show();
      });
      return b;
    }));
    show();
  }

  function drawMetodo() {
    const blocchi = [
      {
        lettera: 'K', tone: '2', titolo: 'I Limiti dei Software Tradizionali (es. Keplero)',
        punti: [
          ['Costo continuo elevato:', ' ~400 € / mese (circa 1.200 € a trimestre) per funzioni generiche e non su misura.'],
          ['Dipendenza da Meta WhatsApp:', ' Costi per messaggio, finestre rigide di 24h, rischio blocco account.'],
          ['Non è un asset tuo:', ' Se smetti di pagare perdi lo storico, le automazioni e l’interfaccia.'],
        ],
      },
      {
        lettera: 'M', tone: '0', titolo: 'Il Vantaggio di M×E (Eliseo + Maverik)',
        punti: [
          ['Proprietà Totale del Software:', ' Codice di proprietà, zero canoni a terzi, dati protetti su server dedicati.'],
          ['Binomio Unico al Mondo:', ' Eliseo guida la parte tecnica/automazioni; Maverik guida la strategia e la crescita commerciale.'],
          ['Prodotto Replicabile:', ' Domani M×E Barber Lab può essere venduto in licenza o canone ad altre barberie in tutta Italia!'],
        ],
      },
    ];
    listCount.textContent = '2';
    const show = () => {
      const b = blocchi[picked];
      sheet('M×E Barber Lab', b.titolo,
        h('p', { class: 'mav-note', text: 'Perché stiamo costruendo questo sistema proprietario invece di rimanere dipendenti da Keplero o Treatwell.' }),
        h('ul', { class: 'mav-points' }, ...b.punti.map(([a, c]) => point(a, c))),
        h('blockquote', { class: 'mav-quote' },
          h('p', { text: '«Il nostro obiettivo non è copiare Keplero, ma costruire qualcosa che possa andare oltre.»' }),
          h('footer', { text: '— Maurizio Pizzuto & Eliseo Miraglia (M×E Barber Lab)' })
        )
      );
    };
    list.replaceChildren(...blocchi.map((b, i) => row(b.lettera, b.tone, b.titolo, '', b.punti[0][0], () => { picked = i; markRows(); show(); })));
    markRows();
    show();
  }

  function draw() {
    if (tab === 'radar') drawRadar();
    else if (tab === 'crescita') drawCrescita();
    else if (tab === 'simulatore') drawSimulatore();
    else if (tab === 'copilota') drawCopilota();
    else if (tab === 'metodo') drawMetodo();
  }

  draw();
}
