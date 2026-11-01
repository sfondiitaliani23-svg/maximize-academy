// Installa e aggiorna l'app (PWA) dal menu.
// - Android / Chrome / Edge: il browser manda "beforeinstallprompt": lo teniamo da parte e lo usiamo quando si tocca "Installa l'app".
// - iPhone / iPad (Safari): non esiste un pulsante automatico, si mostrano i passi (Condividi → Aggiungi alla schermata Home).
// - Dentro l'app installata: "Aggiorna l'app" controlla /version.json e ricarica se c'è una versione nuova.

const CURRENT = typeof __BUILD_ID__ !== 'undefined' ? __BUILD_ID__ : '';

let deferred = null;
const listeners = new Set();
const notify = () => listeners.forEach((fn) => fn());

export function initPwa() {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault(); // niente banner automatico: si installa dal menu
    deferred = e;
    notify();
  });
  window.addEventListener('appinstalled', () => {
    deferred = null;
    notify();
  });
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function isStandalone() {
  return (
    window.matchMedia?.('(display-mode: standalone)').matches ||
    window.matchMedia?.('(display-mode: fullscreen)').matches ||
    window.navigator.standalone === true
  );
}

export function isIOS() {
  const ua = navigator.userAgent || '';
  return /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

export const canPrompt = () => deferred !== null;

/** Apre la finestra di installazione del browser. Torna 'accepted', 'dismissed' o 'unavailable'. */
export async function promptInstall() {
  if (!deferred) return 'unavailable';
  const e = deferred;
  deferred = null;
  notify();
  try {
    await e.prompt();
    const { outcome } = await e.userChoice;
    return outcome;
  } catch {
    return 'unavailable';
  }
}

export const currentVersion = () => (CURRENT ? CURRENT.slice(0, 7) : '');

/** Controlla se c'è una versione nuova. Torna 'updating' (e ricarica), 'latest' oppure 'offline'. */
export async function checkForUpdate() {
  try {
    const res = await fetch(`/version.json?t=${Date.now()}`, { cache: 'no-store' });
    if (!res.ok) return 'offline';
    const { version } = await res.json();
    if (version && CURRENT && version !== CURRENT) {
      // Ricarica scavalcando la cache del browser
      const url = new URL(window.location.href);
      url.searchParams.set('v', String(version).slice(0, 7));
      window.location.replace(url.toString());
      return 'updating';
    }
    return 'latest';
  } catch {
    return 'offline';
  }
}
