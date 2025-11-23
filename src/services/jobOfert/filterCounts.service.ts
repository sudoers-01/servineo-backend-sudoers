// services/jobOfert/filterCounts.service.ts
import { Offer } from '../../models/offer.model';
import { validateAndNormalizeCity } from '../../utils/cityHelper';
import { validateAndNormalizeCategory } from '../../utils/categoryHelper';
import { getRangeRegex } from '../../utils/nameRangeHelper';
import { PerformanceCount } from '../../utils/performanceCount';
import { FilterCountValidator } from '../../validators/filterCount.validator';

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

  static async getCounts(options: FilterCountsOptions = {}): Promise<FilterCounts> {
    const startTime = Date.now();

    const baseQuery: MongoQuery = this.buildBaseQuery(options);

    const [fixerCounts, cityCounts, categoryCounts, ratingCounts, total] = await Promise.all([
      this.getFixerCounts(baseQuery, options),
      this.getCityCounts(baseQuery, options),
      this.getCategoryCounts(baseQuery, options),
      this.getRatingCounts(baseQuery, options),
      PerformanceCount.measure(
        'Total Count',
        baseQuery,
        () => Offer.countDocuments(baseQuery)
      ),
    ]);

    const duration = Date.now() - startTime;
    console.log(`📊 Filter Counts completed in ${duration}ms`);

    // VALIDACIÓN: Verificar que los datos sean válidos
    const validation = FilterCountValidator.validateCounts(
      fixerCounts,
      cityCounts,
      categoryCounts,
      ratingCounts,
      total
    );

    // Loguear errores si existen
    if (!validation.isValid) {
      console.error('❌ Filter counts validation FAILED:', validation.errors);
      throw new Error(`Invalid filter counts: ${validation.errors.join(', ')}`);
    }

    // Loguear advertencias si existen
    if (validation.warnings.length > 0) {
      console.warn('⚠️  Filter counts validation warnings:', validation.warnings);
    }

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
    const queryWithoutFixerFilter = { ...baseQuery };
    delete queryWithoutFixerFilter.fixerName;

    interface AggregationResult {
      _id: string;
      count: number;
    }

    const counts = await PerformanceCount.measure(
      'Fixer Counts Aggregation',
      queryWithoutFixerFilter,
      () => {
        const aggregation = Offer.aggregate<AggregationResult>([
          { $match: queryWithoutFixerFilter },
          {
            $group: {
              _id: '$fixerName',
              count: { $sum: 1 },
            },
          },
          { $sort: { count: -1, _id: 1 } },
          { $limit: 50 },
        ]);

        // OPTIMIZACIÓN: Solo usar hint si NO hay $or o RegEx complejos
        const hasComplexQuery = queryWithoutFixerFilter.$or || 
                                (queryWithoutFixerFilter.category && 
                                 typeof queryWithoutFixerFilter.category === 'object');
        
        if (queryWithoutFixerFilter.city && !hasComplexQuery) {
          aggregation.hint('fixerName_1_city_1');
        }

        return aggregation.exec();
      }
    );

    return counts.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {} as Record<string, number>);
  }

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

    const counts = await PerformanceCount.measure(
      'City Counts Aggregation',
      queryWithoutCityFilter,
      () => {
        const aggregation = Offer.aggregate<AggregationResult>([
          { $match: queryWithoutCityFilter },
          {
            $group: {
              _id: '$city',
              count: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 } },
        ]);

        // OPTIMIZACIÓN: Solo usar hint si NO hay queries complejas
        const hasComplexQuery = queryWithoutCityFilter.$or || queryWithoutCityFilter.fixerName;
        
        if (!hasComplexQuery) {
          if (queryWithoutCityFilter.category) {
            aggregation.hint('city_1_category_1');
          } else {
            aggregation.hint('city_1');
          }
        }

        return aggregation.exec();
      }
    );

    return counts.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {} as Record<string, number>);
  }

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

    const counts = await PerformanceCount.measure(
      'Category Counts Aggregation',
      queryWithoutCategoryFilter,
      () => {
        const aggregation = Offer.aggregate<AggregationResult>([
          { $match: queryWithoutCategoryFilter },
          {
            $group: {
              _id: '$category',
              count: { $sum: 1 },
            },
          },
          { $sort: { count: -1, _id: 1 } },
        ]);

        // OPTIMIZACIÓN: Solo usar hint si NO hay queries complejas
        const hasComplexQuery = queryWithoutCategoryFilter.$or || queryWithoutCategoryFilter.fixerName;
        
        if (!hasComplexQuery) {
          if (queryWithoutCategoryFilter.city) {
            aggregation.hint('city_1_category_1');
          } else {
            aggregation.hint('category_1');
          }
        }

        return aggregation.exec();
      }
    );

    return counts.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {} as Record<string, number>);
  }

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

    const counts = await PerformanceCount.measure(
      'Rating Counts Aggregation',
      queryWithoutRatingFilter,
      () => Offer.aggregate<BucketResult>([
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
      ]).exec()
    );

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