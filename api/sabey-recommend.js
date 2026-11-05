export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  return res.status(200).json({
    status: 'UNAVAILABLE',
    message: 'Il configuratore non è attivo. Sabey Scissors propone forbici professionali. Per la scelta scrivi a Keplero.',
    waDirectLink: `https://wa.me/393783101416?text=${encodeURIComponent('Salve, vorrei informazioni su una forbice Sabey.')}`
  });
}
