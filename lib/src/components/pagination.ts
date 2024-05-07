import * as pagination from "@zag-js/pagination"
import type { Alpine, PluginCallback } from "alpinejs"
import type { PropTypes } from "src/integration/normalize-props"
import { createComponent, getApi, handleComponentPart } from "src/utils/create-component"
import type { CleanupFn } from "src/utils/reactivity"

export const plugin: PluginCallback = (Alpine) => {
  Alpine.directive("pagination", (el, directive, { evaluate, cleanup }) => {
    switch (directive.value) {
      case "prev-trigger":
        return handleComponentPart(el, Alpine, "pagination", "prevTriggerProps")
      case "item":
        return handleComponentPart(
          el,
          Alpine,
          "pagination",
          "getItemProps",
          evaluate(directive.expression)
        )
      case "ellipsis":
        return handleComponentPart(el, Alpine, "pagination", "getEllipsisProps", {
          index: evaluate(directive.expression)
        })
      case "next-trigger":
        return handleComponentPart(el, Alpine, "pagination", "nextTriggerProps")
      default:
        return handleRoot(el, Alpine, cleanup, evaluate(directive.expression || "{}"))
    }
  }).before("bind")

  Alpine.magic("pagination", (el) => {
    return getApi<pagination.Api<PropTypes>>(el, Alpine, "pagination")
  })
}

const handleRoot = (el: HTMLElement, Alpine: Alpine, cleanup: CleanupFn, props: any) => {
  Alpine.bind(el, {
    "x-id"() {
      return ["z-pagination"]
    },
    "x-data"() {
      return createComponent(
        Alpine,
        cleanup,
        "pagination",
        props,
        ({ $id, $dispatch }) =>
          pagination.machine({
            id: $id("z-pagination"),
            ...Alpine.raw(props),
            onPageChange: (details) => {
              $dispatch("z-page-change", details)
            }
          }),
        pagination.connect
      )
    }
  })

  handleComponentPart(el, Alpine, "pagination", "rootProps")
}
