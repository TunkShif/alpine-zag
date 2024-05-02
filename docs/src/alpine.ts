import {
  accordion,
  avatar,
  carousel,
  checkbox,
  clipboard,
  collapsible,
  combobox,
  dialog
} from "@tunkshif/alpine-zag"
import type { Alpine } from "alpinejs"

export default (Alpine: Alpine) => {
  Alpine.plugin(accordion)
  Alpine.plugin(avatar)
  Alpine.plugin(carousel)
  Alpine.plugin(checkbox)
  Alpine.plugin(clipboard)
  Alpine.plugin(collapsible)
  Alpine.plugin(combobox)
  Alpine.plugin(dialog)
}
