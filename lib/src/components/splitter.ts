import * as splitter from "@zag-js/splitter"
import type { Alpine, PluginCallback } from "alpinejs"
import { createComponent, getApi, handleComponentPart } from "src/utils/create-component"
import type { CleanupFn } from "src/utils/reactivity"

export const plugin: PluginCallback = (Alpine) => {
  Alpine.directive("splitter", (el, directive, { evaluate, cleanup }) => {
    switch (directive.value) {
      case "panel":
        return handleComponentPart(el, Alpine, "splitter", "getPanelProps", {
          id: evaluate(directive.expression)
        })
      case "resize-trigger":
        return handleComponentPart(el, Alpine, "splitter", "getResizeTriggerProps", {
          id: evaluate(directive.expression)
        })
      default:
        return handleRoot(el, Alpine, cleanup, evaluate(directive.expression || "{}"))
    }
  }).before("bind")

  Alpine.magic("splitter", (el) => {
    return getApi<splitter.Api>(el, Alpine, "splitter")
  })
}

const handleRoot = (el: HTMLElement, Alpine: Alpine, cleanup: CleanupFn, props: any) => {
  Alpine.bind(el, {
    "x-id"() {
      return ["z-splitter"]
    },
    "x-data"() {
      return createComponent(
        Alpine,
        cleanup,
        "splitter",
        props,
        ({ $id, $dispatch }) =>
          splitter.machine({
            id: $id("z-splitter"),
            ...Alpine.raw(props),
            onSizeChange: (details) => {
              $dispatch("z-size-change", details)
            },
            onSizeChangeEnd: (details) => {
              $dispatch("z-size-change-end", details)
            }
          }),
        splitter.connect
      )
    }
  })

  handleComponentPart(el, Alpine, "splitter", "rootProps")
}
