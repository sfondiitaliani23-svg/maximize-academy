export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { hand = 'right', primaryTechnique = 'sfumatura', sizePreference = '6.0' } = req.body || {};

  let recommendation = {
    model: 'SABEY DAMASCUS MASTER EDITION',
    size: sizePreference || '6.0"',
    steel: 'Acciaio Giapponese VG-10 Lavorazione Artigianale Italiana',
    description: 'Bilanciamento perfetto per sfumature ultra-pulite, forbice su pettine e precisione assoluta sul contorno.',
    badge: 'Consigliata da Maurizio Pizzuto',
    waDirectLink: `https://wa.me/393783101416?text=${encodeURIComponent('Salve, vorrei informazioni sulla forbice Sabey consigliata dal configuratore Maximize: modello ' + sizePreference + ' per tecnica ' + primaryTechnique)}`
  };

  if (primaryTechnique.includes('punta') || primaryTechnique.includes('dettaglio')) {
    recommendation.model = 'SABEY PRECISION BLADE LINE';
    recommendation.size = '5.5"';
    recommendation.description = 'Lama affilata a rasoio per rifiniture micrometriche e lavoro point-cutting.';
  } else if (primaryTechnique.includes('sfoltitura')) {
    recommendation.model = 'SABEY TEXTURE 30T ERGO';
    recommendation.size = '6.0" (30 Denti)';
    recommendation.description = 'Denti micropettinati per alleggerire i volumi senza lasciare tacche visibili.';
  }

  return res.status(200).json({
    status: 'SUCCESS',
    recommendation
  });
}
