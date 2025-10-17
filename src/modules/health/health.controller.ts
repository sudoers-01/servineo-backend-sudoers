import { Request, Response } from 'express';

export const getHealth = (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    message: 'Backend operativo',
    timestamp: new Date().toISOString(),
  });
};
