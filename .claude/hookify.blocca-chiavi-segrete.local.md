---
name: blocca-chiavi-segrete
enabled: true
event: file
action: block
conditions:
  - field: content
    operator: regex_match
    pattern: sb_secret_[A-Za-z0-9]|service_role['"]?\s*[:=]\s*['"]ey|SUPABASE_SERVICE_ROLE_KEY\s*=\s*\S{20,}
---

🚫 **Chiave segreta Supabase nel codice.**

Nel codice solo URL e chiave `sb_publishable_`. Le chiavi segrete vanno solo nelle variabili d'ambiente del server (Vercel o Cloudflare), mai in `src/`, `public/` o in un file salvato nel repository.
