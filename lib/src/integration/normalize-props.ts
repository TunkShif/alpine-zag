import { createNormalizer } from "@zag-js/types"

export type PropTypes = HTMLElementTagNameMap & {
  element: HTMLElement
  svg: HTMLOrSVGElement
  path: HTMLOrSVGElement
  circle: HTMLOrSVGElement
}

type Dict = Record<string, string>

const propMap: Dict = {
  htmlFor: "for",
  className: "class",
  onDoubleClick: "onDblclick",
  onChange: "onInput",
  onFocus: "onFocusIn",
  onBlur: "onFocusOut",
  defaultValue: "value",
  defaultChecked: "checked"
}

const toHTMLProp = (prop: string) => {
  if (prop in propMap) return propMap[prop]
  return prop
}

export const normalizeProps = createNormalizer<PropTypes>((props) => {
  const normalized: Dict = {}
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
