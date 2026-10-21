# 🚀 GUIDA PRATICA AI 3 PASSAGGI ESTERNI PER IL LANCIO

> **Maximize Academy — Istruzioni Passo-Passo per Eliseo e Maurizio**  
> Questa guida contiene le istruzioni esatte per configurare le 3 piattaforme esterne senza toccare il codice.

---

## 📍 1. Google Search Console (Indicizzazione Rapida su Google)

Permette al sito di apparire nei risultati di ricerca Google per parole chiave come *"Maximize Academy", "Maurizio Pizzuto", "Corsi Barber Foggia", "Barber Reset"*.

### Come fare in 2 minuti:
1. Accedi a [Google Search Console](https://search.google.com/search-console) con l'account Google.
2. Clicca su **Aggiungi Proprietà** in alto a sinistra.
3. Seleziona **Prefisso URL** e incolla:  
   `https://maximize-academy.vercel.app` (oppure il dominio definitivo se già attivo).
4. Scegli il metodo di verifica **Tag HTML**:
   - Google ti mostrerà un codice simile a:  
     `<meta name="google-site-verification" content="abc123xyz..." />`
   - Copia il valore contenuto in `content` e incollalo in `index.html` all'interno della sezione `<head>`.
   - Il daemon salverà e pubblicherà la modifica in 5 secondi.
5. Torna su Search Console e clicca su **Verifica**.
6. Nel menu a sinistra vai su **Sitemap** e inserisci:  
   `sitemap.xml`  
   quindi clicca su **Invia**. Google inizierà la scansione di tutte le sezioni.

---

## 🌐 2. Dominio Personalizzato su Vercel (es. maximizeacademy.it)

Permette di usare un indirizzo proprio anziché il sottodominio `.vercel.app`.

### Come fare:
1. Acquista il dominio su qualsiasi registrar (es. Serverplan, Register.it, Namecheap, GoDaddy).
2. Entra nella dashboard del progetto su [Vercel](https://vercel.com/eliseeshop/maximize-academy).
3. Vai in **Settings → Domains**.
4. Inserisci il dominio acquistato (es. `maximizeacademy.it`) e clicca su **Add**.
5. Vercel mostrerà i record DNS esatti da inserire nel pannello di gestione del dominio:
   - **Record A**: puntato all'IP `76.76.21.21`
   - **Record CNAME**: per `www` puntato a `cname.vercel-dns.com`
6. Il certificato SSL HTTPS gratuito verrà generato automaticamente da Vercel in pochi minuti.

---

## ✉️ 3. Notifiche Email Automatiche per Nuovi Lead (Resend)

Permette di ricevere una notifica via email sia a Maurizio (`mauriziomaximize@gmail.com`) sia a te (`eliseeshop.official@gmail.com`) ogni volta che un utente compila il modulo contatti sul sito.

### Come fare (Piano Gratuito fino a 3.000 email/mese):
1. Registrati gratis su [resend.com](https://resend.com).
2. Nel menu a sinistra vai su **API Keys** e clicca su **Create API Key**.
3. Copia la chiave generata (inizia con `re_...`).
4. Entra nel progetto su [Vercel](https://vercel.com/eliseeshop/maximize-academy):
   - Vai in **Settings → Environment Variables**.
   - Aggiungi la variabile:
     - **Key**: `RESEND_API_KEY`
     - **Value**: *(incolla la tua chiave `re_...`)*
   - *(Facoltativo)* Se vuoi specificare destinatari diversi, aggiungi:
     - **Key**: `NOTIFICATION_EMAIL`
     - **Value**: `mauriziomaximize@gmail.com,eliseeshop.official@gmail.com`
5. Clicca su **Save**. Al successivo deploy o salvataggio, il servizio sarà attivo al 100%.

---

## 📞 Riepilogo Contatti di Supporto
- **WhatsApp Ufficiale**: `+39 391 716 3833`
- **Sito Produzione**: `https://maximize-academy.vercel.app`
- **Pannello Vercel**: `https://vercel.com/eliseeshop/maximize-academy`
