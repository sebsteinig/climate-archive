import { useStore } from "@/utils/store/store"
import CrossIcon from "$/assets/icons/cross-small-emerald-300.svg"
import {
  MutableRefObject,
  RefObject,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react"
import {
  TimeFrameRef,
  WorldID,
  WorldData,
} from "@/utils/store/worlds/time/time.type"
import { isPublication } from "@/utils/types.utils"
import { Collection } from "@/utils/store/collection.store"
import { ContainerConf } from "./utils/ContainerConf"
import { SceneRef } from "./Scene"
import {
  ControllerRef,
  TimeController,
} from "../time_controllers/utils/TimeController"
import { Selector } from "./utils/Selector"

type Props = {
  className?: string
  world_id: WorldID
  grid_id: number
  data: WorldData
  displayCollection: (collection: Collection) => void
  current_frame: TimeFrameRef
  scene_ref: RefObject<SceneRef>
}

export type ContainerRef = {
  track: MutableRefObject<HTMLDivElement>
  controller: ControllerRef
}

export const Container = forwardRef<ContainerRef, Props>(function Container(
  {
    world_id,
    data,
    className,
    grid_id,
    current_frame,
    displayCollection,
    scene_ref,
  },
  ref,
) {
  const remove = useStore((state) => state.worlds.remove)

  const div_ref = useRef<HTMLDivElement>(null!)
  const controller_ref = useRef<ControllerRef>(null)

  useImperativeHandle(ref, () => {
    return {
      track: div_ref,
      controller: controller_ref.current!,
    }
  })

  return (
    <div
      className={`relative select-none p-5 flex flex-col justify-between
        overflow-hidden w-full h-full ${className ?? ""}`}
      ref={div_ref}
    >
      <div
        className="max-w-1/2 w-fit
          flex flex-row"
      >
        <CrossIcon
          className="grow-0 shrink-0 w-10 h-10 cursor-pointer text-slate-400 hover:tex-slate-300"
          onClick={() => {
            current_frame.current.map.delete(world_id)
            remove(world_id)
          }}
        />
        <Selector data={data} world_id={world_id} />
      </div>

      <div className="pointer-events-none max-h-full justify-end mr-20 flex flex-col gap-5">
        <TimeController
          className="grow-0 shrink-0"
          current_frame={current_frame}
          world_id={world_id}
          data={data}
          ref={controller_ref}
        />
        {data.collection && isPublication(data.collection) && (
          <p className="select-none italic text-slate-400 text-sm">
            {data.collection.authors_short}, {data.collection.year}
          </p>
        )}
      </div>
      <ContainerConf
        className="absolute right-0 bottom-0 m-5"
        data={data}
        current_frame={current_frame}
        displayCollection={displayCollection}
        world_id={world_id}
        scene_ref={scene_ref}
      />
    </div>
  )
})
