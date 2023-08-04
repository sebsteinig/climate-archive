import { useClusterStore } from "@/utils/store/cluster.store"
import {
  forwardRef,
  useEffect,
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
  data: WorldData
  current_frame: TimeFrameRef
}

export type InputRef = {
  onChange: (frame: TimeFrame) => void
  onWeightUpdate: (frame: TimeFrame) => void
}

export const TimeSlider = forwardRef<InputRef, Props>(function TimeSlider(
  { time_id, className, current_frame }: Props,
  ref,
) {
  const input_ref = useRef<HTMLInputElement>(null!)
  const is_changing = useRef(false)
  const departure = useRef<number>(null!)
  const destination = useRef<number>(null!)
  useImperativeHandle(ref, () => {
    return {
      onChange: (frame: TimeFrame) => {
        const first = frame?.variables.values().next().value as
          | TimeFrameState
          | undefined
        const timestep = first?.info.timesteps
        if (timestep && parseFloat(input_ref.current.max) !== timestep - 1) {
          input_ref.current.max = (timestep - 1).toString()
        }
      },
      onWeightUpdate: (frame: TimeFrame) => {
        if (!is_changing.current) {
          input_ref.current.value = frame.weight.toFixed(1).toString()
        }
      },
    }
  })
  const max = useMemo(() => {
    const frame = current_frame.current.get(time_id)
    const first = frame?.variables.values().next().value as
      | TimeFrameState
      | undefined
    const timestep = first?.info.timesteps
    return timestep ?? 0
  }, [current_frame.current.get(time_id)])

  return (
    <div className={className}>
      <input
        ref={input_ref}
        type="range"
        className="w-full"
        min={0}
        max={max}
        step={0.1}
        onPointerDown={() => {
          departure.current = Math.round(parseFloat(input_ref.current.value))
        }}
        onPointerUp={() => {
          const frame = current_frame.current.get(time_id)
          if (!frame) return
          is_changing.current = true
          const to = Math.round(destination.current)
          if (!to) return
          const duration =
            (5 * Math.abs(to - departure.current ?? 0)) / (max > 0 ? max : 1)
          goto(frame, to, duration, () => {
            is_changing.current = false
          })
        }}
        onChange={(e) => {
          destination.current = parseFloat(e.target.value)
        }}
      />
    </div>
  )
})
