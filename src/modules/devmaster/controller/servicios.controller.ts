import { Request, Response } from 'express';
import { Job } from '../services/job.model';
import { normalizeSearchText } from '../utils/search.normalizer';

export async function getServiciosByName(req: Request, res: Response) {
  let name = typeof req.query.name === 'string' ? req.query.name : '';
  const context = typeof req.query.context === 'string' ? req.query.context : '';

  if (name.length > 50) {
    return res.json({ total: 0, data: [] });
  }

  const allowedCharsRegex = /^[A-Za-z0-9_.\- ]*$/;
  if (!allowedCharsRegex.test(name)) {
    return res.json({ total: 0, data: [] });
  }

  name = normalizeSearchText(name);

  if (!name) {
    return res.json({ total: 0, data: [] });
  }

  console.log('Context:', context);

  let filter;
  if (context === 'home') {
    filter = {
      $or: [
        { title: { $regex: name, $options: 'i' } },
        { description: { $regex: name, $options: 'i' } },
        { jobWords: { $regex: name, $options: 'i' } },
        { category: { $regex: name, $options: 'i' } },
        { location: { $regex: name, $options: 'i' } },
      ],
    };
  } else if (context === 'map') {
    filter = {
      $or: [
        { title: { $regex: name, $options: 'i' } },
        { description: { $regex: name, $options: 'i' } },
        { jobWords: { $regex: name, $options: 'i' } },
      ],
    };
  } else if (context === 'job_offer') {
    filter = {
      $or: [
        { title: { $regex: name, $options: 'i' } },
        { description: { $regex: name, $options: 'i' } },
      ],
    };
  } else {
    filter = {
      $or: [
        { title: { $regex: name, $options: 'i' } },
        { description: { $regex: name, $options: 'i' } },
      ],
    };
  }

  const [data, total] = await Promise.all([
    Job.find(filter).limit(50).lean(),
    Job.countDocuments(filter),
  ]);

  return res.json({ total, data });
}
