import { plugin } from "../src/index"

document.addEventListener("alpine:init", () => {
  window.Alpine.plugin(plugin)
})

export { useAPI, useActor, useMachine, normalizeProps } from "../src/index"
