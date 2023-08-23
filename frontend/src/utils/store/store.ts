import { create } from "zustand"
import { immer } from "zustand/middleware/immer"
import { VariableSlice, createVariableSlice } from "./variables/variable.store"
import { CollectionSlice, createCollectionSlice } from "./collection.store"
import { WorldSlice, createWorldSlice } from "./worlds/world.store"
import { GraphSlice, createGraphStore } from "./graph/graph.store"

type Store = VariableSlice & CollectionSlice & WorldSlice & GraphSlice

export const useStore = create<Store, [["zustand/immer", never]]>(
  immer((...a) => {
    return {
      ...createVariableSlice(...a),
      ...createCollectionSlice(...a),
      ...createWorldSlice(...a),
      ...createGraphStore(...a),
    }
  }),
)
