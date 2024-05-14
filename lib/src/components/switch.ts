import * as switches from "@zag-js/switch"
import type { Alpine, PluginCallback } from "alpinejs"
import { createComponent, getApi, handleComponentPart } from "src/utils/create-component"
import type { CleanupFn } from "src/utils/reactivity"

export const plugin: PluginCallback = (Alpine) => {
  Alpine.directive("switch", (el, directive, { evaluate, cleanup }) => {
    switch (directive.value) {
      case "control":
        return handleComponentPart(el, Alpine, "switch", "controlProps")
      case "label":
        return handleComponentPart(el, Alpine, "switch", "labelProps")
      case "thumb":
        return handleComponentPart(el, Alpine, "switch", "thumbProps")
      case "hidden-input":
        return handleComponentPart(el, Alpine, "switch", "hiddenInputProps")
      default:
        return handleRoot(el, Alpine, cleanup, evaluate(directive.expression || "{}"))
    }
  }).before("bind")

  Alpine.magic("switch", (el) => {
    return getApi<switches.Api>(el, Alpine, "switch")
  })
}

const handleRoot = (el: HTMLElement, Alpine: Alpine, cleanup: CleanupFn, props: any) => {
  Alpine.bind(el, {
    "x-id"() {
      return ["z-switch"]
    },
    "x-data"() {
      return createComponent(
        Alpine,
        cleanup,
        "switch",
        props,
        ({ $id, $dispatch }) =>
          switches.machine({
            id: $id("z-switch"),
            ...Alpine.raw(props),
            onCheckedChange: (details) => {
              $dispatch("z-checked-change", details)
            }
          }),
        switches.connect
      )
    }
  })

  handleComponentPart(el, Alpine, "switch", "rootProps")
}
