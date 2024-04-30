import type { MachineSrc, StateMachine as S } from "@zag-js/core"
import type { Alpine } from "alpinejs"
import type { MachineOptions } from "src/integration/types"
import { useService } from "src/integration/use-service"
import { useSnapshot } from "src/integration/use-snapshot"
import type { CleanupFn } from "src/utils/reactivity"

export const useMachine = <
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
  const service = useService(Alpine, cleanup, nextTick, machine, options)
  const state = useSnapshot(Alpine, cleanup, service, options)

  return [state, service.send, service] as const
}
