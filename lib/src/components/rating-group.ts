import * as ratingGroup from "@zag-js/rating-group"
import type { Alpine, PluginCallback } from "alpinejs"
import type { PropTypes } from "src/integration/normalize-props"
import { createComponent, getApi, handleComponentPart } from "src/utils/create-component"
import type { CleanupFn } from "src/utils/reactivity"

export const plugin: PluginCallback = (Alpine) => {
  Alpine.directive("rating-group", (el, directive, { evaluate, cleanup }) => {
    switch (directive.value) {
      case "label":
        return handleComponentPart(el, Alpine, "rating_group", "labelProps")
      case "control":
        return handleComponentPart(el, Alpine, "rating_group", "controlProps")
      case "item":
        return handleComponentPart(
          el,
          Alpine,
          "rating_group",
          "getItemProps",
          evaluate(directive.expression)
        )
      case "hidden-input":
        return handleComponentPart(el, Alpine, "rating_group", "hiddenInputProps")
      default:
        return handleRoot(el, Alpine, cleanup, evaluate(directive.expression || "{}"))
    }
  }).before("bind")

  Alpine.magic("ratingGroup", (el) => {
    return getApi<ratingGroup.Api<PropTypes>>(el, Alpine, "rating_group")
  })
}

const handleRoot = (el: HTMLElement, Alpine: Alpine, cleanup: CleanupFn, props: any) => {
  Alpine.bind(el, {
    "x-id"() {
      return ["z-rating-group"]
    },
    "x-data"() {
      return createComponent(
        Alpine,
        cleanup,
        "rating_group",
        props,
        ({ $id, $dispatch }) =>
          ratingGroup.machine({
            id: $id("z-rating-group"),
            ...Alpine.raw(props),
            onValueChange: (details) => {
              $dispatch("z-value-change", details)
            },
            onHoverChange: (details) => {
              $dispatch("z-hover-change", details)
            }
          }),
        ratingGroup.connect
      )
    }
  })

  handleComponentPart(el, Alpine, "rating_group", "rootProps")
}
