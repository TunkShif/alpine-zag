import * as slider from "@zag-js/slider"
import type { Alpine, PluginCallback } from "alpinejs"
import { createComponent, getApi, handleComponentPart } from "src/utils/create-component"
import type { CleanupFn } from "src/utils/reactivity"

export const plugin: PluginCallback = (Alpine) => {
  Alpine.directive("slider", (el, directive, { evaluate, cleanup }) => {
    switch (directive.value) {
      case "control":
        return handleComponentPart(el, Alpine, "slider", "controlProps")
      case "label":
        return handleComponentPart(el, Alpine, "slider", "labelProps")
      case "value-text":
        return handleComponentPart(el, Alpine, "slider", "valueTextProps")
      case "track":
        return handleComponentPart(el, Alpine, "slider", "trackProps")
      case "range":
        return handleComponentPart(el, Alpine, "slider", "rangeProps")
      case "thumb":
        return handleComponentPart(el, Alpine, "slider", "getThumbProps", {
          index: evaluate(directive.expression)
        })
      case "hidden-input":
        return handleComponentPart(el, Alpine, "slider", "getHiddenInputProps", {
          index: evaluate(directive.expression)
        })
      default:
        return handleRoot(el, Alpine, cleanup, evaluate(directive.expression || "{}"))
    }
  }).before("bind")

  Alpine.magic("slider", (el) => {
    return getApi<slider.Api>(el, Alpine, "slider")
  })
}

const handleRoot = (el: HTMLElement, Alpine: Alpine, cleanup: CleanupFn, props: any) => {
  Alpine.bind(el, {
    "x-id"() {
      return ["z-slider"]
    },
    "x-data"() {
      return createComponent(
        Alpine,
        cleanup,
        "slider",
        props,
        ({ $id, $dispatch }) =>
          slider.machine({
            id: $id("z-slider"),
            ...Alpine.raw(props),
            onValueChange: (details) => {
              $dispatch("z-value-change", details)
            },
            onValueChangeEnd: (details) => {
              $dispatch("z-value-change-end", details)
            },
            onFocusChange: (details) => {
              $dispatch("z-focus-change", details)
            }
          }),
        slider.connect
      )
    }
  })

  handleComponentPart(el, Alpine, "slider", "rootProps")
}
