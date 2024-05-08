import {
  accordion,
  avatar,
  carousel,
  checkbox,
  clipboard,
  collapsible,
  combobox,
  dialog,
  editable,
  fileUpload,
  hoverCard
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
  Alpine.plugin(editable)
  Alpine.plugin(fileUpload)
  Alpine.plugin(hoverCard)
}
