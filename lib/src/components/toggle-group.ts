import * as toggleGroup from "@zag-js/toggle-group"
import type { Alpine, PluginCallback } from "alpinejs"
import type { PropTypes } from "src/integration/normalize-props"
import { createComponent, getApi, handleComponentPart } from "src/utils/create-component"
import type { CleanupFn } from "src/utils/reactivity"

export const plugin: PluginCallback = (Alpine) => {
  Alpine.directive("toggle-group", (el, directive, { evaluate, cleanup }) => {
    switch (directive.value) {
      case "item":
        return handleComponentPart(
          el,
          Alpine,
          "toggle_group",
          "getItemProps",
          evaluate(directive.expression)
        )
      default:
        return handleRoot(el, Alpine, cleanup, evaluate(directive.expression || "{}"))
    }
  }).before("bind")

  Alpine.magic("toggleGroup", (el) => {
    return getApi<toggleGroup.Api<PropTypes>>(el, Alpine, "toggle_group")
  })
}

const handleRoot = (el: HTMLElement, Alpine: Alpine, cleanup: CleanupFn, props: any) => {
  Alpine.bind(el, {
    "x-id"() {
      return ["z-toggle-group"]
    },
    "x-data"() {
      return createComponent(
        Alpine,
        cleanup,
        "toggle_group",
        props,
        ({ $id, $dispatch }) =>
          toggleGroup.machine({
            id: $id("z-toggle-group"),
            ...Alpine.raw(props),
            onValueChange: (details) => {
              $dispatch("z-value-change", details)
            }
          }),
        toggleGroup.connect
      )
    }
  })

  handleComponentPart(el, Alpine, "toggle_group", "rootProps")
}
