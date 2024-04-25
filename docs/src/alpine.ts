import { accordion, avatar, carousel } from "@tunkshif/alpine-zag"
import type { Alpine } from "alpinejs"

export default (Alpine: Alpine) => {
  Alpine.plugin(accordion)
  Alpine.plugin(avatar)
  Alpine.plugin(carousel)
}
