
import { StateCreator } from "zustand"
import { Graph } from "./graph.type"


export interface GraphSlice {
    graph : {
        graphs : Graph[]
        visible : boolean
        show : (visibility : boolean) => void
        add : (graph:Graph) => void
        remove : (idx:number) => void
        clear : () => void
    }
}

export const createGraphStore: StateCreator<
GraphSlice,
  [["zustand/immer", never]],
  [],
  GraphSlice
> = (set) => {
  return {
    graph : {
        graphs:[],
        visible : false,
        show(visibility) {
            set(state => {
                state.graph.visible = visibility
            })
        },
        add(graph) {
            set(state => {
                state.graph.visible = true
                state.graph.graphs.push(graph)
            })
        },
        remove(idx) {
            set(state => {
                state.graph.graphs.splice(idx,1)
            })
        },
        clear() {
            set(state => {
                state.graph.graphs = []
            })
        },
    }
  }
}
