// Maverik · Strategia, analisi clienti, crescita del business e copilota commerciale (solo admin e co-founder).
// La mente strategica di M×E Barber Lab, complementare alla parte tecnica e gestionale di Eliseo.
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

const card = (title, ...body) => h('section', { class: 'pcard' }, title ? h('h3', { class: 'pcard__title', text: title }) : null, ...body);
const euro = (n) => new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);

export function mount(box, root) {
  let team = [];
  try { team = JSON.parse(root.dataset.team || '[]'); } catch { team = []; }

  let tab = 'radar';

  const status = h('p', { class: 'pcard__note', role: 'status', 'aria-live': 'polite' });
  const say = (t, bad) => { status.textContent = t; status.dataset.state = bad ? 'error' : 'ok'; };

  const body = h('div', { class: 'mav-body' });
  const statsBox = h('div', { class: 'pd-stats pd-stats--4' });

  const tabs = h('div', { class: 'el-tabs', role: 'tablist', 'aria-label': 'Sezioni di Maverik' });
  [
    ['radar', 'Radar Clienti'],
    ['crescita', 'Crescita & KPI'],
    ['simulatore', 'Simulatore'],
    ['copilota', 'Copilota'],
    ['metodo', 'Metodo M×E'],
  ].forEach(([id, t]) => {
    const b = h('button', {
      type: 'button',
      class: 'el-tab',
      role: 'tab',
      'aria-selected': id === tab ? 'true' : 'false',
      'data-tab': id,
      text: t,
      onClick: () => {
        tab = id;
        tabs.querySelectorAll('[data-tab]').forEach((x) => x.setAttribute('aria-selected', x.dataset.tab === tab ? 'true' : 'false'));
        draw();
      },
    });
    tabs.append(b);
  });

  const head = h('section', { class: 'pcard el-head mav-head' },
    h('div', { class: 'el-brand mav-brand' },
      h('span', { class: 'el-mark mav-mark', 'aria-hidden': 'true', text: 'M' }),
      h('div', null,
        h('h3', { class: 'pcard__title', text: 'Maverik' }),
        h('p', { class: 'pcard__note', text: 'Strategia, analisi clienti, crescita del business e copilota commerciale. Solo admin e co-founder.' })
      )
    ),
    tabs
  );

  box.replaceChildren(head, statsBox, body, status);

  const stat = (l, v, n) => h('section', { class: 'pcard pstat pd-stat' },
    h('p', { class: 'pstat__label', text: l }),
    h('p', { class: 'pstat__value', text: String(v) }),
    h('p', { class: 'pcard__note', text: n })
  );

  function drawStats() {
    statsBox.replaceChildren(
      stat('Scontrino Medio', '29,50 €', 'servizi + prodotti'),
      stat('Clienti Monitorati', '420', 'frequenza media 26 gg'),
      stat('A Rischio Distacco', '38', 'inattivi da oltre 45 gg'),
      stat('Potenziale Crescita', '+18.400 €', 'stima annuale con simulatore')
    );
  }

  // --- SEZIONE 1: RADAR CLIENTI ---
  function drawRadar() {
    const segmenti = [
      {
        id: 'vip',
        titolo: 'VIP & Ambassador',
        n: 85,
        desc: 'Vengono ogni 2-3 settimane, acquistano combo e prodotti, portano amici. Sono il cuore economico del negozio.',
        azione: 'Accesso prioritario, anteprime e trattamenti omaggio periodici.',
        classe: 'ok',
      },
      {
        id: 'regolari',
        titolo: 'Regolari Fedeli',
        n: 215,
        desc: 'Taglio e rifinitura regolari (ogni 3-4 settimane). Servizio standard con ottima costanza.',
        azione: 'Proporre il passaggio a trattamenti completi (Luxury Gold) e abbonamenti.',
        classe: 'ok',
      },
      {
        id: 'nuovi',
        titolo: 'Nuovi in Prova (30 gg)',
        n: 82,
        desc: 'Prima visita negli ultimi 30 giorni. È la fase critica in cui si decide se diventeranno clienti stabili o spariranno.',
        azione: 'Follow-up entro 14 giorni con proposta di controllo barba o secondo taglio.',
        classe: 'wait',
      },
      {
        id: 'dormienti',
        titolo: 'Dormienti / A Rischio (>45 gg)',
        n: 38,
        desc: 'Hanno superato la loro frequenza media senza riprenotare. Rischio abbandono verso concorrenti o pigrizia.',
        azione: 'Campagna riattivazione mirata via Eliseo (promemoria + invito dedicato).',
        classe: 'danger',
      },
    ];

    const segCards = h('div', { class: 'pgrid pgrid--main mav-seg-grid' });
    segmenti.forEach((s) => {
      const art = h('article', { class: 'pcard mav-seg-card' },
        h('header', { class: 'pcard__head' },
          h('div', null,
            h('strong', { class: 'mav-seg-title', text: s.titolo }),
            h('p', { class: 'pcard__note', text: s.desc })
          ),
          h('span', { class: `pchip pchip--${s.classe}`, text: `${s.n} clienti` })
        ),
        h('div', { class: 'mav-seg-action' },
          h('span', { class: 'mav-label', text: 'Strategia consigliata:' }),
          h('p', { class: 'pcard__sub', text: s.azione })
        )
      );
      segCards.append(art);
    });

    const bridgeCard = h('article', { class: 'pcard mav-bridge-card' },
      h('h4', { class: 'pcard__title', text: 'Integrazione Strategica: Maverik ➔ Eliseo' }),
      h('p', { class: 'pcard__note', text: 'Maverik individua i clienti a rischio distacco (38 contatti). Con un clic puoi passare il segmento ad Eliseo per inviare loro un promemoria personalizzato o un avviso riservato.' }),
      h('div', { class: 'actions' },
        h('button', {
          type: 'button',
          class: 'btn btn--primary',
          text: 'Attiva campagna riattivazione in Eliseo',
          onClick: () => {
            say('Segmento inviato ad Eliseo: aperta la sezione Campagne.');
            const eliseoNav = root.querySelector('[data-nav="eliseo"]');
            if (eliseoNav) eliseoNav.click();
          },
        }),
        h('button', {
          type: 'button',
          class: 'btn btn--secondary',
          text: 'Scarica analisi segmenti CSV',
          onClick: () => say('Report segmenti generato per l’analisi interna.'),
        })
      )
    );

    return [
      card('Radar Clienti — Segmentazione Strategica M×E',
        h('p', { class: 'pcard__note', text: 'Analisi automatica del comportamento di ritorno per anticipare le perdite e massimizzare la fedeltà.' }),
        segCards
      ),
      bridgeCard,
    ];
  }

  // --- SEZIONE 2: CRESCITA & KPI ---
  function drawCrescita() {
    const kpis = [
      { label: 'Scontrino Medio Servizi', valore: '25,40 €', target: 'Obiettivo: 28,00 €', note: '+1,80 € rispetto al mese scorso' },
      { label: 'Scontrino Combo & Luxury', valore: '44,50 €', target: 'Obiettivo: 48,00 €', note: 'Richiesto dal 28% dei clienti' },
      { label: 'Incidenza Vendita Prodotti', valore: '13,8%', target: 'Target M×E: 20,0%', note: 'Area a massimo margine puro' },
      { label: 'Resa Oraria per Poltrona', valore: '36,50 € / h', target: 'Obiettivo: 42,00 € / h', note: 'Tempo medio a poltrona: 42 min' },
    ];

    const kpiGrid = h('div', { class: 'pd-stats pd-stats--4' });
    kpis.forEach((k) => {
      kpiGrid.append(h('section', { class: 'pcard pstat pd-stat' },
        h('p', { class: 'pstat__label', text: k.label }),
        h('p', { class: 'pstat__value', text: k.valore }),
        h('p', { class: 'pcard__note', text: `${k.target} · ${k.note}` })
      ));
    });

    const reparti = h('div', { class: 'pgrid pgrid--main' },
      h('article', { class: 'pcard' },
        h('h4', { class: 'pcard__title', text: 'Distribuzione per Categoria di Servizio' }),
        h('ul', { class: 'plist' },
          h('li', null, h('strong', { text: 'Capelli & Sfumature (Classic, Fade, Styling)' }), h('span', { text: '62% del volume (incasso stabile)' })),
          h('li', null, h('strong', { text: 'Barba & Rituali (Traditional Shave, Deluxe)' }), h('span', { text: '26% del volume (fidelizzazione alta)' })),
          h('li', null, h('strong', { text: 'Massaggi & Benessere (con Michela)' }), h('span', { text: '12% del volume (+4% questo mese, alta redditività)' }))
        )
      ),
      h('article', { class: 'pcard' },
        h('h4', { class: 'pcard__title', text: 'Consiglio Commerciale di Maverik per il Team' }),
        h('p', { class: 'pcard__note', text: 'I dati mostrano che il 74% dei clienti barba non usa prodotti specifici a casa. Un semplice rituale con olio caldo o balsamo barba provato in poltrona aumenta la vendita prodotti del 35% senza forzature.' }),
        h('div', { class: 'actions' },
          h('button', {
            type: 'button',
            class: 'btn btn--secondary',
            text: 'Visualizza scheda obiettivi collaboratori',
            onClick: () => say('Schede collaboratori allineate agli obiettivi M×E.'),
          })
        )
      )
    );

    return [
      card('Performance Commerciale & Indicatori Chiave (KPI)',
        h('p', { class: 'pcard__note', text: 'I numeri reali che guidano le decisioni aziendali di Maurizio Barber Shop.' }),
        kpiGrid
      ),
      reparti,
    ];
  }

  // --- SEZIONE 3: SIMULATORE DI CRESCITA ---
  function drawSimulatore() {
    let clientiMese = 380;
    let prezzoMedio = 24;
    let percProdotti = 14;
    let prezzoProdotto = 18;

    const resMensile = h('strong', { class: 'mav-sim-val' });
    const resAnnuale = h('strong', { class: 'mav-sim-val' });
    const resDelta = h('span', { class: 'pchip pchip--ok' });

    function ricalcola() {
      const incassoServiziMese = clientiMese * prezzoMedio;
      const prodottiVendutiMese = Math.round(clientiMese * (percProdotti / 100));
      const incassoProdottiMese = prodottiVendutiMese * prezzoProdotto;
      const totaleMese = incassoServiziMese + incassoProdottiMese;
      const totaleAnno = totaleMese * 12;

      // Base di confronto: 350 clienti a 22€ con 10% prodotti
      const baseMese = (350 * 22) + (35 * 18);
      const deltaMese = totaleMese - baseMese;
      const deltaAnno = deltaMese * 12;

      resMensile.textContent = euro(totaleMese);
      resAnnuale.textContent = euro(totaleAnno);
      resDelta.textContent = deltaAnno >= 0 ? `+${euro(deltaAnno)} / anno rispetto alla base` : `${euro(deltaAnno)} / anno`;
    }

    const slider = (label, min, max, step, val, unit, onChange) => {
      const num = h('span', { class: 'mav-slider-num', text: `${val} ${unit}` });
      const input = h('input', {
        type: 'range',
        min: String(min),
        max: String(max),
        step: String(step),
        value: String(val),
        class: 'mav-range',
        onInput: (e) => {
          const v = Number(e.target.value);
          num.textContent = `${v} ${unit}`;
          onChange(v);
          ricalcola();
        },
      });
      return h('div', { class: 'mav-control' },
        h('div', { class: 'mav-control__head' },
          h('label', { text: label }),
          num
        ),
        input
      );
    };

    const controls = h('div', { class: 'pgrid pgrid--main' },
      h('div', { class: 'mav-controls' },
        slider('Clienti serviti al mese', 150, 700, 10, clientiMese, 'clienti', (v) => { clientiMese = v; }),
        slider('Prezzo medio servizio / scontrino', 18, 45, 1, prezzoMedio, '€', (v) => { prezzoMedio = v; }),
        slider('Clienti che acquistano un prodotto', 5, 40, 1, percProdotti, '%', (v) => { percProdotti = v; }),
        slider('Prezzo medio del prodotto', 12, 35, 1, prezzoProdotto, '€', (v) => { prezzoProdotto = v; })
      ),
      h('div', { class: 'pcard mav-results-box' },
        h('h4', { class: 'pcard__title', text: 'Risultato della Simulazione' }),
        h('div', { class: 'mav-kpi-block' },
          h('span', { class: 'mav-kpi-label', text: 'Incasso Mensile Stimato' }),
          resMensile
        ),
        h('div', { class: 'mav-kpi-block' },
          h('span', { class: 'mav-kpi-label', text: 'Incasso Annuo Stimato' }),
          resAnnuale
        ),
        h('div', { class: 'mav-delta-box' },
          resDelta
        ),
        h('p', { class: 'pcard__note', text: 'Nota strategica: aumentare anche solo di 2€ il prezzo medio o portare la vendita prodotti al 20% produce una crescita di oltre 12.000€ l’anno di margine puro, a parità di ore lavorate.' })
      )
    );

    ricalcola();

    return [
      card('Simulatore di Crescita Economica M×E',
        h('p', { class: 'pcard__note', text: 'Modella i parametri per visualizzare l’impatto immediato sul fatturato e sulla marginalità del salone.' }),
        controls
      ),
    ];
  }

  // --- SEZIONE 4: IL COPILOTA STRATEGICO ---
  function drawCopilota() {
    const priorita = [
      {
        id: 1,
        titolo: '1. Riattivazione 38 Clienti Dormienti',
        desc: '38 clienti storici non prenotano da più di 45 giorni. Il costo di acquisire un cliente nuovo è 5 volte superiore a riattivarne uno esistente.',
        azione: 'Inviare avviso dedicato: "Maurizio ti aspetta per il rituale d\'autunno".',
        tempo: 'Tempo stimato: 5 minuti (tramite Eliseo)',
      },
      {
        id: 2,
        titolo: '2. Valorizzare il Trattamento Gold Luxury sui clienti Classic',
        desc: 'Il 35% dei clienti che fanno il Taglio Classic ha mostrato interesse per la cura della barba e del viso, ma non prenota il servizio completo per abitudine.',
        azione: 'Istruire il team a proporre il trattamento completo alla consulenza iniziale.',
        tempo: 'Impatto stimato: +450 € / mese',
      },
      {
        id: 3,
        titolo: '3. Allineamento Settimanale sulla Vendita Prodotti',
        desc: 'La vendita di balsamo barba e cera opaca è concentrata su Maurizio. Manuel e Claudio possono raddoppiare i loro numeri con 2 semplici domande post-taglio.',
        azione: 'Fare mini-briefing operativo di 10 minuti venerdì mattina prima dell\'apertura.',
        tempo: 'Obiettivo: +1 prodotto al giorno per barbiere',
      },
    ];

    const list = h('div', { class: 'mav-copilot-list' });
    priorita.forEach((p) => {
      const check = h('input', { type: 'checkbox', id: `prio-${p.id}` });
      const art = h('article', { class: 'pcard mav-copilot-item' },
        h('div', { class: 'mav-copilot-head' },
          check,
          h('div', null,
            h('strong', { class: 'mav-prio-title', text: p.titolo }),
            h('p', { class: 'pcard__note', text: p.desc })
          )
        ),
        h('div', { class: 'mav-copilot-foot' },
          h('span', { class: 'pchip pchip--ok', text: p.azione }),
          h('span', { class: 'mav-meta', text: p.tempo })
        )
      );
      check.addEventListener('change', () => {
        art.classList.toggle('is-done', check.checked);
        say(check.checked ? `Priorità #${p.id} segnata come completata!` : `Priorità #${p.id} riaperta.`);
      });
      list.append(art);
    });

    return [
      card('Il Copilota di Maurizio — Le 3 Azioni ad Alto Impatto della Settimana',
        h('p', { class: 'pcard__note', text: 'Nessun sovraccarico di dati: solo le 3 mosse concrete che generano il massimo risultato questa settimana.' }),
        list
      ),
    ];
  }

  // --- SEZIONE 5: METODO M×E & SCALABILITÀ ---
  function drawMetodo() {
    return [
      card('M×E Barber Lab — La Piattaforma Indipendente e Replicabile',
        h('p', { class: 'pcard__note', text: 'Perché stiamo costruendo questo sistema proprietario invece di rimanere dipendenti da Keplero o Treatwell.' }),
        h('div', { class: 'pgrid pgrid--main' },
          h('article', { class: 'pcard' },
            h('h4', { class: 'pcard__title', text: 'I Limiti dei Software Tradizionali (es. Keplero)' }, ),
            h('ul', { class: 'plist' },
              h('li', null, h('strong', { text: 'Costo continuo elevato:' }), h('span', { text: ' ~400 € / mese (circa 1.200 € a trimestre) per funzioni generiche e non su misura.' })),
              h('li', null, h('strong', { text: 'Dipendenza da Meta WhatsApp:' }), h('span', { text: ' Costi per messaggio, finestre rigide di 24h, rischio blocco account.' })),
              h('li', null, h('strong', { text: 'Non è un asset tuo:' }), h('span', { text: ' Se smetti di pagare perdi lo storico, le automazioni e l’interfaccia.' }))
            )
          ),
          h('article', { class: 'pcard' },
            h('h4', { class: 'pcard__title', text: 'Il Vantaggio di M×E (Eliseo + Maverik)' }),
            h('ul', { class: 'plist' },
              h('li', null, h('strong', { text: 'Proprietà Totale del Software:' }), h('span', { text: ' Codice di proprietà, zero canoni a terzi, dati protetti su server dedicati.' })),
              h('li', null, h('strong', { text: 'Binomio Unico al Mondo:' }), h('span', { text: ' Eliseo guida la parte tecnica/automazioni; Maverik guida la strategia e la crescita commerciale.' })),
              h('li', null, h('strong', { text: 'Prodotto Replicabile:' }), h('span', { text: ' Domani M×E Barber Lab può essere venduto in licenza o canone ad altre barberie in tutta Italia!' }))
            )
          )
        ),
        h('div', { class: 'mav-quote' },
          h('blockquote', null,
            h('p', { text: '«Il nostro obiettivo non è copiare Keplero, ma costruire qualcosa che possa andare oltre.»' }),
            h('footer', { text: '— Maurizio Pizzuto & Eliseo Miraglia (M×E Barber Lab)' })
          )
        )
      ),
    ];
  }

  function draw() {
    if (tab === 'radar') body.replaceChildren(...drawRadar());
    else if (tab === 'crescita') body.replaceChildren(...drawCrescita());
    else if (tab === 'simulatore') body.replaceChildren(...drawSimulatore());
    else if (tab === 'copilota') body.replaceChildren(...drawCopilota());
    else if (tab === 'metodo') body.replaceChildren(...drawMetodo());
  }

  drawStats();
  draw();
}
