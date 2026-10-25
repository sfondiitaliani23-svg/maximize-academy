export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = req.body || {};
  const clean = (v, max) => (typeof v === 'string' ? v : '').trim().slice(0, max);
  const name = clean(body.name || body.nome, 120);
  const phone = clean(body.phone || body.telefono, 40);
  const email = clean(body.email, 160);
  const type = clean(body.type || body.tipoRichiesta || body.course, 160) || 'Contatto Generale';
  const message = clean(body.message || body.messaggio, 3000);

  // I dati del form finiscono nell'HTML dell'email: vanno sempre "escapati".
  const esc = (v) => String(v)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  const phoneDigits = phone.replace(/[^0-9+]/g, '');
  // Link WhatsApp: serve il prefisso internazionale (numeri italiani senza 39 → aggiunto).
  let waNumber = phoneDigits.replace(/^\+/, '').replace(/^00/, '');
  if (/^3\d{8,9}$/.test(waNumber)) waNumber = '39' + waNumber;

  if (!name || (!phone && !email)) {
    return res.status(400).json({ error: 'Nome e contatto (telefono o email) sono obbligatori' });
  }

  const lead = {
    id: 'LEAD_' + Date.now(),
    name,
    phone,
    email,
    type,
    message,
    timestamp: new Date().toISOString()
  };

  console.log('[VERCEL LEAD CAPTURED]', lead);

  // Tiene traccia di dove il lead è arrivato davvero.
  let channels = 0;
  let delivered = 0;

  // --- Invio email notifica tramite Resend ---
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (RESEND_API_KEY) {
    channels++;
    try {
      const emailBody = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0b0c10; color: #f3f4f6; border: 1px solid #d4af3740; border-radius: 12px; padding: 28px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
          <div style="border-bottom: 2px solid #d4af37; padding-bottom: 16px; margin-bottom: 20px;">
            <h2 style="color: #d4af37; margin: 0; font-size: 20px; letter-spacing: 0.5px;">🔔 NUOVO LEAD RICEVUTO — MAXIMIZE ACADEMY</h2>
            <p style="color: #9ca3af; margin: 4px 0 0 0; font-size: 13px;">Un potenziale studente ha compilato il form sul sito web</p>
          </div>

          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr>
              <td style="padding: 10px 0; color: #9ca3af; width: 140px; border-bottom: 1px solid #1f2937;">👤 Candidato</td>
              <td style="padding: 10px 0; font-weight: 700; color: #ffffff; border-bottom: 1px solid #1f2937;">${esc(name)}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #9ca3af; border-bottom: 1px solid #1f2937;">🎯 Corso / Richiesta</td>
              <td style="padding: 10px 0; font-weight: 600; color: #d4af37; border-bottom: 1px solid #1f2937;">${esc(lead.type)}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #9ca3af; border-bottom: 1px solid #1f2937;">📱 Telefono</td>
              <td style="padding: 10px 0; color: #ffffff; border-bottom: 1px solid #1f2937;">
                ${lead.phone ? `<a href="tel:${esc(phoneDigits)}" style="color: #60a5fa; text-decoration: none; font-weight: bold;">${esc(lead.phone)}</a> (<a href="https://wa.me/${waNumber}" style="color: #22c55e; text-decoration: none;">Apri su WhatsApp</a>)` : '—'}
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #9ca3af; border-bottom: 1px solid #1f2937;">✉️ Email</td>
              <td style="padding: 10px 0; color: #ffffff; border-bottom: 1px solid #1f2937;">
                ${lead.email ? `<a href="mailto:${esc(lead.email)}" style="color: #60a5fa; text-decoration: none;">${esc(lead.email)}</a>` : '—'}
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #9ca3af; vertical-align: top; border-bottom: 1px solid #1f2937;">💬 Note / Messaggio</td>
              <td style="padding: 10px 0; color: #e5e7eb; font-style: italic; border-bottom: 1px solid #1f2937; white-space: pre-wrap;">${lead.message ? esc(lead.message) : 'Nessun messaggio aggiuntivo'}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #9ca3af;">⏱️ Data e Ora</td>
              <td style="padding: 10px 0; font-size: 13px; color: #9ca3af;">${new Date(lead.timestamp).toLocaleString('it-IT', { timeZone: 'Europe/Rome' })}</td>
            </tr>
          </table>

          <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #1f2937; font-size: 12px; color: #6b7280; text-align: center;">
            <p style="margin: 0;">Maximize Academy by Maurizio Barber Shop · Foggia</p>
            <p style="margin: 4px 0 0 0; font-family: monospace; font-size: 11px;">ID: ${lead.id}</p>
          </div>
        </div>
      `;

      // In modalità test (senza dominio personalizzato verificato su Resend), 
      // l'email viene recapitata all'indirizzo dell'account proprietario (eliseeshop.official@gmail.com).
      // Se viene configurato un dominio o specificata un'altra email tramite NOTIFICATION_EMAIL, usa quella.
      const recipients = process.env.NOTIFICATION_EMAIL 
        ? process.env.NOTIFICATION_EMAIL.split(',').map(e => e.trim()) 
        : ['eliseeshop.official@gmail.com'];

      const emailResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Maximize Academy <onboarding@resend.dev>',
          to: recipients,
          subject: `🔔 Nuovo Lead: ${name} (${lead.type})`.replace(/[\r\n]+/g, ' '),
          html: emailBody,
        }),
      });

      const emailResult = await emailResponse.json().catch(() => ({}));
      if (emailResponse.ok) {
        delivered++;
        console.log('[EMAIL INVIATA]', emailResult.id || '');
      } else {
        console.error('[EMAIL ERROR]', emailResponse.status, emailResult);
      }
    } catch (emailErr) {
      console.error('[EMAIL ERROR]', emailErr.message);
    }
  }

  // --- Salvataggio Lead su Database Cloud Supabase ---
  const SUPABASE_URL = process.env.SUPABASE_URL || 'https://hozyimhhrodazpssxmtt.supabase.co';
  const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
  if (SUPABASE_URL && SUPABASE_ANON_KEY) {
    channels++;
    try {
      const dbResponse = await fetch(`${SUPABASE_URL}/rest/v1/leads`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({
          name,
          phone,
          email,
          type: lead.type,
          message,
          status: 'Nuovo'
        })
      });
      if (dbResponse.ok) {
        delivered++;
        console.log('[SUPABASE CRM] Lead salvato nel database Maximize Academy');
      } else {
        console.error('[SUPABASE CRM ERROR]', dbResponse.status, await dbResponse.text().catch(() => ''));
      }
    } catch (dbErr) {
      console.error('[SUPABASE CRM ERROR]', dbErr.message);
    }
  }

  if (channels === 0) {
    // Né Resend né Supabase configurati: il lead resta solo nei log di Vercel.
    console.warn('[LEAD NON INOLTRATO] Configura RESEND_API_KEY o SUPABASE_ANON_KEY su Vercel.');
  } else if (delivered === 0) {
    return res.status(502).json({
      success: false,
      error: 'Invio non riuscito. Riprova tra poco o scrivici su WhatsApp al +39 391 716 3833.'
    });
  }

  return res.status(200).json({
    success: true,
    message: 'Richiesta ricevuta con successo. Il team di Maximize Academy ti risponderà al più presto.',
    leadId: lead.id
  });
}
