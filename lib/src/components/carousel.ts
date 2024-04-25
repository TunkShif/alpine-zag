import * as carousel from "@zag-js/carousel"
import type { PluginCallback } from "alpinejs"
import { createComponent, getApi, handleComponentPart } from "src/utils/create-component"

export const plugin: PluginCallback = (Alpine) => {
  Alpine.directive("carousel", (el, directive, { evaluate }) => {
    switch (directive.value) {
      case "prev-trigger":
        return handleComponentPart(el, Alpine, "prevTriggerProps")
      case "next-trigger":
        return handleComponentPart(el, Alpine, "nextTriggerProps")
      case "viewport":
        return handleComponentPart(el, Alpine, "viewportProps")
      case "item-group":
        return handleComponentPart(el, Alpine, "itemGroupProps")
      case "item":
        return handleComponentPart(el, Alpine, "getItemProps", {
          index: evaluate(directive.expression)
        })
      default:
        return handleRoot(el, Alpine, evaluate(directive.expression || "{}"))
    }
  })

  Alpine.magic("carousel", (el) => {
    return getApi<carousel.Api>(el, Alpine)
  })
}

const handleRoot = (el: HTMLElement, Alpine: any, props: any) => {
  Alpine.bind(el, {
    "x-id"() {
      return ["z-carousel"]
    },
    "x-data"() {
      return createComponent(
        Alpine,
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

  handleComponentPart(el, Alpine, "rootProps")
}
