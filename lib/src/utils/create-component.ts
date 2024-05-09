import type { Alpine } from "alpinejs"
import { normalizeProps, useMachine } from "src/integration"
import { type CleanupFn, computedShallowRef, markRaw } from "src/utils/reactivity"

type Dict = Record<string, any>

type CreateMachine = (utils: {
  $id: (scope: string) => string
  $dispatch: (event: string, details: any) => void
}) => any

type ConnectMachine = (state: any, send: any, normalizer: any) => any

export const getApi = <API>(el: HTMLElement, Alpine: Alpine, name: string) => {
  return (Alpine.$data(el) as any)[`_${name}_api`].value as API
}

export const createBind = (
  props: Record<string, any>,
  accessor: (context: any) => any,
  param?: Record<string, any>
) => {
  const binds: Record<string, any> = {}
  for (const key in props) {
    if (key.startsWith("on")) {
      const event = `@${key.substring(2)}`
      binds[event] = function (event: any) {
        const handler = param ? accessor(this)(param)[key] : accessor(this)[key]
        handler(event)
      }
    } else {
      const prop = key === "innerHTML" ? "x-text" : `:${key}`
      binds[prop] = function () {
        const value = param ? accessor(this)(param)[key] : accessor(this)[key]
        return value
      }
    }
  }
  return binds
}

export const handleComponentPart = (
  el: HTMLElement,
  Alpine: Alpine,
  name: string,
  propName: string,
  param?: any
) => {
  const api = getApi<any>(el, Alpine, name)
  const accessor = (ctx: any) => ctx[`_${name}_api`].value[propName]
  const binds = param
    ? createBind(api[propName](param), accessor, param)
    : createBind(api[propName], accessor)
  Alpine.bind(el, binds)
}

export const createComponent = (
  Alpine: Alpine,
  cleanup: CleanupFn,
  name: string,
  props: Dict,
  createMachine: CreateMachine,
  connectMachine: ConnectMachine
): Dict => {
  const contextProp = `_${name}_context`
  const machineProp = `_${name}_machine`
  const apiProp = `_${name}_api`

  return {
    [contextProp]: null,
    [machineProp]: null,
    [apiProp]: null,
    init() {
      this[contextProp] = Alpine.reactive(props)
      const nextTick = (callback: () => void) => this.$nextTick(callback)
      const [state, send, machine] = useMachine(
        Alpine,
        cleanup,
        nextTick,
        createMachine({
          $id: (scope) => this.$id(scope),
          $dispatch: (event, details) => this.$dispatch(event, details)
        }),
        { context: this[contextProp] }
      )

      this[machineProp] = markRaw(machine)
      this[apiProp] = computedShallowRef(Alpine, cleanup, () =>
        connectMachine(state.value, send, normalizeProps)
      )
    }
  }
}
