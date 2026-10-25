import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const JAVA_BACKEND_URL = process.env.JAVA_URL || 'http://localhost:8085';

app.use(cors());
app.use(express.json());

// Cartella per salvataggio lead
const DATA_DIR = path.join(__dirname, '../data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
const LEADS_FILE = path.join(DATA_DIR, 'leads.json');
if (!fs.existsSync(LEADS_FILE)) {
  fs.writeFileSync(LEADS_FILE, JSON.stringify([], null, 2));
}

// 1. Health check
app.get('/api/health', async (req, res) => {
  let javaStatus = 'UNREACHABLE';
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1000);
    const resp = await fetch(`${JAVA_BACKEND_URL}/api/java/health`, { signal: controller.signal });
    clearTimeout(timeout);
    if (resp.ok) {
      const data = await resp.json();
      javaStatus = data.status || 'ONLINE';
    }
  } catch (err) {
    javaStatus = 'OFFLINE (Start via backend-java/build-and-run.bat)';
  }

  res.json({
    status: 'ONLINE',
    system: 'Maximize Academy Unified API Gateway',
    nodeVersion: process.version,
    javaService: javaStatus,
    timestamp: new Date().toISOString()
  });
});

// 2. Barber Reset Audit (inoltra a Java se disponibile, altrimenti fallback ad alta precisione)
app.post('/api/barber-reset/assess', async (req, res) => {
  const { chairs = 2, weeklyClients = 120, avgTicket = 22, monthlyProductsSold = 15, salonName = '' } = req.body;

  try {
    const javaResp = await fetch(`${JAVA_BACKEND_URL}/api/java/barber-audit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chairs, weeklyClients, avgTicket, monthlyProductsSold })
    });
    if (javaResp.ok) {
      const data = await javaResp.json();
      return res.json({ ...data, engine: 'JAVA_CORE_ENGINE' });
    }
  } catch (err) {
    // Fallback nativo
  }

  // Fallback Node.js
  const currentMonthly = (weeklyClients * 4.33 * avgTicket) + (monthlyProductsSold * 25);
  const projectedTicket = avgTicket * 1.28;
  const projectedProducts = weeklyClients * 4.33 * 0.18;
  const projectedMonthly = (weeklyClients * 4.33 * projectedTicket) + (projectedProducts * 26);
  const monthlyUplift = projectedMonthly - currentMonthly;
  const annualUplift = monthlyUplift * 12;

  let resetScore = 65;
  if (avgTicket < 20) resetScore += 15;
  if (monthlyProductsSold < 20) resetScore += 15;

  res.json({
    status: 'SUCCESS',
    engine: 'NODE_ENGINE',
    chairs,
    currentMonthlyRevenue: parseFloat(currentMonthly.toFixed(2)),
    projectedMonthlyRevenue: parseFloat(projectedMonthly.toFixed(2)),
    monthlyUplift: parseFloat(monthlyUplift.toFixed(2)),
    annualUplift: parseFloat(annualUplift.toFixed(2)),
    resetNeedScore: resetScore,
    strategy: 'BARBER RESET STRATEGY',
    summary: `Con l'intervento Barber Reset su protocolli di consulenza e vendita prodotti, la tua barberia ha un potenziale recuperabile stimato in € ${annualUplift.toFixed(2)} all'anno.`
  });
});

// 3. Quiz / Raccomandazione Forbice Sabey
app.post('/api/sabey/recommend', (req, res) => {
  const { hand = 'right', primaryTechnique = 'sfumatura', sizePreference = '6.0' } = req.body;

  let recommendation = {
    model: 'SABEY DAMASCUS MASTER EDITION',
    size: sizePreference || '6.0"',
    steel: 'Acciaio Giapponese VG-10 Lavorazione Artigianale Italiana',
    description: 'Bilanciamento perfetto per sfumature ultra-pulite, forbice su pettine e precisione assoluta sul contorno.',
    badge: 'Consigliata da Maurizio Pizzuto',
    waDirectLink: `https://wa.me/393783101416?text=${encodeURIComponent('Salve, vorrei informazioni sulla forbice Sabey consigliata dal sito Maximize: modello ' + sizePreference + ' per tecnica ' + primaryTechnique)}`
  };

  if (primaryTechnique === 'punta' || primaryTechnique === 'dettaglio') {
    recommendation.model = 'SABEY PRECISION BLADE LINE';
    recommendation.size = '5.5"';
    recommendation.description = 'Lama affilata a rasoio per rifiniture micrometriche e lavoro point-cutting.';
  } else if (primaryTechnique === 'sfoltitura') {
    recommendation.model = 'SABEY TEXTURE 30T ERGO';
    recommendation.size = '6.0" (30 Denti)';
    recommendation.description = 'Denti micropettinati per alleggerire i volumi senza lasciare tacche visibili.';
  }

  res.json({
    status: 'SUCCESS',
    recommendation
  });
});

// 4. Ricezione Lead e Contatti
app.post('/api/contact', async (req, res) => {
  const { name, phone, email, type, message, notes } = req.body;

  if (!name || (!phone && !email)) {
    return res.status(400).json({ error: 'Nome e almeno un contatto (telefono o email) sono obbligatori.' });
  }

  const newLead = {
    id: 'LEAD_' + Date.now(),
    name,
    phone: phone || '',
    email: email || '',
    type: type || 'Contatto Generale',
    message: message || '',
    notes: notes || '',
    date: new Date().toISOString()
  };

  try {
    const raw = fs.readFileSync(LEADS_FILE, 'utf-8');
    const leads = JSON.parse(raw);
    leads.unshift(newLead);
    fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2));

    // Notifica anche al microservizio Java se in esecuzione
    try {
      fetch(`${JAVA_BACKEND_URL}/api/java/lead`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLead)
      }).catch(() => {});
    } catch (e) {}

    // Sincronizza con Supabase Cloud se configurato
    const SUPABASE_URL = process.env.SUPABASE_URL || 'https://hozyimhhrodazpssxmtt.supabase.co';
    const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
    if (SUPABASE_URL && SUPABASE_ANON_KEY) {
      try {
        fetch(`${SUPABASE_URL}/rest/v1/leads`, {
          method: 'POST',
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
          },
          body: JSON.stringify({
            name,
            phone: phone || '',
            email: email || '',
            type: type || 'Contatto Generale',
            message: message || '',
            status: 'Nuovo'
          })
        }).catch((err) => console.error('[SUPABASE LOCAL SYNC ERROR]', err.message));
      } catch (e) {}
    }

    res.json({
      success: true,
      message: 'Richiesta ricevuta con successo. Il team di Maximize Academy ti risponderà nelle prossime ore.',
      leadId: newLead.id
    });
  } catch (err) {
    res.status(500).json({ error: 'Errore nel salvataggio della richiesta.' });
  }
});

// 5. Elenco corsi ed eventi attivi
app.get('/api/courses', (req, res) => {
  res.json([
    {
      id: 'gianni-cardinale',
      title: 'Gianni Cardinale — Masterclass Tecnica',
      subtitle: 'Tecnica pura, precisione chirurgica e confronto professionale.',
      tag: 'Formazione Internazionale',
      educator: 'Gianni Cardinale',
      description: 'Nuove prospettive e metodologie operative da portare immediatamente nel lavoro quotidiano per alzare il livello del servizio.',
      partner: 'Men\'s Events Education & Maximize Academy'
    },
    {
      id: 'yass-the-barber',
      title: 'Yass The Barber — International Workshop',
      subtitle: 'Esperienza internazionale, metodo visivo e lavoro pratico sul campo.',
      tag: 'Formazione Internazionale',
      educator: 'Yass The Barber',
      description: 'Osservazione analitica, gestione delle proporzioni e transizioni avanzate per un barber contemporaneo.',
      partner: 'Men\'s Events Education & Maximize Academy'
    },
    {
      id: 'barber-reset',
      title: 'Barber Reset — Intervento Strategico in Barberia',
      subtitle: 'Il percorso esclusivo firmato Maurizio Pizzuto.',
      tag: 'Business & Management',
      educator: 'Maurizio Pizzuto',
      description: 'Dalla relazione con il cliente alla vendita di prodotti, organizzazione dell\'agenda e marginalità economica. La vera crescita comincia quando cambi il modo di gestire la tua attività.',
      partner: 'Maximize Academy'
    },
    {
      id: 'barber-match-2026',
      title: 'Barber Match 2026 — Paestum',
      subtitle: 'Competizione, palco, formazione e networking d\'élite.',
      tag: 'Evento Nazionale',
      educator: 'Top Barber Internazionali',
      description: 'Porta il tuo talento fuori dalla barberia. L\'evento di riferimento per confrontarsi con i migliori professionisti d\'Italia.',
      partner: 'Barber Match & Maurizio Pizzuto'
    }
  ]);
});

// Servizio statico della build di produzione del frontend
const DIST_DIR = path.join(__dirname, '../dist');
if (fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(DIST_DIR, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`[NODE API GATEWAY] In esecuzione su http://localhost:${PORT}`);
  if (fs.existsSync(DIST_DIR)) {
    console.log(`[FRONTEND READY] Anteprima completa attiva su: http://localhost:${PORT}`);
  }
});

