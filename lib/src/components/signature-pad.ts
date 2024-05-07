import * as signaturePad from "@zag-js/signature-pad"
import type { Alpine, PluginCallback } from "alpinejs"
import type { PropTypes } from "src/integration/normalize-props"
import { createComponent, getApi, handleComponentPart } from "src/utils/create-component"
import type { CleanupFn } from "src/utils/reactivity"

export const plugin: PluginCallback = (Alpine) => {
  Alpine.directive("signature-pad", (el, directive, { evaluate, cleanup }) => {
    switch (directive.value) {
      case "label":
        return handleComponentPart(el, Alpine, "signature_pad", "labelProps")
      case "segment":
        return handleComponentPart(el, Alpine, "signature_pad", "segmentProps")
      case "segment-path":
        return handleComponentPart(el, Alpine, "signature_pad", "getSegmentPathProps", {
          path: evaluate(directive.expression)
        })
      case "clear-trigger":
        return handleComponentPart(el, Alpine, "signature_pad", "clearTriggerProps")
      case "guide":
        return handleComponentPart(el, Alpine, "signature_pad", "guideProps")
      default:
        return handleRoot(el, Alpine, cleanup, evaluate(directive.expression || "{}"))
    }
  }).before("bind")

  Alpine.magic("signaturePad", (el) => {
    return getApi<signaturePad.Api<PropTypes>>(el, Alpine, "signature_pad")
  })
}

const handleRoot = (el: HTMLElement, Alpine: Alpine, cleanup: CleanupFn, props: any) => {
  Alpine.bind(el, {
    "x-id"() {
      return ["z-signature-pad"]
    },
    "x-data"() {
      return createComponent(
        Alpine,
        cleanup,
        "signature_pad",
        props,
        ({ $id, $dispatch }) =>
          signaturePad.machine({
            id: $id("z-signature-pad"),
            ...Alpine.raw(props),
            onDraw: (details) => {
              $dispatch("z-draw", details)
            },
            onDrawEnd: (details) => {
              $dispatch("z-draw-end", details)
            }
          }),
        signaturePad.connect
      )
    }
  })

  handleComponentPart(el, Alpine, "signature_pad", "rootProps")
}
