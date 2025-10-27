export type PaginationOptions = {
  limit: number;
  skip: number;
};

export function paginate<T>(items: T[], options: PaginationOptions): T[] {
  const { limit, skip } = options;
  return items.slice(skip, skip + limit);
}
