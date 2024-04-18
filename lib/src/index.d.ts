import type { PluginCallback } from "alpinejs"

type ComponentRegistry = [name: string, connect: unknown, machine: unknown, collection?: unknown]

interface ZagPlugin extends PluginCallback {
  register(components: ComponentRegistry[]): ZagPlugin
}

declare const zag: ZagPlugin

export { zag }
