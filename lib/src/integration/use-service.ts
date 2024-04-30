import type { MachineSrc, StateMachine as S } from "@zag-js/core"
import type { Alpine } from "alpinejs"
import type { CleanupFn } from "src/utils/reactivity"
import type { MachineOptions } from "./types"

export const useService = <
  TContext extends Record<string, any>,
  TState extends S.StateSchema,
  TEvent extends S.EventObject = S.AnyEventObject
>(
  Alpine: Alpine,
  cleanup: CleanupFn,
  nextTick: (callback: () => void) => void,
  machine: MachineSrc<TContext, TState, TEvent>,
  options?: MachineOptions<TContext, TState, TEvent>
) => {
  const { state: hydratedState, context } = options ?? {}

  const service = typeof machine === "function" ? machine() : machine
  if (context) service.setContext(Alpine.raw(context))
  service._created()

  // initialization process of some zag machines relies on DOM element id to locate the corresponding elements,
  // so we have to start the service only after the DOM attributes has been set by Alpine
  nextTick(() => {
    service.start(hydratedState)
  })

  cleanup(() => service.stop())
  return service
}
