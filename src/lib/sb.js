// Collegamento al progetto Supabase di Maximize Academy (separato da Maurizio Barber Shop).
// L'indirizzo e la chiave «publishable» sono pubblici per natura: compaiono nel browser. Le chiavi segrete non stanno mai qui.
export const SB_URL = 'https://hozyimhhrodazpssxmtt.supabase.co';
export const SB_KEY = ''; // Project Settings → API Keys → Publishable key (sb_publishable_…). Vuota = storie di base, gestione spenta.

const STORE = 'mx-sessione';
const read = () => { try { return JSON.parse(localStorage.getItem(STORE) || 'null'); } catch { return null; } };
const write = (s) => { try { if (s) localStorage.setItem(STORE, JSON.stringify(s)); else localStorage.removeItem(STORE); } catch { /* memoria non disponibile */ } };

async function auth(grant, body) {
  const r = await fetch(`${SB_URL}/auth/v1/token?grant_type=${grant}`, { method: 'POST', headers: { apikey: SB_KEY, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const d = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(r.status === 400 ? 'Email o password non corrette.' : 'Accesso non riuscito. Riprova.');
  const s = { access: d.access_token, refresh: d.refresh_token, exp: Date.now() + (d.expires_in || 3600) * 1000 };
  write(s);
  return s;
}

export const login = (email, password) => auth('password', { email, password });
export const hasSession = () => Boolean(read());
let pending = null;
/** Token valido (si rinnova da solo). Vuoto se non c'è accesso. */
export async function token() {
  const s = read();
  if (!s) return '';
  if (s.exp - Date.now() > 60000) return s.access;
  if (!pending) pending = auth('refresh_token', { refresh_token: s.refresh }).catch((e) => { if (/non corrette/.test(e.message)) write(null); return null; }).finally(() => { setTimeout(() => { pending = null; }, 0); });
  const n = await pending;
  return n ? n.access : '';
}
export async function logout() {
  const t = await token().catch(() => '');
  if (t) await fetch(`${SB_URL}/auth/v1/logout`, { method: 'POST', headers: { apikey: SB_KEY, Authorization: `Bearer ${t}` } }).catch(() => {});
  write(null);
}
/** Ruolo dal token (admin o cofounder possono gestire le storie). */
export function role(t) { try { return JSON.parse(atob(t.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))).app_metadata?.role || ''; } catch { return ''; } }
