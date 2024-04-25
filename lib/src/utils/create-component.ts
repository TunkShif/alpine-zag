import type { Alpine } from "alpinejs"
import { normalizeProps, useAPI, useMachine } from "src/integration"
import { createBind } from "src/integration/bind"

type Dict = Record<string, any>

type CreateMachine = (utils: {
  $id: (scope: string) => string
  $dispatch: (event: string, details: any) => void
}) => any

type ConnectMachine = (state: any, send: any, normalizer: any) => any

export const getApi = <API>(el: HTMLElement, Alpine: Alpine) => {
  return (Alpine.$data(el) as any)._api as API
}

export const handleComponentPart = (
  el: HTMLElement,
  Alpine: Alpine,
  propName: string,
  param?: any
) => {
  const api = getApi<any>(el, Alpine)
  param
    ? Alpine.bind(el, createBind(api[propName](param), propName, param))
    : Alpine.bind(el, createBind(api[propName], propName))
}

export const createComponent = (
  Alpine: Alpine,
  props: Dict,
  createMachine: CreateMachine,
  connectMachine: ConnectMachine
): Dict => {
  return {
    init() {
      this._context = props
      this._serviceManager = useMachine(
        Alpine,
        createMachine({
          $id: (scope) => this.$id(scope),
          $dispatch: (event, details) => this.$dispatch(event, details)
        }),
        { context: this._context }
      )
      this._apiManager = useAPI(Alpine, () =>
        connectMachine(this._serviceManager.state.value, this._serviceManager.send, normalizeProps)
      )

      this._serviceManager.start()
      this._apiManager.start()
    },
    destroy() {
      this._apiManager.stop()
      this._serviceManager.stop()
    },
    get _api() {
      return this._apiManager.value
    },
    get _machine() {
      return this._serviceManager.machine
    }
  }
}
