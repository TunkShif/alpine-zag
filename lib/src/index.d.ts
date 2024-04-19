import type { AlpineComponent, PluginCallback } from "alpinejs"
import type { CollectionItem } from "@zag-js/collection"

type ComponentRegistry = [name: string, connect: unknown, machine: unknown, collection?: unknown]

interface ZagPlugin extends PluginCallback {
  register(components: ComponentRegistry[]): ZagPlugin
}

declare const zag: ZagPlugin

type CreateComponent = (
  initialContext: Record<string, unknown>,
  syncContext?: Record<string, unknown>
) => AlpineComponent<unknown>
type CreateCollection = <T extends CollectionItem>(options: CollectionOptions<T>) => Collection<T>

declare const getComponent: (name: string) => CreateComponent
declare const getCollection: (name: string) => CreateCollection

export { markRaw } from "@vue/reactivity"
export { zag, getComponent, getCollection }
