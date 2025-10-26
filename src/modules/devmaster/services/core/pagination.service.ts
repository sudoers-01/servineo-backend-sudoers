export type PaginationOptions = {
  limit?: number;
  skip?: number;
};

export function paginateOffers<T>(offers: T[], options: PaginationOptions): T[] {
  const { limit, skip } = options;
  const start = skip ?? 0;
  const end = limit != null ? start + limit : undefined;
  return offers.slice(start, end);
}

