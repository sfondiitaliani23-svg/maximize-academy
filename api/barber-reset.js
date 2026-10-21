export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { chairs = 2, weeklyClients = 120, avgTicket = 22, monthlyProductsSold = 15 } = req.body || {};

  const currentMonthly = (weeklyClients * 4.33 * avgTicket) + (monthlyProductsSold * 25);
  const projectedTicket = avgTicket * 1.28;
  const projectedProducts = weeklyClients * 4.33 * 0.18;
  const projectedMonthly = (weeklyClients * 4.33 * projectedTicket) + (projectedProducts * 26);
  const monthlyUplift = projectedMonthly - currentMonthly;
  const annualUplift = monthlyUplift * 12;

  let resetScore = 65;
  if (avgTicket < 20) resetScore += 15;
  if (monthlyProductsSold < 20) resetScore += 15;

  return res.status(200).json({
    status: 'SUCCESS',
    engine: 'VERCEL_SERVERLESS_ENGINE',
    chairs,
    currentMonthlyRevenue: parseFloat(currentMonthly.toFixed(2)),
    projectedMonthlyRevenue: parseFloat(projectedMonthly.toFixed(2)),
    monthlyUplift: parseFloat(monthlyUplift.toFixed(2)),
    annualUplift: parseFloat(annualUplift.toFixed(2)),
    resetNeedScore: resetScore,
    strategy: 'BARBER RESET STRATEGY',
    summary: `Con l'intervento Barber Reset su protocolli di consulenza e vendita prodotti, la tua barberia ha un potenziale recuperabile stimato in € ${annualUplift.toFixed(2)} all'anno.`
  });
}
