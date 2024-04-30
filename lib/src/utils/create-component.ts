import type { Alpine } from "alpinejs"
import { normalizeProps, useMachine } from "src/integration"
import { createBind } from "src/integration/bind"
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

export const handleComponentPart = (
  el: HTMLElement,
  Alpine: Alpine,
  name: string,
  propName: string,
  param?: any
) => {
  const api = getApi<any>(el, Alpine, name)
  param
    ? Alpine.bind(el, createBind(name, api[propName](param), propName, param))
    : Alpine.bind(el, createBind(name, api[propName], propName))
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
      this[contextProp] = props
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
