import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const token = req.headers.authorization?.replace('Bearer ', '') || process.env.LOTTERY_SAMBAD_API_KEY;
  const { date, drawTime } = req.body || {};

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Lottery Sambad API Token is required. Please sign in to lottery.sambad.com to generate your token.',
    });
  }

  try {
    const targetUrl = `https://api.sambad.com/api/v1/draws?date=${date || new Date().toISOString().split('T')[0]}`;
    const sambadRes = await fetch(targetUrl, {
      headers: {
        Authorization: `Bearer ${token.trim()}`,
        Accept: 'application/json',
      },
    });

    if (!sambadRes.ok) {
      const errText = await sambadRes.text();
      return res.status(sambadRes.status).json({
        success: false,
        error: `Sambad API returned status ${sambadRes.status}: ${errText}`,
      });
    }

    const data = await sambadRes.json();
    return res.status(200).json({ success: true, data });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err.message || 'Internal proxy error connecting to Sambad API',
    });
  }
}
