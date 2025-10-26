import { SortCriteria, DEFAULT_SORT_CONFIG } from '../../types/sort.types';

type SortableOffer = {
  fixerName?: string;
  createdAt?: Date | string | number;
  rating?: number | null;
  contactPhone?: string | number;
  [key: string]: unknown;
};

function normalizeNumber(num?: string | number | null): number {
  if (!num) return 0;
  const parsed = Number(String(num).replace(/\D/g, ''));
  return isNaN(parsed) ? 0 : parsed;
}

export function sortOffers<T extends SortableOffer>(
  offers: T[],
  sortBy?: string | SortCriteria,
): T[] {
  const criteria = sortBy || DEFAULT_SORT_CONFIG.sortBy;

  const normalized = offers.map((o) => ({
    ...o,
    fixerName: o.fixerName || '',
    createdAt: o.createdAt ? new Date(o.createdAt) : new Date(0),
    rating: o.rating ?? 0,
    contactPhone: o.contactPhone || '',
  }));

  normalized.sort((a, b) => {
    switch (criteria) {
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

  return normalized;
}
