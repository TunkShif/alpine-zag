import * as radioGroup from "@zag-js/radio-group"
import type { Alpine, PluginCallback } from "alpinejs"
import type { PropTypes } from "src/integration/normalize-props"
import { createComponent, getApi, handleComponentPart } from "src/utils/create-component"
import type { CleanupFn } from "src/utils/reactivity"

export const plugin: PluginCallback = (Alpine) => {
  Alpine.directive("radio-group", (el, directive, { evaluate, cleanup }) => {
    const param = directive.value?.startsWith("item")
      ? { value: evaluate(directive.expression) }
      : evaluate(directive.expression || "{}")
    switch (directive.value) {
      case "label":
        return handleComponentPart(el, Alpine, "radio_group", "labelProps")
      case "indicator":
        return handleComponentPart(el, Alpine, "radio_group", "indicatorProps")
      case "item":
        return handleComponentPart(el, Alpine, "radio_group", "getItemProps", param)
      case "item-text":
        return handleComponentPart(el, Alpine, "radio_group", "getItemTextProps", param)
      case "item-hidden-input":
        return handleComponentPart(el, Alpine, "radio_group", "getItemHiddenInputProps", param)
      case "item-control":
        return handleComponentPart(el, Alpine, "radio_group", "getItemControlProps", param)
      default:
        return handleRoot(el, Alpine, cleanup, param)
    }
  }).before("bind")

  Alpine.magic("radioGroup", (el) => {
    return getApi<radioGroup.Api<PropTypes>>(el, Alpine, "radio_group")
  })
}

const handleRoot = (el: HTMLElement, Alpine: Alpine, cleanup: CleanupFn, props: any) => {
  Alpine.bind(el, {
    "x-id"() {
      return ["z-radio-group"]
    },
    "x-data"() {
      return createComponent(
        Alpine,
        cleanup,
        "radio_group",
        props,
        ({ $id, $dispatch }) =>
          radioGroup.machine({
            id: $id("z-radio-group"),
            ...Alpine.raw(props),
            onValueChange: (details) => {
              $dispatch("z-value-change", details)
            }
          }),
        radioGroup.connect
      )
    }
  })

  handleComponentPart(el, Alpine, "radio_group", "rootProps")
}
