import { StateCreator } from "zustand"
import {
  TimeState,
  TimeID,
  CollectionID,
  WorldData,
  Slots,
  TimeConf,
} from "./time.type"

import { Collection } from "../collection.store"
import { buildTimeConf, buildWorldConf } from "./time.utils"
import { Experiment, Publication } from "@/utils/types"

export interface TimeSlice {
  time: {
    __auto_increment: number
    slots: Slots

    add: (collection: Collection, config?: Partial<TimeConf>) => void
    addAll: (
      collection: { publication: Publication; exp_id: string }[],
      config?: Partial<TimeConf>,
    ) => void
    clear: () => void
    replace: (collection: Collection) => void
    remove: (id: TimeID) => void
    dup: (time_id: TimeID) => void

    changeExp: (id: TimeID, exp: Experiment) => void
  }
}

export const createTimeSlice: StateCreator<
  TimeSlice,
  [["zustand/immer", never]],
  [],
  TimeSlice
> = (set) => {
  return {
    time: {
      __auto_increment: -1,
      slots: new Map(),

      add(collection, config) {
        set((state) => {
          state.time.__auto_increment += 1
          state.time.slots.set(state.time.__auto_increment, {
            collection,
            //conf: buildWorldConf(),
            time: buildTimeConf(config),
          })
        })
      },

      addAll(collections, config) {
        set((state) => {
          for (let collection of collections) {
            state.time.__auto_increment += 1
            state.time.slots.set(state.time.__auto_increment, {
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
          state.time.__auto_increment += 1
          state.time.slots.clear()
          state.time.slots.set(state.time.__auto_increment, {
            collection,
            //conf: buildWorldConf(),
            time: buildTimeConf(),
          })
        })
      },
      clear() {
        set((state) => {
          state.time.__auto_increment = 0
          state.time.slots.clear()
        })
      },
      dup(time_id) {
        set((state) => {
          const data = state.time.slots.get(time_id)
          if (!data) return
          state.time.__auto_increment += 1
          state.time.slots.set(state.time.__auto_increment, data)
        })
      },
      remove(id) {
        set((state) => {
          state.time.slots.delete(id)
        })
      },

      changeExp(id, exp) {
        set((state) => {
          const data = state.time.slots.get(id)
          if (!data) return
          data.exp = exp
        })
      },
    },
  }
}
