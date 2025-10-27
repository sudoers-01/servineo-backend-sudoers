import { filter, FilterFunction } from '../common/filter.common';
import { getRangeRegex } from '../../utils/nameRangeHelper';
import { validateAndNormalizeCity } from '../../utils/cityHelper';
import { validateAndNormalizeCategory } from '../../utils/categoryHelper';

type FilterableOffer = {
  fixerName?: string;
  city?: string;
  category?: string;
  [key: string]: unknown;
};

export type FilterOptions = {
  ranges?: string[];
  city?: string;
  categories?: string[];
};

export function filterOffers<T extends FilterableOffer>(offers: T[], options?: FilterOptions): T[] {
  if (!options) return offers;

  const filters: FilterFunction<T>[] = [];

  if (options.ranges && options.ranges.length > 0) {
    const regexes = options.ranges.map((r) => getRangeRegex(r)).filter((r): r is RegExp => !!r);
    filters.push((offer) => regexes.some((regex) => regex.test(offer.fixerName || '')));
  }

  if (options.city) {
    const normalizedCity = validateAndNormalizeCity(options.city);
    filters.push((offer) => offer.city === normalizedCity);
  }

  if (options.categories && options.categories.length > 0) {
    const normalizedCategories = options.categories
      .map((c) => validateAndNormalizeCategory(c))
      .filter(Boolean) as Array<NonNullable<T['category']>>; // assert union type

    filters.push(
      (offer) => offer.category != null && normalizedCategories.includes(offer.category),
    );
  }


  return filter(offers, filters);
}
