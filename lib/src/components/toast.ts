import * as toast from "@zag-js/toast"
import type { Alpine, PluginCallback } from "alpinejs"
import { normalizeProps, useActor } from "src/integration"
import { createComponent, getApi, handleComponentPart } from "src/utils/create-component"
import { computedShallowRef, type CleanupFn } from "src/utils/reactivity"

export const plugin: PluginCallback = (Alpine) => {
  Alpine.directive("toast-group", (el, directive, { evaluate, cleanup }) => {
    const param = evaluate(directive.expression || "{}")
    switch (directive.value) {
      case "group":
        return handleComponentPart(el, Alpine, "toastGroup", "getGroupProps", param)
      default:
        return handleGroupRoot(el, Alpine, cleanup, param)
    }
  }).before("bind")

  Alpine.magic("toastGroup", (el) => {
    return getApi<toast.GroupApi>(el, Alpine, "toastGroup")
  })

  Alpine.directive("toast", (el, directive, { evaluate, cleanup }) => {
    switch (directive.value) {
      case "title":
        return handleComponentPart(el, Alpine, "toast", "titleProps")
      case "description":
        return handleComponentPart(el, Alpine, "toast", "descriptionProps")
      case "action-trigger":
        return handleComponentPart(el, Alpine, "toast", "actionTriggerProps")
      case "close-trigger":
        return handleComponentPart(el, Alpine, "toast", "closeTriggerProps")
      case "ghost-before":
        return handleComponentPart(el, Alpine, "toast", "ghostBeforeProps")
      case "ghost-after":
        return handleComponentPart(el, Alpine, "toast", "ghostAfterProps")
      default:
        return handleToastRoot(el, Alpine, cleanup, evaluate(directive.expression))
    }
  }).before("bind")

  Alpine.magic("toast", (el) => {
    return getApi<toast.Api>(el, Alpine, "toast")
  })

  Alpine.magic("toaster", () => (Alpine.store("_toaster_api") as any).value)
}

const handleGroupRoot = (el: HTMLElement, Alpine: Alpine, cleanup: CleanupFn, props: any) => {
  Alpine.bind(el, {
    "x-id"() {
      return ["z-toast-group"]
    },
    "x-init"() {
      const ctx = this as any
      Alpine.store("_toaster_api", ctx._toastGroup_api)
    },
    "x-data"() {
      return createComponent(
        Alpine,
        cleanup,
        "toastGroup",
        props,
        ({ $id }) =>
          toast.group.machine({
            id: $id("z-toast-group"),
            ...Alpine.raw(props)
          }),
        toast.group.connect
      )
    }
  })
}

const handleToastRoot = (el: HTMLElement, Alpine: Alpine, cleanup: CleanupFn, actor: any) => {
  Alpine.bind(el, {
    "x-data"() {
      return {
        _toast_api: null,
        init() {
          const ctx = this as any
          const [state, send] = useActor(Alpine, cleanup, actor)
          ctx._toast_api = computedShallowRef(Alpine, cleanup, () =>
            toast.connect(state.value as any, send, normalizeProps)
          )
        }
      }
    }
  })

  handleComponentPart(el, Alpine, "toast", "rootProps")
}
