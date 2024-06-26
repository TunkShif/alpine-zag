import * as combobox from "@zag-js/combobox"
import type { Alpine, PluginCallback } from "alpinejs"
import { createComponent, getApi, handleComponentPart } from "src/utils/create-component"
import { createPresence, handlePresencePart, mergePresenceProps } from "src/utils/create-presence"
import { type CleanupFn, markRaw } from "src/utils/reactivity"

// TODO: warn when missing required props

export const plugin: PluginCallback = (Alpine) => {
  Alpine.directive("combobox", (el, directive, { evaluate, effect, cleanup }) => {
    switch (directive.value) {
      case "label":
        return handleComponentPart(el, Alpine, "combobox", "labelProps")
      case "control":
        return handleComponentPart(el, Alpine, "combobox", "controlProps")
      case "input":
        return handleComponentPart(el, Alpine, "combobox", "inputProps")
      case "trigger":
        return handleComponentPart(el, Alpine, "combobox", "triggerProps")
      case "clear-trigger":
        return handleComponentPart(el, Alpine, "combobox", "clearTriggerProps")
      case "positioner":
        return handleComponentPart(el, Alpine, "combobox", "positionerProps")
      case "content":
        return handleContent(el, Alpine)
      case "item":
        return handleComponentPart(
          el,
          Alpine,
          "combobox",
          "getItemProps",
          evaluate(directive.expression)
        )
      case "item-text":
        return handleComponentPart(
          el,
          Alpine,
          "combobox",
          "getItemTextProps",
          evaluate(directive.expression)
        )
      case "item-indicator":
        return handleComponentPart(
          el,
          Alpine,
          "combobox",
          "getItemIndicatorProps",
          evaluate(directive.expression)
        )
      case "item-group":
        return handleComponentPart(
          el,
          Alpine,
          "combobox",
          "getItemGroupProps",
          evaluate(directive.expression)
        )
      case "item-group-label":
        return handleComponentPart(
          el,
          Alpine,
          "combobox",
          "getItemGroupLabelProps",
          evaluate(directive.expression)
        )
      default:
        return handleRoot(el, Alpine, effect, cleanup, evaluate(directive.expression || "{}"))
    }
  }).before("bind")

  Alpine.magic("combobox", (el) => {
    return getApi<combobox.Api>(el, Alpine, "combobox")
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

      ctx._combobox_context.items = items
      ctx._combobox_context.itemToString = itemToString
      ctx._combobox_context.itemToValue = itemToValue
      ctx._combobox_context.isItemDisabled = isItemDisabled

      effect(() => {
        const collection = combobox.collection({
          items: ctx._combobox_context.items.value,
          itemToString: ctx._combobox_context.itemToString,
          itemToValue: ctx._combobox_context.itemToValue,
          isItemDisabled: ctx._combobox_context.isItemDisabled
        })
        ctx._combobox_context.collection = markRaw(collection)
      })

      if (!props.value) ctx._combobox_context.value = []
    },
    "x-id"() {
      return ["z-combobox"]
    },
    "x-data"() {
      const component = {} as any

      const { init: initCombobox, ...comboboxContext } = createComponent(
        Alpine,
        cleanup,
        "combobox",
        props,
        ({ $id, $dispatch }) =>
          combobox.machine({
            id: $id("z-combobox"),
            ...Alpine.raw(props),
            onInputValueChange: (details) => {
              $dispatch("z-input-value-change", details)
            },
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
        combobox.connect
      )

      const { init: initPresence, ...presenceContext } = createPresence(
        Alpine,
        cleanup,
        component,
        "combobox"
      )

      Object.assign(component, comboboxContext, presenceContext)
      component.init = () => {
        initCombobox.bind(component)()
        initPresence.bind(component)()
      }
      mergePresenceProps(component, "combobox", "contentProps")
      return component
    }
  })

  handleComponentPart(el, Alpine, "combobox", "rootProps")
}

const handleContent = (el: HTMLElement, Alpine: Alpine) => {
  Alpine.bind(el, {
    "x-init"() {
      const ctx = this as any
      ctx._combobox_presence_api.value.setNode(el)
    }
  })

  handlePresencePart(el, Alpine, "combobox", "contentProps")
}
