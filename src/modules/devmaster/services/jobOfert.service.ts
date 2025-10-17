import { Offer } from '../models/offer.model';
import { getRangeRegex } from '../utils/nameRangeHelper';
import { validateAndNormalizeCity } from '../utils/cityHelper';
import { validateAndNormalizeCategory } from '../utils/categoryHelper';
import { SortCriteria, DEFAULT_SORT_CONFIG } from '../utils/queryParams.types';

function normalizeNumber(num?: string | number | null): number {
  if (!num) return 0;
  const parsed = Number(String(num).replace(/\D/g, ''));
  return isNaN(parsed) ? 0 : parsed;
}

export const getAllOffers = async () => {
  return await Offer.find().sort({ createdAt: -1 }).lean().exec();
};

export const getOfferById = async (id: string) => {
  return await Offer.findById(id).lean().exec();
};

export const getOffersFiltered = async (options?: {
  ranges?: string[];
  city?: string;
  categories?: string[];
  search?: string;
  sortBy?: SortCriteria;
  limit?: number;
  skip?: number;
}) => {

  const allOffers = await Offer.find().lean().exec();

  if (allOffers.length === 0) {
    return { count: 0, data: [] };
  }

  let filteredOffers = [...allOffers];

  // === FILTROS ===

  // Filtro por rango de nombre
  if (options?.ranges && options.ranges.length > 0) {
    const regexes = options.ranges.map((r) => getRangeRegex(r)).filter((r): r is RegExp => !!r);

    filteredOffers = filteredOffers.filter((offer) =>
      regexes.some((regex) => regex.test(offer.fixerName || '')),
    );
  }

  // Filtro por ciudad
  if (options?.city) {
    const normalizedCity = validateAndNormalizeCity(options.city);
    filteredOffers = filteredOffers.filter((o) => o.city === normalizedCity);
  }

  // Filtro por categorías
  if (options?.categories && options.categories.length > 0) {
    const normalizedCategories = options.categories
      .map((c) => validateAndNormalizeCategory(c))
      .filter(Boolean);
    filteredOffers = filteredOffers.filter((o) => normalizedCategories.includes(o.category));
  }

  // Filtro de búsqueda
  if (options?.search && options.search.trim()) {
    const searchText = options.search.trim().toLowerCase();
    filteredOffers = filteredOffers.filter((o) => {
      const fixer = (o.fixerName || '').toLowerCase();
      const title = (o.title || '').toLowerCase();
      const desc = (o.description || '').toLowerCase();
      const cat = (o.category || '').toLowerCase();
      const city = (o.city || '').toLowerCase();
      return (
        fixer.includes(searchText) ||
        title.includes(searchText) ||
        desc.includes(searchText) ||
        cat.includes(searchText) ||
        city.includes(searchText)
      );
    });
  }

  // === ORDENAMIENTO ===
  const sortBy = options?.sortBy || DEFAULT_SORT_CONFIG.sortBy;

  filteredOffers = filteredOffers.map((o) => ({
    ...o,
    fixerName: o.fixerName || '',
    createdAt: o.createdAt ? new Date(o.createdAt) : new Date(0),
    rating: o.rating ?? 0,
    contactPhone: o.contactPhone || '',
  }));

  filteredOffers.sort((a, b) => {
    switch (sortBy) {
      case SortCriteria.DATE_RECENT:
        return b.createdAt.getTime() - a.createdAt.getTime();
      case SortCriteria.DATE_OLDEST:
        return a.createdAt.getTime() - b.createdAt.getTime();
      case SortCriteria.NAME_ASC:
        return a.fixerName.localeCompare(b.fixerName, 'es');
      case SortCriteria.NAME_DESC:
        return b.fixerName.localeCompare(a.fixerName, 'es');
      case SortCriteria.RATING:
        return b.rating - a.rating;
      case SortCriteria.CONTACT_ASC:
        return normalizeNumber(a.contactPhone) - normalizeNumber(b.contactPhone);
      case SortCriteria.CONTACT_DESC:
        return normalizeNumber(b.contactPhone) - normalizeNumber(a.contactPhone);
      default:
        return 0;
    }
  });

  // === PAGINACIÓN ===
  const hasFilters =
    (options?.search && options.search.trim()) ||
    (options?.city && options.city.trim()) ||
    (options?.categories && options.categories.length > 0) ||
    (options?.ranges && options.ranges.length > 0);

  let paginatedOffers = filteredOffers;

  if (!hasFilters) {
    const limit = options?.limit || 10;
    const skip = options?.skip || 0;
    paginatedOffers = filteredOffers.slice(skip, skip + limit);
  }

  return {
    count: filteredOffers.length,
    data: paginatedOffers,
  };
};
