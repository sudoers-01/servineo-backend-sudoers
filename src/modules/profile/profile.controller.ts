import { Request, Response } from 'express';

export function getProfileData(_req: Request, res: Response) {
  setTimeout(() => {
    return res.status(200).json({
      name: 'Juan Condori Quispe',
      photo_url:
        'https://www.shutterstock.com/image-photo/bold-portrait-photo-40yearold-latino-260nw-2627618737.jpg',
      role: 'Carpintero',
      average_rating: 1.36,
      ratings: {
        1: 15,
        2: 2,
        3: 2,
      },
      rating_count: 10,
    });
  }, 1500);
}
