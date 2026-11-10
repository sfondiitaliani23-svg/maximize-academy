// /api/mfa-riserva su Vercel — ponte verso la funzione di Maurizio Barber Shop (10/11/2026).
// Stessi account (stesso progetto Supabase): codici di riserva e link via email passano da lì.
// Nessuna chiave segreta qui: si inoltrano solo il token di chi è entrato e il corpo.
// Su Cloudflare Pages fa lo stesso functions/api/mfa-riserva.js.
const MBS = 'https://maurizio-barbershop.it';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ ok: false, error: { code: 'method_not_allowed', message: 'Metodo non consentito.' } }); }
  const auth = String(req.headers.authorization || '');
  if (!/^Bearer [A-Za-z0-9._-]{20,4096}$/.test(auth)) return res.status(401).json({ ok: false, error: { code: 'unauthorized', message: 'Accedi per continuare.' } });
  const b = req.body && typeof req.body === 'object' ? req.body : {};
  const body = JSON.stringify({ azione: String(b.azione || '').slice(0, 20), codice: b.codice == null ? undefined : String(b.codice).slice(0, 40) });
  try {
    const r = await fetch(`${MBS}/api/mfa-riserva`, { method: 'POST', headers: { Authorization: auth, 'Content-Type': 'application/json', Origin: MBS }, body, signal: AbortSignal.timeout(10000) });
    const text = await r.text();
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    return res.status(r.status).send(text);
  } catch {
    return res.status(502).json({ ok: false, error: { code: 'upstream_unavailable', message: 'Servizio non raggiungibile. Riprova tra poco.' } });
  }
}
