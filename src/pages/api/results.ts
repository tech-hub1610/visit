import type { NextApiRequest, NextApiResponse } from 'next';
import { LotteryResult } from '../../lib/types';
import { INITIAL_RESULTS } from '../../lib/sample-data';

// In-memory store for serverless runtime
let resultsStore: LotteryResult[] = [...INITIAL_RESULTS];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { date, time } = req.query;
    let filtered = resultsStore;
    if (date && typeof date === 'string') {
      filtered = filtered.filter(r => r.drawDate === date);
    }
    if (time && typeof time === 'string') {
      filtered = filtered.filter(r => r.drawTime === time);
    }
    return res.status(200).json({ success: true, count: filtered.length, results: filtered });
  }

  if (req.method === 'POST') {
    try {
      const newResult: LotteryResult = req.body;
      if (!newResult || !newResult.drawDate || !newResult.drawTime || !newResult.firstPrize) {
        return res.status(400).json({ success: false, error: 'Invalid result payload' });
      }

      // Filter out duplicate date + time slot
      resultsStore = [
        newResult,
        ...resultsStore.filter(r => !(r.drawDate === newResult.drawDate && r.drawTime === newResult.drawTime)),
      ];

      return res.status(201).json({ success: true, message: 'Result published successfully', result: newResult });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  if (req.method === 'DELETE') {
    const { id } = req.query;
    if (id && typeof id === 'string') {
      resultsStore = resultsStore.filter(r => r.id !== id);
      return res.status(200).json({ success: true, message: 'Draw removed' });
    }
    return res.status(400).json({ success: false, error: 'Missing ID' });
  }

  res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
  return res.status(405).json({ success: false, error: `Method ${req.method} not allowed` });
}
