import * as collapsible from "@zag-js/collapsible"
import type { Alpine, PluginCallback } from "alpinejs"
import { createComponent, getApi, handleComponentPart } from "src/utils/create-component"
import type { CleanupFn } from "src/utils/reactivity"

export const plugin: PluginCallback = (Alpine) => {
  Alpine.directive("collapsible", (el, directive, { evaluate, cleanup }) => {
    switch (directive.value) {
      case "trigger":
        return handleComponentPart(el, Alpine, "collapsible", "triggerProps")
      case "content":
        return handleComponentPart(el, Alpine, "collapsible", "contentProps")
      default:
        return handleRoot(el, Alpine, cleanup, evaluate(directive.expression || "{}"))
    }
  }).before("bind")

  Alpine.magic("collapsible", (el) => {
    return getApi<collapsible.Api>(el, Alpine, "collapsible")
  })
}

const handleRoot = (el: HTMLElement, Alpine: Alpine, cleanup: CleanupFn, props: any) => {
  Alpine.bind(el, {
    "x-id"() {
      return ["z-collapsible"]
    },
    "x-data"() {
      return createComponent(
        Alpine,
        cleanup,
        "collapsible",
        props,
        ({ $id, $dispatch }) =>
          collapsible.machine({
            id: $id("z-collapsible"),
            ...Alpine.raw(props),
            onOpenChange: (details) => {
              $dispatch("z-open-change", details)
            },
            onExitComplete: () => {
              $dispatch("z-exit-complete", undefined)
            }
          }),
        collapsible.connect
      )
    }
  })

  handleComponentPart(el, Alpine, "collapsible", "rootProps")
}
