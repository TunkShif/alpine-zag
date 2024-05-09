import * as dialog from "@zag-js/dialog"
import type { Alpine, PluginCallback } from "alpinejs"
import { createComponent, getApi, handleComponentPart } from "src/utils/create-component"
import { createPresence, handlePresencePart, mergePresenceProps } from "src/utils/create-presence"
import type { CleanupFn } from "src/utils/reactivity"

export const plugin: PluginCallback = (Alpine) => {
  Alpine.directive("dialog", (el, directive, { evaluate, cleanup }) => {
    switch (directive.value) {
      case "trigger":
        return handleComponentPart(el, Alpine, "dialog", "triggerProps")
      case "backdrop":
        return handlePresencePart(el, Alpine, "dialog", "backdropProps")
      case "positioner":
        return handleComponentPart(el, Alpine, "dialog", "positionerProps")
      case "content":
        return handleContent(el, Alpine)
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
      const component = {} as any

      const { init: initDialog, ...dialogContext } = createComponent(
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
      const { init: initPresence, ...presenceContext } = createPresence(
        Alpine,
        cleanup,
        component,
        "dialog"
      )

      Object.assign(component, dialogContext, presenceContext)
      component.init = () => {
        initDialog.bind(component)()
        initPresence.bind(component)()
      }
      mergePresenceProps(component, "dialog", "backdropProps")
      mergePresenceProps(component, "dialog", "contentProps")
      return component
    },
    ":data-scope"() {
      return "dialog"
    },
    ":data-part"() {
      return "root"
    }
  })
}

const handleContent = (el: HTMLElement, Alpine: Alpine) => {
  Alpine.bind(el, {
    "x-init"() {
      const ctx = this as any
      ctx._dialog_presence_api.value.setNode(el)
    }
  })

  handlePresencePart(el, Alpine, "dialog", "contentProps")
}
