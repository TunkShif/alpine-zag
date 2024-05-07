import * as toggle from "@zag-js/switch"
import type { Alpine, PluginCallback } from "alpinejs"
import { createComponent, getApi, handleComponentPart } from "src/utils/create-component"
import type { CleanupFn } from "src/utils/reactivity"

export const plugin: PluginCallback = (Alpine) => {
  Alpine.directive("toggle", (el, directive, { evaluate, cleanup }) => {
    switch (directive.value) {
      case "control":
        return handleComponentPart(el, Alpine, "toggle", "controlProps")
      case "label":
        return handleComponentPart(el, Alpine, "toggle", "labelProps")
      case "thumb":
        return handleComponentPart(el, Alpine, "toggle", "thumbProps")
      case "hidden-input":
        return handleComponentPart(el, Alpine, "toggle", "hiddenInputProps")
      default:
        return handleRoot(el, Alpine, cleanup, evaluate(directive.expression || "{}"))
    }
  }).before("bind")

  Alpine.magic("toggle", (el) => {
    return getApi<toggle.Api>(el, Alpine, "toggle")
  })
}

const handleRoot = (el: HTMLElement, Alpine: Alpine, cleanup: CleanupFn, props: any) => {
  Alpine.bind(el, {
    "x-id"() {
      return ["z-toggle"]
    },
    "x-data"() {
      return createComponent(
        Alpine,
        cleanup,
        "toggle",
        props,
        ({ $id, $dispatch }) =>
          toggle.machine({
            id: $id("z-toggle"),
            ...Alpine.raw(props),
            onCheckedChange: (details) => {
              $dispatch("z-checked-change", details)
            }
          }),
        toggle.connect
      )
    }
  })

  handleComponentPart(el, Alpine, "toggle", "rootProps")
}
