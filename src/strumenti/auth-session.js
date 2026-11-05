// Stesso progetto Supabase di Maurizio Barber Shop, sessione già aperta nell'area di Maximize (mx-area).
import { token as areaToken } from '../lib/account.js';

export function client() {
  return {
    async token() {
      const t = await areaToken();
      return t || null;
    },
  };
}
