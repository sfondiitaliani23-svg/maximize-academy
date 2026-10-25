# 🌟 MAXIMIZE ACADEMY — Piattaforma Ufficiale

> **L'ecosistema definitivo per il Barber moderno.**
> Formazione Internazionale · Barber Reset · Sabey Scissors · ANAQA · Treatwell · Barber Match Paestum 2026.
> Fondato da **Maurizio Pizzuto** (Maximize Academy S.r.l.s., Foggia).

[![Deploy con Vercel](https://therealsujitk-vercel-badge.vercel.app/?app=maximize-academy)](https://maximize-academy.vercel.app)
[![Node Version](https://img.shields.io/badge/Node.js-18%2B-brightgreen.svg)](https://nodejs.org)
[![Vite](https://img.shields.io/badge/Vite-5.4-purple.svg)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC.svg)](https://tailwindcss.com)

---

## 🧭 Panoramica del Progetto

Maximize Academy è una Web Application luxury ad alte prestazioni sviluppata con **React 18**, **Vite** e **Tailwind CSS**, progettata per offrire un'esperienza visiva premium (palette scura con sfumature oro e glassmorphism) e un tasso di conversione elevato per la lead generation.

### Moduli Principali

1. **Ecosistema di Crescita**: Guida interattiva step-by-step (*Impara → Migliora → Attrezzati → Organizzati → Confrontati → Cresci*).
2. **Formazione Internazionale**: Presentazione degli Educator di rilievo (Gianni Cardinale, Yass The Barber) e sinergia unificata con **Men's Events Education** e **Sabey Scissors**.
3. **Barber Reset & Calcolatore ROI**: Calcolatore interattivo per la ristrutturazione del listino e l'ottimizzazione del rendimento alla poltrona, con CTA WhatsApp diretta.
4. **Sabey Scissors Italy**: Sezione forbici professionali giapponesi con configuratore interattivo su misura e badge ufficiale *Brand Ambassador Strategist*.
5. **ANAQA Men Creation**: Linea prodotti e kit professionali per barberie.
6. **Treatwell**: Integrazione dell'agenda digitale e gestione clienti.
7. **Barber Match Paestum 2026**: Scheda evento della competizione barber più prestigiosa del sud Italia.
8. **WhatsApp Concierge & Modali**: Canali diretti di contatto per candidature e acquisto strumenti.

---

## 🛠️ Stack Tecnologico

- **Frontend**: React 18, Vite 5, Tailwind CSS, Lucide Icons, Google Fonts (Cinzel, Cormorant Garamond, Plus Jakarta Sans).
- **Backend Serverless (Vercel)**:
  - `/api/contact`: gestione lead e invio automatico notifiche via Resend.
  - `/api/barber-reset/assess`: algoritmo serverless per il calcolo del ROI e rendimento poltrona.
  - `/api/sabey/recommend`: motore di raccomandazione modelli forbici.
  - `/api/health`: diagnostica e uptime.
- **Backend Standalone (Java)**: microserver HTTP opzionale in `backend-java/` per la persistenza locale e l'esportazione dei lead in formato CSV.
- **Monitoring**: `@vercel/analytics` e `@vercel/speed-insights` integrati per Web Vitals e statistiche reali a zero cookie.
- **Compliance GDPR**: Privacy & Cookie Policy dedicata in `/public/privacy.html`, banner consensi con salvataggio locale.

---

## 🚀 Avvio Rapido

### Prerequisiti
- Node.js (v18 o superiore raccomandato)
- npm oppure pnpm

### 1. Installazione Dipendenze
```bash
npm install
```

### 2. Configurazione Ambiente
Copia il file `.env.example` in `.env`:
```bash
cp .env.example .env
```
*(Imposta facoltativamente `RESEND_API_KEY` se desideri testare le notifiche email in locale)*

### 3. Sviluppo Locale
```bash
# Avvia il server di sviluppo Vite
npm run dev
```
La piattaforma sarà accessibile su `http://localhost:5173`.

### 4. Build di Produzione
```bash
npm run build
npm run preview
```

---

## ⚡ Auto-Deploy

`auto-deploy.js` guarda `src/`, `public/`, `api/` e i file di configurazione. Quando smetti di salvare:

1. aspetta **30 secondi** di silenzio;
2. esegue `npm run build` — **se la build fallisce, non pubblica nulla**;
3. blocca tutto se trova un file `.env` vero tra le modifiche;
4. fa commit e push su GitHub → Vercel pubblica.

Modifiche a `documentazione/` e `README.md` **non** fanno partire il deploy.

```bash
npm run auto-deploy          # avvio manuale
```

**Avvio automatico con Windows:** doppio click su `INSTALLA-AUTO-DEPLOY.bat` (una volta sola).
Per toglierlo: `INSTALLA-AUTO-DEPLOY.bat rimuovi`.

**Pausa:** crea un file vuoto `.auto-deploy-pausa` nella cartella del progetto. Finché c'è, niente va online.

Gira un solo watcher alla volta (file `.auto-deploy.lock`).

---
## 📄 Pagine e File Pubblici

- `/` — Homepage principale SPA
- `/privacy.html` — Informativa Privacy e Cookie Policy a norma GDPR
- `/404.html` — Pagina di errore 404 personalizzata luxury
- `/manifest.json` — PWA Web App Manifest per dispositivi mobili
- `/robots.txt` — Istruzioni per web crawler e protezione da bot AI
- `/sitemap.xml` — Mappa del sito XML per i motori di ricerca
- `/humans.txt` — Crediti del team di sviluppo

---

## 📞 Contatti Ufficiali

- **Sito Web**: [https://maximize-academy.vercel.app](https://maximize-academy.vercel.app)
- **WhatsApp Maurizio Pizzuto**: [+39 391 716 3833](https://wa.me/393917163833)
- **Email**: [mauriziomaximize@gmail.com](mailto:mauriziomaximize@gmail.com)
- **Sede**: Via Benedetto Croce 8, 71121 Foggia (FG)
- **P. IVA**: 02147290767
