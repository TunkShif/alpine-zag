import { zag } from "../src/index"

document.addEventListener("alpine:init", () => {
  window.Alpine.plugin(zag)
})

export const plugin = zag

export { getComponent, getCollection } from "../src/index"
