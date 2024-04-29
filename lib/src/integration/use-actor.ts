import type { Machine, StateMachine as S } from "@zag-js/core"
import type { Alpine } from "alpinejs"
import { useSnapshot } from "src/integration/use-snapshot"
import type { CleanupFn } from "src/utils/reactivity"

export function useActor<
  TContext extends Record<string, any>,
  TState extends S.StateSchema,
  TEvent extends S.EventObject = S.AnyEventObject
>(Alpine: Alpine, cleanup: CleanupFn, service: Machine<TContext, TState, TEvent>) {
  const state = useSnapshot(Alpine, cleanup, service)
  return [state, service.send] as const
}
