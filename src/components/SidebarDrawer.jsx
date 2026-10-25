import React from 'react';
import { X, ChevronRight, Phone, MessageSquare, Compass, Award, Scissors, ShoppingBag, Calendar, Users, ExternalLink } from 'lucide-react';

export default function SidebarDrawer({ isOpen, onClose }) {
  if (!isOpen) return null;

  const navItems = [
    { label: 'Ecosistema Maximize', href: '/ecosistema', icon: Compass, sub: 'I 6 pilastri di crescita' },
    { label: 'Formazione Internazionale', href: '/formazione', icon: Award, sub: 'Cardinale, Yass, Men’s Events' },
    { label: 'Barber Reset', href: '/barber-reset', icon: Scissors, sub: 'Intervento Strategico in Barberia', highlight: true },
    { label: 'Sabey Scissors', href: '/sabey', icon: Scissors, sub: 'Forbici Professionali Hand Made' },
    { label: 'ANAQA Prodotti', href: '/anaqa', icon: ShoppingBag, sub: 'Prodotti & Linee Barberia' },
    { label: 'Treatwell Agenda', href: '/treatwell', icon: Calendar, sub: 'Digitalizzazione e Prenotazioni' },
    { label: 'Barber Match & Eventi', href: '/eventi', icon: Users, sub: 'Paestum 2026 & Networking' },
    { label: 'Contatti & Consulenza', href: '/contatti', icon: Phone, sub: 'Maurizio Pizzuto & Operatore' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
      {/* Backdrop Glass Scuro */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-sm glass-panel-gold border-l border-amber-500/30 p-6 flex flex-col justify-between shadow-2xl relative">
          
          {/* Header */}
          <div>
            <div className="flex items-center justify-between pb-6 border-b border-amber-500/20">
              <div className="flex items-center gap-3">
                <img src="/assets/img/logo-maximize.webp" alt="" width="181" height="224" className="h-10 w-auto" aria-hidden="true" />
                <div>
                  <h3 className="font-display font-bold text-white text-sm tracking-widest">MAXIMIZE</h3>
                  <p className="text-[10px] uppercase text-amber-400/80 tracking-wider">Maurizio Pizzuto</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                aria-label="Chiudi menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Menu Links */}
            <div className="mt-6 space-y-1.5 overflow-y-auto max-h-[calc(100vh-280px)] pr-1">
              {navItems.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <a
                    key={idx}
                    href={item.href}
                    onClick={onClose}
                    className={`flex items-center justify-between p-3 rounded-xl transition-all duration-300 ${
                      item.highlight 
                        ? 'bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20' 
                        : 'hover:bg-white/5 border border-transparent hover:border-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${item.highlight ? 'bg-amber-500/20 text-amber-300' : 'bg-black/40 text-gray-400'}`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div>
                        <div className={`text-sm font-semibold ${item.highlight ? 'text-amber-300' : 'text-gray-200'}`}>
                          {item.label}
                        </div>
                        <div className="text-[11px] text-gray-400">
                          {item.sub}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Bottom Fast Contact Bar */}
          <div className="pt-4 border-t border-amber-500/20 space-y-2">
            <a
              href="https://wa.me/393917163833?text=Salve%20Maurizio,%20vorrei%20informazioni%20su%20Barber%20Reset%20e%20consulenza"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl btn-gold text-xs font-bold uppercase tracking-wider"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Parla con Maurizio</span>
            </a>
            <a
              href="https://wa.me/393917163833?text=Salve,%20vorrei%20informazioni%20sui%20corsi%20di%20formazione%20e%20forbici%20Sabey"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl btn-glass text-xs font-semibold tracking-wider text-amber-300 border-amber-500/30"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Operatore Formazione & Sabey</span>
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}
