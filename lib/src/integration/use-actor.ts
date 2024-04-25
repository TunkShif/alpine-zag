import { useSnapshot } from "./use-snapshot"
import type { Machine, StateMachine as S } from "@zag-js/core"
import type { Alpine } from "alpinejs"

export function useActor<
  TContext extends Record<string, any>,
  TState extends S.StateSchema,
  TEvent extends S.EventObject = S.AnyEventObject
>(Alpine: Alpine, service: Machine<TContext, TState, TEvent>) {
  const [state, onDestroyed] = useSnapshot(Alpine, service)
  return {
    stop() {
      onDestroyed()
    },
    get state() {
      return state
    },
    get send() {
      return service.send
    }
  }
}
