import * as colorPicker from "@zag-js/color-picker"
import type { Alpine, PluginCallback } from "alpinejs"
import type { PropTypes } from "src/integration/normalize-props"
import { createComponent, getApi, handleComponentPart } from "src/utils/create-component"
import type { CleanupFn } from "src/utils/reactivity"

export const plugin: PluginCallback = (Alpine) => {
  Alpine.directive("color-picker", (el, directive, { evaluate, cleanup }) => {
    const param = evaluate(directive.expression || "{}")
    switch (directive.value) {
      case "label":
        return handleComponentPart(el, Alpine, "color_picker", "labelProps")
      case "control":
        return handleComponentPart(el, Alpine, "color_picker", "controlProps")
      case "trigger":
        return handleComponentPart(el, Alpine, "color_picker", "triggerProps")
      case "positioner":
        return handleComponentPart(el, Alpine, "color_picker", "positionerProps")
      case "content":
        return handleComponentPart(el, Alpine, "color_picker", "contentProps")
      case "hidden-input":
        return handleComponentPart(el, Alpine, "color_picker", "hiddenInputProps")
      case "area":
        return handleComponentPart(el, Alpine, "color_picker", "getAreaProps", param)
      case "area-background":
        return handleComponentPart(el, Alpine, "color_picker", "getAreaBackgroundProps", param)
      case "area-thumb":
        return handleComponentPart(el, Alpine, "color_picker", "getAreaThumbProps", param)
      case "channel-slider":
        return handleComponentPart(el, Alpine, "color_picker", "getChannelSliderProps", param)
      case "channel-slider-track":
        return handleComponentPart(el, Alpine, "color_picker", "getChannelSliderTrackProps", param)
      case "channel-slider-thumb":
        return handleComponentPart(el, Alpine, "color_picker", "getChannelSliderThumbProps", param)
      case "channel-input":
        return handleComponentPart(el, Alpine, "color_picker", "getChannelInputProps", param)
      case "transparency-grid":
        return handleComponentPart(el, Alpine, "color_picker", "getTransparencyGridProps", param)
      case "eye-dropper-trigger":
        return handleComponentPart(el, Alpine, "color_picker", "eyeDropperTriggerProps")
      case "swatch-group":
        return handleComponentPart(el, Alpine, "color_picker", "swatchGroupProps")
      case "swatch-trigger":
        return handleComponentPart(el, Alpine, "color_picker", "getSwatchTriggerProps", param)
      case "swatch":
        return handleComponentPart(el, Alpine, "color_picker", "getSwatchProps", param)
      case "swatch-indicator":
        return handleComponentPart(el, Alpine, "color_picker", "getSwatchIndicatorProps", param)
      case "format-select":
        return handleComponentPart(el, Alpine, "color_picker", "formatSelectProps")
      case "format-trigger":
        return handleComponentPart(el, Alpine, "color_picker", "formatTriggerProps")
      default:
        return handleRoot(el, Alpine, cleanup, param)
    }
  }).before("bind")

  Alpine.magic("colorPicker", (el) => {
    return getApi<colorPicker.Api<PropTypes>>(el, Alpine, "color_picker")
  })
}

const handleRoot = (el: HTMLElement, Alpine: Alpine, cleanup: CleanupFn, props: any) => {
  Alpine.bind(el, {
    "x-id"() {
      return ["z-color-picker"]
    },
    "x-data"() {
      return createComponent(
        Alpine,
        cleanup,
        "color_picker",
        props,
        ({ $id, $dispatch }) =>
          colorPicker.machine({
            id: $id("z-color-picker"),
            ...Alpine.raw(props),
            onOpenChange: (details) => {
              $dispatch("z-open-change", details)
            },
            onValueChange: (details) => {
              $dispatch("z-value-change", details)
            },
            onFormatChange: (details) => {
              $dispatch("z-format-change", details)
            },
            onValueChangeEnd: (details) => {
              $dispatch("z-value-change-end", details)
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
        colorPicker.connect
      )
    }
  })

  handleComponentPart(el, Alpine, "color_picker", "rootProps")
}
