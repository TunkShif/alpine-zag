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
      ["Tooltip", tooltip.connect, tooltip.machine],
      ["Popover", popover.connect, popover.machine],
      ["Accordion", accordion.connect, accordion.machine],
      ["Clipboard", clipboard.connect, clipboard.machine],
      ["Dialog", dialog.connect, dialog.machine],
      ["Combobox", combobox.connect, combobox.machine, combobox.collection]
    ])
  )
}
