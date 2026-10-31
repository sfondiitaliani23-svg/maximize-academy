---
name: ricorda-check-prima-del-push
enabled: true
event: bash
action: warn
pattern: git\s+push\b
---

⚠️ **Prima e dopo il push**

- Prima: `npm run build` (deve finire con `built in`) e prova locale con `vite preview` (home, pagina toccata, telefono 390x844 e computer 1366x768, nessun errore).
- Commit in italiano con le righe di attribuzione.
- Dopo: `Vercel:success` sullo SHA, poi controllo dal vivo (`/`, pagina toccata, `/gestione`, `/api/health`).
