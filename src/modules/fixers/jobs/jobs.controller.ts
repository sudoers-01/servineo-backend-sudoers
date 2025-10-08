import { Request, Response } from 'express';

export function getJobs(_req: Request, res: Response) {
  return res.status(200).json({
    status: 200,
    data: [
      {
        requester: 'Carlos López',
        jobName: 'Reparar tubería dañada en la cocina',
        status: 'Accepted',
      },
      {
        requester: 'Ana Torres',
        jobName: 'Pintado de fachada principal',
        status: 'Accepted',
      },
      {
        requester: 'Luis Gómez',
        jobName: 'Instalación de enchufes eléctricos',
        status: 'Accepted',
      },
    ],
  });
}
