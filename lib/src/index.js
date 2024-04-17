import { createNormalizer } from "@zag-js/types"

export const zag = (Alpine) => {
  Alpine.directive("props", (el, { expression }, { evaluate }) => {
    const props = evaluate(expression)
    Alpine.bind(el, createBinds(expression, props))
  })
}

export const createComponent =
  (connect, machine) =>
  (initialContext = {}) => {
    let instance
    let unsubscribe
    const config = {
      api: {},
      init() {
        instance = machine({ id: this.$id("z"), ...initialContext })
        instance._created()
        instance.start()
        unsubscribe = instance.subscribe((state) => {
          this.api = connect(state, instance.send, normalizeProps)
        })
      },
      destroy() {
        instance.stop()
        unsubscribe()
      },
      setContext(context) {
        instance.setContext(context)
      }
    }
    return config
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
        console.warn("[Zag Normalize Prop] : avoid passing non-primitive value as `children`")
      }
    } else {
      normalized[toHTMLProp(key)] = props[key]
    }
  }
  return normalized
})

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
    binds[name] = `${expression}['${key}']`
  }
  return binds
}
