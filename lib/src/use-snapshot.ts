import { markRaw } from "./reactivity"
import type { Machine, StateMachine as S } from "@zag-js/core"
import type { MachineOptions } from "./types"
import type { Alpine } from "alpinejs"

type Ref<T> = { value: T }

export const useSnapshot = <
  TContext extends Record<string, any>,
  TState extends S.StateSchema,
  TEvent extends S.EventObject = S.AnyEventObject
>(
  Alpine: Alpine,
  service: Machine<TContext, TState, TEvent>,
  options?: MachineOptions<TContext, TState, TEvent>
): [Ref<S.State<TContext, TState, TEvent>>, () => void] => {
  const { context } = options ?? {}

  const state = Alpine.reactive({ value: markRaw(service.state) })

  let unwatch: () => void
  const unsubscribe = service.subscribe((value) => {
    state.value = markRaw(value as any)
  })
  if (context) {
    unwatch = Alpine.watch(
      () => context,
      (context) => {
        service.setContext(Alpine.raw(context))
      }
    )
  }

  const onDestroyed = () => {
    unwatch?.()
    unsubscribe()
  }
  return [state, onDestroyed] as const
}
