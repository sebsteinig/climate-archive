// Importing necessary React hooks and utility functions
import { useStore } from "@/utils/store/store"
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react"

// Importing various types that represent specific data structures or states
import {
  TimeFrame,
  TimeFrameRef,
  TimeFrameState,
  WorldID,
  TimeMode,
  WorldData,
} from "@/utils/store/worlds/time/time.type"
import { goto, jumpTo } from "@/utils/store/worlds/time/loop"
import { ControllerRef } from "./TimeController"
import Slider from '@material-ui/core/Slider';

// Define the properties (Props) expected for the component
type Props = {
  className?: string
  world_id: WorldID
  data: WorldData
  current_frame: TimeFrameRef
  controller_ref: ControllerRef | undefined
  onSliderChange?: (value: number) => void
}

// Define a type for the forwarded ref
export type InputRef = {
  onChange: (frame: number) => void
  onWeightUpdate: (frame: number) => void
}

// Define the TimeSlider component
export const TimeSlider = forwardRef<InputRef, Props>(function TimeSlider(
  { world_id, className, current_frame, data, onSliderChange }: Props,
  ref,
) {
  // Declare references for input element, and state variables
  const input_ref = useRef<HTMLInputElement>(null!)
  const is_changing = useRef(false)
  const departure = useRef<number>(null!)
  const destination = useRef<number>(null!)

  const worlds = useStore((state) => state.worlds.slots)


  // Expose some methods to parent components via ref
  useImperativeHandle(ref, () => {
    return {
      onChange: (frame: number) => {
        if (!is_changing.current) {
          // input_ref.current.value = frame.weight.toFixed(1).toString()
          input_ref.current.value = frame.toString()
        }        
      },
      onWeightUpdate: (frame: number) => {
        if (!is_changing.current) {
          // input_ref.current.value = frame.weight.toFixed(1).toString()
          input_ref.current.value = frame.toString()
        }
      },
    }
  })

  // Calculate the maximum value for the slider based on data
  const max = useMemo(() => {
    if (data.time.mode === TimeMode.mean) {
      console.log(data.collection)
      return data.collection.exps.length
    } else {
      const frame = current_frame.current.get(world_id)
      const timestep = frame?.timesteps
      return timestep ?? 0
    }
  }, [current_frame.current.get(world_id)])

  // Render the component
  return (
    <div className={className}>
      <input
        ref={input_ref}
        type="range" // It's a range slider input
        className="w-full range accent-emerald-400"
        min={0}
        max={max}
        step={0.01}
        // onPointerDown={() => {
        //   // Capture the value when slider is initially clicked
        //   departure.current = Math.round(parseFloat(input_ref.current.value))
        //   is_changing.current = true
        // }}
        onPointerUp={() => {
          // Capture the final value when the slider is released
          const frame = current_frame.current.get(world_id)
          if (!frame) return
          const to = Math.round(destination.current)
          if (!to) return

          // Move to the specified frame after slider is released
          goto(frame, to, () => {
            is_changing.current = false
          })
        }}
        onChange={(e) => {
          // Update the destination value whenever slider value changes
          destination.current = parseFloat(e.target.value)
          for (let w of worlds) {
            const frame = current_frame.current.get(w[0])
            if (!frame) return
            jumpTo(frame, destination.current, () => {
              is_changing.current = false
            })
          }

          if (onSliderChange) {
            onSliderChange(destination.current);
          }

        }}
      />
    </div>
  )
})
