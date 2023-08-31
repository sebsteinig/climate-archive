"use client"
import { Canvas } from "@react-three/fiber"
import { useEffect, useRef, useMemo, RefObject, useState } from "react"
import { useStore } from "@/utils/store/store"
import {
  TimeFrameRef,
  Slots,
  WorldID,
  WorldData,
} from "@/utils/store/worlds/time/time.type"
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
import { useInit } from "@/utils/hooks/useInit"
import { usePanels } from "@/utils/hooks/usePanels"
import { useScenes } from "@/utils/hooks/useScenes"
import { DefaultView } from "./DefaultView"
import { useActiveVariables } from "@/utils/hooks/useActiveVariables"

type Props = {
  displayCollection: (collection: Collection) => void
}

export function WorldManager(props: Props) {
  const worlds_slots = useStore((state) => state.worlds.slots)
  const [display_popup, displayPopup] = useState<boolean>(false)
  const [popup_info, setPopupInfo] = useState<PopupInfo | undefined>(undefined)
  const active_variables = useActiveVariables()
  const current_frame = useFrameRef()
  const canvas = useCanvas()
  useInit(worlds_slots, current_frame, active_variables)

  const grid = useMemo(() => {
    return gridOf(worlds_slots.size)
  }, [worlds_slots.size])

  const container_ref = useRef<HTMLDivElement>(null!)

  const panel_refs = usePanels(worlds_slots)
  const scene_refs = useScenes(worlds_slots)

  return (
    <DefaultView>
      {display_popup && popup_info != undefined && (
        <div className="max-w-full w-fit grow self-center pointer-events-auto">
          <Popup
            close={() => displayPopup(false)}
            data={popup_info.data}
            coordinate={popup_info.coordinate}
            world_id={popup_info.world_id}
          />
        </div>
      )}
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
                showPopup={(
                  data: WorldData,
                  x: Coordinate,
                  world_id: number,
                ) => {
                  setPopupInfo({
                    data: data,
                    world_id: world_id,
                    coordinate: x,
                  })
                  displayPopup(true)
                }}
              />
            )
          })}
        </Canvas>
      </div>
    </DefaultView>
  )
}
