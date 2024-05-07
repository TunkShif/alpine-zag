import * as hoverCard from "@zag-js/hover-card"
import type { Alpine, PluginCallback } from "alpinejs"
import type { PropTypes } from "src/integration/normalize-props"
import { createComponent, getApi, handleComponentPart } from "src/utils/create-component"
import type { CleanupFn } from "src/utils/reactivity"

export const plugin: PluginCallback = (Alpine) => {
  Alpine.directive("hover-card", (el, directive, { evaluate, cleanup }) => {
    switch (directive.value) {
      case "trigger":
        return handleComponentPart(el, Alpine, "hover_card", "triggerProps")
      case "positioner":
        return handleComponentPart(el, Alpine, "hover_card", "positionerProps")
      case "content":
        return handleComponentPart(el, Alpine, "hover_card", "contentProps")
      case "arrow":
        return handleComponentPart(el, Alpine, "hover_card", "arrowProps")
      case "arrow-tip":
        return handleComponentPart(el, Alpine, "hover_card", "arrowTipProps")
      default:
        return handleRoot(el, Alpine, cleanup, evaluate(directive.expression || "{}"))
    }
  }).before("bind")

  Alpine.magic("hoverCard", (el) => {
    return getApi<hoverCard.Api<PropTypes>>(el, Alpine, "hover_card")
  })
}

const handleRoot = (el: HTMLElement, Alpine: Alpine, cleanup: CleanupFn, props: any) => {
  Alpine.bind(el, {
    "x-id"() {
      return ["z-hover-card"]
    },
    "x-data"() {
      return createComponent(
        Alpine,
        cleanup,
        "hover_card",
        props,
        ({ $id, $dispatch }) =>
          hoverCard.machine({
            id: $id("z-hover-card"),
            ...Alpine.raw(props),
            onOpenChange: (details) => {
              $dispatch("z-open-change", details)
            }
          }),
        hoverCard.connect
      )
    },
    ":data-scope"() {
      return "hover-card"
    },
    ":data-part"() {
      return "root"
    }
  })
}
