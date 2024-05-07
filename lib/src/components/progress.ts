import * as progress from "@zag-js/progress"
import type { Alpine, PluginCallback } from "alpinejs"
import type { PropTypes } from "src/integration/normalize-props"
import { createComponent, getApi, handleComponentPart } from "src/utils/create-component"
import type { CleanupFn } from "src/utils/reactivity"

export const plugin: PluginCallback = (Alpine) => {
  Alpine.directive("progress", (el, directive, { evaluate, cleanup }) => {
    switch (directive.value) {
      case "label":
        return handleComponentPart(el, Alpine, "progress", "labelProps")
      case "track":
        return handleComponentPart(el, Alpine, "progress", "trackProps")
      case "range":
        return handleComponentPart(el, Alpine, "progress", "rangeProps")
      case "circle":
        return handleComponentPart(el, Alpine, "progress", "circleProps")
      case "circle-track":
        return handleComponentPart(el, Alpine, "progress", "circleTrackProps")
      case "circle-range":
        return handleComponentPart(el, Alpine, "progress", "circleRangeProps")
      default:
        return handleRoot(el, Alpine, cleanup, evaluate(directive.expression || "{}"))
    }
  }).before("bind")

  Alpine.magic("progress", (el) => {
    return getApi<progress.Api<PropTypes>>(el, Alpine, "progress")
  })
}

const handleRoot = (el: HTMLElement, Alpine: Alpine, cleanup: CleanupFn, props: any) => {
  Alpine.bind(el, {
    "x-id"() {
      return ["z-progress"]
    },
    "x-data"() {
      return createComponent(
        Alpine,
        cleanup,
        "progress",
        props,
        ({ $id }) =>
          progress.machine({
            id: $id("z-progress"),
            ...Alpine.raw(props)
          }),
        progress.connect
      )
    }
  })

  handleComponentPart(el, Alpine, "progress", "rootProps")
}
