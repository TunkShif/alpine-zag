import * as popover from "@zag-js/popover"
import type { Alpine, PluginCallback } from "alpinejs"
import { createComponent, getApi, handleComponentPart } from "src/utils/create-component"
import type { CleanupFn } from "src/utils/reactivity"

export const plugin: PluginCallback = (Alpine) => {
  Alpine.directive("popover", (el, directive, { evaluate, cleanup }) => {
    switch (directive.value) {
      case "trigger":
        return handleComponentPart(el, Alpine, "popover", "triggerProps")
      case "positioner":
        return handleComponentPart(el, Alpine, "popover", "positionerprops")
      case "content":
        return handleComponentPart(el, Alpine, "popover", "contentProps")
      case "title":
        return handleComponentPart(el, Alpine, "dialog", "titleProps")
      case "description":
        return handleComponentPart(el, Alpine, "dialog", "descriptionProps")
      case "close-trigger":
        return handleComponentPart(el, Alpine, "dialog", "closeTriggerProps")
      default:
        return handleRoot(el, Alpine, cleanup, evaluate(directive.expression || "{}"))
    }
  }).before("bind")

  Alpine.magic("popover", (el) => {
    return getApi<popover.Api>(el, Alpine, "popover")
  })
}

const handleRoot = (el: HTMLElement, Alpine: Alpine, cleanup: CleanupFn, props: any) => {
  Alpine.bind(el, {
    "x-id"() {
      return ["z-popover"]
    },
    "x-data"() {
      return createComponent(
        Alpine,
        cleanup,
        "popover",
        props,
        ({ $id, $dispatch }) =>
          popover.machine({
            id: $id("z-popover"),
            ...Alpine.raw(props),
            onEscapeKeyDown: (event) => {
              $dispatch("z-escape-keydown", event.detail)
            },
            onPointerDownOutside: (event) => {
              $dispatch("z-pointer-down-outside", event.detail)
            },
            onFocusOutside: (event) => {
              $dispatch("z-focus-outside", event.detail)
            },
            onInteractOutside: (event) => {
              $dispatch("z-interact-outside", event.detail)
            }
          }),
        popover.connect
      )
    },
    ":data-scope"() {
      return "popover"
    },
    ":data-part"() {
      return "root"
    }
  })

  handleComponentPart(el, Alpine, "popover", "rootProps")
}
