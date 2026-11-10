// Stesso progetto Supabase di Maurizio Barber Shop, sessione già aperta nell'area di Maximize (mx-area).
// Stessi metodi del client di Maurizio usati da Eliseo (Profilo → Sicurezza, Esci).
import { token as areaToken, utente, attivaCodice, togliCodice, confermaCodice, riserva, logout } from '../lib/account.js';

export function client() {
  return {
    async token() {
      const t = await areaToken();
      return t || null;
    },
    user: () => utente(),
    mfaEnroll: () => attivaCodice(),
    mfaVerify: (id, code) => confermaCodice(id, code),
    mfaUnenroll: (id) => togliCodice(id),
    mfaRiserva: (azione, codice) => riserva(azione, codice),
    signOut: () => logout(),
  };
}
