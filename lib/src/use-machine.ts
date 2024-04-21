import { markRaw } from "./reactivity"
import type { MachineSrc, StateMachine as S } from "@zag-js/core"
import type { Alpine } from "alpinejs"

declare module "alpinejs" {
  interface Alpine {
    watch<T>(getter: () => T, watcher: (value: T, prev: T) => void): () => void
  }
}

export type MachineOptions<
  TContext extends Record<string, any>,
  TState extends S.StateSchema,
  TEvent extends S.EventObject = S.AnyEventObject
> = Omit<S.HookOptions<TContext, TState, TEvent>, "context"> & {
  context?: S.UserContext<TContext>
}

export const useMachine = <
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

  // kind of a hacky way to use alpine and vue reactivity's internal to make it act like a shallow ref
  const state = Alpine.reactive({ value: markRaw(service.state) })

  let unwatch: () => void
  let unsubscribe: () => void

  return {
    start() {
      service.start(hydratedState)

      // subscribe to machine's internal state change
      unsubscribe = service.subscribe((value) => {
        state.value = markRaw(value as any)
      })

      // if a reactive context state is provided, sync it with the machine context
      if (context) {
        unwatch = Alpine.watch(
          () => context,
          (context) => {
            service.setContext(Alpine.raw(context))
          }
        )
      }
    },
    stop() {
      unwatch?.()
      unsubscribe()
      service.stop()
    },
    get state() {
      return state
    },
    get send() {
      return service.send
    },
    get machine() {
      return service
    }
  }
}
