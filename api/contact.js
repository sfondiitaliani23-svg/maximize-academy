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
  const name = body.name || body.nome;
  const phone = body.phone || body.telefono || '';
  const email = body.email || '';
  const type = body.type || body.tipoRichiesta || body.course || 'Contatto Generale';
  const message = body.message || body.messaggio || '';

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

  // --- Invio email notifica tramite Resend ---
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (RESEND_API_KEY) {
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
              <td style="padding: 10px 0; font-weight: 700; color: #ffffff; border-bottom: 1px solid #1f2937;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #9ca3af; border-bottom: 1px solid #1f2937;">🎯 Corso / Richiesta</td>
              <td style="padding: 10px 0; font-weight: 600; color: #d4af37; border-bottom: 1px solid #1f2937;">${lead.type}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #9ca3af; border-bottom: 1px solid #1f2937;">📱 Telefono</td>
              <td style="padding: 10px 0; color: #ffffff; border-bottom: 1px solid #1f2937;">
                ${lead.phone ? `<a href="tel:${lead.phone}" style="color: #60a5fa; text-decoration: none; font-weight: bold;">${lead.phone}</a> (<a href="https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}" style="color: #22c55e; text-decoration: none;">Apri su WhatsApp</a>)` : '—'}
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #9ca3af; border-bottom: 1px solid #1f2937;">✉️ Email</td>
              <td style="padding: 10px 0; color: #ffffff; border-bottom: 1px solid #1f2937;">
                ${lead.email ? `<a href="mailto:${lead.email}" style="color: #60a5fa; text-decoration: none;">${lead.email}</a>` : '—'}
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #9ca3af; vertical-align: top; border-bottom: 1px solid #1f2937;">💬 Note / Messaggio</td>
              <td style="padding: 10px 0; color: #e5e7eb; font-style: italic; border-bottom: 1px solid #1f2937; white-space: pre-wrap;">${lead.message || 'Nessun messaggio aggiuntivo'}</td>
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
          subject: `🔔 Nuovo Lead: ${name} (${lead.type})`,
          html: emailBody,
        }),
      });

      const emailResult = await emailResponse.json();
      console.log('[EMAIL RESPONSE]', emailResult);
    } catch (emailErr) {
      console.error('[EMAIL ERROR]', emailErr.message);
    }
  }

  // --- Salvataggio Lead su Database Cloud Supabase ---
  const SUPABASE_URL = process.env.SUPABASE_URL || 'https://hozyimhhrodazpssxmtt.supabase.co';
  const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
  if (SUPABASE_URL && SUPABASE_ANON_KEY) {
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/leads`, {
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
      console.log('[SUPABASE CRM] Lead salvato nel database Maximize Academy');
    } catch (dbErr) {
      console.error('[SUPABASE CRM ERROR]', dbErr.message);
    }
  }

  return res.status(200).json({
    success: true,
    message: 'Richiesta ricevuta con successo. Il team di Maximize Academy ti risponderà al più presto.',
    leadId: lead.id
  });
}
