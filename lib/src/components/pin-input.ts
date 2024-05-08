import * as pinInput from "@zag-js/pin-input"
import type { Alpine, PluginCallback } from "alpinejs"
import type { PropTypes } from "src/integration/normalize-props"
import { createComponent, getApi, handleComponentPart } from "src/utils/create-component"
import type { CleanupFn } from "src/utils/reactivity"

export const plugin: PluginCallback = (Alpine) => {
  Alpine.directive("pin-input", (el, directive, { evaluate, cleanup }) => {
    switch (directive.value) {
      case "label":
        return handleComponentPart(el, Alpine, "pin_input", "labelProps")
      case "control":
        return handleComponentPart(el, Alpine, "pin_input", "controlProps")
      case "input":
        return handleComponentPart(el, Alpine, "pin_input", "getInputProps", {
          index: evaluate(directive.expression)
        })
      case "hidden-input":
        return handleComponentPart(el, Alpine, "pin_input", "hiddenInputProps")
      default:
        return handleRoot(el, Alpine, cleanup, evaluate(directive.expression || "{}"))
    }
  }).before("bind")

  Alpine.magic("pinInput", (el) => {
    return getApi<pinInput.Api<PropTypes>>(el, Alpine, "pin_input")
  })
}

const handleRoot = (el: HTMLElement, Alpine: Alpine, cleanup: CleanupFn, props: any) => {
  Alpine.bind(el, {
    "x-id"() {
      return ["z-pin-input"]
    },
    "x-data"() {
      return createComponent(
        Alpine,
        cleanup,
        "pin_input",
        props,
        ({ $id, $dispatch }) =>
          pinInput.machine({
            id: $id("z-pin-input"),
            ...Alpine.raw(props),
            onValueComplete: (details) => {
              $dispatch("z-value-complete", details)
            },
            onValueChange: (details) => {
              $dispatch("z-value-change", details)
            },
            onValueInvalid: (details) => {
              $dispatch("z-value-invalid", details)
            }
          }),
        pinInput.connect
      )
    }
  })

  handleComponentPart(el, Alpine, "pin_input", "rootProps")
}
