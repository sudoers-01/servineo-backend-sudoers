import { Request, Response } from 'express';

export function getRates(_req: Request, res: Response) {
  const rates = [2, 3, 1, 2, 2, 3,3,1,2,2];
  const average = rates.reduce((sum, rate) => sum + rate, 0) / rates.length;

  return res.status(200).json({
    status: 200,
    average: parseFloat(average.toFixed(1))
  });
}