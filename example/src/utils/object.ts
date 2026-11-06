export function values<T>(value: { [x: string]: T }) {
  return Object.values(value)
}

export function entries<T extends Record<any, any>>(value: T) {
  return Object.entries(value) as [keyof T, T[keyof T]][]
}
