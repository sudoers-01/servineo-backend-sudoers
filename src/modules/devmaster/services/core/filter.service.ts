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
  let filtered = offers;

  // Filtro por rango de nombre
  if (options?.ranges && options.ranges.length > 0) {
    const regexes = options.ranges.map((r) => getRangeRegex(r)).filter((r): r is RegExp => !!r);
    filtered = filtered.filter((offer) =>
      regexes.some((regex) => regex.test(offer.fixerName || '')),
    );
  }

  // Filtro por ciudad
  if (options?.city) {
    const normalizedCity = validateAndNormalizeCity(options.city);
    filtered = filtered.filter((o) => o.city === normalizedCity);
  }

  // Filtro por categorías
  if (options?.categories && options.categories.length > 0) {
    const normalizedCategories = options.categories
      .map((c) => validateAndNormalizeCategory(c))
      .filter(Boolean) as Array<NonNullable<T['category']>>; // assert union type

    filtered = filtered.filter((o) => o.category && normalizedCategories.includes(o.category));
  }


  return filtered;
}
