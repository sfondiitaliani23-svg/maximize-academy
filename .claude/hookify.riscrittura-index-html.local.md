---
name: riscrittura-index-html
enabled: true
event: file
action: warn
conditions:
  - field: file_path
    operator: regex_match
    pattern: (vercel\.json|_redirects)$
  - field: content
    operator: contains
    pattern: /index.html
---

⚠️ **Riscrittura verso `/index.html`.**

Con `cleanUrls` non funziona, e su Cloudflare `/* /index.html 200` crea un ciclo. Usa la destinazione `/`.
