import React, { useEffect, useRef, useState } from 'react';
import { SB_KEY, hasSession, login, logout, token, role } from '../lib/sb';

// Pagina /gestione: accesso di Maurizio (o Eliseo) e gestione delle storie di Maximize Academy.
// Non è nel menu né nella sitemap. Gli account si creano in Supabase (Authentication → Add user), mai dal sito.
export default function AdminStorie() {
  const [state, setState] = useState(hasSession() ? 'check' : 'login');
  const [msg, setMsg] = useState('');
  const box = useRef(null);

  useEffect(() => {
    const robots = document.createElement('meta');
    robots.name = 'robots'; robots.content = 'noindex, nofollow';
    document.head.append(robots);
    document.title = 'Gestione storie | Maximize Academy';
    return () => robots.remove();
  }, []);

  useEffect(() => {
    if (state !== 'check') return;
    token().then((t) => {
      if (!t) { setState('login'); return; }
      if (!['admin', 'cofounder'].includes(role(t))) { setMsg('Questo account non ha il permesso di gestire le storie.'); setState('login'); return; }
      setState('ok');
    });
  }, [state]);

  useEffect(() => {
    if (state !== 'ok' || !box.current) return;
    import('../lib/gestione-storie.js').then((m) => m.mount(box.current)).catch(() => setMsg('Non riesco a caricare la gestione. Riprova.'));
  }, [state]);

  const submit = async (e) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setMsg('Accesso in corso…');
    try { await login(String(f.get('email')).trim(), String(f.get('password'))); setMsg(''); setState('check'); }
    catch (err) { setMsg(err.message); }
  };

  return (
    <div className="mx-admin min-h-screen bg-[#111111] text-[#f4f4f4] px-[clamp(1rem,5vw,3rem)] py-8">
      <header className="flex items-center justify-between gap-4 max-w-5xl mx-auto mb-8">
        <a href="/" className="flex items-center gap-3"><img src="/assets/img/logo-maximize.webp" alt="" width="44" height="44" /><span className="uppercase tracking-[0.14em] text-amber-400 font-bold">Gestione storie</span></a>
        <span className="flex gap-3">
          <a href="/" className="btn btn--secondary">Vai al sito</a>
          {state === 'ok' && <button type="button" className="btn btn--secondary" onClick={() => logout().then(() => setState('login'))}>Esci</button>}
        </span>
      </header>
      <main className="max-w-5xl mx-auto">
        {!SB_KEY && <p className="pcard pcard__note">La gestione non è ancora attiva: manca la chiave pubblica del progetto Supabase di Maximize.</p>}
        {SB_KEY && state === 'login' && (
          <form className="pcard max-w-md" onSubmit={submit}>
            <h1 className="pcard__title">Accedi</h1>
            <div className="field"><label htmlFor="mx-email">Email</label><input id="mx-email" name="email" type="email" autoComplete="username" required /></div>
            <div className="field"><label htmlFor="mx-pw">Password</label><input id="mx-pw" name="password" type="password" autoComplete="current-password" required /></div>
            <div className="actions"><button className="btn btn--primary" type="submit">Accedi</button></div>
            {msg && <p className="pcard__note" role="status">{msg}</p>}
          </form>
        )}
        {state === 'check' && <p className="pcard__note">Controllo l’accesso…</p>}
        {state === 'ok' && <div ref={box} />}
        {state === 'ok' && msg && <p className="pcard__note">{msg}</p>}
      </main>
    </div>
  );
}
