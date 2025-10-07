import { Request, Response } from 'express';
import { Job } from '../services/job.model';

export async function getServiciosByName(req: Request, res: Response) {
  const name = typeof req.query.name === 'string' ? req.query.name : '';
  const context = typeof req.query.context === 'string' ? req.query.context : '';
  const limit = typeof req.query.limit === 'number' ? req.query.limit : 50;

  if (!name) {
    return res.json({ total: 0, data: [] });
  }

  console.log('Context:', context);

  const regex = new RegExp(name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), '');
  const filter = { $or: [{ title: regex }, { description: regex }] };
  const [data, total] = await Promise.all([
    Job.find(filter).limit(limit).lean(),
    Job.countDocuments(filter),
  ]);

  return res.json({ total, data });
}
