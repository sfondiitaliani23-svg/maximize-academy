// Inoltra la campagna al portale del negozio. Il permesso lo controlla quel server, con lo stesso accesso.
const SHOP = 'https://maurizio-barbershop.it/api/push';

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(204).end();
  }
  if (req.method !== 'POST') return res.status(405).json({ ok: false });
  const auth = String(req.headers.authorization || '');
  if (!/^Bearer\s+\S+$/.test(auth)) return res.status(401).json({ ok: false, error: { code: 'sessione' } });
  const raw = typeof req.body === 'string' ? req.body : JSON.stringify(req.body || {});
  if (raw.length > 20000) return res.status(400).json({ ok: false, error: { code: 'invalid_input' } });
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), 20000);
  try {
    const r = await fetch(SHOP, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: auth,
        Origin: 'https://maurizio-barbershop.it',
      },
      body: raw,
      redirect: 'manual',
      signal: ac.signal,
    });
    if (r.status >= 300 && r.status < 400) return res.status(502).json({ ok: false, error: { code: 'rete' } });
    const text = await r.text();
    res.status(r.status);
    res.setHeader('Content-Type', r.headers.get('content-type') || 'application/json; charset=utf-8');
    return res.send(text);
  } catch {
    return res.status(502).json({ ok: false, error: { code: 'rete' } });
  } finally {
    clearTimeout(timer);
  }
}
