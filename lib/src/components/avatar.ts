import * as avatar from "@zag-js/avatar"
import type { Alpine, PluginCallback } from "alpinejs"
import { createComponent, getApi, handleComponentPart } from "src/utils/create-component"

export const plugin: PluginCallback = (Alpine) => {
  Alpine.directive("avatar", (el, directive, { evaluate }) => {
    const param = evaluate(directive.expression || "{}")
    switch (directive.value) {
      case "fallback":
        return handleComponentPart(el, Alpine, "fallbackProps")
      case "image":
        return handleComponentPart(el, Alpine, "imageProps")
      default:
        return handleRoot(el, Alpine, param)
    }
  }).before("bind")

  Alpine.magic("avatar", (el) => {
    return getApi<avatar.Api>(el, Alpine)
  })
}

const handleRoot = (el: HTMLElement, Alpine: Alpine, props: any) => {
  Alpine.bind(el, {
    "x-id"() {
      return ["z-avatar"]
    },
    "x-data"() {
      return createComponent(
        Alpine,
        props,
        ({ $id, $dispatch }) =>
          avatar.machine({
            id: $id("z-avatar"),
            ...Alpine.raw(props),
            onStatusChange: (details) => {
              $dispatch("z-status-change", details)
            }
          }),
        avatar.connect
      )
    }
  })

  handleComponentPart(el, Alpine, "rootProps")
}
