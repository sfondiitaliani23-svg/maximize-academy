// /api/dispositivo su Maximize Academy — ponte verso Maurizio Barber Shop (14/11/2026): «Ricorda questo dispositivo».
// Gli account sono gli stessi (stesso progetto Supabase). Si inoltrano il token, il segreto del dispositivo e il corpo.
const MBS = 'https://maurizio-barbershop.it';

export async function onRequestPost({ request }) {
  const auth = request.headers.get('authorization') || '';
  if (!/^Bearer [A-Za-z0-9._-]{20,4096}$/.test(auth)) {
    return Response.json({ ok: false, error: { code: 'unauthorized', message: 'Accedi per continuare.' } }, { status: 401 });
  }
  const disp = request.headers.get('x-dispositivo') || '';
  const body = (await request.text()).slice(0, 2000);
  try {
    const r = await fetch(`${MBS}/api/dispositivo`, {
      method: 'POST',
      headers: { Authorization: auth, 'Content-Type': 'application/json', Origin: MBS, ...(/^[a-f0-9]{64}$/.test(disp) ? { 'x-dispositivo': disp } : {}), 'user-agent': (request.headers.get('user-agent') || '').slice(0, 300) },
      body,
    });
    return new Response(await r.text(), { status: r.status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' } });
  } catch {
    return Response.json({ ok: false, error: { code: 'upstream_unavailable', message: 'Servizio non raggiungibile. Riprova tra poco.' } }, { status: 502 });
  }
}

export const onRequest = () => new Response(null, { status: 405, headers: { Allow: 'POST' } });
