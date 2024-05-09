import { mergeProps } from "@zag-js/core"
import * as popover from "@zag-js/popover"
import * as presence from "@zag-js/presence"
import type { Alpine, PluginCallback } from "alpinejs"
import {
  createBind,
  createComponent,
  getApi,
  handleComponentPart
} from "src/utils/create-component"
import { type CleanupFn, markRaw } from "src/utils/reactivity"

export const plugin: PluginCallback = (Alpine) => {
  Alpine.directive("popover", (el, directive, { evaluate, cleanup }) => {
    switch (directive.value) {
      case "trigger":
        return handleComponentPart(el, Alpine, "popover", "triggerProps")
      case "positioner":
        return handlePositioner(el, Alpine, cleanup)
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

const handlePositioner = (el: HTMLElement, Alpine: Alpine, cleanup: CleanupFn) => {
  Alpine.bind(el, {
    "x-data"() {
      const ctx = this as any
      const context = Alpine.reactive({
        get present() {
          return ctx.$popover.open
        }
      })
      return createComponent(
        Alpine,
        cleanup,
        "popover_presence",
        context,
        () => presence.machine({ ...Alpine.raw(context) }),
        presence.connect
      )
    }
  })

  handleComponentPart(el, Alpine, "popover", "positionerProps")
}

const handleContent = (el: HTMLElement, Alpine: Alpine) => {
  Alpine.bind(el, {
    "x-init"() {
      const ctx = this as any
      ctx._popover_presence_api.value.setNode(el)
    },
    "x-data"() {
      return {
        get _popoverContentProps() {
          const ctx = this as any
          const presence = ctx._popover_presence_api
          const localProps = ctx.$popover.contentProps
          const presenceProps = {
            hidden: !presence.value.present
          }
          return markRaw(mergeProps(localProps, presenceProps))
        }
      }
    }
  })

  const contentProps = (Alpine.$data(el) as any)._popoverContentProps
  Alpine.bind(
    el,
    createBind(contentProps, (ctx) => ctx._popoverContentProps)
  )
}
