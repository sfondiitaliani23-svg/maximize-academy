import React, { useState } from 'react';
import { Phone, MessageSquare, Send, CheckCircle2, User, Mail, Sparkles, Clock } from 'lucide-react';

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    type: 'Barber Reset & Crescita',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const resp = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await resp.json().catch(() => ({}));

      if (resp.ok && data.success) {
        setSubmitted(true);
      } else {
        setErrorMsg(data.error || 'Impossibile inviare la richiesta. Riprova o contattaci su WhatsApp.');
      }
    } catch (err) {
      setErrorMsg('Connessione non riuscita: la richiesta non è stata inviata. Riprova o scrivici su WhatsApp al +39 391 716 3833.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contatti" className="py-24 relative overflow-hidden bg-gradient-to-b from-[#070709] via-[#0d0d14] to-[#070709]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-amber-500/30">
            <span className="text-[11px] uppercase tracking-[0.25em] text-amber-400 font-bold">
              IL TUO PROSSIMO PASSO COMINCIA DA UNA CONVERSAZIONE
            </span>
          </div>

          <h2 className="text-3xl sm:text-6xl font-display font-bold text-white tracking-tight">
            Hai un progetto?{' '}
            <span className="font-serif italic font-normal gold-text-gradient">
              Parliamone.
            </span>
          </h2>

          <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
            Corsi, Barber Reset, Sabey Scissors, ANAQA, Treatwell, eventi o crescita della tua barberia. Raccontami dove sei e dove vuoi arrivare.
          </p>
        </div>

        {/* 2 Distinct Channels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          
          {/* Canale 1: Maurizio Pizzuto */}
          <div className="glass-panel-gold rounded-3xl p-8 sm:p-10 border border-amber-500/40 relative shadow-2xl flex flex-col justify-between group hover:border-amber-400">
            <div>
              <div className="text-[10px] uppercase font-bold tracking-[0.25em] text-amber-400 mb-2">
                CONSULENZA · PROGETTI · PARTNERSHIP
              </div>
              <h3 className="text-2xl sm:text-3xl font-display font-bold text-white mb-2">
                Una visione per la tua barberia.
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-6">
                Barber Reset, crescita strategica dell’attività, digitalizzazione Treatwell e nuove collaborazioni commerciali.
              </p>
            </div>

            <div className="space-y-4 pt-4 border-t border-amber-500/20">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Linea Diretta Maurizio</span>
                <span className="text-sm font-bold font-mono text-white">+39 391 716 3833</span>
              </div>
              <a
                href="https://wa.me/393917163833?text=Salve%20Maurizio,%20vorrei%20fissare%20una%20consulenza%20strategica%20per%20la%20mia%20barberia"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-6 rounded-xl btn-gold flex items-center justify-center gap-2 text-xs uppercase font-bold tracking-wider shadow-gold-glow"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Parla direttamente con Maurizio</span>
              </a>
            </div>
          </div>

          {/* Canale 2: Operatore Formazione & Sabey */}
          <div className="glass-panel rounded-3xl p-8 sm:p-10 border border-white/10 relative shadow-2xl flex flex-col justify-between group hover:border-amber-500/40">
            <div>
              <div className="text-[10px] uppercase font-bold tracking-[0.25em] text-amber-400/80 mb-2">
                FORMAZIONE · CORSI · SABEY SCISSORS
              </div>
              <h3 className="text-2xl sm:text-3xl font-display font-bold text-white mb-2">
                Il tuo prossimo passo professionale.
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-6">
                Un supporto dedicato per orientarti tra date e iscrizioni ai corsi internazionali, e per la prova delle forbici Sabey.
              </p>
            </div>

            <div className="space-y-4 pt-4 border-t border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Desk Operativo Maximize</span>
                <span className="text-sm font-bold font-mono text-white">+39 391 716 3833</span>
              </div>
              <a
                href="https://wa.me/393917163833?text=Salve,%20vorrei%20informazioni%20sui%20corsi%20di%20formazione%20e%20sulle%20forbici%20Sabey"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-6 rounded-xl btn-glass flex items-center justify-center gap-2 text-xs uppercase font-bold tracking-wider text-amber-300 border-amber-500/30 hover:border-amber-400"
              >
                <Phone className="w-4 h-4 text-amber-400" />
                <span>Parla con un operatore Maximize</span>
              </a>
            </div>
          </div>

        </div>

        {/* Direct Contact Form Container */}
        <div className="max-w-3xl mx-auto glass-panel rounded-3xl p-8 sm:p-12 border border-white/10 shadow-2xl">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-display font-bold text-white">
              Invia un Messaggio Diretto
            </h3>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              Compila il modulo sottostante: riceverai una risposta dettagliata entro 24 ore lavorative.
            </p>
          </div>

          {submitted ? (
            <div className="p-8 rounded-2xl bg-amber-500/10 border border-amber-500/40 text-center space-y-4 animate-fadeIn">
              <div className="w-14 h-14 mx-auto rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-white">Richiesta Inviata con Successo</h4>
              <p className="text-xs sm:text-sm text-gray-300 max-w-md mx-auto leading-relaxed">
                Grazie per averci contattato. Il team di Maximize Academy ha preso in carico la tua richiesta e ti risponderà al più presto.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 px-6 py-2.5 rounded-full btn-glass text-xs text-amber-300"
              >
                Invia un'altra richiesta
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-300">
                    Il tuo Nome e Cognome *
                  </label>
                  <div className="relative">
                    <input 
                      type="text" 
                      required
                      placeholder="es. Marco Rossi"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-amber-400 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-300">
                    Telefono / WhatsApp *
                  </label>
                  <div className="relative">
                    <input 
                      type="tel" 
                      required
                      placeholder="es. 340 1234567"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-amber-400 focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-300">
                    Email
                  </label>
                  <input 
                    type="email" 
                    placeholder="tuaemail@esempio.it"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-amber-400 focus:outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-300">
                    Area d'interesse
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-amber-400 focus:outline-none transition-colors"
                  >
                    <option value="Barber Reset & Crescita">Barber Reset & Crescita Barberia</option>
                    <option value="Formazione Internazionale">Corsi di Formazione Internazionale</option>
                    <option value="Sabey Scissors">Forbici Professionali Sabey Scissors</option>
                    <option value="ANAQA Prodotti">ANAQA Men Creation Prodotti</option>
                    <option value="Treatwell Digitalizzazione">Treatwell Digitalizzazione</option>
                    <option value="Barber Match 2026">Barber Match Paestum 2026</option>
                    <option value="Altro">Altra richiesta / Collaborazione</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-300">
                  Messaggio / Parlaci della tua barberia
                </label>
                <textarea 
                  rows="3"
                  placeholder="Raccontaci la tua attività e gli obiettivi che desideri raggiungere..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-amber-400 focus:outline-none transition-colors"
                ></textarea>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-300">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl btn-gold text-xs uppercase font-extrabold tracking-widest flex items-center justify-center gap-2 shadow-gold-glow"
              >
                <Send className="w-4 h-4" />
                <span>{loading ? 'Invio in corso...' : 'Invia Richiesta al Team Maximize'}</span>
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-gray-400 text-center">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Puoi scriverci quando vuoi. Ti risponderemo appena possibile.</span>
              </div>

            </form>
          )}

        </div>

      </div>
    </section>
  );
}
