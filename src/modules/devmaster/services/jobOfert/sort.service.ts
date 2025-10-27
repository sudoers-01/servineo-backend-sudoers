import { sort, CompareFn } from '../common/sort.common';
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

  let compareFn: CompareFn<(typeof normalized)[0]>;

  switch (criteria) {
    case SortCriteria.DATE_RECENT:
      compareFn = (a, b) => b.createdAt.getTime() - a.createdAt.getTime();
      break;
    case SortCriteria.DATE_OLDEST:
      compareFn = (a, b) => a.createdAt.getTime() - b.createdAt.getTime();
      break;
    case SortCriteria.NAME_ASC:
      compareFn = (a, b) => a.fixerName.localeCompare(b.fixerName, 'es');
      break;
    case SortCriteria.NAME_DESC:
      compareFn = (a, b) => b.fixerName.localeCompare(a.fixerName, 'es');
      break;
    case SortCriteria.RATING:
      compareFn = (a, b) => b.rating - a.rating;
      break;
    case SortCriteria.CONTACT_ASC:
      compareFn = (a, b) => normalizeNumber(a.contactPhone) - normalizeNumber(b.contactPhone);
      break;
    case SortCriteria.CONTACT_DESC:
      compareFn = (a, b) => normalizeNumber(b.contactPhone) - normalizeNumber(a.contactPhone);
      break;
    default:
      compareFn = () => 0;
  }

  return sort(normalized, compareFn);
}
