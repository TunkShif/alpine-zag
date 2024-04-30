import * as avatar from "@zag-js/avatar"
import type { Alpine, PluginCallback } from "alpinejs"
import { createComponent, getApi, handleComponentPart } from "src/utils/create-component"
import type { CleanupFn } from "src/utils/reactivity"

export const plugin: PluginCallback = (Alpine) => {
  Alpine.directive("avatar", (el, directive, { evaluate, cleanup }) => {
    const param = evaluate(directive.expression || "{}")
    switch (directive.value) {
      case "fallback":
        return handleComponentPart(el, Alpine, "avatar", "fallbackProps")
      case "image":
        return handleComponentPart(el, Alpine, "avatar", "imageProps")
      default:
        return handleRoot(el, Alpine, cleanup, param)
    }
  }).before("bind")

  Alpine.magic("avatar", (el) => {
    return getApi<avatar.Api>(el, Alpine, "avatar")
  })
}

const handleRoot = (el: HTMLElement, Alpine: Alpine, cleanup: CleanupFn, props: any) => {
  Alpine.bind(el, {
    "x-id"() {
      return ["z-avatar"]
    },
    "x-data"() {
      return createComponent(
        Alpine,
        cleanup,
        "avatar",
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

  handleComponentPart(el, Alpine, "avatar", "rootProps")
}
