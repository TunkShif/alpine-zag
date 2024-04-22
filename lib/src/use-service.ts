import type { MachineSrc, StateMachine as S } from "@zag-js/core"
import type { MachineOptions } from "./types"
import type { Alpine } from "alpinejs"

export const useService = <
  TContext extends Record<string, any>,
  TState extends S.StateSchema,
  TEvent extends S.EventObject = S.AnyEventObject
>(
  Alpine: Alpine,
  machine: MachineSrc<TContext, TState, TEvent>,
  options?: MachineOptions<TContext, TState, TEvent>
) => {
  const { state: hydratedState, context } = options ?? {}

  const service = typeof machine === "function" ? machine() : machine
  if (context) service.setContext(Alpine.raw(context))
  service._created()

  const onMounted = () => service.start(hydratedState)
  const onDestroyed = () => service.stop()

  return [service, onMounted, onDestroyed] as const
}
