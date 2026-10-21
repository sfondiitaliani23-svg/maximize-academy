# 🎯 METODO MoSCoW — ROADMAP STRATEGICA MAXIMIZE ACADEMY

> **Framework di Prioritarizzazione Agile** per lo sviluppo, la gestione del cliente e il rilascio continuo dell'ecosistema *Maximize Academy* (Maurizio Pizzuto · Eliseo Miraglia).

---

## 🧭 Obiettivo del Metodo
Evitare il *feature creep* (richieste continue non prioritarie), garantire che la versione online sia sempre focalizzata sul fatturato reale e sulla lead generation, e definire una sequenza chiara di evoluzione tra sviluppatore (Eliseo) e titolare del brand (Maurizio).

```
   ┌────────────────────────────────────────────────────────┐
   │                  MATRICE MoSCoW                       │
   ├────────────────────────────┬───────────────────────────┤
   │  M - MUST HAVE (100% FATTO)│  S - SHOULD HAVE (NEXT)   │
   │  Indispensabili per il Go  │  Crescita, SEO, Notifiche │
   ├────────────────────────────┼───────────────────────────┤
   │  C - COULD HAVE (V2.5)     │  W - WON'T HAVE (FUTURO)  │
   │  Video, Lead Magnet, Ads   │  E-comm carrello, Login   │
   └────────────────────────────┴───────────────────────────┘
```

---

## 🔴 1. MUST HAVE (Da avere assolutamente — RILASCIATO ✅)
*Funzionalità critiche senza le quali la piattaforma non poteva andare online o non avrebbe convertito.*

- [x] **Storytelling & Autorevolezza**: Posizionamento di Maurizio Pizzuto come *Barber Strategist & Brand Ambassador*, formato luxury (nero `#070709`, oro `#D4AF37`, tipografia Cinzel / Cormorant / Plus Jakarta Sans).
- [x] **Percorso di Crescita a 6 Step**: *Impara → Migliora → Attrezzati → Organizzati → Confrontati → Cresci* perfettamente fruibile da mobile senza troncamenti di testo.
- [x] **Formazione Internazionale**: Presentazione degli Educator di punta (Gianni Cardinale, Yass The Barber) e sinergia unificata *Men’s Events Education & Sabey Scissors*.
- [x] **Barber Reset & Calcolatore ROI**: Modulo di consulenza direzionale con calcolatore interattivo sul rendimento poltrona e CTA personalizzata.
- [x] **Sabey Scissors Italy**: Configurator interattivo per la scelta della forbice ideale e badge circolare ufficiale *Brand Ambassador Strategist*.
- [x] **Canali Lead WhatsApp**: Pulsanti differenziati con testi preimpostati sul numero ufficiale `+39 391 716 3833`.
- [x] **Legal & Privacy GDPR**: Pagina statica dedicata `/privacy.html` (e rewrite `/privacy`) con titolare, P.IVA, tabelle trattamenti, cookie banner e pagina `404.html` brandizzata.
- [x] **Infrastruttura & Auto-Deploy**: Progetto Vite React con compilazione a zero errori e daemon permanente di auto-commit e push verso GitHub e Vercel.

---

## 🟡 2. SHOULD HAVE (Dovrebbe avere — PROSSIMO RILASCIO / PRIORITÀ ALTA)
*Funzionalità ad alto impatto commerciale che completano la macchina di marketing.*

- [ ] **Dominio Personalizzato**: Collegamento del dominio di secondo livello (es. `maximizeacademy.it` o `mauriziopizzuto.it`) nei DNS di Vercel.
- [ ] **Google Search Console**: Verifica della proprietà su [search.google.com](https://search.google.com/search-console) e invio di `sitemap.xml`.
- [ ] **Notifiche Email Automatiche (Resend)**: Attivazione della variabile d'ambiente `RESEND_API_KEY` su Vercel per ricevere l'email formattata per ogni lead compilato sul sito.
- [ ] **Social Proof Reale (3-4 Testimonianze)**: Inserimento di citazioni, foto prima/dopo o recensioni di titolari di barberia che hanno applicato il metodo *Barber Reset*.
- [ ] **Date e Calendario Prossimi Corsi**: Aggiornamento delle date della stagione in corso nella sezione Formazione.

---

## 🟢 3. COULD HAVE (Potrebbe avere — VERSIONE 2.5)
*Migliorie e arricchimenti di valore che non bloccano le vendite attuali.*

- [ ] **Lead Magnet Scaricabile (PDF)**: Mini-guida strategica (es. *"I 5 errori che bruciano il margine della tua barberia"*) scaricabile lasciando nome e WhatsApp.
- [ ] **Video Preview Masterclass**: Brevi clip o reel verticali integrati nelle schede dei docenti e nel box Barber Match Paestum.
- [ ] **Tracciamento Avanzato (Meta Pixel / TikTok Pixel)**: Attivazione degli ID di tracciamento solo nel momento in cui si deciderà di investire in sponsorizzate a pagamento.
- [ ] **WhatsApp Chat Floating con selezione operatore**: Selettore rapido a tendina direttamente dal widget in basso a destra.

---

## ⚪ 4. WON'T HAVE (Non si avrà per ora — FUTURO / V3)
*Funzionalità escluse deliberatamente per mantenere il focus commerciale ed evitare spreco di budget o complessità ingestibili.*

- [x] **E-commerce carrello self-service (Checkout Stripe)**: Escluso per scelta strategica. Strumenti professionali Sabey da centinaia di euro e prodotti ANAQA si vendono molto meglio con consulenza diretta su WhatsApp che con un anonimo carrello online.
- [x] **Area Riservata Studenti con Login/Password**: Esclusa per la fase attuale; i corsi si svolgono dal vivo o con materiali dedicati.
- [x] **Sistema di Booking e Pagamento Automatico in App**: La consulenza Barber Reset richiede una valutazione preliminare (candidatura), non un appuntamento automatico senza filtro.

---

## 📊 Regola di Gestione delle Nuove Richieste
Ogni volta che emerge una nuova proposta:
1. Si valuta in quale quadrante MoSCoW collocarla.
2. I **Must Have** rimangono congelati (già tutti online).
3. Si lavora esclusivamente sui **Should Have** prima di considerare qualsiasi elemento dei **Could Have**.
