export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  return res.status(200).json({
    status: 'UNAVAILABLE',
    message: 'Il configuratore non è attivo. Sabey Scissors è strumenti e forbici: per la scelta scrivi a un operatore.',
    waDirectLink: `https://wa.me/393245878724?text=${encodeURIComponent('Salve, vorrei aiuto per scegliere una forbice Sabey.')}`
  });
}
