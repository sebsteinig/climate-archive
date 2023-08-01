import { useClusterStore } from "@/utils/store/cluster.store"
import {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react"
import {
  TimeFrame,
  TimeFrameRef,
  TimeFrameState,
  TimeID,
  TimeMode,
  TimeState,
  WorldData,
} from "@/utils/store/time/time.type"
import { Collection } from "@/utils/store/collection.store"
import { goto } from "@/utils/store/time/time.utils"

type Props = {
  className?: string
  time_id: TimeID
  data:WorldData
  current_frame: TimeFrameRef
}

export type InputRef = {
  onChange: (frame: TimeFrame) => void
  onWeightUpdate:(frame: TimeFrame)=>void
}

export const TimeSlider = forwardRef<InputRef, Props>(function TimeSlider(
  { time_id, className, current_frame }: Props,
  ref,
) {
  const input_ref = useRef<HTMLInputElement>(null!)
  const is_changing = useRef(false)
  useImperativeHandle(ref, () => {
    return {
      onChange: (frame: TimeFrame) => {
       
      },
      onWeightUpdate : (frame: TimeFrame)=>{
        if(!is_changing.current){
          input_ref.current.value = frame.weight.toFixed(1).toString()
        }
      }
    }
  })
  return (
    <div className={className}>
      <input
        ref={input_ref}
        type="range"
        className="w-full"
        min={0}
        max={12}
        step={0.1}
        onChange={(e) => {
          const frame = current_frame.current.get(time_id)
          if(!frame) return;
          is_changing.current = true
          const to = parseFloat(e.target.value)
          goto(frame,to,undefined,()=>{
            is_changing.current = false
          })
        }}
      />
    </div>
  )
})
