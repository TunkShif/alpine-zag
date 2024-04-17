import type { Alpine } from "alpinejs"
import { zag, createComponent } from "@tunkshif/alpine-zag"
import * as tooltip from "@zag-js/tooltip"
import * as popover from "@zag-js/popover"
import * as accordion from "@zag-js/accordion"
import * as clipboard from "@zag-js/clipboard"
import * as combobox from "@zag-js/combobox"

export default (Alpine: Alpine) => {
  Alpine.plugin(zag)

  Alpine.data("tooltip", createComponent(tooltip.connect, tooltip.machine))
  Alpine.data("popover", createComponent(popover.connect, popover.machine))
  Alpine.data("accordion", createComponent(accordion.connect, accordion.machine))
  Alpine.data("clipboard", createComponent(clipboard.connect, clipboard.machine))
  Alpine.data("combobox", createComponent(combobox.connect, combobox.machine))
}

// popover.machine({id: "233", positioning: {}})
