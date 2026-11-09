import { memo, useEffect, useRef } from 'react';
import { AC_URL, AC_KEY } from '../lib/account';
import '../strumenti/strumenti.css';
import '../strumenti/eliseo-console.css';

const TEAM = JSON.stringify([
  { id: 'maurizio', nome: 'Maurizio' },
  { id: 'michela', nome: 'Michela' },
  { id: 'gino', nome: 'Gino' },
  { id: 'claudio', nome: 'Claudio' },
  { id: 'manuel', nome: 'Manuel' },
]);

function StrumentiRiservati({ quale, onApriEliseo }) {
  const host = useRef(null);
  const portal = useRef(null);
  const box = useRef(null);

  useEffect(() => {
    const root = portal.current;
    const slot = box.current;
    if (!root || !slot) return undefined;
    let cancelled = false;
    slot.replaceChildren();
    const load = quale === 'maverik'
      ? import('../strumenti/portal-maverik.js')
      : import('../strumenti/portal-eliseo.js');
    load.then((m) => {
      if (cancelled) return;
      m.mount(slot, root);
      if (quale !== 'eliseo') return;
      const want = sessionStorage.getItem('mx-eliseo-tab');
      if (!want) return;
      sessionStorage.removeItem('mx-eliseo-tab');
      slot.querySelector(`[data-tab="${want}"]`)?.click();
    }).catch(() => {
      if (!cancelled) slot.textContent = 'Non riesco a caricare questa sezione. Ricarica la pagina.';
    });
    const onNav = (e) => {
      const b = e.target.closest?.('[data-nav]');
      if (!b || !root.contains(b)) return;
      if (b.dataset.nav === 'eliseo') {
        sessionStorage.setItem('mx-eliseo-tab', 'campagne');
        onApriEliseo();
      } else if (b.dataset.nav === 'chat') {
        window.location.assign('https://maurizio-barbershop.it/area-riservata/#chat');
      }
    };
    root.addEventListener('click', onNav);
    return () => { cancelled = true; root.removeEventListener('click', onNav); };
  }, [quale, onApriEliseo]);

  return (
    <div className="mx-strumenti" ref={host} data-auth-page="admin" data-auth-url={AC_URL} data-auth-key={AC_KEY}>
      <div ref={portal} data-portal data-team={TEAM}>
        <button type="button" data-nav="eliseo" hidden>Eliseo</button>
        <button type="button" data-nav="chat" hidden>Chat del sito</button>
        <div ref={box} />
      </div>
    </div>
  );
}

export default memo(StrumentiRiservati);
