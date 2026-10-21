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

  const { name, phone, email, type, message } = req.body || {};

  if (!name || (!phone && !email)) {
    return res.status(400).json({ error: 'Nome e contatto (telefono/email) obbligatori' });
  }

  const lead = {
    id: 'LEAD_' + Date.now(),
    name,
    phone: phone || '',
    email: email || '',
    type: type || 'Contatto Generale',
    message: message || '',
    timestamp: new Date().toISOString()
  };

  console.log('[VERCEL LEAD CAPTURED]', lead);

  // --- Invio email notifica a Maurizio tramite Resend ---
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (RESEND_API_KEY) {
    try {
      const emailBody = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #08080a; color: #e5e7eb; border: 1px solid #d4af3730; border-radius: 12px; padding: 32px;">
          <h2 style="color: #d4af37; margin-top: 0;">🔔 Nuovo Lead – Maximize Academy</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #9ca3af; width: 130px;">Nome</td><td style="padding: 8px 0; font-weight: bold;">${name}</td></tr>
            <tr><td style="padding: 8px 0; color: #9ca3af;">Tipo richiesta</td><td style="padding: 8px 0; color: #d4af37;">${lead.type}</td></tr>
            <tr><td style="padding: 8px 0; color: #9ca3af;">Telefono</td><td style="padding: 8px 0;">${lead.phone || '—'}</td></tr>
            <tr><td style="padding: 8px 0; color: #9ca3af;">Email</td><td style="padding: 8px 0;">${lead.email || '—'}</td></tr>
            <tr><td style="padding: 8px 0; color: #9ca3af;">Messaggio</td><td style="padding: 8px 0; font-style: italic;">${lead.message || '—'}</td></tr>
            <tr><td style="padding: 8px 0; color: #9ca3af;">Data/Ora</td><td style="padding: 8px 0; font-size: 12px;">${new Date(lead.timestamp).toLocaleString('it-IT', { timeZone: 'Europe/Rome' })}</td></tr>
            <tr><td style="padding: 8px 0; color: #9ca3af;">Lead ID</td><td style="padding: 8px 0; font-family: monospace; font-size: 11px; color: #6b7280;">${lead.id}</td></tr>
          </table>
          <hr style="border: none; border-top: 1px solid #d4af3730; margin: 24px 0;">
          <p style="font-size: 12px; color: #4b5563; margin: 0;">Maximize Academy · Via Benedetto Croce 8, 71121 Foggia · P.IVA 02147290767</p>
        </div>
      `;

      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Maximize Academy <noreply@resend.dev>',
          to: ['mauriziomaximize@gmail.com'],
          subject: `🔔 Nuovo lead: ${name} — ${lead.type}`,
          html: emailBody,
        }),
      });

      console.log('[EMAIL SENT] Lead notified to mauriziomaximize@gmail.com');
    } catch (emailErr) {
      console.error('[EMAIL ERROR]', emailErr.message);
      // Non blocca la risposta al client anche se l'email fallisce
    }
  }

  return res.status(200).json({
    success: true,
    message: 'Richiesta ricevuta con successo. Il team di Maximize Academy ti risponderà al più presto.',
    leadId: lead.id
  });
}
