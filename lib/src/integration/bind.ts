export const createBind = (
  props: Record<string, any>,
  propName: string,
  param?: Record<string, any>
) => {
  const binds: Record<string, any> = {}

  for (const key in props) {
    let name: string
    if (key.startsWith("on")) {
      const event = key.substring(2)
      name = `@${event}`
    } else {
      name = `:${key}`
    }
    binds[name] = function () {
      return param ? this._api[propName](param)[key] : this._api[propName][key]
    }
  }

  return binds
}
