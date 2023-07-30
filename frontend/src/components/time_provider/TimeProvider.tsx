"use client"
import { Canvas } from "@react-three/fiber"
import { useEffect, useRef, useState, useMemo, RefObject, useCallback } from "react"
import { useClusterStore } from "@/utils/store/cluster.store"
import {
  Time,
  TimeMode,
  TimeFrame,
  TimeState,
  TimeFrameValue,
  TimeFrameRef,
  TimeFrameHolder,
} from "@/utils/store/time/time.type"
import { initFrame } from "@/utils/store/time/time.utils"
import { OrbitControls } from "@react-three/drei"
import { CanvasHolder, tickBuilder } from "./tick"
import { produce } from "immer"
import { sync } from "@/utils/store/time/handlers/utils"
import { Plane } from "../3D_components/Plane"
import THREE from "three"
import { useTimePanel } from "./time_panel/useTimePanel"
import { VariableName } from "@/utils/store/variables/variable.types"
import { Experiments, Publication } from "@/utils/types"
import { Perf } from "r3f-perf"
import { cssGrid } from "@/utils/types.utils"

type Props = {}

var config = {
  model: "Dune",
  heightData: "/assets/textures/tfgzk_height.smoothed.png",
}

export function TimeProvider(props: Props) {
  const prepareTime = useClusterStore((state) => state.time.prepareAll)
  //const saveAll = useClusterStore((state) => state.time.saveAll)
  const pauseAll = useClusterStore((state) => state.time.pauseAll)
  const time_slots = useClusterStore((state) => state.time.slots.map)
  const variables = useClusterStore((state) => state.variables)
  const collections = useClusterStore((state) => state.collections)
  const active_variable = useMemo(() => {
    return Object.values(variables)
      .filter((v) => v.active)
      .map((e) => e.name)
  }, [variables])
  useEffect(() => {
    if (active_variable.length === 0) {
      pauseAll()
    }
  }, [active_variable])
  //const saved_frames = useClusterStore((state) => state.time.saved_frames)
  const current_frame = useRef<TimeFrameHolder>({
    map: new Map(),
    update(frame, time_id, collection_id) {
      const time = this.map.get(time_id)
      if (!time) {
        const collection = new Map()
        collection.set(collection_id, frame)
        this.map.set(time_id, collection)
        return frame
      }
      time.set(collection_id, frame)
      return frame
    },
    get(time_id, collection_id) {
      return this.map.get(time_id)?.get(collection_id)
    },
  })

  const current_canvas = document.createElement("canvas")
  const current_ctx = current_canvas.getContext("2d")
  const next_canvas = document.createElement("canvas")
  const next_ctx = next_canvas.getContext("2d")
  const context = {
    current: {
      canvas: current_canvas,
      ctx: current_ctx,
    },
    next: {
      canvas: next_canvas,
      ctx: next_ctx,
    },
  } as CanvasHolder

  useEffect(() => {
    // PREPARE EACH TIME FRAMES

    init(time_slots, collections, current_frame, active_variable).then(
      (res) => {
        prepareTime(res)
      },
    )
  }, [time_slots, active_variable])

  const container_ref = useRef<HTMLDivElement>(null!)
  const [scenes, panels] = useTimePanel(
    time_slots,
    current_frame,
    collections,
    active_variable,
    context,
    )

  const css_grid = useCallback((size:number) => {
    const grid = cssGrid(size)
    return `w-full h-full grid gap-4 ${grid.cols} ${grid.rows}`

  },[time_slots.size])
  console.log(css_grid(time_slots.size));
  
  return (
    <>
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
            {scenes}
            {/* <View track={view1}>
                    <World config={config} tick={async (x)=>new Map()}/>
                    <PerspectiveCamera makeDefault position={[3, 2, 9]} fov={55} near={0.1} far={200} />
                    <OrbitControls makeDefault />
                </View> */}
            {/* <OrbitControls /> */}
          </Canvas>
        </div>
      <div
        ref={container_ref}
        className={css_grid(time_slots.size)}
      >
        {panels}
      </div>
    </>
  )
}

async function init(
  time_slots: Map<number, Time>,
  collections: Map<number, Publication | Experiments>,
  current_frame: TimeFrameRef,
  active_variables: VariableName[],
) {
  const res = []
  for (let [time_idx, time] of time_slots) {
    if (time.state !== TimeState.zero && time.state !== TimeState.stopped) {
      continue
    }
    res.push(time_idx)
    for (let [collection_idx, _] of time.collections) {
      const collection = collections.get(collection_idx)
      if (!collection) {
        continue
      }
      let frame = await initFrame(time, collection.exps, active_variables)
      console.log("INIT")
      current_frame.current.update(frame, time_idx, collection_idx)
    }
  }
  return res
}
