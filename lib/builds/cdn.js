import { plugin } from "../src/index"

document.addEventListener("alpine:init", () => {
  window.Alpine.plugin(plugin)
})

export { useAPI, useMachine, normalizeProps } from "../src/index"
