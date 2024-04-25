import * as accordion from "@zag-js/accordion"
import type { Alpine, PluginCallback } from "alpinejs"
import { createComponent, getApi, handleComponentPart } from "src/utils/create-component"

export const plugin: PluginCallback = (Alpine) => {
  Alpine.directive("accordion", (el, directive, { evaluate }) => {
    const param = directive.value?.startsWith("item")
      ? { value: evaluate(directive.expression) }
      : evaluate(directive.expression || "{}")
    switch (directive.value) {
      case "item":
        return handleComponentPart(el, Alpine, "getItemProps", param)
      case "item-trigger":
        return handleComponentPart(el, Alpine, "getItemTriggerProps", param)
      case "item-indicator":
        return handleComponentPart(el, Alpine, "getItemIndicatorProps", param)
      case "item-content":
        return handleComponentPart(el, Alpine, "getItemContentProps", param)
      default:
        return handleRoot(el, Alpine, param)
    }
  }).before("bind")

  Alpine.magic("accordion", (el) => {
    return getApi<accordion.Api>(el, Alpine)
  })
}

const handleRoot = (el: HTMLElement, Alpine: Alpine, props: any) => {
  Alpine.bind(el, {
    "x-id"() {
      return ["z-accordion"]
    },
    "x-data"() {
      return createComponent(
        Alpine,
        props,
        ({ $id, $dispatch }) =>
          accordion.machine({
            id: $id("z-accordion"),
            ...Alpine.raw(props),
            onValueChange: (details) => {
              $dispatch("z-value-change", details)
            },
            onFocusChange: (details) => {
              $dispatch("z-focus-change", details)
            }
          }),
        accordion.connect
      )
    }
  })

  handleComponentPart(el, Alpine, "rootProps")
}
