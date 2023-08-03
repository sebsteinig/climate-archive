import { StateCreator } from "zustand"
import {
  TimeState,
  TimeID,
  CollectionID,
  WorldData,
  Slots,
} from "./time.type"

import { Collection } from "../collection.store"
import { buildTimeConf, buildWorldConf } from "./time.utils"

export interface TimeSlice {
  time: {

    __auto_increment: number
    slots : Slots

    add : (collection:Collection) => void
    replace : (collection:Collection) => void
    remove : (id:TimeID) => void
    dup : (time_id:TimeID) => void

    linkCamera: (
      time_id: TimeID,
      linked: boolean,
    ) => void
    // slots: TimeMap


    // addSync: (
    //   collection_idx: CollectionID,
    //   config: TimeConfig | undefined,
    // ) => void
    // addUnSync: (collection_idx: CollectionID, config: TimeConfig) => void

    // remove: (collection_idx: CollectionID, time_idx: TimeID) => void
    // removeAll: (collection_idx: CollectionID) => void

    // prepare: (idx: TimeID) => void
    // prepareAll: (idxs: TimeID[]) => void
    // play: (idx: TimeID) => void
    // pause: (idx: TimeID) => void
    // pin: (idx: TimeID) => void
    // try_surfing: (idx: TimeID, departure: number) => void
    // surf: (idx: TimeID, destination: number) => void
    // updateSurfingDestination: (idx: TimeID, destination: number) => void
    // stop: (idx: TimeID) => void
    // pauseAll: () => void
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
      __auto_increment : -1,
      slots : new Map(),

      add(collection) {
          set(state => {
            state.time.__auto_increment += 1
            state.time.slots.set(state.time.__auto_increment,{
              collection,
              conf : buildWorldConf(),
              time : buildTimeConf(),
            })
          })
      },
      replace(collection) {
        set(state => {
          state.time.__auto_increment += 1
          state.time.slots.clear()
          state.time.slots.set(state.time.__auto_increment,{
            collection,
            conf : buildWorldConf(),
            time : buildTimeConf(),
          })
        })
    },
      dup(time_id) {
        set(state => {
          const data = state.time.slots.get(time_id)
          if(!data) return
          state.time.__auto_increment += 1
          state.time.slots.set(state.time.__auto_increment,data)
        })
    },
      remove(id) {
        set(state => {
          state.time.slots.delete(id)
        })
      },

      // slots: {
      //   map: new Map(),
      //   lookup: new Map(),
      //   auto_increment: 0,
      // },

      linkCamera: (
        time_id: TimeID,
        linked: boolean,
      ) => {
        set((state) => {
          const data = state.time.slots.get(time_id)
          if (data ) {
            data.conf.camera.is_linked = linked
          }
        })
      },

      // addSync: (collection_idx: CollectionID, config?: TimeConfig) => {
      //   set((state) => {
      //     const id = lastID(state.time.slots)
      //     if (id) {
      //       const time = get(state.time.slots, id)!
      //       time.collections.set(collection_idx, buildContainerConfig())
      //     } else {
      //       const time = buildTime(config ?? {})
      //       time.collections.set(collection_idx, buildContainerConfig())
      //       setTime(state.time.slots, time)
      //     }
      //   })
      // },
      // addUnSync: (collection_idx: CollectionID, config: TimeConfig) => {
      //   set((state) => {
      //     const time = buildTime(config)
      //     time.collections.set(collection_idx, buildContainerConfig())
      //     setTime(state.time.slots, time)
      //   })
      // },

      // remove: (time_idx: TimeID, collection_idx: CollectionID) => {
      //   set((state) => {
      //     timeClose(state.time.slots, time_idx, collection_idx)
      //   })
      // },

      // removeAll: (collection_idx: CollectionID) => {
      //   set((state) => {
      //     timeCloseAll(state.time.slots, collection_idx)
      //   })
      // },

      // prepare: (idx) => {
      //   set((state) => {
      //     const time = state.time.slots.map.get(idx)
      //     if (!time) {
      //       return
      //     }

      //     // if(frame.variables.size > 0) {
      //     //     if(time.state === TimeState.zero || time.state === TimeState.stopped) {
      //     //         time.state = TimeState.ready
      //     //         //time.current_frame = frame
      //     //     }
      //     //     callback(true,frame)
      //     // }else {
      //     //     callback(false,undefined)
      //     // }
      //   })
      // },
      // prepareAll: (idxs: TimeID[]) => {
      //   set((state) => {
      //     for (let idx of idxs) {
      //       const time = get(state.time.slots, idx)

      //       if (!time) {
      //         continue
      //       }
      //       if (
      //         time.state === TimeState.zero ||
      //         time.state === TimeState.stopped
      //       ) {
      //         time.state = TimeState.ready
      //       }
      //     }
      //   })
      // },
      // play: (idx: TimeID) => {
      //   set((state) => {
      //     const time = get(state.time.slots, idx)
      //     if (!time) {
      //       return
      //     }

      //     if (
      //       time.state === TimeState.ready ||
      //       time.state === TimeState.paused
      //     ) {
      //       time.state = TimeState.playing
      //     }
      //   })
      // },
      // pause: (idx: TimeID) => {
      //   set((state) => {
      //     const time = get(state.time.slots, idx)
      //     if (!time) {
      //       return
      //     }
      //     if(time.state === TimeState.playing) {
      //       time.state = TimeState.pinning
      //     }else if (time.state === TimeState.pinning) {
      //       time.state = TimeState.paused
      //     }
      //   })
      // },
      // pin: (idx: TimeID) => {
      //   set((state) => {
      //     const time = get(state.time.slots, idx)
      //     if (!time) {
      //       return
      //     }

      //     if (time.state === TimeState.playing) {
      //       time.state = TimeState.pinning
      //     }
      //   })
      // },
      // try_surfing: (idx: TimeID, departure) => {
      //   set((state) => {
      //     const time = get(state.time.slots, idx)
      //     if (!time) {
      //       return
      //     }

      //     time.surfing_departure = departure
      //   })
      // },
      // surf: (idx: TimeID, destination) => {
      //   set((state) => {
      //     const time = get(state.time.slots, idx)
      //     if (!time) {
      //       return
      //     }

      //     if (
      //       time.state === TimeState.playing ||
      //       time.state === TimeState.paused ||
      //       time.state === TimeState.ready
      //     ) {
      //       time.state = TimeState.surfing
      //       time.surfing_destination = destination
      //     }
      //   })
      // },
      // updateSurfingDestination: (idx: TimeID, destination) => {
      //   set((state) => {
      //     const time = get(state.time.slots, idx)
      //     if (!time) {
      //       return
      //     }

      //     if (time.state === TimeState.surfing) {
      //       time.surfing_destination = destination
      //     }
      //   })
      // },
      // pauseAll: () => {
      //   set((state) => {
      //     for (let [idx, time] of state.time.slots.map) {
      //       time.state = TimeState.paused
      //     }
      //   })
      // },
      // stop: (idx: TimeID) => {
      //   set((state) => {
      //     const time = get(state.time.slots, idx)
      //     if (!time) {
      //       return
      //     }

      //     if (
      //       time.state === TimeState.playing ||
      //       time.state === TimeState.paused
      //     ) {
      //       time.state = TimeState.stopped
      //     }
      //   })
      // },
    },
  }
}
