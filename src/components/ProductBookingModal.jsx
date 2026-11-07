import React, { useState } from 'react';
import { ShoppingBag, CheckCircle, Clock, MapPin, X, ArrowRight } from 'lucide-react';
import { WA_MAURIZIO, waLink } from '../routes';

/**
 * Modale per la prenotazione rapida di prodotti con ritiro al Maurizio Barber Shop.
 * Flusso: Selezione -> Inserimento Dati -> Conferma via WhatsApp/Salone senza pagamenti anticipati.
 */
export default function ProductBookingModal({ product, onClose }) {
  const [nome, setNome] = useState('');
  const [telefono, setTelefono] = useState('');
  const [dataRitiro, setDataRitiro] = useState('');
  const [note, setNote] = useState('');
  const [inviato, setInviato] = useState(false);

  if (!product) return null;

  const handlePrenotazione = (e) => {
    e.preventDefault();
    if (!nome.trim() || !telefono.trim()) return;

    const messaggio = `Salve Maurizio! Vorrei prenotare per il ritiro in barberia:
📦 Prodotto: ${product.name}
💰 Prezzo: €${product.price}
👤 Nome: ${nome}
📱 Telefono: ${telefono}
📅 Data preferita ritiro: ${dataRitiro || 'Prima possibile'}
${note ? `📝 Note: ${note}` : ''}`;

    // Reindirizzamento diretto a WhatsApp
    const link = waLink(WA_MAURIZIO, messaggio);
    window.open(link, '_blank');
    setInviato(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg rounded-3xl glass-panel-gold border border-amber-500/40 p-6 sm:p-8 bg-[#141414] shadow-2xl text-left">
        
        {/* Pulsante Chiusura */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Chiudi"
        >
          <X className="w-5 h-5" />
        </button>

        {!inviato ? (
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-4">
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Prenota e Ritira in Salone</span>
            </div>

            <h3 className="text-2xl font-display font-bold text-white mb-1">
              {product.name}
            </h3>
            <p className="text-amber-400 font-bold text-lg mb-4">
              € {product.price} <span className="text-xs text-gray-400 font-normal">· Pagamento al ritiro</span>
            </p>

            <div className="bg-[#1a1a1a] p-3.5 rounded-xl border border-white/5 mb-6 flex items-start gap-3 text-xs text-gray-300">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block">Ritiro presso:</strong>
                Maurizio Barber Shop · Via Foggia
                <span className="block text-[11px] text-gray-400 mt-0.5">Nessun costo di spedizione, prodotto pronto al banco.</span>
              </div>
            </div>

            <form onSubmit={handlePrenotazione} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                  Il tuo Nome e Cognome *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Es. Mario Rossi"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                  Cellulare / WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Es. 340 1234567"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                  Giorno indicativo di ritiro (opzionale)
                </label>
                <input
                  type="text"
                  placeholder="Es. Domani pomeriggio / Sabato mattina"
                  value={dataRitiro}
                  onChange={(e) => setDataRitiro(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 text-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-4 px-6 rounded-xl btn-gold text-xs uppercase font-bold tracking-wider flex items-center justify-center gap-2 shadow-gold-glow"
              >
                <span>Conferma Prenotazione su WhatsApp</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        ) : (
          <div className="text-center py-8 space-y-4">
            <CheckCircle className="w-16 h-16 text-amber-400 mx-auto animate-bounce" />
            <h3 className="text-2xl font-display font-bold text-white">
              Richiesta Inviata con Successo!
            </h3>
            <p className="text-sm text-gray-300 max-w-sm mx-auto">
              Abbiamo aperto la chat WhatsApp con Maurizio per confermare la disponibilità del prodotto. Ti aspettiamo in barberia per il ritiro!
            </p>
            <div className="pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-full btn-glass text-xs uppercase font-bold text-gray-200"
              >
                Chiudi
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

