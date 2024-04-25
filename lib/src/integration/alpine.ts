import type { PluginCallback } from "alpinejs"

export const plugin: PluginCallback = (Alpine) => {
  Alpine.directive("props", (el, { expression }, { evaluate }) => {
    const props = evaluate<Record<string, string>>(expression)
    Alpine.bind(el, createBinds(expression, props))
  }).before("bind")
}

// convert dot access `foo.bar` to bracket access `foo['bar']`, otherwise Alpine will set any undefined value to an empty string
// see https://github.com/alpinejs/alpine/discussions/4156
const normalizeCall = (expression: string) => {
  const re = /^(.+)\.(.+Props)/
  if (!expression.match(re)) {
    console.warn(`[Alpine Zag Error]: the binded expression \`${expression}\` is not a valid prop.`)
    return "undefined"
  }
  return expression.replace(re, "$1['$2']")
}

const createBinds = (expression: string, props: Record<string, string>) => {
  const binds: Record<string, string> = {}
  for (const key in props) {
    let name: string
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
