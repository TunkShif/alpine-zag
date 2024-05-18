import * as popover from "@zag-js/popover"
import type { Alpine, PluginCallback } from "alpinejs"
import { createComponent, getApi, handleComponentPart } from "src/utils/create-component"
import { createPresence, handlePresencePart, mergePresenceProps } from "src/utils/create-presence"
import type { CleanupFn } from "src/utils/reactivity"

export const plugin: PluginCallback = (Alpine) => {
  Alpine.directive("popover", (el, directive, { evaluate, cleanup }) => {
    switch (directive.value) {
      case "trigger":
        return handleComponentPart(el, Alpine, "popover", "triggerProps")
      case "positioner":
        return handleComponentPart(el, Alpine, "popover", "positionerProps")
      case "content":
        return handleContent(el, Alpine)
      case "title":
        return handleComponentPart(el, Alpine, "popover", "titleProps")
      case "description":
        return handleComponentPart(el, Alpine, "popover", "descriptionProps")
      case "close-trigger":
        return handleComponentPart(el, Alpine, "popover", "closeTriggerProps")
      case "arrow":
        return handleComponentPart(el, Alpine, "popover", "arrowProps")
      case "arrow-tip":
        return handleComponentPart(el, Alpine, "popover", "arrowTipProps")
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
      const component = {} as any

      const { init: initPopover, ...popoverContext } = createComponent(
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
        popover.connect,
        (props) => ({ value: props.open ? "open" : "closed" })
      )

      const { init: initPresence, ...presenceContext } = createPresence(
        Alpine,
        cleanup,
        component,
        "popover"
      )

      Object.assign(component, popoverContext, presenceContext)
      component.init = () => {
        initPopover.bind(component)()
        initPresence.bind(component)()
      }
      mergePresenceProps(component, "popover", "contentProps")
      return component
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

const handleContent = (el: HTMLElement, Alpine: Alpine) => {
  Alpine.bind(el, {
    "x-init"() {
      const ctx = this as any
      ctx._popover_presence_api.value.setNode(el)
    }
  })

  handlePresencePart(el, Alpine, "popover", "contentProps")
}
