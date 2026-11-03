// Pagine del sito: ogni macroarea ha il suo indirizzo, come su Maurizio Barber Shop.
// Titoli e descrizioni servono al browser, a Google e alle pagine HTML generate in build (vite.config.js).
export const SITE = 'https://maximize-academy.vercel.app';

export const pages = [
  {
    path: '/ecosistema',
    label: 'Ecosistema',
    title: 'Ecosistema Maximize | Maximize Academy',
    description: 'Impara, migliora, attrezzati, organizzati, confrontati, cresci: i sei passi del percorso Maximize Academy per il Barber.',
    intro: 'I sei passi del percorso: dalla formazione alla crescita dell’attività.',
  },
  {
    path: '/formazione',
    label: 'Formazione',
    title: 'Formazione | Maximize Academy',
    description: 'Corsi e masterclass per Barber: il percorso professionale con UAAMI e la collaborazione con Sabey Scissors.',
    intro: 'Corsi, masterclass e il percorso con UAAMI.',
  },
  {
    path: '/barber-national-academy',
    label: 'National Academy',
    menu: false, // pagina di progetto: nel menu laterale e nel footer, non nella barra in alto
    title: 'Barber National Academy 2027 | Maximize Academy',
    description: 'Barber National Academy: il progetto formativo 2027 di Maurizio Pizzuto per i collaboratori di barberia. Dal settore giovanile alla Nazionale. In sviluppo.',
    intro: 'Progetto formativo 2027: dal settore giovanile alla Nazionale.',
  },
  {
    path: '/barber-reset',
    label: 'Barber Reset',
    title: 'Barber Reset: intervento strategico in barberia | Maximize Academy',
    description: 'Barber Reset: listino, margini, vendita e gestione della barberia. Con il calcolatore del potenziale recuperabile.',
    intro: 'Intervento strategico su listino, margini e vendita.',
  },
  {
    path: '/sabey',
    label: 'Sabey',
    title: 'Sabey Scissors | Maximize Academy',
    description: 'Forbici professionali Sabey Scissors: scegli lo strumento giusto per la tua mano e la tua tecnica, con il configuratore.',
    intro: 'Forbici professionali e configuratore su misura.',
  },
  {
    path: '/anaqa',
    label: 'ANAQA',
    title: 'ANAQA Men Creation | Maximize Academy',
    description: 'ANAQA Men Creation: prodotti professionali e kit per barberie, per completare il servizio e la rivendita.',
    intro: 'Prodotti professionali e kit per la barberia.',
  },
  {
    path: '/treatwell',
    label: 'Treatwell',
    title: 'Treatwell per la barberia | Maximize Academy',
    description: 'Agenda digitale e prenotazioni online con Treatwell: come portare la barberia nel digitale.',
    intro: 'Agenda digitale e prenotazioni online.',
  },
  {
    path: '/eventi',
    label: 'Eventi',
    title: 'Eventi: Barber Match | Maximize Academy',
    description: 'Barber Match Paestum 2026: competizioni, palco, formazione e networking.',
    intro: 'Barber Match, palco e networking.',
  },
  {
    path: '/contatti',
    label: 'Contatti',
    title: 'Contatti | Maximize Academy',
    description: 'Parla con Maurizio Pizzuto o con l’operatore Maximize: consulenza, corsi, Sabey Scissors e Barber Reset.',
    intro: 'Maurizio Pizzuto o l’operatore Maximize.',
  },
];

export const home = {
  path: '/',
  title: 'Maximize Academy | Maurizio Pizzuto — Non solo Barber. Molto di più.',
  description: 'Maximize Academy è l’ecosistema per il Barber moderno: formazione, Barber Reset, Sabey Scissors, ANAQA, Treatwell ed eventi con Maurizio Pizzuto.',
};

// Vecchi indirizzi interni (#sezione) verso le nuove pagine
export const legacyHash = {
  '#ecosistema': '/ecosistema',
  '#formazione': '/formazione',
  '#barber-reset': '/barber-reset',
  '#sabey': '/sabey',
  '#trova-forbice': '/sabey#trova-forbice',
  '#anaqa': '/anaqa',
  '#treatwell': '/treatwell',
  '#barber-match': '/eventi',
  '#mens-events': '/eventi',
  '#contatti': '/contatti',
};

export const normalize = (p) => (p.length > 1 ? p.replace(/\/+$/, '') : p);
export const findPage = (p) => pages.find((x) => x.path === normalize(p)) || null;

// Siti e profili ufficiali dei marchi (ticker e loghi nelle pagine)
export const brandLinks = {
  sabey: 'https://www.instagram.com/sabey_scissors_europa/',
  anaqa: 'https://anaqaitalia.it/',
  treatwell: 'https://www.treatwell.it/',
  maurizioBarberShop: 'https://maurizio-barbershop.it/',
};
