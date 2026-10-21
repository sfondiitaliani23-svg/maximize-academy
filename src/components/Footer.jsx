import React, { useState } from 'react';
import { Mail, MapPin, Shield, FileText, X } from 'lucide-react';

export default function Footer() {
  const [showPrivacy, setShowPrivacy] = useState(false);

  return (
    <footer className="bg-[#050507] border-t border-amber-500/20 text-gray-400 text-xs relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-300 to-amber-700 p-[1px] shadow-gold-glow">
                <div className="w-full h-full bg-[#08080a] rounded-[10px] flex items-center justify-center">
                  <span className="font-display font-black text-lg gold-text-gradient">M</span>
                </div>
              </div>
              <div>
                <span className="font-display font-black text-white tracking-[0.2em] text-sm">
                  MAXIMIZE<span className="text-amber-400 ml-1 font-light">ACADEMY</span>
                </span>
                <p className="text-[10px] uppercase text-amber-400/80 tracking-widest">
                  Maurizio Pizzuto
                </p>
              </div>
            </div>

            <p className="text-xs text-gray-400 max-w-sm leading-relaxed">
              Dalla Barberia. Per le Barberie. Un ecosistema unico dedicato alla formazione d'eccellenza, al business strategico e agli strumenti per il Barber contemporaneo.
            </p>

            <div className="text-[11px] text-gray-400 space-y-1 pt-1">
              <p className="font-semibold text-gray-300">MAXIMIZE ACADEMY S.r.l.s.</p>
              <p className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-amber-400" /> Via Benedetto Croce 8 · 71121 Foggia</p>
              <p>P. IVA: <span className="font-mono text-gray-300">02147290767</span></p>
              <p className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-amber-400" /> <a href="mailto:mauriziomaximize@gmail.com" className="hover:text-amber-300 transition-colors">mauriziomaximize@gmail.com</a></p>
            </div>
          </div>

          {/* Nav Links Fast */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs uppercase font-bold tracking-[0.2em] text-white">
              Ecosistema
            </h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#formazione" className="hover:text-amber-300 transition-colors">Formazione Internazionale</a></li>
              <li><a href="#barber-reset" className="hover:text-amber-300 transition-colors">Barber Reset (Intervento Strategico)</a></li>
              <li><a href="#sabey" className="hover:text-amber-300 transition-colors">Sabey Scissors Italy</a></li>
              <li><a href="#anaqa" className="hover:text-amber-300 transition-colors">ANAQA Men Creation</a></li>
              <li><a href="#treatwell" className="hover:text-amber-300 transition-colors">Treatwell Digital Agenda</a></li>
              <li><a href="#barber-match" className="hover:text-amber-300 transition-colors">Barber Match Paestum 2026</a></li>
            </ul>
          </div>

          {/* Contacts Fast */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs uppercase font-bold tracking-[0.2em] text-white">
              Canali Ufficiali
            </h4>
            <div className="space-y-2.5">
              <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                <div className="text-[10px] uppercase text-amber-400 font-bold">Consulenza & Barber Reset</div>
                <div className="text-xs font-semibold text-white">Maurizio Pizzuto: 324 587 8724</div>
              </div>
              <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                <div className="text-[10px] uppercase text-amber-400 font-bold">Corsi & Forbici Sabey</div>
                <div className="text-xs font-semibold text-white">Operatore Maximize: 378 310 1416</div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Rights */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-400">
          <div>
            © 2026 Maximize Academy S.r.l.s. · Tutti i diritti riservati.
          </div>
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setShowPrivacy(true)}
              className="hover:text-amber-300 underline underline-offset-4 transition-colors"
            >
              Privacy & Cookie Policy
            </button>
            <span className="text-amber-400 font-serif italic text-xs">Maximize Your Potential</span>
          </div>
        </div>

      </div>

      {/* Modal Privacy Policy Glass */}
      {showPrivacy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-panel-gold max-w-xl w-full rounded-3xl p-6 sm:p-8 border border-amber-500/40 relative shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <Shield className="w-4 h-4" />
                <span>Informativa Privacy & Trattamento Dati</span>
              </div>
              <button 
                onClick={() => setShowPrivacy(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-4 text-xs text-gray-300 space-y-3 leading-relaxed">
              <p>
                <strong>Titolare del Trattamento:</strong> MAXIMIZE ACADEMY S.r.l.s., Via Benedetto Croce 8, 71121 Foggia, P.IVA 02147290767. Email: mauriziomaximize@gmail.com.
              </p>
              <p>
                I dati raccolti tramite moduli di contatto, calcolatore audit o canali WhatsApp sono trattati nel pieno rispetto del GDPR (Reg. UE 2016/679) al solo scopo di fornire le informazioni e i servizi commerciali/formativi richiesti dall'utente.
              </p>
              <p>
                Nessun dato viene ceduto a terzi non autorizzati. I dati inseriti nel simulatore di business restano riservati.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/10 text-right">
              <button 
                onClick={() => setShowPrivacy(false)}
                className="px-5 py-2 rounded-xl btn-gold text-xs font-bold uppercase tracking-wider"
              >
                Chiudi
              </button>
            </div>
          </div>
        </div>
      )}

    </footer>
  );
}
