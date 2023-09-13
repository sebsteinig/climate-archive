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
  const progress_bar_ref = useRef<ProgessBarRef>(null)
  const [tree, exp_span_tree] = useGeologicTree()
  useImperativeHandle(ref, () => {
    return {
      onChange(frame) {
        const age =
          exp_span_tree.binder.get(Math.floor(frame.weight))?.high ?? 0
        progress_bar_ref.current?.update(
          (tree.root.data.age_span.to - age) / tree.root.data.age_span.to,
        )
      },
      onWeightUpdate(frame) {
        //const age = exp_span_tree.binder.get(Math.floor(frame.weight))?.high ?? 0
        //progress_bar_ref.current?.update((tree.root.data.age_span.to - age)/tree.root.data.age_span.to);
      },
    }
  })
  return (
    <div className="w-full pt-5 px-5">
      <div className="w-full my-2">
        <ProgressBar ref={progress_bar_ref} />
      </div>
      <TimeScale
        onChange={(idx, exp_id) => {
          const frame = current_frame.current.get(world_id)
          if (!frame) return
          controller_ref?.pause()
          goto(frame, idx, () => {})
        }}
      />
    </div>
  )
})
