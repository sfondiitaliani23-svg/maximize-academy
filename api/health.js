export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).json({
    status: 'ONLINE',
    platform: 'Maximize Academy Platform on Vercel Serverless',
    timestamp: new Date().toISOString()
  });
}
