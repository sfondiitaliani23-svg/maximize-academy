// Regole delle offerte (K3). Funzione pura: serve al browser, all'assistente e ai test. Giorno calcolato a Europe/Rome.
import { partsInZone } from './open-now.js';

export const todayInRome = (now = new Date()) => partsInZone(now, 'Europe/Rome').iso;

// Offerte valide oggi: valida_dal <= oggi <= valida_al. Una data mancante o "[DA COMPLETARE]" non rende valida l'offerta.
export function activeOffers(items = [], now = new Date()) {
  const today = todayInRome(now);
  return items.filter((o) => /^\d{4}-\d{2}-\d{2}$/.test(o.valida_dal) && /^\d{4}-\d{2}-\d{2}$/.test(o.valida_al) && o.valida_dal <= today && today <= o.valida_al);
}
