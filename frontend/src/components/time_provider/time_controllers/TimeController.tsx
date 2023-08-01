import Play from "$/assets/icons/play-slate-400.svg"
import Pause from "$/assets/icons/pause-slate-400.svg"
import Stop from "$/assets/icons/stop-slate-400.svg"
import {
  useState,
  useMemo,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react"
import {
  TimeFrame,
  TimeFrameRef,
  TimeID,
  TimeKind,
  TimeMode,
  TimeState,
  WorldData,
} from "@/utils/store/time/time.type"
import { useClusterStore } from "@/utils/store/cluster.store"
import { circular, goto, once, walk } from "@/utils/store/time/time.utils"

type Props = {
  className?: string
  time_id: TimeID
  data:WorldData
  current_frame: TimeFrameRef
}
export type ControllerRef = {
  onChange: (frame: TimeFrame) => void
}

export const TimeController = forwardRef<ControllerRef, Props>(
  function TimeController({ className,current_frame, time_id,data }, ref) {
    const div_ref = useRef<HTMLDivElement>(null)
    const tween_ref = useRef<gsap.core.Tween|undefined>(null!)
    useImperativeHandle(ref, () => {
      return {
        onChange: (frame: TimeFrame) => {
          const month = titleOf(Math.floor(frame.weight),12)!
          if(div_ref.current) {
            div_ref.current.innerText = month
          }
        }
      }
    })
    const [is_playing,setPlaying] = useState(false)
    return (
      <div className={className + "align-middle flex"}>
        { is_playing ? (
          // PAUSE BUTTON
          <Pause
            className={`w-8 h-8 inline-block text-slate-500`}
            onClick={() => {
              tween_ref.current?.kill()
              setPlaying(false)
            }}
          />
        ) : (
          // PLAY BUTTON
          <Play
            className={`w-8 h-8 inline-block text-slate-500`}
            onClick={() => {
              const frame = current_frame.current.get(time_id)
              if(!frame) return;
              switch (data.time.kind) {
                case TimeKind.circular:
                  tween_ref.current = circular(frame,tween_ref)
                  break;
                case TimeKind.once :
                  tween_ref.current = once(frame,tween_ref,()=>{
                    setPlaying(false)
                  })
                  break;
                case TimeKind.walk :
                  tween_ref.current = walk(frame,tween_ref)
                  break;
              }
              setPlaying(true)
            }}
          />
        )}
        <Stop
          className={`w-8 h-8 block text-slate-500`}
          onClick={() => {

          }}
        />
        <div ref={div_ref}></div>
      </div>
    )
  },
)

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const

function titleOf(t: number, size: number) {
  if (size === 12) {
    return MONTHS[t]
  }
  return undefined
}
