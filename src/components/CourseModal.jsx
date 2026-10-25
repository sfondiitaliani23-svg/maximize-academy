import React, { useState } from 'react';
import { X, Calendar, MapPin, Award, CheckCircle2, Send, Phone, User, Mail } from 'lucide-react';

export default function CourseModal({ courseId, onClose }) {
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', city: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!courseId) return null;

  const coursesDetails = {
    'gianni-cardinale': {
      title: 'Masterclass Tecnica con Gianni Cardinale',
      educator: 'Gianni Cardinale',
      subtitle: 'Tecnica pura, precisione chirurgica e confronto professionale.',
      partner: 'Men’s Events Education & Maximize Academy',
      topics: [
        'Geometria del taglio maschile avanzato',
        'Sfumature e transizioni a rasoio e trimmer',
        'Consulenza morfologica del viso',
        'Ottimizzazione dei tempi di esecuzione alla poltrona'
      ],
      includes: 'Attestato Ufficiale Maximize & Men\'s Events, Dispensa Tecnica, Pranzo & Coffee Break'
    },
    'yass-the-barber': {
      title: 'International Workshop con Yass The Barber',
      educator: 'Yass The Barber',
      subtitle: 'Esperienza internazionale, metodo visivo e lavoro pratico sul campo.',
      partner: 'Men’s Events Education & Maximize Academy',
      topics: [
        'Trend internazionali contemporanei',
        'Gestione delle texture e styling strutturato',
        'Creazione di contenuti visivi e posizionamento social',
        'Sessione pratica live su modelli'
      ],
      includes: 'Certificato Internazionale, Kit gadget formativo, Accesso al gruppo alumni riservato'
    },
    'barber-match-2026': {
      title: 'Barber Match 2026 — Paestum',
      educator: 'Palco & Competizioni Nazionali',
      subtitle: 'Competizione, palco, formazione e networking d’eccellenza.',
      partner: 'Barber Match & Maurizio Pizzuto',
      topics: [
        'Categorie di gara: Fast Fade, Razor Fade, Creative Cut, Total Look',
        'Show sul palco con Educator internazionali',
        'Stand espositivi con brand leader',
        'Cena di gala e premiazione'
      ],
      includes: 'Iscrizione alla competizione, Pass area VIP, Attestato di partecipazione'
    }
  };

  const current = coursesDetails[courseId] || coursesDetails['gianni-cardinale'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const resp = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          type: `Candidatura Corso: ${current.title}`,
          message: `Città: ${formData.city}`
        })
      });
      const data = await resp.json().catch(() => ({}));
      if (resp.ok && data.success) {
        setSubmitted(true);
      } else {
        setErrorMsg(data.error || 'Invio non riuscito. Riprova o scrivici su WhatsApp al +39 391 716 3833.');
      }
    } catch (err) {
      setErrorMsg('Connessione non riuscita: la candidatura non è stata inviata. Riprova o scrivici su WhatsApp al +39 391 716 3833.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel-gold max-w-2xl w-full rounded-3xl p-6 sm:p-10 border border-amber-500/40 relative shadow-2xl max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-2 mb-6 pr-8">
          <div className="text-[10px] uppercase font-bold tracking-[0.25em] text-amber-400">
            {current.partner}
          </div>
          <h3 className="text-2xl sm:text-3xl font-display font-bold text-white">
            {current.title}
          </h3>
          <p className="text-xs sm:text-sm text-gray-300">
            {current.subtitle}
          </p>
        </div>

        {/* Topics Covered */}
        <div className="mb-6 p-5 rounded-2xl bg-black/50 border border-white/10 space-y-3">
          <h4 className="text-xs uppercase font-bold text-amber-300 tracking-wider">
            Cosa apprenderai nel percorso:
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-200">
            {current.topics.map((t, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{t}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Registration Form */}
        {submitted ? (
          <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/40 text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-amber-400 mx-auto" />
            <h4 className="text-base font-bold text-white">Candidatura Ricevuta!</h4>
            <p className="text-xs text-gray-300">
              Il responsabile formazione di Maximize ti ricontatterà con le date disponibili e i dettagli della sede.
            </p>
            <button
              onClick={onClose}
              className="mt-2 px-6 py-2.5 rounded-full btn-gold text-xs font-bold uppercase tracking-wider"
            >
              Chiudi
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-2 border-t border-amber-500/20">
            <h4 className="text-xs uppercase font-bold text-gray-300 tracking-wider">
              Richiedi scheda tecnica, prezzi e prossime date:
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-semibold text-gray-300 block mb-1">Nome e Cognome *</label>
                <input 
                  type="text" 
                  required
                  placeholder="Il tuo nome"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-xs focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-gray-300 block mb-1">WhatsApp / Telefono *</label>
                <input 
                  type="tel" 
                  required
                  placeholder="es. 340 1234567"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-xs focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-semibold text-gray-300 block mb-1">Email</label>
                <input 
                  type="email" 
                  placeholder="tua@email.it"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-xs focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-gray-300 block mb-1">Città della tua barberia</label>
                <input 
                  type="text" 
                  placeholder="es. Milano, Roma, Napoli..."
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-xs focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-300">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl btn-gold text-xs uppercase font-extrabold tracking-widest flex items-center justify-center gap-2 shadow-gold-glow mt-4"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? 'Invio in corso...' : 'Invia Richiesta Programma Corso'}</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
