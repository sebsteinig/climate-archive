import { Time, TimeFrame, TimeState } from "@/utils/store/time/time.type"
import { VariableName } from "@/utils/store/variables/variable.types"
import {
  MutableRefObject,
  RefObject,
  createRef,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react"
import { CanvasHolder, tickBuilder } from "../tick"
import { View } from "@react-three/drei"
import { World } from "../../3D_components/World"
import { TimeController } from "../time_controllers/TimeController"
import { useClusterStore } from "@/utils/store/cluster.store"
import { TimeSlider } from "../time_controllers/TimeSlider"
import React from "react"
import { Scene } from "./scene"
import { Panel, Refs } from "./panel"
import { Experiments, Publication } from "@/utils/types"
import { TextureTree } from "@/utils/database_provider/database_provider.types"

export function useTimePanel(
  time_slots: Map<number, Time>,
  saved_frames: Map<number, Map<number, TimeFrame>>,
  collections: Map<number, Publication | Experiments>,
  active_variables: VariableName[],
  tree: TextureTree,
  context: CanvasHolder,
) {
  const scenes: JSX.Element[] = []
  const panels: JSX.Element[] = []
  const container_refs = useRef<Map<number, Refs>>(new Map())
  for (let [time_idx, time] of time_slots) {
    panels.push(
      <Panel
        key={time_idx}
        time={time}
        time_idx={time_idx}
        ref={(el: Refs) => {
          container_refs.current.set(time_idx, el)
          return el
        }}
      />,
    )
    for (let [collection_idx, occurence] of time.collections) {
      const refs = container_refs.current.get(time_idx)
      if (!refs) continue
      const r = refs.container_refs.current?.get(collection_idx)
      if (!r) continue
      const frame = saved_frames.get(time_idx)!.get(collection_idx)!
      const exps = collections.get(collection_idx)!.exps
      let i = 0
      for (let ref of r) {
        scenes.push(
          <Scene
            key={i}
            time={time}
            frame={frame}
            exps={exps}
            tree={tree}
            context={context}
            active_variables={active_variables}
            track={ref.ref}
            onChange={ref.onChange}
          />,
        )
        i += 1
      }
    }
  }
  return [scenes, panels]
}
