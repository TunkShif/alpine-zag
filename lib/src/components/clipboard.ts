import * as clipboard from "@zag-js/clipboard"
import type { Alpine, PluginCallback } from "alpinejs"
import { createComponent, getApi, handleComponentPart } from "src/utils/create-component"
import type { CleanupFn } from "src/utils/reactivity"

export const plugin: PluginCallback = (Alpine) => {
  Alpine.directive("clipboard", (el, directive, { evaluate, cleanup }) => {
    switch (directive.value) {
      case "control":
        return handleComponentPart(el, Alpine, "clipboard", "controlProps")
      case "label":
        return handleComponentPart(el, Alpine, "clipboard", "labelProps")
      case "input":
        return handleComponentPart(el, Alpine, "clipboard", "inputProps")
      case "trigger":
        return handleComponentPart(el, Alpine, "clipboard", "triggerProps")
      default:
        return handleRoot(el, Alpine, cleanup, evaluate(directive.expression || "{}"))
    }
  }).before("bind")

  Alpine.magic("clipboard", (el) => {
    return getApi<clipboard.Api>(el, Alpine, "clipboard")
  })
}

const handleRoot = (el: HTMLElement, Alpine: Alpine, cleanup: CleanupFn, props: any) => {
  Alpine.bind(el, {
    "x-id"() {
      return ["z-clipboard"]
    },
    "x-data"() {
      return createComponent(
        Alpine,
        cleanup,
        "clipboard",
        props,
        ({ $id, $dispatch }) =>
          clipboard.machine({
            id: $id("z-clipboard"),
            ...Alpine.raw(props),
            onStatusChange: (details) => {
              $dispatch("z-status-change", details)
            }
          }),
        clipboard.connect
      )
    }
  })

  handleComponentPart(el, Alpine, "clipboard", "rootProps")
}
