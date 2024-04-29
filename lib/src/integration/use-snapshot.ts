import type { Machine, StateMachine as S } from "@zag-js/core"
import type { Alpine } from "alpinejs"
import type { MachineOptions } from "src/integration/types"
import { type CleanupFn, type Ref, markRaw } from "src/utils/reactivity"

export const useSnapshot = <
  TContext extends Record<string, any>,
  TState extends S.StateSchema,
  TEvent extends S.EventObject = S.AnyEventObject
>(
  Alpine: Alpine,
  cleanup: CleanupFn,
  service: Machine<TContext, TState, TEvent>,
  options?: MachineOptions<TContext, TState, TEvent>
): Ref<S.State<TContext, TState, TEvent>> => {
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

  cleanup(() => {
    unwatch?.()
    unsubscribe()
  })

  return state
}
