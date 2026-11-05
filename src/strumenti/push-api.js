// Le campagne partono dal server del negozio: lì ci sono le chiavi degli avvisi e il controllo del consenso.
import { token as areaToken } from '../lib/account.js';

export function api() {
  return async function post(body) {
    const token = await areaToken();
    if (!token) {
      const e = new Error('sessione');
      e.status = 401;
      throw e;
    }
    let res;
    try {
      res = await fetch('/api/push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });
    } catch {
      const e = new Error('rete');
      e.status = 0;
      throw e;
    }
    let data = null;
    try { data = await res.json(); } catch { data = null; }
    if (!res.ok || !data?.ok) {
      const e = new Error(data?.error?.code || `http_${res.status}`);
      e.status = res.status;
      throw e;
    }
    return data;
  };
}
