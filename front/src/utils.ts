function fold<T> (value: T | null | undefined, f: (v: T) => void): void {
  if (value) f(value);
}

export { fold }