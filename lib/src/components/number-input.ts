import * as numberInput from "@zag-js/number-input"
import type { Alpine, PluginCallback } from "alpinejs"
import type { PropTypes } from "src/integration/normalize-props"
import { createComponent, getApi, handleComponentPart } from "src/utils/create-component"
import type { CleanupFn } from "src/utils/reactivity"

export const plugin: PluginCallback = (Alpine) => {
  Alpine.directive("number-input", (el, directive, { evaluate, cleanup }) => {
    switch (directive.value) {
      case "label":
        return handleComponentPart(el, Alpine, "number_input", "labelProps")
      case "decrement-trigger":
        return handleComponentPart(el, Alpine, "number_input", "decrementTriggerProps")
      case "input":
        return handleComponentPart(el, Alpine, "number_input", "inputProps")
      case "increment-trigger":
        return handleComponentPart(el, Alpine, "number_input", "incrementTriggerProps")
      default:
        return handleRoot(el, Alpine, cleanup, evaluate(directive.expression || "{}"))
    }
  }).before("bind")

  Alpine.magic("numberInput", (el) => {
    return getApi<numberInput.Api<PropTypes>>(el, Alpine, "number_input")
  })
}

const handleRoot = (el: HTMLElement, Alpine: Alpine, cleanup: CleanupFn, props: any) => {
  Alpine.bind(el, {
    "x-id"() {
      return ["z-number-input"]
    },
    "x-data"() {
      return createComponent(
        Alpine,
        cleanup,
        "number_input",
        props,
        ({ $id, $dispatch }) =>
          numberInput.machine({
            id: $id("z-number-input"),
            ...Alpine.raw(props),
            onValueChange: (details) => {
              $dispatch("z-value-change", details)
            },
            onValueInvalid: (details) => {
              $dispatch("z-value-invalid", details)
            },
            onFocusChange: (details) => {
              $dispatch("z-focus-change", details)
            }
          }),
        numberInput.connect
      )
    }
  })

  handleComponentPart(el, Alpine, "number_input", "rootProps")
}
