// Aggiornamento automatico: quando esce una nuova versione del sito,
// le pagine già aperte si ricaricano da sole.
// Controlla /version.json ogni 60 secondi e quando torni sulla scheda.
// Non ricarica se in un modulo c'è testo scritto e non inviato: aspetta.

const CURRENT = typeof __BUILD_ID__ !== 'undefined' ? __BUILD_ID__ : '';
const EVERY_MS = 60 * 1000;

function isTyping() {
  // Se in un modulo c'è testo scritto e non ancora inviato, non ricaricare.
  return [...document.querySelectorAll('input, textarea')].some(
    (f) => !['hidden', 'checkbox', 'radio', 'range', 'number', 'submit', 'button'].includes(f.type) && f.value.trim() !== ''
  );
}

async function check() {
  if (!CURRENT || document.visibilityState !== 'visible') return;
  try {
    const res = await fetch(`/version.json?t=${Date.now()}`, { cache: 'no-store' });
    if (!res.ok) return;
    const { version } = await res.json();
    if (version && version !== CURRENT) {
      if (isTyping()) return; // riprova al prossimo controllo
      window.location.reload();
    }
  } catch {
    // senza rete: riprova al prossimo controllo
  }
}

export function startAutoUpdate() {
  if (import.meta.env.DEV) return;
  setInterval(check, EVERY_MS);
  document.addEventListener('visibilitychange', check);
  window.addEventListener('focus', check);
}
