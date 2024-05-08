import * as accordion from "@zag-js/accordion"
import * as collapsible from "@zag-js/collapsible"
import { mergeProps } from "@zag-js/core"
import type { Alpine, PluginCallback } from "alpinejs"
import {
  createBind,
  createComponent,
  getApi,
  handleComponentPart
} from "src/utils/create-component"
import { type CleanupFn, computedShallowRef, markRaw } from "src/utils/reactivity"

export const plugin: PluginCallback = (Alpine) => {
  Alpine.directive("accordion", (el, directive, { evaluate, cleanup }) => {
    const param = directive.value?.startsWith("item")
      ? { value: evaluate(directive.expression) }
      : evaluate(directive.expression || "{}")
    switch (directive.value) {
      case "item":
        return handleItem(el, Alpine, cleanup, param)
      case "item-trigger":
        return handleComponentPart(el, Alpine, "accordion", "getItemTriggerProps", param)
      case "item-indicator":
        return handleComponentPart(el, Alpine, "accordion", "getItemIndicatorProps", param)
      case "item-content":
        return handleItemContent(el, Alpine, cleanup, param)
      default:
        return handleRoot(el, Alpine, cleanup, param)
    }
  }).before("bind")

  Alpine.magic("accordion", (el) => {
    return getApi<accordion.Api>(el, Alpine, "accordion")
  })
}

const handleRoot = (el: HTMLElement, Alpine: Alpine, cleanup: CleanupFn, props: any) => {
  Alpine.bind(el, {
    "x-id"() {
      return ["z-accordion"]
    },
    "x-data"() {
      return createComponent(
        Alpine,
        cleanup,
        "accordion",
        props,
        ({ $id, $dispatch }) =>
          accordion.machine({
            id: $id("z-accordion"),
            ...Alpine.raw(props),
            onValueChange: (details) => {
              $dispatch("z-value-change", details)
            },
            onFocusChange: (details) => {
              $dispatch("z-focus-change", details)
            }
          }),
        accordion.connect
      )
    }
  })

  handleComponentPart(el, Alpine, "accordion", "rootProps")
}

const handleItem = (el: HTMLElement, Alpine: Alpine, cleanup: CleanupFn, props: any) => {
  Alpine.bind(el, {
    "x-data"() {
      const ctx = this as any
      const item = computedShallowRef(Alpine, cleanup, () => ctx.$accordion.getItemState(props))
      const itemContentProps = computedShallowRef(Alpine, cleanup, () =>
        ctx.$accordion.getItemContentProps(props)
      )
      const context = Alpine.reactive({
        get open() {
          return item.value.expanded
        },
        get ids() {
          return { content: itemContentProps.value.id }
        }
      })
      return createComponent(
        Alpine,
        cleanup,
        "collapsible_item",
        context,
        () => collapsible.machine({ id: "collapsible-item", ...Alpine.raw(context) }),
        collapsible.connect
      )
    }
  })
  handleComponentPart(el, Alpine, "accordion", "getItemProps", props)
}

const handleItemContent = (el: HTMLElement, Alpine: Alpine, cleanup: CleanupFn, props: any) => {
  Alpine.bind(el, {
    "x-data"() {
      const ctx = this as any
      const itemContentProps = computedShallowRef(Alpine, cleanup, () => {
        const { hidden: _, ...itemContentProps } = ctx.$accordion.getItemContentProps(props)
        return itemContentProps
      })

      return {
        get _collapsibleItemContentProps() {
          const ctx = this as any
          const localProps = ctx.$data._collapsible_item_api.value.contentProps
          return markRaw(mergeProps(localProps, itemContentProps.value))
        }
      }
    }
  })

  const itemContentProps = (Alpine.$data(el) as any)._collapsibleItemContentProps
  Alpine.bind(
    el,
    createBind(itemContentProps, (ctx) => ctx._collapsibleItemContentProps)
  )
}
