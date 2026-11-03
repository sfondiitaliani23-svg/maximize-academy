// Account dell'area privata (/area): sono gli stessi di Maurizio Barber Shop (decisione di Eliseo, 02/11/2026).
// Si usa il progetto Supabase «maurizio-barber-shop». Indirizzo e chiave «publishable» sono pubblici per natura.
// Le storie (/gestione) restano sul progetto di Maximize (lib/sb.js): sessione separata.
export const AC_URL = 'https://jxtkgxdxvouwlowvqohm.supabase.co';
export const AC_KEY = 'sb_publishable_SfTFCS_YxVYUOQzxI_tLpA_Kj10eSVj';

const STORE = 'mx-area';
const read = () => { try { return JSON.parse(localStorage.getItem(STORE) || 'null'); } catch { return null; } };
const write = (s) => { try { if (s) localStorage.setItem(STORE, JSON.stringify(s)); else localStorage.removeItem(STORE); } catch { /* memoria non disponibile */ } };
const back = () => `${window.location.origin}/area`;

function messaggio(d, status) {
  const code = String(d?.error_code || d?.code || '');
  const m = String(d?.msg || d?.message || d?.error_description || '');
  if (code === 'invalid_credentials' || /invalid login/i.test(m)) return 'Email o password non corrette.';
  if (code === 'email_not_confirmed' || /not confirmed/i.test(m)) return 'Prima conferma la tua email: ti abbiamo scritto un link.';
  if (code === 'user_already_exists' || /already/i.test(m)) return 'Questa email ha già un account (anche da Maurizio Barber Shop): accedi.';
  if (code === 'weak_password' || /password/i.test(m)) return 'Password troppo debole: almeno 10 caratteri, con lettere e numeri.';
  if (status === 429) return 'Troppe richieste in poco tempo. Riprova tra qualche minuto.';
  return 'Operazione non riuscita. Riprova.';
}

async function call(path, body, t) {
  let r;
  try {
    r = await fetch(`${AC_URL}${path}`, { method: 'POST', headers: { apikey: AC_KEY, 'Content-Type': 'application/json', ...(t ? { Authorization: `Bearer ${t}` } : {}) }, body: JSON.stringify(body) });
  } catch {
    const err = new Error('Non riusciamo a collegarci. Controlla la connessione e riprova.');
    err.network = true;
    throw err;
  }
  const d = await r.json().catch(() => ({}));
  if (!r.ok) {
    const err = new Error(messaggio(d, r.status));
    err.authDead = r.status === 400 || r.status === 401;
    throw err;
  }
  return d;
}

function scadenzaJwt(access) {
  try {
    const p = JSON.parse(decodeURIComponent(escape(atob(String(access).split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))));
    const e = Number(p.exp);
    return e > 1e9 ? e * 1000 : 0;
  } catch { return 0; }
}

function scadenza(d, access) {
  const jwt = scadenzaJwt(access);
  if (jwt) return jwt;
  const at = Number(d.expires_at);
  if (at > 1e12) return at;
  if (at > 1e9) return at * 1000;
  const inn = Number(d.expires_in);
  if (inn > 0) return Date.now() + inn * 1000;
  return Date.now() + 3600 * 1000;
}

const salva = (d, prev) => {
  const access = d.access_token || prev?.access || '';
  if (!access) return null;
  const s = { access, refresh: d.refresh_token || prev?.refresh || '', exp: scadenza(d, access) };
  write(s);
  return s;
};

export const login = async (email, password) => salva(await call('/auth/v1/token?grant_type=password', { email, password }));
export const hasSession = () => Boolean(read());
// Client ID di Google del progetto «Maximize Academy» (Google Cloud). Non è segreto.
// Con questo il pulsante di Google si apre sul dominio di Maximize e mostra il nome dell'app al posto di supabase.co.
// Vuoto = si usa il vecchio percorso (pagina di Google con l'indirizzo di Supabase).
export const GOOGLE_CLIENT_ID = '';

/** Accesso con il token di Google ottenuto sul dominio del sito. */
export const conGoogleToken = async (idToken, nonce) => salva(await call('/auth/v1/token?grant_type=id_token', { provider: 'google', id_token: idToken, nonce }));

export const googleUrl = () => `${AC_URL}/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(back())}`;

/** Iscrizione (vale anche per Maurizio Barber Shop: è lo stesso account). */
export async function iscriviti({ nome, email, password }) {
  const d = await call(`/auth/v1/signup?redirect_to=${encodeURIComponent(back())}`, { email, password, data: { name: nome } });
  if (d.access_token) { salva(d); return { entrato: true }; }
  return { entrato: false };
}
export async function recuperaPassword(email) { await call(`/auth/v1/recover?redirect_to=${encodeURIComponent(back())}`, { email }).catch(() => {}); }

let indirizzoLetto = false;
let esitoIndirizzo = null;

function pulisciIndirizzo() {
  const q = new URLSearchParams(window.location.search);
  ['access_token', 'refresh_token', 'expires_in', 'expires_at', 'token_type', 'type', 'error', 'error_description', 'error_code'].forEach((k) => q.delete(k));
  const search = q.toString();
  window.history.replaceState(null, '', window.location.pathname + (search ? `?${search}` : ''));
}

/** Ritorno da Google, dal link di conferma o da quello per la nuova password.
 *  I token possono arrivare sulla home (link in Gmail) o su /area. Si leggono una volta, prima della schermata d'ingresso. */
export function sessioneDaIndirizzo() {
  if (indirizzoLetto) return esitoIndirizzo;
  indirizzoLetto = true;
  const h = new URLSearchParams(window.location.hash.slice(1));
  const q = new URLSearchParams(window.location.search);
  const access = h.get('access_token') || q.get('access_token');
  const err = h.get('error_description') || q.get('error_description');
  if (!access) {
    if (err) { pulisciIndirizzo(); esitoIndirizzo = { errore: 'Accesso non riuscito. Riprova.' }; }
    return esitoIndirizzo;
  }
  salva({
    access_token: access,
    refresh_token: h.get('refresh_token') || q.get('refresh_token') || '',
    expires_in: h.get('expires_in') || q.get('expires_in') || '',
    expires_at: h.get('expires_at') || q.get('expires_at') || '',
  });
  pulisciIndirizzo();
  esitoIndirizzo = { tipo: h.get('type') || q.get('type') || '' };
  return esitoIndirizzo;
}

let pending = null;
/** Token valido (si rinnova da solo). Vuoto se non c'è accesso. */
export async function token() {
  const s = read();
  if (!s?.access) return '';
  if (s.exp - Date.now() > 60000) return s.access;
  if (!s.refresh) return s.exp > Date.now() ? s.access : '';
  if (!pending) {
    pending = call('/auth/v1/token?grant_type=refresh_token', { refresh_token: s.refresh })
      .then((d) => salva(d, s))
      .catch((e) => {
        if (e.authDead) { write(null); return null; }
        return s.exp > Date.now() ? s : null;
      })
      .finally(() => { setTimeout(() => { pending = null; }, 0); });
  }
  const n = await pending;
  return n ? n.access : '';
}

export async function nuovaPassword(password) {
  const t = await token();
  const r = await fetch(`${AC_URL}/auth/v1/user`, { method: 'PUT', headers: { apikey: AC_KEY, Authorization: `Bearer ${t}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) });
  if (!r.ok) throw new Error(messaggio(await r.json().catch(() => ({})), r.status));
}

export async function logout() {
  const t = await token().catch(() => '');
  if (t) await fetch(`${AC_URL}/auth/v1/logout`, { method: 'POST', headers: { apikey: AC_KEY, Authorization: `Bearer ${t}` } }).catch(() => {});
  write(null);
}

/** Dati dal token: id, email, nome, ruolo. */
export function chiSono(t) {
  try {
    const p = JSON.parse(decodeURIComponent(escape(atob(t.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))));
    const um = p.user_metadata || {};
    return { id: p.sub || '', email: p.email || '', nome: um.name || um.full_name || um.nome || '', ruolo: p.app_metadata?.role || '' };
  } catch { return { id: '', email: '', nome: '', ruolo: '' }; }
}
