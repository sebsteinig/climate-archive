"use client"
import { Canvas } from "@react-three/fiber"
import { useEffect, useRef, useState, useMemo, RefObject, useCallback, MutableRefObject } from "react"
import { useClusterStore } from "@/utils/store/cluster.store"
import {
  TimeFrameRef,
  Slots,
  TimeID,
} from "@/utils/store/time/time.type"
import { VariableName } from "@/utils/store/variables/variable.types"
import { gridOf } from "@/utils/types.utils"
import { useFrameRef } from "./useFrameRef"
import { useCanvas } from "./useCanvas"
import { Panel, PanelRef } from "./time_panel/panel"
import React from "react"
import { Scene } from "./time_panel/scene"
import { sync } from "@/utils/store/time/time.utils"

type Props = {}

export function TimeProvider(props: Props) {
  const time_slots = useClusterStore((state) => state.time.slots)
  const variables = useClusterStore((state) => state.variables)
  const active_variables = useMemo(() => {
    return Object.values(variables)
      .filter((v) => v.active)
      .map((e) => e.name)
  }, [variables])

  // useEffect(() => {
  //   if (active_variable.length === 0) {
  //     pauseAll()
  //   }
  // }, [active_variable])
  
  const current_frame = useFrameRef()
  const canvas = useCanvas()

  useEffect(() => {
    // PREPARE EACH TIME FRAMES
    init(time_slots, current_frame, active_variables)

  }, [time_slots, active_variables])
  
  const grid = useMemo(()=> {
    return gridOf(time_slots.size)
  },[gridOf(time_slots.size)])
  
  const container_ref = useRef<HTMLDivElement>(null!)
  const panel_refs = useRef<RefObject<PanelRef>[]>([])
  for(let time_id of time_slots.keys()){
    panel_refs.current[time_id] = React.createRef<PanelRef>()
  }

  return (
    <>


      <div className="flex flex-grow h-full">
        <div
          ref={container_ref}
          className={`ml-20 w-full h-full grid gap-4 `}
          style={
            {
              gridTemplateColumns: `repeat(${grid.cols}, minmax(0, 1fr))`,
              gridTemplateRows : `repeat(${grid.rows}, minmax(0, 1fr))`
            }
          }
        >
          {
            Array.from(time_slots,
              ([time_id,data]) => {

                return <Panel
                  current_frame={current_frame}
                  key={time_id}
                  data={data}
                  time_id={time_id}
                  ref={panel_refs.current[time_id]!}
                />
              }
            )
          }
          </div>
      </div>
      <div className="fixed top-0 left-0 -z-10 w-screen h-screen">
        <Canvas
          camera={{
            fov: 55,
            near: 0.1,
            far: 200,
            position: [3, 2, 9],
          }}
          shadows
          eventSource={container_ref}
        >
          {
            Array.from(time_slots,
              ([time_id,data]) => {
                
                return <Scene
                key={time_id}
                time_id={time_id}
                data={data}
                current_frame={current_frame}
                canvas={canvas}
                active_variables={active_variables}
                panel_ref={panel_refs.current[time_id]}
                />
              }
            )
          }
        </Canvas>
      </div>

    </>
  )
}

async function init(
  slots: Slots,
  current_frame: TimeFrameRef,
  active_variables: VariableName[],
) {
  for (let [time_id, data] of slots) {
    const exp = current_frame.current.get(time_id)?.exp ?? data.collection.exps[0]
    await current_frame.current.init(time_id,exp,active_variables)
  }
}
