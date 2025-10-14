import { Review } from '../modules/review.model';
import { Types } from 'mongoose';

/**
 * Interfaz para el promedio de calificación de un fixer
 */
export interface FixerRating {
  fixerId: string;
  averageRating: number;
  totalReviews: number;
}

/**
 * Obtiene los promedios de calificación para múltiples fixers
 */
export const getMultipleFixersRatings = async (
  fixerIds: string[],
): Promise<Map<string, FixerRating>> => {
  try {
    const objectIds = fixerIds.map((id) => new Types.ObjectId(id));

    // Usar agregación de MongoDB para calcular promedios de forma eficiente
    const ratingsAggregation = await Review.aggregate([
      {
        $match: {
          reviewedId: { $in: objectIds },
        },
      },
      {
        $group: {
          _id: '$reviewedId',
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    // Crear un mapa para búsqueda rápida
    const ratingsMap = new Map<string, FixerRating>();

    // Agregar los fixers con calificaciones
    ratingsAggregation.forEach((rating) => {
      ratingsMap.set(rating._id.toString(), {
        fixerId: rating._id.toString(),
        averageRating: Math.round(rating.averageRating * 100) / 100,
        totalReviews: rating.totalReviews,
      });
    });

    // Agregar fixers sin calificaciones con rating 0
    fixerIds.forEach((fixerId) => {
      if (!ratingsMap.has(fixerId)) {
        ratingsMap.set(fixerId, {
          fixerId,
          averageRating: 0,
          totalReviews: 0,
        });
      }
    });

    return ratingsMap;
  } catch (error) {
    console.error('Error obteniendo ratings de múltiples fixers:', error);
    return new Map();
  }
};
