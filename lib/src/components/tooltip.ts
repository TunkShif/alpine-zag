import * as tooltip from "@zag-js/tooltip"
import type { Alpine, PluginCallback } from "alpinejs"
import { createComponent, getApi, handleComponentPart } from "src/utils/create-component"
import { createPresence, handlePresencePart, mergePresenceProps } from "src/utils/create-presence"
import type { CleanupFn } from "src/utils/reactivity"

export const plugin: PluginCallback = (Alpine) => {
  Alpine.directive("tooltip", (el, directive, { evaluate, cleanup }) => {
    switch (directive.value) {
      case "trigger":
        return handleComponentPart(el, Alpine, "tooltip", "triggerProps")
      case "positioner":
        return handleComponentPart(el, Alpine, "tooltip", "positionerProps")
      case "content":
        return handleContent(el, Alpine)
      case "arrow":
        return handleComponentPart(el, Alpine, "tooltip", "arrowProps")
      case "arrow-tip":
        return handleComponentPart(el, Alpine, "tooltip", "arrowTipProps")
      default:
        return handleRoot(el, Alpine, cleanup, evaluate(directive.expression || "{}"))
    }
  }).before("bind")

  Alpine.magic("tooltip", (el) => {
    return getApi<tooltip.Api>(el, Alpine, "tooltip")
  })
}

const handleRoot = (el: HTMLElement, Alpine: Alpine, cleanup: CleanupFn, props: any) => {
  Alpine.bind(el, {
    "x-id"() {
      return ["z-tooltip"]
    },
    "x-data"() {
      const component = {} as any
      const { init: initTooltip, ...tooltipContext } = createComponent(
        Alpine,
        cleanup,
        "tooltip",
        props,
        ({ $id, $dispatch }) =>
          tooltip.machine({
            id: $id("z-tooltip"),
            ...Alpine.raw(props),
            onOpenChange: (details) => {
              $dispatch("z-open-change", details)
            }
          }),
        tooltip.connect,
        (props) => ({ value: props.open ? "open" : "closed" })
      )

      const { init: initPresence, ...presenceContext } = createPresence(
        Alpine,
        cleanup,
        component,
        "tooltip"
      )

      Object.assign(component, tooltipContext, presenceContext)
      component.init = () => {
        initTooltip.bind(component)()
        initPresence.bind(component)()
      }
      mergePresenceProps(component, "tooltip", "contentProps")
      return component
    },
    ":data-scope"() {
      return "tooltip"
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
      ctx._tooltip_presence_api.value.setNode(el)
    }
  })

  handlePresencePart(el, Alpine, "tooltip", "contentProps")
}
