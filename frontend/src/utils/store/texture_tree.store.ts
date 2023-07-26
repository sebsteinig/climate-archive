import { enableMapSet } from "immer"
import { StateCreator } from "zustand"
import {
  TextureBranch,
  TextureLeaf,
  TextureTree,
} from "../database_provider/database_provider.types"
import { VariableName } from "./variables/variable.types"
import { Publication, Experiments } from "../types"
import { isPublication } from "../types.utils"

enableMapSet()

type Collection = Publication | Experiments

export interface TextureTreeSlice {
  texture_tree: TextureTree
  collections: Map<number, Collection>
  __collections_lookup: Map<string | Experiments, number>
  displayed_collections: Map<number, number>
  addCollection: (collection: Collection) => void
  push: (branch: TextureBranch) => void
  pushAll: (branches: TextureBranch[]) => void
  displayCollection: (idx: number) => void
  hideCollection: (idx: number) => void
}

function pushBranchToTree(branch: TextureBranch, tree: TextureTree) {
  const element = tree.get(branch.exp_id)
  if (element) {
    const variables = element.get(branch.variable)
    if (!variables) {
      element.set(branch.variable, branch)
    }
  } else {
    tree.set(branch.exp_id, new Map().set(branch.variable, branch))
  }
}

export function findInTree(
  exp_id: string,
  variable: VariableName,
  tree: TextureTree,
) {
  const element = tree.get(exp_id)
  if (element) {
    const variables = element.get(variable)
    if (variables) {
      return variables
    }
  }
  return undefined
}

export const createTextureTreeSlice: StateCreator<
  TextureTreeSlice,
  [["zustand/immer", never]],
  [],
  TextureTreeSlice
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
        state.displayed_collections.clear()
        state.displayed_collections.set(idx, 1)
      })
    },
    push: (branch: TextureBranch) => {
      set((state) => {
        pushBranchToTree(branch, state.texture_tree)
      })
    },
    pushAll: (branches: TextureBranch[]) => {
      set((state) => {
        branches.forEach((branch) => {
          pushBranchToTree(branch, state.texture_tree)
        })
      })
    },
    displayCollection: (idx: number) => {
      set((state) => {
        if (state.collections.has(idx)) {
          const to_increment = state.displayed_collections.get(idx)
          if (to_increment) {
            state.displayed_collections.set(idx, to_increment + 1)
          } else {
            state.displayed_collections.set(idx, 1)
          }
        }
      })
    },
    hideCollection: (idx: number) => {
      set((state) => {
        if (state.collections.has(idx)) {
          const to_decrement = state.displayed_collections.get(idx)
          if (to_decrement && to_decrement > 1) {
            state.displayed_collections.set(idx, to_decrement - 1)
          } else {
            state.displayed_collections.delete(idx)
          }
        }
      })
    },
  }
}
