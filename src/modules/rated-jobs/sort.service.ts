import { SortCriteria, DEFAULT_SORT_CONFIG } from './sort.types';

export function getSortConfig(sortBy?: string | SortCriteria): any {
  const criteria = sortBy || DEFAULT_SORT_CONFIG;

  switch (criteria) {
    case SortCriteria.DATE_RECENT:
      return { createdAt: -1 };
    case SortCriteria.DATE_OLDEST:
      return { createdAt: 1 };
    case SortCriteria.RATING_ASC:
      return { rating: 1 };
    case SortCriteria.RATING_DESC:
      return { rating: -1 };
    default:
      return { createdAt: -1 };
  }
}
