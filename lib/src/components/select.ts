import * as select from "@zag-js/select"
import type { Alpine, PluginCallback } from "alpinejs"
import { createComponent, getApi, handleComponentPart } from "src/utils/create-component"
import { createPresence, handlePresencePart, mergePresenceProps } from "src/utils/create-presence"
import { type CleanupFn, markRaw } from "src/utils/reactivity"

export const plugin: PluginCallback = (Alpine) => {
  Alpine.directive("select", (el, directive, { evaluate, effect, cleanup }) => {
    switch (directive.value) {
      case "label":
        return handleComponentPart(el, Alpine, "select", "labelProps")
      case "control":
        return handleComponentPart(el, Alpine, "select", "controlProps")
      case "trigger":
        return handleComponentPart(el, Alpine, "select", "triggerProps")
      case "clear-trigger":
        return handleComponentPart(el, Alpine, "select", "clearTriggerProps")
      case "indicator":
        return handleComponentPart(el, Alpine, "select", "indicatorProps")
      case "positioner":
        return handleComponentPart(el, Alpine, "select", "positionerProps")
      case "content":
        return handleContent(el, Alpine)
      case "item":
        return handleComponentPart(
          el,
          Alpine,
          "select",
          "getItemProps",
          evaluate(directive.expression)
        )
      case "item-text":
        return handleComponentPart(
          el,
          Alpine,
          "select",
          "getItemTextProps",
          evaluate(directive.expression)
        )
      case "item-indicator":
        return handleComponentPart(
          el,
          Alpine,
          "select",
          "getItemIndicatorProps",
          evaluate(directive.expression)
        )
      case "item-group":
        return handleComponentPart(
          el,
          Alpine,
          "select",
          "getItemGroupProps",
          evaluate(directive.expression)
        )
      case "item-group-label":
        return handleComponentPart(
          el,
          Alpine,
          "select",
          "getItemGroupLabelProps",
          evaluate(directive.expression)
        )
      case "hidden-select":
        return handleComponentPart(el, Alpine, "select", "hiddenSelectProps")
      default:
        return handleRoot(el, Alpine, effect, cleanup, evaluate(directive.expression || "{}"))
    }
  }).before("bind")

  Alpine.magic("select", (el) => {
    return getApi<select.Api>(el, Alpine, "select")
  })
}

const handleRoot = (
  el: HTMLElement,
  Alpine: Alpine,
  effect: any,
  cleanup: CleanupFn,
  props: any
) => {
  Alpine.bind(el, {
    "x-init"() {
      const ctx = this as any
      const items = props.items ?? { value: [] }
      const itemToString = props.itemToString ?? ((item: any) => item.label)
      const itemToValue = props.itemToValue ?? ((item: any) => item.value)
      const isItemDisabled = props.isItemDisabled ?? ((item: any) => item.disabled)

      ctx._select_context.items = items
      ctx._select_context.itemToString = itemToString
      ctx._select_context.itemToValue = itemToValue
      ctx._select_context.isItemDisabled = isItemDisabled

      effect(() => {
        const collection = select.collection({
          items: ctx._select_context.items.value,
          itemToString: ctx._select_context.itemToString,
          itemToValue: ctx._select_context.itemToValue,
          isItemDisabled: ctx._select_context.isItemDisabled
        })
        ctx._select_context.collection = markRaw(collection)
      })

      if (!props.value) ctx._select_context.value = []
    },
    "x-id"() {
      return ["z-select"]
    },
    "x-data"() {
      const component = {} as any

      const { init: initselect, ...selectContext } = createComponent(
        Alpine,
        cleanup,
        "select",
        props,
        ({ $id, $dispatch }) =>
          select.machine({
            id: $id("z-select"),
            ...Alpine.raw(props),
            onValueChange: (details) => {
              $dispatch("z-value-change", details)
            },
            onHighlightChange: (details) => {
              $dispatch("z-highlight-change", details)
            },
            onOpenChange: (details) => {
              $dispatch("z-open-change", details)
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
        select.connect
      )

      const { init: initPresence, ...presenceContext } = createPresence(
        Alpine,
        cleanup,
        component,
        "select"
      )

      Object.assign(component, selectContext, presenceContext)
      component.init = () => {
        initselect.bind(component)()
        initPresence.bind(component)()
      }
      mergePresenceProps(component, "select", "contentProps")
      return component
    }
  })

  handleComponentPart(el, Alpine, "select", "rootProps")
}

const handleContent = (el: HTMLElement, Alpine: Alpine) => {
  Alpine.bind(el, {
    "x-init"() {
      const ctx = this as any
      ctx._select_presence_api.value.setNode(el)
    }
  })

  handlePresencePart(el, Alpine, "select", "contentProps")
}
