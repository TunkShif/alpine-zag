import { mergeProps } from "@zag-js/core"
import * as hoverCard from "@zag-js/hover-card"
import * as presence from "@zag-js/presence"
import type { Alpine, PluginCallback } from "alpinejs"
import type { PropTypes } from "src/integration/normalize-props"
import {
  createBind,
  createComponent,
  getApi,
  handleComponentPart
} from "src/utils/create-component"
import { type CleanupFn, markRaw } from "src/utils/reactivity"

export const plugin: PluginCallback = (Alpine) => {
  Alpine.directive("hover-card", (el, directive, { evaluate, cleanup }) => {
    switch (directive.value) {
      case "trigger":
        return handleComponentPart(el, Alpine, "hover_card", "triggerProps")
      case "positioner":
        return handlePositioner(el, Alpine, cleanup)
      case "content":
        return handleContent(el, Alpine)
      case "arrow":
        return handleComponentPart(el, Alpine, "hover_card", "arrowProps")
      case "arrow-tip":
        return handleComponentPart(el, Alpine, "hover_card", "arrowTipProps")
      default:
        return handleRoot(el, Alpine, cleanup, evaluate(directive.expression || "{}"))
    }
  }).before("bind")

  Alpine.magic("hoverCard", (el) => {
    return getApi<hoverCard.Api<PropTypes>>(el, Alpine, "hover_card")
  })
}

const handleRoot = (el: HTMLElement, Alpine: Alpine, cleanup: CleanupFn, props: any) => {
  Alpine.bind(el, {
    "x-id"() {
      return ["z-hover-card"]
    },
    "x-data"() {
      return createComponent(
        Alpine,
        cleanup,
        "hover_card",
        props,
        ({ $id, $dispatch }) =>
          hoverCard.machine({
            id: $id("z-hover-card"),
            ...Alpine.raw(props),
            onOpenChange: (details) => {
              $dispatch("z-open-change", details)
            }
          }),
        hoverCard.connect,
        (props) => ({ value: props.open ? "open" : "closed" })
      )
    },
    ":data-scope"() {
      return "hover-card"
    },
    ":data-part"() {
      return "root"
    }
  })
}

const handlePositioner = (el: HTMLElement, Alpine: Alpine, cleanup: CleanupFn) => {
  Alpine.bind(el, {
    "x-data"() {
      const ctx = this as any
      const context = Alpine.reactive({
        get present() {
          return ctx.$hoverCard.open
        }
      })
      return createComponent(
        Alpine,
        cleanup,
        "hover_card_presence",
        context,
        () => presence.machine({ ...Alpine.raw(context) }),
        presence.connect
      )
    }
  })

  handleComponentPart(el, Alpine, "hover_card", "positionerProps")
}

const handleContent = (el: HTMLElement, Alpine: Alpine) => {
  Alpine.bind(el, {
    "x-init"() {
      const ctx = this as any
      ctx._hover_card_presence_api.value.setNode(el)
    },
    "x-data"() {
      return {
        get _hoverCardContentProps() {
          const ctx = this as any
          const presence = ctx._hover_card_presence_api
          const localProps = ctx.$hoverCard.contentProps
          const presenceProps = {
            hidden: !presence.value.present
          }
          return markRaw(mergeProps(localProps, presenceProps))
        }
      }
    }
  })

  const contentProps = (Alpine.$data(el) as any)._hoverCardContentProps
  Alpine.bind(
    el,
    createBind(contentProps, (ctx) => ctx._hoverCardContentProps)
  )
}
