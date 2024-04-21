import { zag } from "@tunkshif/alpine-zag"
import * as accordion from "@zag-js/accordion"
import * as clipboard from "@zag-js/clipboard"
import * as combobox from "@zag-js/combobox"
import * as dialog from "@zag-js/dialog"
import * as menu from "@zag-js/menu"
import * as pinInput from "@zag-js/pin-input"
import * as popover from "@zag-js/popover"
import * as slider from "@zag-js/slider"
import * as splitter from "@zag-js/splitter"
import * as tabs from "@zag-js/tabs"
import * as tagsInput from "@zag-js/tags-input"
import * as tooltip from "@zag-js/tooltip"
// import * as toast from "@zag-js/toast"
import type { Alpine } from "alpinejs"

export default (Alpine: Alpine) => {
  Alpine.plugin(
    zag.register([
      ["Tooltip", tooltip.connect, tooltip.machine],
      ["Popover", popover.connect, popover.machine],
      ["Accordion", accordion.connect, accordion.machine],
      ["Clipboard", clipboard.connect, clipboard.machine],
      ["Dialog", dialog.connect, dialog.machine],
      ["Combobox", combobox.connect, combobox.machine, combobox.collection],
      ["Menu", menu.connect, menu.machine],
      ["PinInput", pinInput.connect, pinInput.machine],
      ["Slider", slider.connect, slider.machine],
      ["Splitter", splitter.connect, splitter.machine],
      ["Tabs", tabs.connect, tabs.machine],
      ["TagsInput", tagsInput.connect, tagsInput.machine]
      // ["Toast", toast.connect, toast.machine],
    ])
  )
}
