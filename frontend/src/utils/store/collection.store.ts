import { enableMapSet } from "immer"
import { StateCreator } from "zustand"
import { VariableName } from "./variables/variable.types"
import { Publication, Experiments } from "../types"
import { isPublication } from "../types.utils"

enableMapSet()

export type Collection = Publication | Experiments

export interface CollectionSlice {
  collections: Map<number, Collection>
  addCollection: (idx: number, collection: Collection) => void
}

export const createTextureTreeSlice: StateCreator<
  CollectionSlice,
  [["zustand/immer", never]],
  [],
  CollectionSlice
> = (set) => {
  return {
    collections: new Map(),
    addCollection: (collection_idx, collection: Collection) => {
      set((state) => {
        state.collections.set(collection_idx, collection)
      })
    },
  }
}