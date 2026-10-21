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
                <a href="https://wa.me/393245878724" target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-white hover:text-amber-300 transition-colors">
                  Maurizio Pizzuto: 324 587 8724
                </a>
              </div>
              <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                <div className="text-[10px] uppercase text-amber-400 font-bold">Corsi & Forbici Sabey</div>
                <a href="https://wa.me/393783101416" target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-white hover:text-amber-300 transition-colors">
                  Operatore Maximize: 378 310 1416
                </a>
              </div>
              {/* Social Links */}
              <div className="flex items-center gap-3 pt-1">
                <a
                  href="https://www.instagram.com/mauriziobarbershop_fg/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-br from-purple-600/20 to-pink-500/20 border border-pink-500/20 text-[11px] text-gray-300 hover:text-white hover:border-pink-500/50 transition-all"
                  aria-label="Instagram Maurizio Barber Shop Foggia"
                >
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                  Instagram
                </a>
                <a
                  href="https://www.tiktok.com/@mauriziopizzuto_barber"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[11px] text-gray-300 hover:text-white hover:border-white/30 transition-all"
                  aria-label="TikTok Maurizio Pizzuto"
                >
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.74a4.85 4.85 0 0 1-1.01-.05z"/></svg>
                  TikTok
                </a>
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
