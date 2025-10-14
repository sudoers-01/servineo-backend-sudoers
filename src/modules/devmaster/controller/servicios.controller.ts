import { Request, Response } from 'express';
import { Job } from '../models/job.model';

export async function getServiciosByName(req: Request, res: Response) {
  const name = typeof req.query.name === 'string' ? req.query.name : '';
  const context = typeof req.query.context === 'string' ? req.query.context : '';

  if (!name) {
    return res.json({ total: 0, data: [] });
  }

  console.log('Context:', context);

  const regex = new RegExp(name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), '');
  let filter;
  if (context === 'home') {
    filter = {
      $or: [
        { title: regex },
        { description: regex },
        { jobWords: regex },
        { category: regex },
        { location: regex },
      ],
    };
  } else if (context === 'map') {
    filter = {
      $or: [{ title: regex }, { description: regex }, { jobWords: regex }],
    };
  } else if (context === 'job_offer') {
    filter = {
      $or: [{ title: regex }, { description: regex }],
    };
  } else {
    filter = {
      $or: [{ title: regex }, { description: regex }],
    };
  }

  const [data, total] = await Promise.all([
    Job.find(filter).limit(50).lean(),
    Job.countDocuments(filter),
  ]);

  return res.json({ total, data });
}
//hola buenas noches