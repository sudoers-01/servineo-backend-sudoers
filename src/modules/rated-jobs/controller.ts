import { Request, Response } from 'express';
import { getDB } from '../../config/db/mongoClient'; // importante: usa la ruta correcta

export const getRatedJobs = async (req: Request, res: Response) => {
  try {
    const db = getDB();
    const jobsCollection = db.collection('jobs');

    // Trae todos los jobs que tienen rating
    const ratedJobs = await jobsCollection.find({ rating: { $exists: true } }).toArray();

    // Filtrar solo los campos relevantes
    const data = ratedJobs.map((job) => ({
      id: job._id.toString(),
      title: job.title,
      dateISO: job.createdAt,
      rating: job.rating,
    }));

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('Error fetching rated jobs:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching rated jobs',
    });
  }
};
