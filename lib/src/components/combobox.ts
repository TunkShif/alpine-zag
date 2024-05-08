import * as combobox from "@zag-js/combobox"
import type { Alpine, PluginCallback } from "alpinejs"
import { createComponent, getApi, handleComponentPart } from "src/utils/create-component"
import { type CleanupFn, markRaw } from "src/utils/reactivity"

// TODO: warn when missing required props
// TODO: add presence composition

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
      case "positioner":
        return handleComponentPart(el, Alpine, "combobox", "positionerProps")
      case "content":
        return handleComponentPart(el, Alpine, "combobox", "contentProps")
      case "item":
        return handleComponentPart(el, Alpine, "combobox", "getItemProps", {
          item: evaluate(directive.value)
        })
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

      ctx._combobox_context.items = items
      ctx._combobox_context.itemToString = itemToString
      ctx._combobox_context.itemToValue = itemToValue

      effect(() => {
        const collection = combobox.collection({
          items: ctx._combobox_context.items.value,
          itemToString: ctx._combobox_context.itemToString,
          itemToValue: ctx._combobox_context.itemToValue
        })
        ctx._combobox_context.collection = markRaw(collection)
      })

      if (!props.value) ctx._combobox_context.value = []
    },
    "x-id"() {
      return ["z-combobox"]
    },
    "x-data"() {
      return createComponent(
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
            }
          }),
        combobox.connect
      )
    }
  })

  handleComponentPart(el, Alpine, "combobox", "rootProps")
}
