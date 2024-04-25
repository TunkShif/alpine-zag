import { accordion, zag } from "@tunkshif/alpine-zag"
import type { Alpine } from "alpinejs"

export default (Alpine: Alpine) => {
  Alpine.plugin(zag)
  Alpine.plugin(accordion)
}
