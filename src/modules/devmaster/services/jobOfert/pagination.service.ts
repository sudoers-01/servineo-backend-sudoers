import { paginate, PaginationOptions } from '../common/pagination.common';

export function paginateOffers<T>(offers: T[], options: PaginationOptions): T[] {
  return paginate(offers, options);
}
