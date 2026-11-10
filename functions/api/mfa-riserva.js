// /api/mfa-riserva — ponte verso la funzione di Maurizio Barber Shop (10/11/2026).
// Gli account sono gli stessi (stesso progetto Supabase): codici di riserva e link via email
// passano da lì, così qui non serve nessuna chiave segreta. Si inoltrano solo il token e il corpo.
const MBS = 'https://maurizio-barbershop.it';

export async function onRequestPost({ request }) {
  const auth = request.headers.get('authorization') || '';
  if (!/^Bearer [A-Za-z0-9._-]{20,4096}$/.test(auth)) {
    return Response.json({ ok: false, error: { code: 'unauthorized', message: 'Accedi per continuare.' } }, { status: 401 });
  }
  const body = (await request.text()).slice(0, 2000);
  try {
    const r = await fetch(`${MBS}/api/mfa-riserva`, {
      method: 'POST',
      headers: { Authorization: auth, 'Content-Type': 'application/json', Origin: MBS },
      body,
    });
    return new Response(await r.text(), { status: r.status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' } });
  } catch {
    return Response.json({ ok: false, error: { code: 'upstream_unavailable', message: 'Servizio non raggiungibile. Riprova tra poco.' } }, { status: 502 });
  }
}

export const onRequest = () => new Response(null, { status: 405, headers: { Allow: 'POST' } });
