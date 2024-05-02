export const createBind = (
  name: string,
  props: Record<string, any>,
  propName: string,
  param?: Record<string, any>
) => {
  const binds: Record<string, any> = {}
  for (const key in props) {
    if (key.startsWith("on")) {
      const event = `@${key.substring(2)}`
      binds[event] = function (event: any) {
        const handler = param
          ? this[`_${name}_api`].value[propName](param)[key]
          : this[`_${name}_api`].value[propName][key]
        handler(event)
      }
    } else {
      const prop = key === "innerHTML" ? "x-text" : `:${key}`
      binds[prop] = function () {
        const value = param
          ? this[`_${name}_api`].value[propName](param)[key]
          : this[`_${name}_api`].value[propName][key]
        return value
      }
    }
  }
  return binds
}
