import {
  TimeFrameRef,
  TimeID,
  WorldData,
} from "@/utils/store/time/time.type"
import {
  RefObject,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react"
import {
  ControllerRef,
  TimeController,
} from "../time_controllers/TimeController"
import { InputRef, TimeSlider } from "../time_controllers/TimeSlider"
import { Container, ContainerRef } from "./container"
import { gridOf } from "@/utils/types.utils"
import { Collection } from "@/utils/store/collection.store"

export type PanelProps = {
  displayCollection : (collection : Collection) => void
  time_id:TimeID
  data: WorldData
  current_frame: TimeFrameRef
}

export type PanelRef = {
  container_ref : RefObject<ContainerRef>,
  controller_ref : RefObject<ControllerRef>,
  input_ref : RefObject<InputRef>,
}

export const Panel = forwardRef<PanelRef, PanelProps>(function Panel(
  { data , time_id , current_frame, displayCollection },
  refs,
) {
  const input_ref = useRef<InputRef>(null)
  const controller_ref = useRef<ControllerRef>(null)
  const container_ref = useRef<ContainerRef>(null)

  useImperativeHandle(refs, () => {
    return {
      input_ref,
      controller_ref,
      container_ref,
    }
  }) 

  return (
    <div className="w-full h-full grid grid-cols-1 grid-rows-2 gap-2">
      <div className="row-span-4 border-2 border-slate-900 rounded-md">

          <Container
            displayCollection={displayCollection}
            current_frame={current_frame}
            ref={container_ref}
            time_id={time_id}
            data={data}
          />
      </div>
      <div className="row-start-5 z-10">
        <TimeController
          current_frame={current_frame}
          time_id={time_id}
          data={data}
          ref={controller_ref}
        />
        <TimeSlider
          current_frame={current_frame}
          data={data}
          time_id={time_id}
          className="w-full"
          ref={input_ref}
        />
      </div>
    </div>
  )
})
