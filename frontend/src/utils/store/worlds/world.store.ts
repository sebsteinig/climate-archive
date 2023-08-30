import { StateCreator } from "zustand"
import {
  WorldID,
  CollectionID,
  WorldData,
  Slots,
  TimeConf,
  TimeMode,
  TimeController,
} from "./time/time.type"

import { Collection } from "../collection/collection.store"
import { buildTimeConf, buildWorldConf } from "./world.utils"
import { Experiment, Publication } from "@/utils/types"

export interface WorldSlice {
  worlds: {
    __auto_increment: number
    slots: Slots
    observed_world: WorldID | undefined
    reload_flag: boolean
    reload: (flag: boolean) => void
    add: (
      collection: Collection,
      config?: Partial<TimeConf>,
      exp?: Experiment,
    ) => void
    addAll: (
      collection: { publication: Publication; exp_id: string }[],
      config?: Partial<TimeConf>,
    ) => void
    clear: () => void
    replace: (collection: Collection) => void
    remove: (id: WorldID) => void
    dup: (world_id: WorldID) => void
    switchTimeMode: (world_id: WorldID, exp: Experiment) => void
    changeExp: (id: WorldID, exp: Experiment) => void
    observe: (id: WorldID | undefined) => void
  }
}

export const createWorldSlice: StateCreator<
  WorldSlice,
  [["zustand/immer", never]],
  [],
  WorldSlice
> = (set) => {
  return {
    worlds: {
      __auto_increment: -1,
      slots: new Map(),
      reload_flag: true,
      observed_world: undefined,
      reload(flag) {
        set((state) => {
          state.worlds.reload_flag = flag
        })
      },
      add(collection, config, exp) {
        set((state) => {
          state.worlds.__auto_increment += 1
          state.worlds.slots.set(state.worlds.__auto_increment, {
            collection,
            //conf: buildWorldConf(),
            time: buildTimeConf(config),
            exp,
          })
        })
      },

      addAll(collections, config) {
        set((state) => {
          for (let collection of collections) {
            state.worlds.__auto_increment += 1
            state.worlds.slots.set(state.worlds.__auto_increment, {
              collection: collection.publication,
              exp: collection.publication.exps.find(
                (exp) => exp.id === collection.exp_id,
              ),
              //conf: buildWorldConf(),
              time: buildTimeConf(config),
            })
          }
        })
      },
      replace(collection) {
        set((state) => {
          state.worlds.__auto_increment += 1
          state.worlds.slots.clear()
          state.worlds.slots.set(state.worlds.__auto_increment, {
            collection,
            //conf: buildWorldConf(),
            time: buildTimeConf(),
          })
        })
      },
      clear() {
        set((state) => {
          state.worlds.__auto_increment = 0
          state.worlds.slots.clear()
        })
      },
      dup(world_id) {
        set((state) => {
          const data = state.worlds.slots.get(world_id)
          if (!data) return
          state.worlds.__auto_increment += 1
          state.worlds.slots.set(state.worlds.__auto_increment, data)
        })
      },
      remove(id) {
        set((state) => {
          state.worlds.slots.delete(id)
        })
      },
      switchTimeMode(world_id, exp) {
        set((state) => {
          const data = state.worlds.slots.get(world_id)
          if (!data) return
          if (data.time.mode_state.is_writable) {
            data.time.mode_state.previous = data.time.mode
            data.time.mode =
              data.time.mode === TimeMode.ts ? TimeMode.mean : TimeMode.ts
            data.time.controller =
              data.time.controller === TimeController.geologic
                ? TimeController.monthly
                : TimeController.geologic
            data.exp = exp
          }
        })
      },
      changeExp(id, exp) {
        set((state) => {
          const data = state.worlds.slots.get(id)
          if (!data) return
          data.exp = exp
        })
      },
      observe(id) {
        set((state) => {
          if (!id) {
            state.worlds.observed_world = undefined
          } else if (state.worlds.slots.has(id)) {
            state.worlds.observed_world = id
          }
        })
      },
    },
  }
}
