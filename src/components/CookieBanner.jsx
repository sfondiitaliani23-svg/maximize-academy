import React, { useState, useEffect } from 'react';
import { ShieldCheck, X } from 'lucide-react';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('maximize_cookie_consent');
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptAll = () => {
    localStorage.setItem('maximize_cookie_consent', 'accepted');
    setVisible(false);
  };

  const acceptEssential = () => {
    localStorage.setItem('maximize_cookie_consent', 'essential');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md z-40 animate-fade-in-up">
      <div className="p-4 sm:p-5 rounded-2xl bg-[#0b0b0f]/95 backdrop-blur-xl border border-amber-500/30 shadow-[0_15px_40px_rgba(0,0,0,0.8)] text-gray-300">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center flex-shrink-0 text-amber-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="flex-1 text-xs">
            <p className="font-semibold text-white tracking-wide">
              Esperienza & Riservatezza
            </p>
            <p className="text-gray-400 mt-1 leading-relaxed text-[11px]">
              Utilizziamo solo cookie tecnici e metriche aggregate anonime per ottimizzare la piattaforma Maximize Academy nel rispetto della privacy (GDPR).
            </p>
            <div className="mt-3 flex items-center gap-2">
              <button
                onClick={acceptAll}
                className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-400 to-amber-600 text-black font-bold text-[11px] hover:brightness-110 transition-all shadow-gold-glow"
              >
                Accetta
              </button>
              <button
                onClick={acceptEssential}
                className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-300 text-[11px] hover:bg-white/10 transition-all"
              >
                Solo Tecnici
              </button>
            </div>
          </div>
          <button
            onClick={acceptEssential}
            className="text-gray-500 hover:text-white p-1 rounded-md"
            aria-label="Chiudi"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
