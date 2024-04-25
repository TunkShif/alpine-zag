import { zag } from "../src/index"

document.addEventListener("alpine:init", () => {
  window.Alpine.plugin(zag)
})

export * from "../src/components"
export { useAPI, useActor, useMachine, normalizeProps } from "../src/index"
