// Service worker di Maximize Academy (02/11/2026), come su Barberia Garofalo e Maurizio Barber Shop.
// Non mette in cache pagine né codice: il sito resta sempre aggiornato. Serve solo a:
// - rendere l'app installabile come vera app;
// - mostrare una pagina «sei offline» quando manca la rete;
// - prendere le pagine sempre fresche dalla rete (niente versioni vecchie nell'app installata).
const CACHE = 'maximize-offline-v2';
const PRECACHE = ['/offline.html', '/icons/icon-192.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(PRECACHE).catch(() => {})).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  // Solo le pagine (navigazioni): sempre dalla rete, e se la rete manca la pagina offline.
  if (req.method !== 'GET' || req.mode !== 'navigate') return;
  // cache: 'no-store' scavalca anche la cache del telefono: l'app installata apre sempre l'ultima versione (03/11/2026).
  event.respondWith(fetch(req, { cache: 'no-store' }).catch(() => fetch(req)).catch(() => caches.match('/offline.html')));
});
