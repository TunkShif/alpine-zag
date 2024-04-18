import type { Alpine } from "alpinejs"
import { zag } from "@tunkshif/alpine-zag"
import * as tooltip from "@zag-js/tooltip"
import * as popover from "@zag-js/popover"
import * as accordion from "@zag-js/accordion"
import * as clipboard from "@zag-js/clipboard"
import * as dialog from "@zag-js/dialog"
import * as combobox from "@zag-js/combobox"

export default (Alpine: Alpine) => {
  Alpine.plugin(
    zag.register([
      ["tooltip", tooltip.connect, tooltip.machine],
      ["popover", popover.connect, popover.machine],
      ["accordion", accordion.connect, accordion.machine],
      ["clipboard", clipboard.connect, clipboard.machine],
      ["dialog", dialog.connect, dialog.machine],
      ["combobox", combobox.connect, combobox.machine, combobox.collection]
    ])
  )
}
