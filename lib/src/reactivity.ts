// this is taken from @vue/reactivity's internal implementation
// kind of a hacky way to imeplement a shallow ref
export const markRaw = <T>(value: T) => {
  if (Object.isExtensible(value)) {
    Object.defineProperty(value, "__v_skip", { configurable: true, enumerable: false, value: true })
  }
  return value
}
