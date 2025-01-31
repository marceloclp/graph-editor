export function range<T>(n: number, fn: (i: number) => T) {
  return Array.from({ length: n }, (_, i) => fn(i));
}
