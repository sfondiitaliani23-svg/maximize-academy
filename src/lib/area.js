// Area privata di Maximize Academy: chiamate a Supabase (solo fetch, nessuna libreria).
// Account e dati stanno nel progetto di Maurizio Barber Shop, in tabelle «mx_» separate (02/11/2026).
// Le regole su chi vede cosa stanno nel database (supabase/area-privata.sql), non qui.
import { AC_URL, AC_KEY, token } from './account';

const BUCKET = 'mx-materiali';

async function headers(extra = {}) {
  const t = await token();
  if (!t) throw new Error('Sessione scaduta: accedi di nuovo.');
  return { apikey: AC_KEY, Authorization: `Bearer ${t}`, ...extra };
}

function errore(r, d) {
  if (r.status === 401) return 'Sessione scaduta: accedi di nuovo.';
  if (r.status === 403) return 'Non hai il permesso per questa azione.';
  if (r.status === 404 || /relation .* does not exist|schema cache|PGRST20/i.test(`${d?.message || ''} ${d?.code || ''}`)) return 'Area non ancora attiva: va eseguito supabase/area-privata.sql.';
  if (r.status === 409) return 'Esiste già.';
  return 'Operazione non riuscita. Riprova.';
}

/** Lettura e scrittura sulle tabelle (PostgREST). */
export async function rest(path, { method = 'GET', body, prefer } = {}) {
  const h = await headers({ 'Content-Type': 'application/json', ...(prefer ? { Prefer: prefer } : {}) });
  const r = await fetch(`${AC_URL}/rest/v1/${path}`, { method, headers: h, body: body ? JSON.stringify(body) : undefined });
  const text = await r.text();
  const d = text ? (() => { try { return JSON.parse(text); } catch { return null; } })() : null;
  if (!r.ok) throw new Error(errore(r, d));
  return d;
}

/** Carica un file nello spazio privato dei materiali (cartella = id del corso). */
export async function caricaFile(corso, file) {
  const ext = (file.name.split('.').pop() || 'bin').toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 5) || 'bin';
  const path = `${corso}/${crypto.randomUUID()}.${ext.length < 2 ? 'bin' : ext}`;
  const h = await headers({ 'Content-Type': file.type || 'application/octet-stream', 'x-upsert': 'false' });
  const r = await fetch(`${AC_URL}/storage/v1/object/${BUCKET}/${path}`, { method: 'POST', headers: h, body: file });
  if (!r.ok) throw new Error(r.status === 413 ? 'Il file supera 50 MB.' : r.status === 400 ? 'Formato non accettato: PDF, video MP4/WebM/MOV, immagini o ZIP.' : 'Caricamento non riuscito. Riprova.');
  return path;
}

/** Link temporaneo (1 ora) per aprire un file privato. */
export async function apriFile(path) {
  const h = await headers({ 'Content-Type': 'application/json' });
  const r = await fetch(`${AC_URL}/storage/v1/object/sign/${BUCKET}/${path}`, { method: 'POST', headers: h, body: JSON.stringify({ expiresIn: 3600 }) });
  const d = await r.json().catch(() => ({}));
  if (!r.ok || !d.signedURL) throw new Error('Non riesco ad aprire il file.');
  return `${AC_URL}/storage/v1${d.signedURL}`;
}

export async function cancellaFile(path) {
  const h = await headers();
  await fetch(`${AC_URL}/storage/v1/object/${BUCKET}/${path}`, { method: 'DELETE', headers: h }).catch(() => {});
}

export const fmtData = (d) => (d ? new Intl.DateTimeFormat('it-IT', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Rome' }).format(new Date(`${d}T12:00:00Z`)) : '');
export const fmtQuando = (iso) => new Intl.DateTimeFormat('it-IT', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Rome' }).format(new Date(iso));
