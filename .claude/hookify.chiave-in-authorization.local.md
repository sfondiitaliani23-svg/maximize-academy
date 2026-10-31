---
name: chiave-in-authorization
enabled: true
event: file
action: warn
conditions:
  - field: content
    operator: regex_match
    pattern: Authorization['"]?\s*:\s*[`'"]Bearer\s*\$\{?\s*\w*(SUPABASE|SB_|ANON|anon|PUBLISHABLE|publishable)
---

⚠️ **Chiave `sb_` in `Authorization`?**

Con Maximize le chiavi `sb_` vanno solo nell'intestazione `apikey`. In `Authorization: Bearer` va il token della sessione dell'utente, non la chiave del progetto.
