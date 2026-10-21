# MAXIMIZE ACADEMY — CONSEGNA TECNICA A ELISEO

## Scopo
Questa cartella raccoglie **tutto ciò che è stato realmente recuperabile** del progetto esistente “Maximize Academy — Maurizio Pizzuto” dall'ambiente disponibile in ChatGPT.

L'obiettivo della consegna è consentire a Eliseo di proseguire lo sviluppo **senza confondere una ricostruzione con il sorgente originale**.

## Stato importante
Il progetto risulta presente come **Site** con:
- Project ID: `appgprj_6abfae3798788191a148aeef3313c4bc`
- Slug: `maximize-academy`
- URL Site rilevato: `https://maximize-academy.pizzuto325.chatgpt.site`
- Stato: `active`
- Access mode: `custom`
- Source version esposta dalla proiezione accessibile: `2`
- Projection revision: `4`
- Ultima modifica esposta: `2026-10-02T13:59:26.584122+00:00`

### Limite tecnico rilevato
L'ambiente disponibile espone il sito come **proiezione testuale indicizzata**, ma **non espone il repository sorgente originale** (HTML/CSS/JS, React/TypeScript, package.json, lockfile, config, componenti o commit Git).

È stato tentato anche il recupero dei byte originali del Site, ma il sistema ha restituito che la materializzazione non è disponibile per le Site projections.

Per questo motivo questa consegna **NON contiene sorgenti inventati o ricostruiti arbitrariamente**.

## Contenuto della consegna
- `recuperato/site_projection_extracted.txt` — contenuto testuale recuperato dalla proiezione del sito.
- `recuperato/site_metadata.json` — metadati tecnici del Site accessibili.
- `assets/screenshots_versione_2/` — screenshot mobile forniti e usati durante la revisione della Versione 2.
- `assets/riferimenti/Sabey_Brand_Ambassador_Strategist.png` — immagine originale fornita per la correzione del badge Sabey.
- `documentazione/STRUTTURA_CONTENUTI_FUNZIONALITA.md` — mappa del sito e delle funzioni rilevate.
- `documentazione/STATO_COMPLETAMENTO_E_MANCANTI.md` — ciò che risulta completato, ancora da sviluppare o non esportabile.
- `documentazione/MODIFICHE_PENDING.md` — ultime modifiche richieste e non ancora correttamente applicate.
- `documentazione/HANDOFF_TECNICO_ELISEO.md` — istruzioni pratiche per la presa in carico tecnica.

## Come procedere per una consegna 100% fedele del sorgente
Per ottenere il progetto originale completo serve esportare direttamente dal sistema/superficie che conserva il Site sorgente o dal repository associato, includendo almeno:
1. repository/cartella sorgente;
2. cronologia o commit desiderato;
3. `package.json` e lockfile, se presenti;
4. configurazioni build/deploy;
5. componenti e pagine;
6. asset originali;
7. variabili d'ambiente come **template** (`.env.example`), senza segreti reali;
8. istruzioni di avvio/build.

Se Eliseo riceve l'export nativo del Site o il repository, questa cartella può essere usata come riferimento di contenuto, UX mobile e stato funzionale.
