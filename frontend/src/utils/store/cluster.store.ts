import { create } from "zustand"
import { immer } from "zustand/middleware/immer"
import { VariableSlice, createVariableSlice } from "./variables/variable.store"
import { CollectionSlice, createCollectionSlice } from "./collection.store"
import { TimeSlice, createTimeSlice } from "./time/time.store"
import { GraphSlice, createGraphStore } from "./graph/graph.store"

type Store = VariableSlice & CollectionSlice & TimeSlice & GraphSlice

export const useClusterStore = create<Store, [["zustand/immer", never]]>(
  immer((...a) => {
    return {
      ...createVariableSlice(...a),
      ...createCollectionSlice(...a),
      ...createTimeSlice(...a),
      ...createGraphStore(...a),
    }
  }),
)
