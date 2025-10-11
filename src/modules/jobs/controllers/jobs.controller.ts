import { Request, Response } from 'express';
import { changeJobStatus } from '../services/jobs.service';

export const changeStatusController = async (req: Request, res: Response) => {
  try {
    const { jobId } = req.params;
    await changeJobStatus(req.db, jobId);

    res.status(200).json({ message: 'Job status updated to pending payment' });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Job not found') {
      return res.status(404).json({ message: error.message });
    }
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
