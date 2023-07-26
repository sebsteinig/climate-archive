import { enableMapSet } from "immer"
import { StateCreator } from "zustand"
import { VariableName } from "./variables/variable.types"
import { Publication, Experiments } from "../types"
import { isPublication } from "../types.utils"

enableMapSet()

type Collection = Publication | Experiments

export interface CollectionSlice {
  collections: Map<number, Collection>
  __collections_lookup: Map<string | Experiments, number>
  addCollection: (collection: Collection) => void
  displayCollection: (idx: number) => void
  hideCollection: (idx: number) => void
}


export const createTextureTreeSlice: StateCreator<
CollectionSlice,
  [["zustand/immer", never]],
  [],
  CollectionSlice
> = (set) => {
  return {
    texture_tree: new Map(),
    collections: new Map(),
    __collections_lookup: new Map(),
    displayed_collections: new Map(),
    addCollection: (collection: Collection) => {
      set((state) => {
        let idx = state.__collections_lookup.get(
          isPublication(collection)
            ? collection.title + collection.authors_short
            : JSON.stringify(collection),
        )
        if (!idx) {
          idx = state.collections.size
          state.collections.set(idx, collection)
          state.__collections_lookup.set(
            isPublication(collection)
              ? collection.title + collection.authors_short
              : JSON.stringify(collection),
            idx,
          )
        }
        // state.displayed_collections.clear()
        // state.displayed_collections.set(idx, 1)
      })
    },
    displayCollection: (idx: number) => {
      set((state) => {
        if (state.collections.has(idx)) {
          // const to_increment = state.displayed_collections.get(idx)
          // if (to_increment) {
          //   state.displayed_collections.set(idx, to_increment + 1)
          // } else {
          //   state.displayed_collections.set(idx, 1)
          // }
        }
      })
    },
    hideCollection: (idx: number) => {
      set((state) => {
        if (state.collections.has(idx)) {
          // const to_decrement = state.displayed_collections.get(idx)
          // if (to_decrement && to_decrement > 1) {
          //   state.displayed_collections.set(idx, to_decrement - 1)
          // } else {
          //   state.displayed_collections.delete(idx)
          // }
        }
      })
    },
  }
}
