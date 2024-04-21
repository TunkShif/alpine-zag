import { markRaw } from "@vue/reactivity"
import { createNormalizer } from "@zag-js/types"

let registration = []
const components = new Map()
const collections = new Map()

const ComponentRegistry = new Proxy(
  {},
  {
    get(_target, prop) {
      const component = components.get(prop)
      if (!component) console.warn(`[Alpine Zag Error]: component for '${prop}' not found.`)
      return component
    }
  }
)

const CollectionRegistry = new Proxy(
  {},
  {
    get(_target, prop) {
      const collection = collections.get(prop)
      if (!collection) console.warn(`[Alpine Zag Error]: collection for '${prop}' not found.`)
      return collection
    }
  }
)

export const zag = (Alpine) => {
  for (const [name, connect, machine, collection] of registration) {
    if (collection) collections.set(name, collection)
    const component = createComponent(connect, machine, Alpine)
    components.set(name, component)
  }

  Alpine.magic("machine", () => ComponentRegistry)
  Alpine.magic("collection", () => CollectionRegistry)

  Alpine.directive("component", (el, { expression }, { Alpine, evaluate }) => {
    const config = evaluate(expression)

    if (!Array.isArray(config)) {
      console.warn(
        "[Alpine Zag Error]: expect `['Component', init, context]` value for components."
      )
    }

    const [name, init = {}, context] = evaluate(expression)
    const component = ComponentRegistry[name]
    const machine = component(init, context)

    Alpine.bind(el, {
      "x-data"() {
        return {
          init() {
            this.machine.start()
          },
          destroy() {
            this.machine.stop()
          },
          machine,
          get api() {
            return this.machine.api
          }
        }
      }
    })
  }).before("bind")

  Alpine.directive("props", (el, { expression }, { evaluate }) => {
    const props = evaluate(expression)
    Alpine.bind(el, createBinds(expression, props))
  }).before("bind")
}

zag.register = (components) => {
  registration = components
  return zag
}

export const getComponent = (name) => ComponentRegistry[name]
export const getCollection = (name) => CollectionRegistry[name]

let globalId = 0

const createComponent =
  (connect, machine, Alpine) =>
  (initialContext = {}, syncContext = null) => {
    const service = machine({ id: `z-${globalId++}`, ...Alpine.raw(initialContext) })
    if (syncContext) service.setContext(Alpine.raw(syncContext))
    service._created()

    let unsubscribe
    let unwatch
    let api = Alpine.reactive({ value: {} })

    return markRaw({
      start() {
        service.start()

        unsubscribe = service.subscribe((state) => {
          api.value = markRaw(connect(state, service.send, normalizeProps))
        })

        if (syncContext) {
          unwatch = Alpine.watch(
            () => syncContext,
            (context) => service.setContext(Alpine.raw(context))
          )
        }
      },
      stop() {
        unwatch?.()
        unsubscribe()
        service.stop()

        api.value = undefined
        api = undefined
      },
      get api() {
        return api.value
      },
      get machine() {
        return service
      },
      setContext(context) {
        service.setContext(Alpine.raw(context))
      }
    })
  }

const propMap = {
  htmlFor: "for",
  className: "class",
  onDoubleClick: "ondblclick",
  onChange: "oninput",
  onFocus: "onfocusin",
  onBlur: "onfocusout",
  defaultValue: "value",
  defaultChecked: "checked"
}

const toHTMLProp = (prop) => {
  if (prop in propMap) return propMap[prop]
  return prop.toLowerCase()
}

const normalizeProps = createNormalizer((props) => {
  const normalized = {}
  for (const key in props) {
    const value = props[key]
    if (key === "children") {
      if (typeof value === "string") {
        normalized.innerHTML = value
      } else if (process.env.NODE_ENV !== "production" && value != null) {
        console.warn("[Zag Normalize Prop]: avoid passing non-primitive value as `children`.")
      }
    } else {
      normalized[toHTMLProp(key)] = props[key]
    }
  }
  return normalized
})

const normalizeCall = (expression) => {
  const re = /^(.+)\.(.+Props)/
  if (!expression.match(re)) {
    console.warn(`[Alpine Zag Error]: the binded expression \`${expression}\` is not a valid prop.`)
    return "undefined"
  }
  // convert dot access `foo.bar` to bracket access `foo['bar']`, otherwise Alpine will set any undefined value to an empty string
  return expression.replace(re, "$1['$2']")
}

const createBinds = (expression, props) => {
  const binds = {}
  for (const key in props) {
    let name
    if (key.startsWith("on")) {
      const event = key.substring(2)
      name = `x-on:${event}`
    } else {
      name = `x-bind:${key}`
    }
    binds[name] = `${normalizeCall(expression)}['${key}']`
  }
  return binds
}

export { markRaw }
