import { Request, Response } from 'express';
import { getJobsByFixerId } from './jobs.service';

export async function getJobs(req: Request, res: Response) {
  try {
    const { fixerId } = req.params;
    if (!fixerId) {
      return res.status(400).json({ status: 400, message: 'fixerId is required' });
    }

    const jobs = await getJobsByFixerId(req.db, fixerId);

    return res.status(200).json({ status: 200, data: jobs });
  } catch (error) {
    console.error('Error fetching jobs by fixerId:', error);
    return res.status(500).json({ status: 500, message: 'Internal server error' });
  }
}
