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

  return res.status(200).json({
    success: true,
    message: 'Richiesta ricevuta con successo. Il team di Maximize Academy ti risponderà al più presto.',
    leadId: lead.id
  });
}
