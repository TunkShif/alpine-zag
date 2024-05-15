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
  hoverCard,
  numberInput,
  pinInput,
  popover,
  progress,
  radioGroup,
  ratingGroup,
  select,
  signaturePad,
  slider,
  splitter,
  switches,
  tabs,
  tagsInput,
  toggleGroup,
  tooltip
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
  Alpine.plugin(numberInput)
  Alpine.plugin(pinInput)
  Alpine.plugin(popover)
  Alpine.plugin(progress)
  Alpine.plugin(radioGroup)
  Alpine.plugin(ratingGroup)
  Alpine.plugin(select)
  Alpine.plugin(signaturePad)
  Alpine.plugin(slider)
  Alpine.plugin(splitter)
  Alpine.plugin(switches)
  Alpine.plugin(tabs)
  Alpine.plugin(tagsInput)
  Alpine.plugin(toggleGroup)
  Alpine.plugin(tooltip)
}
