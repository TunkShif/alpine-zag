import { markRaw } from "./reactivity"
import type { Alpine } from "alpinejs"

export const useAPI = <T extends object>(Alpine: Alpine, getter: () => T) => {
  const api = Alpine.reactive({ value: markRaw(getter()) })
  let unwatch: () => void
  return {
    start() {
      unwatch = Alpine.watch(getter, (value) => {
        api.value = markRaw(value)
      })
    },
    stop() {
      unwatch()
    },
    get value() {
      return api.value
    }
  }
}
