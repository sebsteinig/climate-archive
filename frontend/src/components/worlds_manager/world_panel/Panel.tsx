import {
  TimeController,
  TimeFrameRef,
  WorldID,
  WorldData,
} from "@/utils/store/worlds/time/time.type"
import { RefObject, forwardRef, useImperativeHandle, useRef } from "react"
import { Container, ContainerRef } from "./Container"
import { Collection } from "@/utils/store/collection/collection.store"
import { SceneRef } from "./Scene"
import { MonthlyController } from "../time_controllers/MonthlyController"
import { IControllerRef } from "../time_controllers/controller.types"
import { GeoTimeScaleController } from "../time_controllers/GeoTimeScaleController"

import { TimeSlider } from "../time_controllers/utils/TimeSlider"

export type PanelProps = {
  displayCollection: (collection: Collection) => void
  world_id: WorldID
  grid_id: number
  data: WorldData
  current_frame: TimeFrameRef
  scene_ref: RefObject<SceneRef>
}

export type PanelRef = {
  container_ref: RefObject<ContainerRef>
  controller_ref: RefObject<IControllerRef>
}

export const Panel = forwardRef<PanelRef, PanelProps>(function Panel(
  { data, world_id, grid_id, current_frame, displayCollection, scene_ref },
  refs,
) {
  const controller_ref = useRef<IControllerRef>(null)
  const container_ref = useRef<ContainerRef>(null)

  useImperativeHandle(refs, () => {
    return {
      controller_ref,
      container_ref,
    }
  })

  return (
    <div className="w-full h-full flex flex-col">
      <div className="grow border-2 border-slate-950 rounded-lg overflow-hidden">
        <Container
          displayCollection={displayCollection}
          current_frame={current_frame}
          grid_id={grid_id}
          ref={container_ref}
          world_id={world_id}
          data={data}
          scene_ref={scene_ref}
        />
      </div>
      <div className="z-10">
        {data.time.controller === TimeController.monthly && (
          <MonthlyController
            ref={controller_ref}
            world_id={world_id}
            data={data}
            controller_ref={container_ref.current?.controller}
            current_frame={current_frame}
          />
        )}
        {data.time.controller === TimeController.geologic && (
          <GeoTimeScaleController
            ref={controller_ref}
            current_frame={current_frame}
            data={data}
            controller_ref={container_ref.current?.controller}
            world_id={world_id}
          />
        )}
      </div>
    </div>
  )
})
