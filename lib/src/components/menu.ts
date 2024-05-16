import * as menu from "@zag-js/menu"
import type { Alpine, PluginCallback } from "alpinejs"
import {
  createBind,
  createComponent,
  getApi,
  handleComponentPart
} from "src/utils/create-component"
import { createPresence, handlePresencePart, mergePresenceProps } from "src/utils/create-presence"
import { type CleanupFn, markRaw } from "src/utils/reactivity"

export const plugin: PluginCallback = (Alpine) => {
  Alpine.directive("menu", (el, directive, { evaluate, cleanup }) => {
    const param = evaluate(directive.expression || "{}")
    switch (directive.value) {
      case "trigger":
        return handleComponentPart(el, Alpine, "menu", "triggerProps")
      case "context-trigger":
        return handleComponentPart(el, Alpine, "menu", "contextTriggerProps")
      case "indicator":
        return handleComponentPart(el, Alpine, "menu", "indicatorProps")
      case "positioner":
        return handleComponentPart(el, Alpine, "menu", "positionerProps")
      case "content":
        return handleContent(el, Alpine)
      case "separator":
        return handleComponentPart(el, Alpine, "menu", "separatorProps")
      case "arrow":
        return handleComponentPart(el, Alpine, "menu", "arrowProps")
      case "arrow-tip":
        return handleComponentPart(el, Alpine, "menu", "arrowTipProps")
      case "item":
        return handleComponentPart(el, Alpine, "menu", "getItemProps", param)
      case "option-item":
        return handleComponentPart(el, Alpine, "menu", "getOptionItemProps", param)
      case "trigger-item":
        return handleTriggerItem(el, Alpine)
      case "item-indicator":
        return handleComponentPart(el, Alpine, "menu", "getItemIndicatorProps", param)
      case "item-text":
        return handleComponentPart(el, Alpine, "menu", "getItemTextProps", param)
      case "item-group":
        return handleComponentPart(el, Alpine, "menu", "getItemGroupProps", param)
      case "item-group-label":
        return handleComponentPart(el, Alpine, "menu", "getItemGroupLabelProps", param)
      default:
        return handleRoot(el, Alpine, cleanup, param)
    }
  }).before("bind")

  Alpine.magic("menu", (el) => {
    return getApi<menu.Api>(el, Alpine, "menu")
  })
}

const handleRoot = (el: HTMLElement, Alpine: Alpine, cleanup: CleanupFn, props: any) => {
  Alpine.bind(el, {
    "x-id"() {
      return ["z-menu"]
    },
    "x-init"() {
      const ctx = this as any
      Alpine.nextTick(() => {
        ctx.parent = getParentMenu(el, Alpine)
        if (ctx.parent) {
          ctx.parent._menu_api.value.setChild(ctx._menu_machine)
          ctx._menu_api.value.setParent(ctx.parent._menu_machine)
        }
      })
    },
    "x-data"() {
      const component = { parent: null } as any

      const { init: initMenu, ...menuContext } = createComponent(
        Alpine,
        cleanup,
        "menu",
        props,
        ({ $id, $dispatch }) =>
          menu.machine({
            id: $id("z-menu"),
            ...Alpine.raw(props),
            onOpenChange: (details) => {
              $dispatch("z-open-change", details)
            },
            onSelect: (details) => {
              $dispatch("z-select", details)
            },
            onHighlightChange: (details) => {
              $dispatch("z-highlight-change", details)
            },
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
        menu.connect
      )

      const { init: initPresence, ...presenceContext } = createPresence(
        Alpine,
        cleanup,
        component,
        "menu"
      )

      Object.assign(component, menuContext, presenceContext)
      component.init = () => {
        initMenu.bind(component)()
        initPresence.bind(component)()
      }
      mergePresenceProps(component, "menu", "contentProps")
      Object.defineProperty(component, "triggerItemProps", {
        get: () => {
          if (!component.parent) return markRaw({})
          return markRaw(
            component.parent._menu_api.value.getTriggerItemProps(component._menu_api.value)
          )
        }
      })
      return component
    }
  })

  handleComponentPart(el, Alpine, "menu", "rootProps")
}

const handleContent = (el: HTMLElement, Alpine: Alpine) => {
  Alpine.bind(el, {
    "x-init"() {
      const ctx = this as any
      ctx._menu_presence_api.value.setNode(el)
    }
  })

  handlePresencePart(el, Alpine, "menu", "contentProps")
}

type MenuComponent = {
  _menu_machine: any
  _menu_api: menu.Api
}

const getParentMenu = (el: HTMLElement, Alpine: Alpine) => {
  let parent: MenuComponent | null = null
  const parentElement = el.parentElement
  if (parentElement) {
    const datastacks = Alpine.closestDataStack(el.parentElement)
    for (const datastack of datastacks) {
      if (datastack._menu_api != null) {
        parent = datastack as MenuComponent
        break
      }
    }
  }
  return parent
}

const handleTriggerItem = (el: HTMLElement, Alpine: Alpine) => {
  Alpine.nextTick(() => {
    const triggerItemProps = (Alpine.$data(el) as any).triggerItemProps
    Alpine.bind(
      el,
      createBind(triggerItemProps, (ctx) => ctx.triggerItemProps)
    )
  })
}
