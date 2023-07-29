import { Time, TimeFrame, TimeFrameRef, TimeState } from "@/utils/store/time/time.type"
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
import { uniqueIdx } from "@/utils/types.utils"

export function useTimePanel(
  time_slots: Map<number, Time>,
  current_frame:TimeFrameRef,
  collections: Map<number, Publication | Experiments>,
  active_variables: VariableName[],
  context: CanvasHolder,
) {
  if(!current_frame.current) {
    return [[],[]]
  }
  const scenes: JSX.Element[] = []
  const panels: JSX.Element[] = []
  const container_refs = useRef<Map<number, Refs>>(new Map())
  for (let [time_idx, time] of time_slots) {
    panels.push(
      <Panel
      current_frame={current_frame}
        key={time_idx}
        time={time}
        time_idx={time_idx}
        ref={(el: Refs) => {
          container_refs.current.set(time_idx, el)
          return el
        }}
      />,
    )
    for (let [collection_idx, _] of time.collections) {
      const refs = container_refs.current.get(time_idx)
      if (!refs) continue
      const container_ref = refs.container_refs.current?.get(collection_idx)
      if (!container_ref) continue
      const exps = collections.get(collection_idx)!.exps
      scenes.push(
        <Scene
          key={uniqueIdx(time_idx, collection_idx,0)}
          time_idx={time_idx}
          collection_idx={collection_idx}
          time={time}
          current_frame={current_frame}
          exps={exps}
          context={context}
          active_variables={active_variables}
          track={container_ref.ref}
          onChange={container_ref.onChange}
        />,
      )
      
    }
  }
  return [scenes, panels]
}
