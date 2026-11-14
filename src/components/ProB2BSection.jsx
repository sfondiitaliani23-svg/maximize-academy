import React, { useState } from 'react';
import { Anello } from './Attesa';
import { brandLinks, WA_KEPLERO, WA_MAURIZIO, waLink } from '../routes';
import {
  Scissors,
  Sparkles,
  TrendingUp,
  Award,
  ArrowRight,
  CheckCircle2,
  Phone,
  MessageSquare,
  ShieldCheck,
  Send,
  Building2,
  Layers,
  Cpu,
  UserCheck
} from 'lucide-react';

export default function ProB2BSection() {
  const [formData, setFormData] = useState({
    nome: '',
    telefono: '',
    salone: '',
    citta: '',
    interesse: 'Consulenza Strategica & Barber Reset',
    note: ''
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
        body: JSON.stringify({
          name: `${formData.nome} (${formData.salone || 'Salone'} - ${formData.citta || 'Italia'})`,
          phone: formData.telefono,
          type: `B2B: ${formData.interesse}`,
          message: formData.note || `Richiesta contatto da scansione Biglietto da Visita B2B Maximize Academy.`
        })
      });
      const data = await resp.json().catch(() => ({}));
      if (resp.ok && data.success) {
        setSubmitted(true);
      } else {
        // Fallback WhatsApp se API server offline
        const text = `Salve Maurizio, sono ${formData.nome} di ${formData.salone || 'Barberia'} (${formData.citta || ''}). Ho inquadrato il QR del tuo biglietto da visita e vorrei maggiori informazioni su: ${formData.interesse}.`;
        window.open(waLink(WA_MAURIZIO, text), '_blank');
        setSubmitted(true);
      }
    } catch {
      const text = `Salve Maurizio, sono ${formData.nome} di ${formData.salone || 'Barberia'} (${formData.citta || ''}). Ho inquadrato il QR del tuo biglietto da visita e vorrei maggiori informazioni su: ${formData.interesse}.`;
      window.open(waLink(WA_MAURIZIO, text), '_blank');
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 sm:py-20 relative overflow-hidden bg-[#111111] text-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        
        {/* HERO SECTION B2B */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center pt-4">
          
          {/* Colonna Foto Maurizio */}
          <div className="lg:col-span-5 flex justify-center order-2 lg:order-1">
            <div className="relative w-full max-w-md aspect-[4/5] rounded-3xl overflow-hidden glass-panel-gold border border-amber-500/40 p-2 shadow-2xl">
              <div className="relative w-full h-full rounded-2xl overflow-hidden bg-neutral-900">
                <img
                  src="/assets/img/maurizio_ritratto.webp"
                  alt="Maurizio Pizzuto · Master Barber & Formatore"
                  width="1000"
                  height="1250"
                  className="w-full h-full object-cover object-top filter contrast-105"
                  priority="true"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl glass-panel border border-amber-500/30 text-center">
                  <span className="text-[11px] uppercase tracking-[0.22em] text-amber-300 font-bold block">
                    Maurizio Pizzuto
                  </span>
                  <span className="text-xs text-white/80 font-medium">
                    Master Barber · Formatore · Business Advisor B2B
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Colonna Presentazione Istituzionale */}
          <div className="lg:col-span-7 space-y-6 order-1 lg:order-2">
            
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-amber-500/30">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-amber-300 font-bold">
                ACCESSO RISERVATO AI PROFESSIONISTI DEL SETTORE
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-bold text-white tracking-tight leading-tight">
              Dalla poltrona alla{' '}
              <span className="font-serif italic font-normal gold-text-gradient">
                gestione d’impresa.
              </span>
            </h1>

            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              Benvenuto. Se sei arrivato qui scansionando il mio biglietto da visita, condividiamo la stessa ambizione: far crescere il mestiere del barbiere trasformandolo in un’attività solida, remunerativa e autorevole.
            </p>

            <p className="text-gray-400 text-sm leading-relaxed">
              Attraverso <strong>Maximize Academy</strong> metto a disposizione dei titolari di salone e dei professionisti oltre vent’anni di esperienza reale: formazione manageriale, accordi commerciali esclusivi e strumenti digitali avanzati.
            </p>

            {/* Quick Actions Direct Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <a
                href={waLink(WA_MAURIZIO, 'Salve Maurizio, ho inquadrato il tuo biglietto da visita B2B e vorrei confrontarmi con te su una consulenza/formazione per la mia barberia')}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-xs uppercase font-bold tracking-wider shadow-gold-glow"
              >
                <Phone className="w-4 h-4" />
                <span>Parla con Maurizio</span>
              </a>

              <a
                href={waLink(WA_KEPLERO, 'Salve, ho inquadrato il biglietto da visita di Maurizio Pizzuto e vorrei informazioni commerciali sui prodotti e strumenti B2B')}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-panel hover:bg-white/10 border border-amber-500/30 text-amber-200 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-xs uppercase font-bold tracking-wider transition-colors"
              >
                <MessageSquare className="w-4 h-4 text-amber-400" />
                <span>Canale Commerciale Keplero</span>
              </a>
            </div>

          </div>

        </div>

        {/* I 4 PILASTRI PROFESSIONALI */}
        <div className="space-y-8 pt-8 border-t border-white/10">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-amber-400">
              L'ECOSISTEMA PER IL TUO SALONE
            </span>
            <h2 className="text-2xl sm:text-4xl font-display font-bold text-white">
              Cosa possiamo fare insieme
            </h2>
            <p className="text-sm text-gray-400">
              Quattro percorsi concreti per ottimizzare margini, competenze tecniche e visibilità.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* 1. Formazione & Barber Reset */}
            <div className="glass-panel-gold rounded-2xl p-6 border border-amber-500/30 flex flex-col justify-between hover:border-amber-400 transition-all">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white font-display">
                  Barber Reset & Formazione
                </h3>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Intervento strategico su listino, margini e scontrino medio. Percorsi formativi con UAAMI 2027 e Barber National Academy per far crescere il tuo staff.
                </p>
              </div>
              <div className="pt-6">
                <a href="/barber-reset" className="inline-flex items-center gap-2 text-xs font-bold text-amber-300 hover:text-amber-200">
                  <span>Scopri Barber Reset</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* 2. Forbici Sabey */}
            <div className="glass-panel-gold rounded-2xl p-6 border border-amber-500/30 flex flex-col justify-between hover:border-amber-400 transition-all">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Scissors className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white font-display">
                  Sabey Scissors
                </h3>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Maurizio Pizzuto è Brand Ambassador ufficiale. Forbici professionali giapponesi ad altissima precisione, testate e consigliate per ogni tipo di taglio.
                </p>
              </div>
              <div className="pt-6">
                <a href="/sabey" className="inline-flex items-center gap-2 text-xs font-bold text-amber-300 hover:text-amber-200">
                  <span>Catalogo Sabey</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* 3. Rituale Barba ANAQA */}
            <div className="glass-panel-gold rounded-2xl p-6 border border-amber-500/30 flex flex-col justify-between hover:border-amber-400 transition-all">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white font-display">
                  ANAQA Men Creation
                </h3>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Il rituale barba professionale in 5 step. Linea cosmetica ad altissima marginalità riservata esclusivamente alle barberie (nessun prezzo pubblico).
                </p>
              </div>
              <div className="pt-6">
                <a href="/anaqa" className="inline-flex items-center gap-2 text-xs font-bold text-amber-300 hover:text-amber-200">
                  <span>Rituale ANAQA</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* 4. Soluzioni Digitali & M×E */}
            <div className="glass-panel-gold rounded-2xl p-6 border border-amber-500/30 flex flex-col justify-between hover:border-amber-400 transition-all">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Cpu className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white font-display">
                  M×E Barber Lab & Digital
                </h3>
                <p className="text-xs text-gray-300 leading-relaxed">
                  L'unione tra esperienza barber e sviluppo tecnologico con Eliseo Miraglia: siti web proprietari, CRM Eliseo, agenda Treatwell e automazioni intelligenti.
                </p>
              </div>
              <div className="pt-6">
                <a href="/mxe" className="inline-flex items-center gap-2 text-xs font-bold text-amber-300 hover:text-amber-200">
                  <span>Scopri M×E Barber Lab</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

          </div>

        </div>

        {/* MODULO DIRETTO B2B */}
        <div className="rounded-3xl glass-panel-gold border border-amber-500/40 p-6 sm:p-12 relative shadow-2xl bg-gradient-to-br from-black/80 via-[#18140f] to-black">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-5 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-amber-400">
                <UserCheck className="w-4 h-4" />
                <span>CONTATTO RAPIDO PER TITOLARI</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-display font-bold text-white">
                Richiedi un confronto riservato
              </h2>

              <p className="text-sm text-gray-300 leading-relaxed">
                Compila questo modulo per essere ricontattato personalmente da Maurizio o dal team commerciale Keplero per listini riservati, campionature o percorsi formativi.
              </p>

              <div className="pt-4 space-y-3 text-xs text-gray-400">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Consulenza iniziale gratuita e riservata</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Accesso ai listini riservati Sabey & ANAQA</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Nessun vincolo né intermediario</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              {submitted ? (
                <div className="p-8 rounded-2xl glass-panel border border-emerald-500/40 text-center space-y-4">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                  <h3 className="text-xl font-bold text-white">Richiesta Ricevuta!</h3>
                  <p className="text-sm text-gray-300 max-w-md mx-auto">
                    Grazie per l'interesse. Maurizio o il referente Keplero ti ricontatteranno entro 24 ore lavorative.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">Il tuo Nome *</label>
                      <input
                        type="text"
                        required
                        value={formData.nome}
                        onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                        placeholder="Es. Mario Rossi"
                        className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">Telefono WhatsApp *</label>
                      <input
                        type="tel"
                        required
                        value={formData.telefono}
                        onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                        placeholder="+39 333 1234567"
                        className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">Nome Barberia / Salone</label>
                      <input
                        type="text"
                        value={formData.salone}
                        onChange={(e) => setFormData({ ...formData, salone: e.target.value })}
                        placeholder="Es. Barber Club"
                        className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">Città</label>
                      <input
                        type="text"
                        value={formData.citta}
                        onChange={(e) => setFormData({ ...formData, citta: e.target.value })}
                        placeholder="Es. Milano, Roma, Foggia..."
                        className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">Ambito di Interesse Primario</label>
                    <select
                      value={formData.interesse}
                      onChange={(e) => setFormData({ ...formData, interesse: e.target.value })}
                      className="w-full bg-black/80 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value="Consulenza Strategica & Barber Reset">Consulenza Strategica & Barber Reset</option>
                      <option value="Corsi di Formazione & UAAMI 2027">Corsi di Formazione & UAAMI 2027</option>
                      <option value="Forbici Professionali Sabey Scissors">Forbici Professionali Sabey Scissors</option>
                      <option value="Rituale Barba ANAQA Men Creation">Rituale Barba ANAQA Men Creation</option>
                      <option value="Soluzioni Digitali & M×E Barber Lab">Soluzioni Digitali & M×E Barber Lab</option>
                      <option value="Altro / Proposta Commerciale">Altro / Proposta Commerciale</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">Note o Esigenze Specifiche (opzionale)</label>
                    <textarea
                      rows={3}
                      value={formData.note}
                      onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                      placeholder="Descrivi brevemente la tua attività o cosa vorresti approfondire..."
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  {errorMsg && (
                    <p className="text-xs text-red-400">{errorMsg}</p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-gold py-3.5 rounded-xl text-xs uppercase font-bold tracking-wider shadow-gold-glow flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span className="inline-flex items-center gap-2">{loading ? <><Anello /> Invio in corso…</> : 'Invia Richiesta Riservata'}</span>
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
