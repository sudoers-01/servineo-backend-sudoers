import { Request, Response } from 'express';
import { getJobSummary } from './service';

function getClientIp(req: Request): string | undefined {
  const xff = req.headers['x-forwarded-for'];
  if (typeof xff === 'string') return xff.split(',')[0].trim();
  if (Array.isArray(xff) && xff.length) return xff[0];
  return req.ip;
}

export async function getJobInfoHandler(req: Request, res: Response) {
  const { id } = req.params;
  const db = req.db;
  if (!db) return res.status(500).json({ message: 'Database not available' });

  if (!id) return res.status(400).json({ message: 'ID is required' });

  try {
    const clientIp = getClientIp(req);
    const summary = await getJobSummary(db, id, clientIp);

    if (!summary) return res.status(404).json({ message: 'Job not found' });

    return res.status(200).json(summary);
  } catch (err) {
    console.error('getJobInfoHandler error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
}
