import * as tooltip from "@zag-js/tooltip"
import type { Alpine, PluginCallback } from "alpinejs"
import { createComponent, getApi, handleComponentPart } from "src/utils/create-component"
import type { CleanupFn } from "src/utils/reactivity"

export const plugin: PluginCallback = (Alpine) => {
  Alpine.directive("tooltip", (el, directive, { evaluate, cleanup }) => {
    switch (directive.value) {
      case "trigger":
        return handleComponentPart(el, Alpine, "tooltip", "triggerProps")
      case "positioner":
        return handleComponentPart(el, Alpine, "tooltip", "positionerProps")
      case "content":
        return handleComponentPart(el, Alpine, "tooltip", "contentProps")
      case "arrow":
        return handleComponentPart(el, Alpine, "tooltip", "arrowProps")
      default:
        return handleRoot(el, Alpine, cleanup, evaluate(directive.expression || "{}"))
    }
  }).before("bind")

  Alpine.magic("tooltip", (el) => {
    return getApi<tooltip.Api>(el, Alpine, "tooltip")
  })
}

const handleRoot = (el: HTMLElement, Alpine: Alpine, cleanup: CleanupFn, props: any) => {
  Alpine.bind(el, {
    "x-id"() {
      return ["z-tooltip"]
    },
    "x-data"() {
      return createComponent(
        Alpine,
        cleanup,
        "tooltip",
        props,
        ({ $id, $dispatch }) =>
          tooltip.machine({
            id: $id("z-tooltip"),
            ...Alpine.raw(props),
            onOpenChange: (details) => {
              $dispatch("z-open-change", details)
            }
          }),
        tooltip.connect
      )
    },
    ":data-scope"() {
      return "tooltip"
    },
    ":data-part"() {
      return "root"
    }
  })
}
