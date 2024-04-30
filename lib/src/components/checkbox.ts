import * as checkbox from "@zag-js/checkbox"
import type { Alpine, PluginCallback } from "alpinejs"
import { createComponent, getApi, handleComponentPart } from "src/utils/create-component"
import type { CleanupFn } from "src/utils/reactivity"

export const plugin: PluginCallback = (Alpine) => {
  Alpine.directive("checkbox", (el, directive, { evaluate, cleanup }) => {
    switch (directive.value) {
      case "control":
        return handleComponentPart(el, Alpine, "checkbox", "controlProps")
      case "label":
        return handleComponentPart(el, Alpine, "checkbox", "labelProps")
      case "hidden-input":
        return handleComponentPart(el, Alpine, "checkbox", "hiddenInputProps")
      default:
        return handleRoot(el, Alpine, cleanup, evaluate(directive.expression || "{}"))
    }
  }).before("bind")

  Alpine.magic("checkbox", (el) => {
    return getApi<checkbox.Api>(el, Alpine, "checkbox")
  })
}

const handleRoot = (el: HTMLElement, Alpine: Alpine, cleanup: CleanupFn, props: any) => {
  Alpine.bind(el, {
    "x-id"() {
      return ["z-checkbox"]
    },
    "x-data"() {
      return createComponent(
        Alpine,
        cleanup,
        "checkbox",
        props,
        ({ $id, $dispatch }) =>
          checkbox.machine({
            id: $id("z-checkbox"),
            ...Alpine.raw(props),
            onCheckedChange: (details) => {
              $dispatch("z-checked-change", details)
            }
          }),
        checkbox.connect
      )
    }
  })

  handleComponentPart(el, Alpine, "checkbox", "rootProps")
}
