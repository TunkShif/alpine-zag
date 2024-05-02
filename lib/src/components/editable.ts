import * as editable from "@zag-js/editable"
import type { Alpine, PluginCallback } from "alpinejs"
import { createComponent, getApi, handleComponentPart } from "src/utils/create-component"
import type { CleanupFn } from "src/utils/reactivity"

export const plugin: PluginCallback = (Alpine) => {
  Alpine.directive("editable", (el, directive, { evaluate, cleanup }) => {
    switch (directive.value) {
      case "area":
        return handleComponentPart(el, Alpine, "editable", "areaProps")
      case "input":
        return handleComponentPart(el, Alpine, "editable", "inputProps")
      case "preview":
        return handleComponentPart(el, Alpine, "editable", "previewProps")
      case "edit-trigger":
        return handleComponentPart(el, Alpine, "editable", "editTriggerProps")
      case "submit-trigger":
        return handleComponentPart(el, Alpine, "editable", "submitTriggerProps")
      case "cancel-trigger":
        return handleComponentPart(el, Alpine, "editable", "cancelTriggerProps")
      default:
        return handleRoot(el, Alpine, cleanup, evaluate(directive.expression || "{}"))
    }
  }).before("bind")

  Alpine.magic("editable", (el) => {
    return getApi<editable.Api>(el, Alpine, "editable")
  })
}

const handleRoot = (el: HTMLElement, Alpine: Alpine, cleanup: CleanupFn, props: any) => {
  Alpine.bind(el, {
    "x-id"() {
      return ["z-editable"]
    },
    "x-data"() {
      return createComponent(
        Alpine,
        cleanup,
        "editable",
        props,
        ({ $id, $dispatch }) =>
          editable.machine({
            id: $id("z-editable"),
            ...Alpine.raw(props),
            onValueChange: (details) => {
              $dispatch("z-value-change", details)
            },
            onValueCommit: (details) => {
              $dispatch("z-value-commit", details)
            }
          }),
        editable.connect
      )
    },
    ":data-scope"() {
      return "editable"
    },
    ":data-part"() {
      return "root"
    }
  })

  handleComponentPart(el, Alpine, "editable", "rootProps")
}
