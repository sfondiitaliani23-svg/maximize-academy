// Aggiornamento automatico: quando esce una nuova versione del sito,
// le pagine già aperte si ricaricano da sole.
// Controlla /version.json ogni 60 secondi e quando torni sulla scheda.
// Non ricarica se in un modulo c'è testo scritto e non inviato: aspetta.

const CURRENT = typeof __BUILD_ID__ !== 'undefined' ? __BUILD_ID__ : '';
const EVERY_MS = 60 * 1000;

function isTyping() {
  // Non ricaricare solo se si sta scrivendo adesso in un campo (03/11/2026).
  // Prima bastava un campo compilato dal browser (es. l'email salvata) per bloccare l'aggiornamento per sempre.
  const f = document.activeElement;
  if (!f || !['INPUT', 'TEXTAREA'].includes(f.tagName)) return false;
  return !['hidden', 'checkbox', 'radio', 'range', 'submit', 'button'].includes(f.type) && f.value.trim() !== '';
}

// Ricarica scavalcando la cache del browser e del telefono.
function reloadFresh(version) {
  const url = new URL(window.location.href);
  url.searchParams.set('v', String(version).slice(0, 7));
  window.location.replace(url.toString());
}

async function check() {
  if (!CURRENT || document.visibilityState !== 'visible') return;
  try {
    const res = await fetch(`/version.json?t=${Date.now()}`, { cache: 'no-store' });
    if (!res.ok) return;
    const { version } = await res.json();
    if (version && version !== CURRENT) {
      if (isTyping()) return; // riprova al prossimo controllo
      reloadFresh(version);
    }
  } catch {
    // senza rete: riprova al prossimo controllo
  }
}

export function startAutoUpdate() {
  if (import.meta.env.DEV) return;
  // Dopo l'aggiornamento toglie «?v=…» dall'indirizzo
  try { const u = new URL(window.location.href); if (u.searchParams.has('v')) { u.searchParams.delete('v'); window.history.replaceState(null, '', u.pathname + u.search + u.hash); } } catch { /* niente */ }
  check();
  window.addEventListener('pageshow', check);
  setInterval(check, EVERY_MS);
  document.addEventListener('visibilitychange', check);
  window.addEventListener('focus', check);
}
