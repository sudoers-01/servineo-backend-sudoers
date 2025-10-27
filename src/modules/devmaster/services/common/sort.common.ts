export type CompareFn<T> = (a: T, b: T) => number;

export function sort<T>(items: T[], compareFn: CompareFn<T>): T[] {
  return [...items].sort(compareFn);
}
