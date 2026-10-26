// Ponte per Cloudflare Pages: usa le funzioni di api/ (scritte per Vercel) senza cambiarle.
// Trasforma la richiesta del web in req/res stile Vercel e la risposta in Response.
export function adapt(handler) {
  return async function onRequest({ request, env = {} }) {
    // Le funzioni leggono process.env (Resend, ecc.): lo riempiamo con le variabili di Cloudflare.
    globalThis.process ??= { env: {} };
    globalThis.process.env ??= {};
    for (const [k, v] of Object.entries(env)) if (typeof v === 'string') globalThis.process.env[k] = v;
    let body;
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      const text = await request.text();
      try { body = text ? JSON.parse(text) : undefined; } catch { body = text; }
    }
    const headers = Object.fromEntries([...request.headers].map(([k, v]) => [k.toLowerCase(), v]));
    const req = { method: request.method, headers, body, url: request.url, query: Object.fromEntries(new URL(request.url).searchParams) };
    return new Promise((resolve, reject) => {
      const out = new Headers();
      const res = {
        statusCode: 200,
        setHeader(k, v) { out.set(k, String(v)); return res; },
        status(c) { res.statusCode = c; return res; },
        json(o) { out.set('Content-Type', 'application/json; charset=utf-8'); resolve(new Response(JSON.stringify(o), { status: res.statusCode, headers: out })); return res; },
        send(b) { resolve(new Response(b ?? null, { status: res.statusCode, headers: out })); return res; },
        end(b) { resolve(new Response(b ?? null, { status: res.statusCode, headers: out })); return res; },
      };
      Promise.resolve(handler(req, res)).catch(reject);
    });
  };
}
