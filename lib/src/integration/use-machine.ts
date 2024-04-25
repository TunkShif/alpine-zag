import { useService } from "./use-service"
import { useSnapshot } from "./use-snapshot"
import type { MachineSrc, StateMachine as S } from "@zag-js/core"
import type { MachineOptions } from "./types"
import type { Alpine } from "alpinejs"
import { markRaw } from "src/integration/reactivity"

declare module "alpinejs" {
  interface Alpine {
    watch<T>(getter: () => T, watcher: (value: T, prev: T) => void): () => void
  }
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
  const [service, onServiceMounted, onServiceDestroyed] = useService(Alpine, machine, options)
  const [state, onSnapshotDestroyed] = useSnapshot(Alpine, service, options)

  return markRaw({
    start() {
      onServiceMounted()
    },
    stop() {
      onSnapshotDestroyed()
      onServiceDestroyed()
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
  })
}
