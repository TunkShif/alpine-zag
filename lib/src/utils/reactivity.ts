import type { Alpine } from "alpinejs"

declare module "alpinejs" {
  interface Alpine {
    watch<T>(getter: () => T, watcher: (value: T, prev: T) => void): () => void
  }
}

export type Ref<T> = { value: T }

export type CleanupFn = (cleanup: () => void) => void

// this is taken from @vue/reactivity's internal implementation
// kind of a hacky way to imeplement a shallow ref
export const markRaw = <T>(value: T) => {
  if (Object.isExtensible(value)) {
    Object.defineProperty(value, "__v_skip", { configurable: true, enumerable: false, value: true })
  }
  return value
}

export const computedRef = <V>(Alpine: Alpine, cleanup: CleanupFn, getter: () => V): Ref<V> => {
  const ref = Alpine.reactive({ value: getter() })
  const unwatch = Alpine.watch(getter, (value) => {
    ref.value = value
  })
  cleanup(() => unwatch())
  return ref
}

export const computedShallowRef = <V>(
  Alpine: Alpine,
  cleanup: CleanupFn,
  getter: () => V
): Ref<V> => {
  return computedRef(Alpine, cleanup, () => markRaw(getter()))
}
