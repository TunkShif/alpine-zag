import { mergeProps } from "@zag-js/core"
import * as presence from "@zag-js/presence"
import type { Alpine } from "alpinejs"
import { createBind, createComponent } from "src/utils/create-component"
import { markRaw } from "src/utils/reactivity"

export const createPresence = (Alpine: Alpine, cleanup: any, component: any, name: string) => {
  const context = Alpine.reactive({
    get present() {
      return component[`$${name}`].open
    }
  })

  return createComponent(
    Alpine,
    cleanup,
    `${name}_presence`,
    context,
    () => presence.machine({ ...Alpine.raw(context) }),
    presence.connect
  )
}

export const mergePresenceProps = (component: any, name: string, prop: string) => {
  Object.defineProperty(component, getPresencePropName(name, prop), {
    get: () => {
      const presence = component[`_${name}_presence_api`]
      const localProps = component[`$${name}`][prop]
      const presenceProps = {
        hidden: !presence.value.present
      }
      return markRaw(mergeProps(localProps, presenceProps))
    }
  })
}

export const handlePresencePart = (el: HTMLElement, Alpine: Alpine, name: string, prop: string) => {
  const presenceProp = getPresencePropName(name, prop)
  const props = (Alpine.$data(el) as any)[presenceProp]
  Alpine.bind(
    el,
    createBind(props, (ctx) => ctx[presenceProp])
  )
}

const getPresencePropName = (name: string, prop: string) =>
  `_${name}${prop[0].toUpperCase()}${prop.slice(1)}`
