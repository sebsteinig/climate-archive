import { create } from "zustand"
import { immer } from "zustand/middleware/immer"
import { VariableSlice, createVariableSlice } from "./variables/variable.store"
import { CollectionSlice, createTextureTreeSlice } from "./collection.store"
import { TimeSlice, createTimeSlice } from "./time/time.store"

type Store = VariableSlice & CollectionSlice & TimeSlice

export const useClusterStore = create<Store, [["zustand/immer", never]]>(
  immer((...a) => {
    return {
      ...createVariableSlice(...a),
      ...createTextureTreeSlice(...a),
      ...createTimeSlice(...a),
    }
  }),
)
