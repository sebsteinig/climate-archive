import { useStore } from "@/utils/store/store"
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
  WorldID,
  TimeMode,
  WorldData,
} from "@/utils/store/worlds/time.type"
import { Collection } from "@/utils/store/collection/collection.store"
import { goto } from "@/utils/store/worlds/world.utils"

type Props = {
  className?: string
  world_id: WorldID
  data: WorldData
  current_frame: TimeFrameRef
}

export type InputRef = {
  onChange: (frame: TimeFrame) => void
  onWeightUpdate: (frame: TimeFrame) => void
}

export const TimeSlider = forwardRef<InputRef, Props>(function TimeSlider(
  { world_id, className, current_frame, data }: Props,
  ref,
) {
  const input_ref = useRef<HTMLInputElement>(null!)
  const is_changing = useRef(false)
  const departure = useRef<number>(null!)
  const destination = useRef<number>(null!)
  useImperativeHandle(ref, () => {
    return {
      onChange: (frame: TimeFrame) => {
        // const timestep = frame.timesteps
        // if (timestep && parseFloat(input_ref.current.max) !== timestep - 1) {
        //   input_ref.current.max = (timestep - 1).toString()
        // }
      },
      onWeightUpdate: (frame: TimeFrame) => {
        if (!is_changing.current) {
          input_ref.current.value = frame.weight.toFixed(1).toString()
        }
      },
    }
  })
  const max = useMemo(() => {
    if (data.time.mode === TimeMode.mean) {
      return data.collection.exps.length
    } else {
      const frame = current_frame.current.get(world_id)
      const timestep = frame?.timesteps
      return timestep ?? 0
    }
  }, [current_frame.current.get(world_id)])

  return (
    <div className={className}>
      <input
        ref={input_ref}
        type="range"
        className="w-full range accent-emerald-400"
        min={0}
        max={max}
        step={0.1}
        onPointerDown={() => {
          departure.current = Math.round(parseFloat(input_ref.current.value))
          is_changing.current = true
        }}
        onPointerUp={() => {
          const frame = current_frame.current.get(world_id)
          if (!frame) return
          const to = Math.round(destination.current)
          if (!to) return

          goto(frame, to, () => {
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
