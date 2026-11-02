import React, { useEffect, useState } from 'react';
import { X, ChevronRight, Phone, MessageSquare, Compass, Award, Scissors, ShoppingBag, Calendar, Users, Download, RefreshCw, Share, PlusSquare, Check, MoreVertical } from 'lucide-react';
import { subscribe, canPrompt, promptInstall, isStandalone, isIOS, checkForUpdate, currentVersion } from '../pwa';

const navItems = [
  { label: 'Ecosistema Maximize', href: '/ecosistema', icon: Compass, sub: 'I 6 pilastri di crescita' },
  { label: 'Formazione', href: '/formazione', icon: Award, sub: 'Cardinale, UAAMI, Sabey' },
  { label: 'Barber Reset', href: '/barber-reset', icon: Scissors, sub: 'Intervento Strategico in Barberia', highlight: true },
  { label: 'Sabey Scissors', href: '/sabey', icon: Scissors, sub: 'Forbici Professionali Hand Made' },
  { label: 'ANAQA Prodotti', href: '/anaqa', icon: ShoppingBag, sub: 'Prodotti & Linee Barberia' },
  { label: 'Treatwell Agenda', href: '/treatwell', icon: Calendar, sub: 'Digitalizzazione e Prenotazioni' },
  { label: 'Barber Match & Eventi', href: '/eventi', icon: Users, sub: 'Paestum 2026 & Networking' },
  { label: 'Contatti & Consulenza', href: '/contatti', icon: Phone, sub: 'Maurizio Pizzuto & Operatore' },
];

/** Voce "Installa l'app" / "Aggiorna l'app" in fondo all'elenco. */
function AppItem() {
  const [, force] = useState(0);
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  const [help, setHelp] = useState(false);
  useEffect(() => subscribe(() => force((n) => n + 1)), []);

  const installed = isStandalone();
  const ios = isIOS();

  const onClick = async () => {
    setMsg('');
    if (installed) {
      setBusy(true);
      const r = await checkForUpdate();
      setBusy(false);
      if (r === 'updating') setMsg('Aggiornamento in corso…');
      else if (r === 'latest') setMsg('Hai già l’ultima versione.');
      else setMsg('Nessuna connessione. Riprova tra poco.');
      return;
    }
    if (canPrompt()) {
      const r = await promptInstall();
      if (r === 'accepted') setMsg('Fatto! Trovi Maximize nella schermata Home.');
      else if (r === 'dismissed') setMsg('Installazione annullata. Puoi riprovare quando vuoi.');
      else setHelp(true);
      return;
    }
    setHelp((h) => !h);
  };

  const Icon = installed ? RefreshCw : Download;
  const title = installed ? 'Aggiorna l’app' : 'Installa l’app';
  const sub = installed
    ? `Scarica l’ultima versione${currentVersion() ? ` · v. ${currentVersion()}` : ''}`
    : 'Maximize sulla schermata Home, come un’app';

  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={onClick}
        aria-expanded={!installed && !canPrompt() ? help : undefined}
        className="drawer-app group w-full flex items-center gap-3 px-3 py-3 text-left"
      >
        <span className="drawer-ico drawer-ico--gold">
          <Icon className={`w-[18px] h-[18px] ${busy ? 'animate-spin' : ''}`} aria-hidden="true" />
        </span>
        <span className="flex-1 min-w-0">
          <span className="block font-display uppercase tracking-[0.12em] text-[15px] text-[var(--gold)]">{title}</span>
          <span className="block text-[12px] text-[#bdbdbd] mt-0.5">{sub}</span>
        </span>
        <ChevronRight className={`w-4 h-4 text-[var(--gold)] transition-transform ${help ? 'rotate-90' : ''}`} aria-hidden="true" />
      </button>

      {help && !installed && (
        <ol ref={(el) => el && el.scrollIntoView({ block: 'nearest', behavior: 'smooth' })} className="drawer-help mt-2 px-4 py-3 space-y-2 text-[13px] text-[#f4f4f4]">
          {ios ? (
            <>
              <li className="flex items-center gap-2"><span className="drawer-step">1</span>Tocca <Share className="w-4 h-4 text-[var(--gold)]" aria-label="Condividi" /> in basso in Safari</li>
              <li className="flex items-center gap-2"><span className="drawer-step">2</span>Scegli <PlusSquare className="w-4 h-4 text-[var(--gold)]" aria-hidden="true" /> «Aggiungi alla schermata Home»</li>
              <li className="flex items-center gap-2"><span className="drawer-step">3</span>Tocca «Aggiungi»</li>
            </>
          ) : (
            <>
              <li className="flex items-center gap-2"><span className="drawer-step">1</span>Apri il menu <MoreVertical className="w-4 h-4 text-[var(--gold)]" aria-label="del browser" /> in alto</li>
              <li className="flex items-center gap-2"><span className="drawer-step">2</span>Tocca «Installa app» o «Aggiungi a schermata Home»</li>
              <li className="flex items-center gap-2"><span className="drawer-step">3</span>Se c’è già, Maximize è installata: aprila dall’icona</li>
            </>
          )}
        </ol>
      )}

      <p className="min-h-[1.25rem] px-3 mt-1.5 text-[12px] text-[#bdbdbd] flex items-center gap-1.5" role="status" aria-live="polite">
        {msg && msg.startsWith('Fatto') && <Check className="w-3.5 h-3.5 text-[var(--gold)]" aria-hidden="true" />}
        {msg}
      </p>
    </div>
  );
}

export default function SidebarDrawer({ isOpen, onClose, currentPath = '/' }) {
  useEffect(() => {
    if (!isOpen) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden'; // la pagina dietro non scorre
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] overflow-hidden lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="drawer-panel w-screen max-w-sm bg-[#111111] border-l border-[color-mix(in_srgb,var(--gold),transparent_55%)] flex flex-col shadow-2xl">

          {/* Intestazione */}
          <div className="flex items-center justify-between px-6 pb-5 border-b border-[#3d3d3d]">
            <a href="/" onClick={onClose} className="flex items-center gap-3" aria-label="Maximize Academy, torna all'inizio">
              <img src="/assets/img/logo-maximize.webp" alt="" width="181" height="224" className="h-10 w-auto" aria-hidden="true" />
              <span>
                <span className="block font-display font-bold text-white text-sm tracking-[0.25em]">MAXIMIZE</span>
                <span className="block text-[10px] uppercase text-[var(--gold)] tracking-[0.2em] mt-0.5">Maurizio Pizzuto</span>
              </span>
            </a>
            <button onClick={onClose} className="drawer-close" aria-label="Chiudi menu">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Voci */}
          <nav className="drawer-scroll flex-1 overflow-y-auto px-3 pt-3 pb-2" aria-label="Menu">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = currentPath === item.href;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  aria-current={active ? 'page' : undefined}
                  className={`drawer-link flex items-center gap-3 px-3 py-2.5 ${active ? 'is-active' : ''}`}
                >
                  <span className={`drawer-ico ${item.highlight || active ? 'drawer-ico--gold' : ''}`}>
                    <Icon className="w-[18px] h-[18px]" aria-hidden="true" />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className={`flex items-center gap-2 text-[15px] font-semibold ${active ? 'text-[var(--gold)]' : 'text-[#f4f4f4]'}`}>
                      <span className="truncate">{item.label}</span>
                      {item.highlight && <span className="drawer-tag">In evidenza</span>}
                    </span>
                    <span className="block text-[12px] text-[#bdbdbd] mt-0.5 truncate">{item.sub}</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-[#6b6b6b] shrink-0" aria-hidden="true" />
                </a>
              );
            })}

            <AppItem />
          </nav>

          {/* Contatti veloci */}
          <div className="px-6 pt-4 border-t border-[#3d3d3d] space-y-2.5">
            <a
              href="https://wa.me/393245878724?text=Salve%20Maurizio,%20vorrei%20informazioni%20su%20Barber%20Reset%20e%20consulenza"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 btn-gold text-xs font-bold uppercase tracking-wider"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Parla con Maurizio</span>
            </a>
            <a
              href="https://wa.me/393245878724?text=Salve,%20vorrei%20informazioni%20sui%20corsi%20di%20formazione%20e%20forbici%20Sabey"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 btn-glass text-xs font-semibold uppercase tracking-wider"
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
