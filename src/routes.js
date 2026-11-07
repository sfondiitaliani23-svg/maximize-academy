// Pagine del sito: ogni macroarea ha il suo indirizzo, come su Maurizio Barber Shop.
// Titoli e descrizioni servono al browser, a Google e alle pagine HTML generate in build (vite.config.js).
export const SITE = 'https://maximize-academy.vercel.app';

export const pages = [
  {
    path: '/ecosistema',
    label: 'Ecosistema',
    title: 'Ecosistema Maximize | Maximize Academy',
    description: 'Impara, migliora, attrezzati, organizzati, confrontati, cresci, digitalizza: il percorso Maximize Academy per il Barber, con M×E Barber Lab.',
    intro: 'I passi del percorso, dalla formazione al digitale.',
  },
  {
    path: '/formazione',
    label: 'Formazione',
    title: 'Formazione | Maximize Academy',
    description: 'Percorso formativo di Maximize Academy con UAAMI. La collaborazione per il 2027 è ancora in fase di definizione.',
    intro: 'Solo Maximize Academy e UAAMI. Il 2027 è in definizione.',
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
    description: 'Sabey Scissors propone forbici professionali. Modelli dal catalogo ufficiale.',
    intro: 'Forbici professionali, dal catalogo ufficiale.',
  },
  {
    path: '/anaqa',
    label: 'ANAQA',
    title: 'ANAQA Men Creation | Maximize Academy',
    description: 'ANAQA Men Creation: rituale barba professionale in 5 step e catalogo senza prezzi. Acquisto riservato ai professionisti.',
    intro: 'Rituale barba in 5 step e catalogo, senza prezzi.',
  },
  {
    path: '/treatwell',
    label: 'Treatwell',
    title: 'Treatwell per la barberia | Maximize Academy',
    description: 'Agenda digitale e prenotazioni online con Treatwell: come portare la barberia nel digitale.',
    intro: 'Agenda digitale e prenotazioni online.',
  },
  {
    path: '/mxe',
    label: 'M×E Barber Lab',
    nav: 'M×E',
    title: 'M×E Barber Lab | Maximize Academy',
    description: 'M×E Barber Lab: strategia, comunicazione e tecnologia per le imprese barber. Siti e soluzioni digitali. Sito ufficiale collegato.',
    intro: 'Siti e soluzioni digitali per le barberie.',
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
    description: 'Consulenza e corsi con Maurizio Pizzuto. Forbici Sabey, prodotti ANAQA e Treatwell con Keplero.',
    intro: 'Maurizio per formazione e consulenza. Keplero per Sabey, ANAQA e Treatwell.',
  },
  {
    path: '/pro',
    label: 'Professionisti',
    menu: false,
    title: 'Maurizio Pizzuto | Formazione, Prodotti & Business B2B · Maximize Academy',
    description: 'La piattaforma B2B di Maurizio Pizzuto per barbieri e titolari: percorsi formativi, Barber Reset, Sabey Scissors, rituale ANAQA e assistenza commerciale Keplero.',
    intro: 'Dedicato ai professionisti del settore barber.',
  },
];

export const home = {
  path: '/',
  title: 'Maximize Academy | Maurizio Pizzuto — Non solo Barber. Molto di più.',
  description: 'Maximize Academy è l’ecosistema per il Barber moderno: formazione, Barber Reset, Sabey Scissors, ANAQA, Treatwell, M×E Barber Lab ed eventi con Maurizio Pizzuto.',
};

// Maurizio: formazione, consulenza, collaborazioni.
// Vendita B2B (Sabey, ANAQA, Treatwell): 378 310 1416.
// 378 310 1417 è l'assistente del Maurizio Barber Shop e non va usato qui.
export const WA_MAURIZIO = '393245878724';
export const WA_KEPLERO = '393783101416';
export const waLink = (number, text) => `https://wa.me/${number}?text=${encodeURIComponent(text)}`;

// Vecchi indirizzi interni (#sezione) verso le nuove pagine
export const legacyHash = {
  '#ecosistema': '/ecosistema',
  '#formazione': '/formazione',
  '#barber-reset': '/barber-reset',
  '#sabey': '/sabey',
  '#trova-forbice': '/sabey#modelli',
  '#anaqa': '/anaqa',
  '#treatwell': '/treatwell',
  '#mxe': '/mxe',
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
  mxe: 'https://mxe-barber-lab.pages.dev/',
  maurizioBarberShop: 'https://maurizio-barbershop.it/',
};
