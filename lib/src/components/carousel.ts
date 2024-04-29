import * as carousel from "@zag-js/carousel"
import type { PluginCallback } from "alpinejs"
import { createComponent, getApi, handleComponentPart } from "src/utils/create-component"
import type { CleanupFn } from "src/utils/reactivity"

export const plugin: PluginCallback = (Alpine) => {
  Alpine.directive("carousel", (el, directive, { evaluate, cleanup }) => {
    switch (directive.value) {
      case "prev-trigger":
        return handleComponentPart(el, Alpine, "carousel", "prevTriggerProps")
      case "next-trigger":
        return handleComponentPart(el, Alpine, "carousel", "nextTriggerProps")
      case "viewport":
        return handleComponentPart(el, Alpine, "carousel", "viewportProps")
      case "item-group":
        return handleComponentPart(el, Alpine, "carousel", "itemGroupProps")
      case "item":
        return handleComponentPart(el, Alpine, "carousel", "getItemProps", {
          index: evaluate(directive.expression)
        })
      default:
        return handleRoot(el, Alpine, cleanup, evaluate(directive.expression || "{}"))
    }
  })

  Alpine.magic("carousel", (el) => {
    return getApi<carousel.Api>(el, Alpine, "carousel")
  })
}

const handleRoot = (el: HTMLElement, Alpine: any, cleanup: CleanupFn, props: any) => {
  Alpine.bind(el, {
    "x-id"() {
      return ["z-carousel"]
    },
    "x-data"() {
      return createComponent(
        Alpine,
        cleanup,
        "carousel",
        props,
        ({ $id, $dispatch }) =>
          carousel.machine({
            id: $id("z-carousel"),
            ...Alpine.raw(props),
            onIndexChange: (details) => {
              $dispatch("z-index-change", details)
            }
          }),
        carousel.connect
      )
    }
  })

  handleComponentPart(el, Alpine, "carousel", "rootProps")
}
