
import { StateCreator } from "zustand"
import { Graph, GraphInfo } from "./graph.type"
import { Color } from "three"



export interface GraphSlice {
    graph : {
        graphs : Graph[]
        visible : boolean
        show : (visibility : boolean) => void
        add : (x:GraphInfo) => void
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
        add(graph_info) {
            set(state => {
                state.graph.visible = true
                const rgb = new Color()
                rgb.setRGB( Math.random(), Math.random()*0.8, Math.random()*0.3)
                
                let graph : Graph = {
                    lat : graph_info.lat,
                    lon : graph_info.lon,
                    data : graph_info.data,
                    id_label : graph_info.id_label,
                    color : `#${rgb.getHexString()}`
                }
                
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
