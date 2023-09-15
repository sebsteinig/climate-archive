import { forwardRef, useImperativeHandle, useRef, useState } from "react"
import { ControllerRef, TimeController } from "./utils/TimeController"
import { IControllerRef } from "./controller.types"
import {
  TimeFrameRef,
  WorldID,
  WorldData,
} from "@/utils/store/worlds/time/time.type"
import { ProgessBarRef, ProgressBar } from "./utils/ProgressBar"
import { TimeScale } from "@/components/geologic_timescale/TimeScale"
import { useGeologicTree } from "@/utils/hooks/useGeologicTree"
import { goto } from "@/utils/store/worlds/time/loop"
import { useStore } from "@/utils/store/store"

import { TimeSlider, InputRef as TimeSliderRef } from "./utils/TimeSlider"

type MonthlyControllerProps = {
  data: WorldData
  current_frame: TimeFrameRef
  world_id: WorldID
  controller_ref: ControllerRef | undefined
}

export const GeoTimeScaleController = forwardRef<
  IControllerRef,
  MonthlyControllerProps
>(function GeoTimeScaleController(
  { current_frame, world_id, data, controller_ref },
  ref,
) {

  const timeScaleRef = useRef(); // This ref is to connect to TimeScale

  return (
    <div className="w-full pt-2 px-7">
      <div className="w-full my-2">
      <TimeSlider 
            world_id={world_id} 
            data={data} 
            current_frame={current_frame} 
            controller_ref={controller_ref} 
            labels={false}
          />
      </div>
      <TimeScale ref={timeScaleRef} //
        onChange={(idx, exp_id) => {
          const frame = current_frame.current.get(world_id)
          if (!frame) return
          // controller_ref?.pause()
          // console.log("frame: "+frame.weight)
          goto(frame, idx, 5.0, true, () => {})
          // console.log("index: "+idx)
        }}
        world_id={world_id} 
        current_frame={current_frame} 
      />
    </div>
  )
})
