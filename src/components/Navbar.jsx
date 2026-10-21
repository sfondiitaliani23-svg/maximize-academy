import React, { useState, useEffect } from 'react';
import { Menu, X, PhoneCall, Sparkles, Compass } from 'lucide-react';

export default function Navbar({ onOpenMobileMenu, onOpenContactModal }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled 
        ? 'py-3.5 glass-nav border-b border-amber-500/20' 
        : 'py-6 bg-gradient-to-b from-black/80 via-black/40 to-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Brand Logo Luxury */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 p-[1px] shadow-gold-glow group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-[#09090c] rounded-[11px] flex items-center justify-center">
                <span className="font-display font-black text-xl gold-text-gradient tracking-tighter">M</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-sm sm:text-base tracking-[0.22em] text-white group-hover:text-amber-300 transition-colors">
                MAXIMIZE<span className="text-amber-400 ml-1 font-light">ACADEMY</span>
              </span>
              <span className="text-[9px] uppercase tracking-[0.3em] text-amber-400/80 font-medium">
                Maurizio Pizzuto
              </span>
            </div>
          </a>

          {/* Desktop Nav Links Glass Pill */}
          <nav className="hidden lg:flex items-center gap-1.5 px-5 py-2 rounded-full glass-panel border border-white/10 shadow-glass">
            <a href="#ecosistema" className="px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-gray-300 hover:text-amber-300 transition-colors">
              Ecosistema
            </a>
            <span className="text-white/20 text-xs">•</span>
            <a href="#formazione" className="px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-gray-300 hover:text-amber-300 transition-colors">
              Formazione
            </a>
            <span className="text-white/20 text-xs">•</span>
            <a href="#barber-reset" className="px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-amber-400 hover:text-amber-200 transition-colors flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
              Barber Reset
            </a>
            <span className="text-white/20 text-xs">•</span>
            <a href="#sabey" className="px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-gray-300 hover:text-amber-300 transition-colors">
              Sabey
            </a>
            <span className="text-white/20 text-xs">•</span>
            <a href="#anaqa" className="px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-gray-300 hover:text-amber-300 transition-colors">
              ANAQA
            </a>
            <span className="text-white/20 text-xs">•</span>
            <a href="#treatwell" className="px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-gray-300 hover:text-amber-300 transition-colors">
              Treatwell
            </a>
            <span className="text-white/20 text-xs">•</span>
            <a href="#barber-match" className="px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-gray-300 hover:text-amber-300 transition-colors">
              Eventi
            </a>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            <a 
              href="#contatti"
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full btn-gold text-xs uppercase tracking-wider shadow-gold-glow"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Parla con noi</span>
            </a>

            {/* Mobile / Tablet Menu Toggle */}
            <button
              onClick={onOpenMobileMenu}
              className="p-2.5 rounded-xl glass-panel border border-amber-500/30 text-amber-400 hover:text-amber-200 hover:border-amber-400 transition-all lg:hidden"
              aria-label="Apri menu di navigazione"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
