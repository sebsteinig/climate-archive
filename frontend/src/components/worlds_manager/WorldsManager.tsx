"use client"
import { Canvas } from "@react-three/fiber"
import { useEffect, useRef, useMemo, RefObject, useState } from "react"
import { useStore } from "@/utils/store/store"
import { TimeFrameRef, Slots, WorldID, WorldData } from "@/utils/store/worlds/time.type"
import { EVarID } from "@/utils/store/variables/variable.types"
import { gridOf } from "@/utils/types.utils"
import { Panel, PanelRef } from "./world_panel/Panel"
import React from "react"
import { Scene, SceneRef } from "./world_panel/Scene"
import { Collection } from "@/utils/store/collection/collection.store"
import { usePathname, useRouter } from "next/navigation"
import { resolveURLparams } from "@/utils/URL_params/url_params.utils"
import { useFrameRef } from "@/utils/hooks/useFrameRef"
import { useCanvas } from "@/utils/hooks/useCanvas"
import { ErrorBoundary, useErrorBoundary } from "react-error-boundary"
import Link from "next/link"
import { Popup, PopupInfo } from "./world_panel/utils/Popup"
import { Coordinate } from "@/utils/store/graph/graph.type"

type Props = {
  displayCollection: (collection: Collection) => void
}


export function WorldManager(props: Props) {
  const worlds_slots = useStore((state) => state.worlds.slots)
  const [display_popup, displayPopup] = useState<boolean>(false)
  const [popup_info, setPopupInfo] = useState<PopupInfo | undefined>(undefined)
  
  const stored_active_variables = useStore((state) => state.active_variables)
  const active_variables = useMemo(() => {
    let actives = []
    for (let [key, active] of stored_active_variables.entries()) {
      if (active) actives.push(key)
    }
    return actives
  }, [stored_active_variables])

  const current_frame = useFrameRef()
  const canvas = useCanvas()

  const { showBoundary } = useErrorBoundary()
  const [is_empty, setEmpty] = useState<undefined | boolean>(undefined)
  useEffect(() => {
    if (worlds_slots.size === 0 && is_empty !== undefined) {
      setEmpty(true)
    } else {
      setEmpty(false)
    }
  }, [worlds_slots.size])
  useEffect(() => {
    // PREPARE EACH TIME FRAMES
    init(worlds_slots, current_frame, active_variables)
      .then(() => {
        if (pathname.includes("publication")) {
          const search_params = resolveURLparams(worlds_slots)
          router.push(pathname + "?" + search_params.toString())
        }
      })
      .catch((e) => {
        showBoundary(e)
      })
  }, [worlds_slots, active_variables])
  const router = useRouter()
  const pathname = usePathname()

  const grid = useMemo(() => {
    return gridOf(worlds_slots.size)
  }, [gridOf(worlds_slots.size)])

  const container_ref = useRef<HTMLDivElement>(null!)

  const panel_refs = useRef<RefObject<PanelRef>[]>([])
  for (let world_id of worlds_slots.keys()) {
    panel_refs.current[world_id] = React.createRef<PanelRef>()
  }
  const scene_refs = useRef<RefObject<SceneRef>[]>([])
  for (let world_id of worlds_slots.keys()) {
    scene_refs.current[world_id] = React.createRef<SceneRef>()
  }

  if (is_empty) {
    return (
      <div className="w-full h-full flex flex-col">
        <div className="grow-0 self-end">
          <Link
            href={"/"}
            className="overflow-hidden h-14 cursor-pointer flex items-center"
          >
            <h1 className="">CLIMATE ARCHIVE</h1>
          </Link>
        </div>
        <div className="w-full h-full flex justify-center items-center">
          <div>
            <h1 className="font-bold text-center small-caps text-5xl">
              Nothing to see here !
            </h1>
            <br />
            <p className="text-center">
              Try searching for the publication using our handy search bar up
              top,
              <br /> or simply head back to our{" "}
              <Link
                href={"/"}
                className="cursor-pointer text-emerald-500 tracking-widest small-caps"
              >
                homepage
              </Link>
              . Safe travels!{" "}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {display_popup && (popup_info != undefined) && 
        <div className="max-w-full w-fit grow self-center pointer-events-auto">
            <Popup
              close = {() => displayPopup(false)}
              data={popup_info.data}
              coordinate = {popup_info.coordinate}
              world_id = {popup_info.world_id}
            />
        </div>
      }
      <div className={`flex flex-grow h-full`}>
        <div
          ref={container_ref}
          className={`w-full h-full grid gap-4 `}
          style={{
            gridTemplateColumns: `repeat(${grid.cols}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${grid.rows}, minmax(0, 1fr))`,
          }}
        >
          {Array.from(worlds_slots, ([world_id, data], idx) => {
            return (
              <Panel
                displayCollection={props.displayCollection}
                grid_id={idx}
                current_frame={current_frame}
                key={world_id}
                data={data}
                world_id={world_id}
                ref={panel_refs.current[world_id]!}
                scene_ref={scene_refs.current[world_id]!}
              />
            )
          })}
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
          {Array.from(worlds_slots, ([world_id, data]) => {
            return (
              <Scene
                key={world_id}
                world_id={world_id}
                data={data}
                current_frame={current_frame}
                canvas={canvas}
                active_variables={active_variables}
                panel_ref={panel_refs.current[world_id]}
                ref={scene_refs.current[world_id]!}
                showPopup={(data : WorldData, x:Coordinate, world_id : number) => {
                  setPopupInfo({data : data, world_id : world_id, coordinate : x})
                  displayPopup(true)
                }}
              />
            )
          })}
        </Canvas>
      </div>
    </>
  )
}

async function init(
  slots: Slots,
  current_frame: TimeFrameRef,
  active_variables: EVarID[],
) {
  for (let [world_id, data] of slots) {
    const exp = data.exp ?? data.collection.exps[0]
    await current_frame.current.init(world_id, exp, active_variables, data)
  }
}
