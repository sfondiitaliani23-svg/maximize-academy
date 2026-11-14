import React, { useEffect, useRef, useState } from 'react';
import { GOOGLE_CLIENT_ID, conGoogleToken, googleUrl, googleRedirect } from '../lib/account';

// Pulsante «Continua con Google» (03/11/2026), come su Maurizio Barber Shop:
// si apre sul dominio di Maximize (Google Identity Services), così Google non mostra l'indirizzo di Supabase.
// Se Google non apre il pulsante, il link va su Google con ritorno su /area del sito (mai sull'indirizzo di Supabase).
const SRC = 'https://accounts.google.com/gsi/client';
const hex = (bytes) => [...new Uint8Array(bytes)].map((b) => b.toString(16).padStart(2, '0')).join('');
function carica() {
  if (window.google?.accounts?.id) return Promise.resolve();
  return new Promise((ok, ko) => {
    const s = document.querySelector(`script[src="${SRC}"]`) || Object.assign(document.createElement('script'), { src: SRC, async: true });
    s.addEventListener('load', () => ok(), { once: true });
    s.addEventListener('error', () => ko(new Error('gsi')), { once: true });
    if (!s.parentNode) document.head.append(s);
  });
}

const GoogleIc = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="#4285F4" d="M22.6 12.3c0-.8-.1-1.5-.2-2.3H12v4.3h5.9a5 5 0 0 1-2.2 3.3v2.7h3.6c2.1-1.9 3.3-4.8 3.3-8z" /><path fill="#34A853" d="M12 23c3 0 5.5-1 7.3-2.7l-3.6-2.7c-1 .7-2.2 1-3.7 1-2.9 0-5.3-1.9-6.2-4.5H2.1v2.8A11 11 0 0 0 12 23z" /><path fill="#FBBC05" d="M5.8 14.1a6.6 6.6 0 0 1 0-4.2V7.1H2.1a11 11 0 0 0 0 9.8z" /><path fill="#EA4335" d="M12 5.4c1.6 0 3 .6 4.2 1.6l3.1-3.1A11 11 0 0 0 2.1 7.1l3.7 2.8C6.7 7.3 9.1 5.4 12 5.4z" /></svg>
);

export default function GoogleButton({ onEntrato, onErrore }) {
  const box = useRef(null);
  const [pronto, setPronto] = useState(false);

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID || !box.current) return undefined;
    let vivo = true;
    (async () => {
      const raw = hex(crypto.getRandomValues(new Uint8Array(16)));
      const hashed = hex(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(raw)));
      await carica();
      if (!vivo || !window.google?.accounts?.id) return;
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID, nonce: hashed, auto_select: false, itp_support: true, use_fedcm_for_prompt: true,
        callback: async (r) => {
          if (!r?.credential) return;
          try { await conGoogleToken(r.credential, raw); onEntrato(); } catch (e) { onErrore(e.message); }
        },
      });
      const w = Math.min(400, Math.max(200, Math.round(box.current.getBoundingClientRect().width)));
      window.google.accounts.id.renderButton(box.current, { type: 'standard', theme: 'filled_black', size: 'large', text: 'continue_with', shape: 'rectangular', width: w, locale: 'it' });
      // Se Google rifiuta il dominio il pulsante resta vuoto: si torna al link normale
      setTimeout(() => { if (!vivo) return; const f = box.current?.querySelector('iframe'); setPronto(Boolean(f && f.offsetWidth >= 20)); }, 1500);
    })().catch(() => setPronto(false));
    return () => { vivo = false; };
  }, [onEntrato, onErrore]);

  return (
    <>
      {GOOGLE_CLIENT_ID && <div ref={box} className="ap-gsi" style={pronto ? undefined : { position: 'absolute', opacity: 0, pointerEvents: 'none' }} />}
      {!pronto && <a className="ap-google" href={GOOGLE_CLIENT_ID ? '#google' : googleUrl()} onClick={(e) => { if (!GOOGLE_CLIENT_ID) return; e.preventDefault(); googleRedirect(); }}><GoogleIc /> Continua con Google</a>}
    </>
  );
}
