import * as dialog from "@zag-js/dialog"
import type { Alpine, PluginCallback } from "alpinejs"
import { createComponent, getApi, handleComponentPart } from "src/utils/create-component"
import type { CleanupFn } from "src/utils/reactivity"

// TODO: add presence composition

export const plugin: PluginCallback = (Alpine) => {
  Alpine.directive("dialog", (el, directive, { evaluate, cleanup }) => {
    switch (directive.value) {
      case "trigger":
        return handleComponentPart(el, Alpine, "dialog", "triggerProps")
      case "backdrop":
        return handleComponentPart(el, Alpine, "dialog", "backdropProps")
      case "positioner":
        return handleComponentPart(el, Alpine, "dialog", "positionerProps")
      case "content":
        return handleComponentPart(el, Alpine, "dialog", "contentProps")
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

  Alpine.magic("dialog", (el) => {
    return getApi<dialog.Api>(el, Alpine, "dialog")
  })
}

const handleRoot = (el: HTMLElement, Alpine: Alpine, cleanup: CleanupFn, props: any) => {
  Alpine.bind(el, {
    "x-id"() {
      return ["z-dialog"]
    },
    "x-data"() {
      return createComponent(
        Alpine,
        cleanup,
        "dialog",
        props,
        ({ $id, $dispatch }) =>
          dialog.machine({
            id: $id("z-dialog"),
            ...Alpine.raw(props),
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
        dialog.connect
      )
    },
    ":data-scope"() {
      return "dialog"
    },
    ":data-part"() {
      return "root"
    }
  })
}
