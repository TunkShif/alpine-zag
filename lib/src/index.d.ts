import type { PluginCallback, AlpineComponent } from "alpinejs"
import Alpine from "alpinejs"

declare const zag: PluginCallback

declare const createComponent =
  <T = unknown>(connect: unknown, machine: unknown) =>
  (initialContext?: unknown) =>
    AlpineComponent<T>

export { zag, createComponent }
