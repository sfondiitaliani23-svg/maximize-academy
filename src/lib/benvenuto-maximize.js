// Schermata d'ingresso dell'app Maximize Academy (03/11/2026). Gli account sono quelli dell'area privata (/area).
import { benvenuto, TESTI_BASE } from './benvenuto';
import { hasSession, logout } from './account';

export function avviaBenvenuto() {
  benvenuto({
    chiave: 'maximize',
    classe: 'bv-maximize',
    nome: 'Maximize Academy',
    logo: '/assets/img/logo-maximize.webp',
    sfondo: '/assets/img/maurizio_ritratto.webp',
    tema: '#111111',
    obbligo: true,
    lingua: () => 'it',
    lingue: false,
    accedi: '/area',
    iscriviti: '/area#registrati',
    escludi: ['/area', '/gestione', '/privacy'],
    privacy: '/privacy.html',
    assistenza: 'https://wa.me/393245878724',
    versione: typeof __BUILD_ID__ !== 'undefined' ? `v. ${String(__BUILD_ID__).slice(0, 7)}` : '',
    loggato: () => hasSession(),
    esci: () => logout(),
    testi: {
      it: { ...TESTI_BASE.it, accedi: 'Accedi', iscriviti: 'Crea un nuovo account', vantaggiTitolo: 'Vantaggi per gli allievi', vantaggi: 'Nell\'app trovi i tuoi corsi con date e luogo, i materiali (dispense e video), gli avvisi di Maurizio e gli attestati da salvare in PDF.', iscrivitiTitolo: 'Iscriviti a Maximize', iscrivitiTesto: 'Crea l\'account in un minuto con Google o con la tua email. Vale anche per Maurizio Barber Shop: un solo account per entrambi.', gia: 'Hai già un account su Maurizio Barber Shop? Accedi con gli stessi dati.' },
      en: { ...TESTI_BASE.en, accedi: 'Sign in', iscriviti: 'Create a new account', vantaggiTitolo: 'Student benefits', vantaggi: 'Your courses, materials, notices and certificates in one app.', iscrivitiTitolo: 'Join Maximize', iscrivitiTesto: 'Create your account in a minute with Google or email.', gia: '' },
    },
  });
}
