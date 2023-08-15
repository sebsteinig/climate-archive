import { forwardRef, useImperativeHandle, useRef, useState } from "react"
import { ControllerRef, TimeController } from "./utils/TimeController"
import { IControllerRef } from "./controller.types"
import { TimeFrameRef, TimeID, WorldData } from "@/utils/store/time/time.type"
import { ProgessBarRef, ProgressBar } from "./utils/ProgressBar"
import { goto } from "@/utils/store/time/time.utils"
import { TimeScale } from "@/components/geologic_timescale/TimeScale"
import { useGeologicTree } from "@/components/geologic_timescale/geologic_tree"




type MonthlyControllerProps = {
    data: WorldData
    current_frame: TimeFrameRef
    time_id: TimeID
}

export const GeoTimeScaleController = forwardRef<IControllerRef,MonthlyControllerProps>(
    function GeoTimeScaleController({current_frame,time_id,data},ref) {
        const controller_ref = useRef<ControllerRef>(null)
        const progress_bar_ref = useRef<ProgessBarRef>(null)
        const [tree,exp_span_tree] = useGeologicTree()
        useImperativeHandle(ref,() => {
            return {
                onChange(frame) {
                    controller_ref.current?.onChange(frame)
                    const age = exp_span_tree.binder.get(Math.floor(frame.weight))?.high ?? 0
                    progress_bar_ref.current?.update((tree.root.data.age_span.to - age)/tree.root.data.age_span.to);
                },
                onWeightUpdate(frame) {
                    //const age = exp_span_tree.binder.get(Math.floor(frame.weight))?.high ?? 0
                    //progress_bar_ref.current?.update((tree.root.data.age_span.to - age)/tree.root.data.age_span.to);
                },
            }
        })
        return (
            <div className="w-full pt-5 px-5">
                <TimeController
                    current_frame={current_frame}
                    time_id={time_id}
                    data={data}
                    ref={controller_ref}
                />
                <div className="w-full my-2">
                    <ProgressBar ref={progress_bar_ref}/>
                </div>
                <TimeScale 
                    onChange={(idx,exp_id) => {
                        const frame = current_frame.current.get(time_id)
                        if (!frame) return
                        goto(frame, idx, () => {
                        })
                    }}
                />
            </div>
        )
    }
)
