// services/jobOfert/filterCounts.service.ts
import { Offer } from '../../models/offer.model';
import { validateAndNormalizeCity } from '../../utils/cityHelper';
import { validateAndNormalizeCategory } from '../../utils/categoryHelper';
import { getRangeRegex } from '../../utils/nameRangeHelper';

export type FilterCountsOptions = {
  search?: string;
  ranges?: string[];
  city?: string;
  categories?: string[];
  minRating?: number;
  maxRating?: number;
};

export type FilterCounts = {
  fixers: Record<string, number>;
  cities: Record<string, number>;
  categories: Record<string, number>;
  ratings: Record<string, number>;
  total: number;
};

interface MongoQuery {
  $or?: Array<{
    title?: RegExp;
    description?: RegExp;
    fixerName?: RegExp | { $in: RegExp[] };
  }>;
  fixerName?: RegExp | { $in: RegExp[] };
  city?: string;
  category?: string | { $in: string[] };
  rating?: {
    $gte?: number;
    $lte?: number;
  };
}

export class FilterCountsService {
  /**
   * Obtiene conteos dinámicos de filtros según los filtros activos
   */
  static async getCounts(options: FilterCountsOptions = {}): Promise<FilterCounts> {
    // Construir query base con filtros activos
    const baseQuery: MongoQuery = this.buildBaseQuery(options);

    // Obtener conteos en paralelo para mejor performance
    const [fixerCounts, cityCounts, categoryCounts, ratingCounts, total] = await Promise.all([
      this.getFixerCounts(baseQuery, options),
      this.getCityCounts(baseQuery, options),
      this.getCategoryCounts(baseQuery, options),
      this.getRatingCounts(baseQuery, options),
      Offer.countDocuments(baseQuery),
    ]);

    return {
      fixers: fixerCounts,
      cities: cityCounts,
      categories: categoryCounts,
      ratings: ratingCounts,
      total,
    };
  }

  /**
   * Construye el query base con todos los filtros activos
   */
  private static buildBaseQuery(options: FilterCountsOptions): MongoQuery {
    const query: MongoQuery = {};

    // Filtro de búsqueda (title o description)
    if (options.search) {
      const searchRegex = new RegExp(options.search, 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { fixerName: searchRegex },
      ];
    }

    // Filtro de rangos de nombres (A-D, E-H, etc.)
    if (options.ranges && options.ranges.length > 0) {
      const regexes = options.ranges.map((r) => getRangeRegex(r)).filter(Boolean) as RegExp[];
      if (regexes.length > 0) {
        query.fixerName = { $in: regexes };
      }
    }

    // Filtro de ciudad
    if (options.city) {
      query.city = validateAndNormalizeCity(options.city);
    }

    // Filtro de categorías
    if (options.categories && options.categories.length > 0) {
      const normalizedCategories = options.categories
        .map((c) => validateAndNormalizeCategory(c))
        .filter(Boolean) as string[];
      if (normalizedCategories.length > 0) {
        query.category = { $in: normalizedCategories };
      }
    }

    // Filtro de rating
    if (options.minRating !== undefined || options.maxRating !== undefined) {
      const ratingQuery: { $gte?: number; $lte?: number } = {};
      if (options.minRating !== undefined) {
        ratingQuery.$gte = options.minRating;
      }
      if (options.maxRating !== undefined) {
        ratingQuery.$lte = options.maxRating;
      }
      query.rating = ratingQuery;
    }

    return query;
  }

  /**
   * Obtiene conteo de ofertas por fixer (excluyendo el filtro de ranges si está activo)
   */
  private static async getFixerCounts(
    baseQuery: MongoQuery,
    options: FilterCountsOptions
  ): Promise<Record<string, number>> {
    // Crear query sin el filtro de fixerName para mostrar todos los fixers disponibles
    const queryWithoutFixerFilter = { ...baseQuery };
    delete queryWithoutFixerFilter.fixerName;

    interface AggregationResult {
      _id: string;
      count: number;
    }

    const counts = await Offer.aggregate<AggregationResult>([
      { $match: queryWithoutFixerFilter },
      {
        $group: {
          _id: '$fixerName',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1, _id: 1 } },
      { $limit: 50 }, // Limitar a los 50 fixers con más ofertas
    ]);

    return counts.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {} as Record<string, number>);
  }

  /**
   * Obtiene conteo de ofertas por ciudad (excluyendo el filtro de city si está activo)
   */
  private static async getCityCounts(
    baseQuery: MongoQuery,
    options: FilterCountsOptions
  ): Promise<Record<string, number>> {
    const queryWithoutCityFilter = { ...baseQuery };
    delete queryWithoutCityFilter.city;

    interface AggregationResult {
      _id: string;
      count: number;
    }

    const counts = await Offer.aggregate<AggregationResult>([
      { $match: queryWithoutCityFilter },
      {
        $group: {
          _id: '$city',
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return counts.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {} as Record<string, number>);
  }

  /**
   * Obtiene conteo de ofertas por categoría (excluyendo el filtro de category si está activo)
   */
  private static async getCategoryCounts(
    baseQuery: MongoQuery,
    options: FilterCountsOptions
  ): Promise<Record<string, number>> {
    const queryWithoutCategoryFilter = { ...baseQuery };
    delete queryWithoutCategoryFilter.category;

    interface AggregationResult {
      _id: string;
      count: number;
    }

    const counts = await Offer.aggregate<AggregationResult>([
      { $match: queryWithoutCategoryFilter },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1, _id: 1 } },
    ]);

    return counts.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {} as Record<string, number>);
  }

  /**
   * Obtiene conteo de ofertas por rango de rating (excluyendo el filtro de rating si está activo)
   */
  private static async getRatingCounts(
    baseQuery: MongoQuery,
    options: FilterCountsOptions
  ): Promise<Record<string, number>> {
    const queryWithoutRatingFilter = { ...baseQuery };
    delete queryWithoutRatingFilter.rating;

    interface BucketResult {
      _id: number | string;
      count: number;
    }

    const counts = await Offer.aggregate<BucketResult>([
      { $match: queryWithoutRatingFilter },
      {
        $bucket: {
          groupBy: '$rating',
          boundaries: [1.0, 2.0, 3.0, 4.0, 5.0, 6.0],
          default: 'other',
          output: {
            count: { $sum: 1 },
          },
        },
      },
    ]);

    // Convertir a formato más legible: "1-2", "2-3", etc.
    const ratingRanges: Record<string, number> = {};
    counts.forEach((item) => {
      if (item._id !== 'other' && typeof item._id === 'number') {
        const start = item._id;
        const end = start + 1;
        const key = `${start}-${end}`;
        ratingRanges[key] = item.count;
      }
    });

    return ratingRanges;
  }
}