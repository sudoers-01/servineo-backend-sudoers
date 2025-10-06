import { Request, Response } from 'express';
import { Job } from '../services/job.model';

export async function getServiciosByName(req: Request, res: Response) {
  const name = typeof req.query.name === 'string' ? req.query.name : '';

  if (!name) {
    return res.json({ total: 0, data: [] });
  }

  const regex = new RegExp(name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), '');
  const filter = { $or: [{ title: regex }, { description: regex }] };
  const [data, total] = await Promise.all([
    Job.find(filter).limit(50).lean(),
    Job.countDocuments(filter),
  ]);

  return res.json({ total, data });
}
