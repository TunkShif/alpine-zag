import * as tagsInput from "@zag-js/tags-input"
import type { Alpine, PluginCallback } from "alpinejs"
import type { PropTypes } from "src/integration/normalize-props"
import { createComponent, getApi, handleComponentPart } from "src/utils/create-component"
import type { CleanupFn } from "src/utils/reactivity"

export const plugin: PluginCallback = (Alpine) => {
  Alpine.directive("tags-input", (el, directive, { evaluate, cleanup }) => {
    const param = evaluate(directive.expression || "{}")
    switch (directive.value) {
      case "label":
        return handleComponentPart(el, Alpine, "tags_input", "labelProps")
      case "control":
        return handleComponentPart(el, Alpine, "tags_input", "controlProps")
      case "input":
        return handleComponentPart(el, Alpine, "tags_input", "inputProps")
      case "hidden-input":
        return handleComponentPart(el, Alpine, "tags_input", "hiddenInputProps")
      case "clear-trigger":
        return handleComponentPart(el, Alpine, "tags_input", "clearTriggerProps")
      case "item":
        return handleComponentPart(el, Alpine, "tags_input", "getItemProps", param)
      case "item-preview":
        return handleComponentPart(el, Alpine, "tags_input", "getItemPreviewProps", param)
      case "item-text":
        return handleComponentPart(el, Alpine, "tags_input", "getItemTextProps", param)
      case "item-input":
        return handleComponentPart(el, Alpine, "tags_input", "getItemInputProps", param)
      case "item-delete-trigger":
        return handleComponentPart(el, Alpine, "tags_input", "getItemDeleteTriggerProps", param)
      default:
        return handleRoot(el, Alpine, cleanup, param)
    }
  }).before("bind")

  Alpine.magic("tagsInput", (el) => {
    return getApi<tagsInput.Api<PropTypes>>(el, Alpine, "tags_input")
  })
}

const handleRoot = (el: HTMLElement, Alpine: Alpine, cleanup: CleanupFn, props: any) => {
  Alpine.bind(el, {
    "x-id"() {
      return ["z-tags-input"]
    },
    "x-data"() {
      return createComponent(
        Alpine,
        cleanup,
        "tags_input",
        props,
        ({ $id, $dispatch }) =>
          tagsInput.machine({
            id: $id("z-tags-input"),
            ...Alpine.raw(props),
            onValueChange: (details) => {
              $dispatch("z-value-change", details)
            },
            onInputValueChange: (details) => {
              $dispatch("z-input-value-change", details)
            },
            onHighlightChange: (details) => {
              $dispatch("z-highlight-change", details)
            },
            onValueInvalid: (details) => {
              $dispatch("z-value-invalid", details)
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
        tagsInput.connect
      )
    }
  })

  handleComponentPart(el, Alpine, "tags_input", "rootProps")
}
