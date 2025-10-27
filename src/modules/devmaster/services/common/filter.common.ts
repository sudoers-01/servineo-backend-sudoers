export type FilterFunction<T> = (item: T) => boolean;

export function filter<T>(items: T[], filters: FilterFunction<T>[]): T[] {
  let filtered = items;

  for (const filterFn of filters) {
    filtered = filtered.filter(filterFn);
  }

  return filtered;
}
