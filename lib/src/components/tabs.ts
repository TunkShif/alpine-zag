import * as tabs from "@zag-js/tabs"
import type { Alpine, PluginCallback } from "alpinejs"
import { createComponent, getApi, handleComponentPart } from "src/utils/create-component"
import type { CleanupFn } from "src/utils/reactivity"

export const plugin: PluginCallback = (Alpine) => {
  Alpine.directive("tabs", (el, directive, { evaluate, cleanup }) => {
    switch (directive.value) {
      case "list":
        return handleComponentPart(el, Alpine, "tabs", "listProps")
      case "trigger":
        return handleComponentPart(
          el,
          Alpine,
          "tabs",
          "getTriggerProps",
          evaluate(directive.expression)
        )
      case "content":
        return handleComponentPart(
          el,
          Alpine,
          "tabs",
          "getContentProps",
          evaluate(directive.expression)
        )
      case "indicator":
        return handleComponentPart(el, Alpine, "tabs", "indicatorProps")
      default:
        return handleRoot(el, Alpine, cleanup, evaluate(directive.expression || "{}"))
    }
  }).before("bind")

  Alpine.magic("tabs", (el) => {
    return getApi<tabs.Api>(el, Alpine, "tabs")
  })
}

const handleRoot = (el: HTMLElement, Alpine: Alpine, cleanup: CleanupFn, props: any) => {
  Alpine.bind(el, {
    "x-id"() {
      return ["z-tabs"]
    },
    "x-data"() {
      return createComponent(
        Alpine,
        cleanup,
        "tabs",
        props,
        ({ $id, $dispatch }) =>
          tabs.machine({
            id: $id("z-tabs"),
            ...Alpine.raw(props),
            onValueChange: (details) => {
              $dispatch("z-value-change", details)
            },
            onFocusChange: (details) => {
              $dispatch("z-focus-change", details)
            }
          }),
        tabs.connect
      )
    }
  })

  handleComponentPart(el, Alpine, "tabs", "rootProps")
}
