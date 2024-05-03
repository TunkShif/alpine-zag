import * as fileUpload from "@zag-js/file-upload"
import type { Alpine, PluginCallback } from "alpinejs"
import type { PropTypes } from "src/integration/normalize-props"
import { createComponent, getApi, handleComponentPart } from "src/utils/create-component"
import type { CleanupFn } from "src/utils/reactivity"

export const plugin: PluginCallback = (Alpine) => {
  Alpine.directive("file-upload", (el, directive, { evaluate, cleanup }) => {
    switch (directive.value) {
      case "dropzone":
        return handleComponentPart(el, Alpine, "file_upload", "dropzoneProps")
      case "hidden-input":
        return handleComponentPart(el, Alpine, "file_upload", "hiddenInputProps")
      case "trigger":
        return handleComponentPart(el, Alpine, "file_upload", "triggerProps")
      case "item-group":
        return handleComponentPart(el, Alpine, "file_upload", "itemGroupProps")
      case "item":
        return handleComponentPart(el, Alpine, "file_upload", "getItemProps", {
          file: evaluate(directive.expression)
        })
      case "item-name":
        return handleComponentPart(el, Alpine, "file_upload", "getItemNameProps", {
          file: evaluate(directive.expression)
        })
      case "item-delete-trigger":
        return handleComponentPart(el, Alpine, "file_upload", "getItemDeleteTriggerProps", {
          file: evaluate(directive.expression)
        })
      default:
        return handleRoot(el, Alpine, cleanup, evaluate(directive.expression || "{}"))
    }
  }).before("bind")

  Alpine.magic("fileUpload", (el) => {
    return getApi<fileUpload.Api<PropTypes>>(el, Alpine, "file_upload")
  })
}

const handleRoot = (el: HTMLElement, Alpine: Alpine, cleanup: CleanupFn, props: any) => {
  Alpine.bind(el, {
    "x-id"() {
      return ["z-file-upload"]
    },
    "x-data"() {
      return createComponent(
        Alpine,
        cleanup,
        "file_upload",
        props,
        ({ $id, $dispatch }) =>
          fileUpload.machine({
            id: $id("z-file-upload"),
            ...Alpine.raw(props),
            onFileAccept: (details) => {
              $dispatch("z-file-accept", details)
            },
            onFileChange: (details) => {
              $dispatch("z-file-change", details)
            },
            onFileReject: (details) => {
              $dispatch("z-file-reject", details)
            }
          }),
        fileUpload.connect
      )
    }
  })

  handleComponentPart(el, Alpine, "file_upload", "rootProps")
}
