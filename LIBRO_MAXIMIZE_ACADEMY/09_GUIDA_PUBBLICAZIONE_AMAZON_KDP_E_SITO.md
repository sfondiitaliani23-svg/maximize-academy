# GUIDA OPERATIVA: PUBBLICAZIONE SU AMAZON KDP & VENDITA DIRETTA SUL SITO MAXIMIZE

---

## 1. STRATEGIA DI PREZZO & POSIZIONAMENTO

Maurizio ed Eliseo hanno individuato il prezzo di **29 €**.  
Nel mondo editoriale, 29 € è il prezzo ideale per un **"Business Book & Technical Master Manual"**, perché:
1. Comunica immediatamente prestigio e valore (non è un romanzetto da 9 euro).
2. Seleziona un pubblico di professionisti pronti a investire su se stessi.
3. Genera un margine netto eccezionale per finanziare le campagne promozionali.

### La Formula Multi-Formato:

| Canale di Vendita | Formato | Prezzo al Pubblico | Margine Netto Stimato | Beneficio Strategico |
| :--- | :--- | :--- | :--- | :--- |
| **Sito Web Maximize Academy** | PDF Interattivo ad Alta Risoluzione + Bundle Modelli Stampabili (Checklist, Schede Diagnosi) | **29,00 €** | **~96%** (27,80 € netti dopo commissione Stripe 1.5% + 0.25€) | Margine massimo, incasso immediato sul conto bancario aziendale, acquisizione dell'email e del numero WhatsApp del barbiere per il funnel Academy. |
| **Amazon KDP (Cartaceo)** | Copertina Flessibile (Paperback) Premium a Colori o Bianco/Nero con inserto fotografico lucido | **29,00 €** | **~45-60%** (Circa 12-16 € netti per copia venduta dopo costi di stampa Amazon) | Riprova sociale straordinaria (recensioni verificate), indicizzazione su Google e Amazon, regalo perfetto da mostrare sul bancone della barberia. |
| **Amazon Kindle (eBook)** | Formato Kindle / KPF letto su tablet e smartphone | **14,99 € o 19,99 €** | **70%** (Circa 10,50 - 14,00 € netti) | Accesso immediato per chi legge solo in digitale; posizionamento nelle classifiche Bestseller Amazon categoria "Arte e Mestieri / Business". |

---

## 2. COME PUBBLICARE SU AMAZON KDP PASSO-PASSO

### Step 1: Registrazione e Accesso
1. Vai su [kdp.amazon.com](https://kdp.amazon.com) ed effettua l'accesso con l'account Amazon aziendale.
2. Compila i dati fiscali (intervista fiscale W-8BEN per evitare doppie imposizioni USA) e inserisci l'IBAN per l'accredito mensile delle royalties.

### Step 2: Formattazione del Manoscritto
Il file consolidato `LIBRO_MAXIMIZE_ACADEMY/MANOSCRITTO_COMPLETO_LIBRO_3M.md` contiene già la struttura completa con interruzioni di pagina.
- **Per l'eBook Kindle**: Puoi importare direttamente il testo in **Kindle Create** (software gratuito ufficiale di Amazon) per aggiungere capitoli cliccabili, stili dei titoli e immagini con un clic.
- **Per il Cartaceo**: Formato raccomandato **6 x 9 pollici (15,24 x 22,86 cm)** oppure **7 x 10 pollici (17,78 x 25,4 cm)**, il formato standard dei manuali professionali americani.

### Step 3: Metadati Ottimizzati per l'Algoritmo di Amazon (SEO Amazon)
- **Titolo del Libro**: `NON SOLO BARBER: Il Metodo 3M`
- **Sottotitolo**: `Dalla Tecnica Millimetrica all'Impresa Digitale: Sfumature, Rituali, Social Media e AI per il Barbiere del Futuro`
- **Serie**: `Maximize Academy Series (Volume 1)`
- **Autori**:  
  - *Autore Principale*: Maurizio Pizzuto  
  - *Co-Autore*: Eliseo Miraglia  
  - *Editore*: Maximize Academy × M×E Barber Lab
- **7 Parole Chiave Algoritmiche (Search Keywords KDP)**:
  1. `taglio capelli uomo e sfumatura`
  2. `corso barbiere professionale manuale`
  3. `fade haircut barba rasatura`
  4. `gestione salone barberia marketing`
  5. `forbici sabey e tosatrice fade`
  6. `intelligenza artificiale per parrucchieri`
  7. `come aprire un barber shop di successo`
- **Categorie Amazon Consigliate**:
  - *Non-Fiction > Crafts, Hobbies & Home > Beauty & Grooming*
  - *Business & Money > Small Business & Entrepreneurship*
  - *Computers & Technology > Artificial Intelligence & Marketing*

---

## 3. VENDITA DIRETTA SUL SITO MAXIMIZE ACADEMY

Per vendere il libro direttamente sul sito ufficiale a 29 € con margine del 96%:

### Architettura Tecnica:
1. **Pulsante Checkout Stripe / Vercel Serverless**:
   - Creare un prodotto "Libro Non Solo Barber - Il Metodo 3M" nella dashboard Stripe a 29,00 € (imposta IVA inclusa o assolta).
   - Generare un *Payment Link* Stripe brandizzato con logo Maximize Academy oro e nero.
2. **Consegna Automatica Post-Acquisto (Webhook o Supabase)**:
   - All'avvenuto pagamento (`checkout.session.completed`), una funzione serverless (es. in `api/` o Cloudflare Worker) invia automaticamente una email al cliente con il link protetto per scaricare:
     - `MANOSCRITTO_COMPLETO_LIBRO_3M.pdf`
     - `BUNDLE_CHECKLIST_STAMPABILI.pdf`
3. **Integrazione WhatsApp (Concierge Maximize)**:
   - Tramite il già presente `WhatsAppConcierge.jsx`, il cliente che acquista può ricevere un messaggio automatico di benvenuto da Maurizio:  
     *"Complimenti per aver scelto di investire nel tuo futuro! Trovi il libro nella tua casella email. Non vedo l'ora di sapere quale capitolo applicherai per primo in salone!"*

---

## 4. PIANO DI LANCIO SOCIAL (5 GIORNI) PER MAURIZIO ED ELISEO

### Giorno -3 (Il Teaser del Mistero)
- **Instagram Story Maurizio**: Foto del bancone con un fascicolo rilegato senza mostrare il titolo, con lo sticker: *"Dopo mesi di lavoro in segreto con Eliseo, stiamo per svelarvi il progetto editoriale più importante della nostra carriera. Chi indovina di cosa si tratta?"*.

### Giorno -1 (L'Annuncio Ufficiale & Il Concept "Le 3M per E")
- **Reel / Video a Due Voci (Maurizio ed Eliseo)**:
  - *Maurizio*: *"In tutti questi anni di corsi e palco, mi avete sempre chiesto: Maurizio, dove posso trovare tutto il tuo metodo scritto dall'inizio alla fine?"*
  - *Eliseo*: *"E noi abbiamo fatto molto di più: abbiamo unito la precisione del taglio alla rivoluzione digitale di M×E Barber Lab, dai social all'Intelligenza Artificiale."*
  - *Maurizio*: *"Nasce oggi 'Non Solo Barber: Il Metodo 3M'. Il manuale che insegna a dominare la sedia e a costruirsi un'impresa solida."*

### Giorno 0 (Lancio Ufficiale - Vendite Aperte)
- Post Carosello su entrambi i profili (@maurizio_pizzuto, @maximize_academy, @mxe_barber_lab).
- Link in bio attivo sia per l'edizione digitale con bonus su Maximize Academy, sia per la versione cartacea Amazon KDP.
- Prime 100 copie cartacee con dedica autografa di Maurizio per chi ordina entro 48 ore.

### Giorno +2 (Riprova Sociale & Unboxing)
- Repost delle prime storie dei colleghi e allievi che hanno scaricato il libro o mostrano il manuale plastificato sul loro bancone da lavoro.

