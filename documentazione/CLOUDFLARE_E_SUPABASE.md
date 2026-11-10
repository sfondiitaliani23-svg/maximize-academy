# Maximize Academy: Supabase e passaggio a Cloudflare Pages
Ultima modifica: 2026-10-26

## Supabase (separato da Maurizio Barber Shop)
- Progetto `maximize-academy` (organizzazione «Maximize Academy», piano Free, Francoforte), sul secondo account Google di Eliseo.
- URL e chiave pubblica in `src/lib/sb.js` e `api/contact.js` (pubbliche per natura). Nessuna chiave segreta nel codice.
- Tabelle: `storie` + spazio file `storie` (`supabase/storie.sql`), `leads` (`supabase/richieste.sql`): il sito può solo aggiungere richieste, si leggono dal pannello.
- Iscrizioni libere spente. Gli utenti per `/gestione` si creano dal pannello (Authentication → Users → Add user) e ricevono il ruolo con:
  `update auth.users set raw_app_meta_data = raw_app_meta_data || '{"role":"admin"}' where email = 'EMAIL';`
- Il vecchio progetto (hozyimhh…, account principale) è in pausa: le richieste vecchie si scaricano fino al 26/11/2027.

## Cloudflare Pages (quando c'è il dominio)
Il codice è già pronto: `functions/api/*` (ponte `functions/_adapter.js` verso `api/*.js`), `public/_headers`, `public/_redirects`.
1. Cloudflare → Workers & Pages → Create → Pages → collega il repository `maximize-academy`.
2. Build command `npm run build`, output `dist`. Variabili: le stesse di Vercel per Resend (`RESEND_API_KEY`, `RESEND_FROM`, destinatari).
3. Prova su `*.pages.dev`: home, `/sabey/`, `/gestione`, `/api/health`, modulo contatti.
4. Custom domains → `maximizeacademy.it` e `www`; `.com` reindirizzato al `.it`.
5. Poi: aggiornare `SITE` in `src/routes.js`, sitemap, e il link in `site.config.js` di Maurizio Barber Shop. Vercel si spegne solo dopo.
Le statistiche di Vercel (Analytics) si caricano solo su `*.vercel.app`.


## Un solo progetto Supabase per Maximize (decisione del 10/11/2026)
- **Si tiene `pxzdsgcdwqnipxggveuu`** («maximize-academy», organizzazione «Maximize Academy» del secondo account Supabase di Eliseo). È quello attivo e usato dal sito: storie e `/gestione` (`src/lib/sb.js`), modulo contatti (`api/contact.js`), `server/index.js`. Controllato il 10/11/2026: risponde (auth 200, tabella `storie` 200).
- **Si elimina `hozyimhhrodazpssxmtt`** (account principale, organizzazione «Maximize Academy», in pausa). Nessun file del codice lo usa.
- Perché non si sposta tutto sull'account principale: il piano gratuito permette 2 progetti attivi per account, e lì ci sono già Barberia Garofalo e Maurizio Barber Shop. Un terzo resterebbe in pausa.
- Gli account dell'area privata (`/area`) restano sul progetto di Maurizio Barber Shop (`jxtkgxdxvouwlowvqohm`), come deciso il 02/11/2026.
