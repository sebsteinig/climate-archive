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
  Time,
  TimeFrame,
  TimeFrameRef,
  TimeFrameValue,
  TimeMode,
  TimeState,
} from "@/utils/store/time/time.type"
import { useClusterStore } from "@/utils/store/cluster.store"
import { chunksDetails } from "@/utils/store/time/handlers/utils"

type Props = {
  className?: string
  time_idx: number
  current_frame: TimeFrameRef
}
export type ControllerRef = {
  onChange: (collection_idx: number, frame: TimeFrame) => void
}

export const TimeController = forwardRef<ControllerRef, Props>(
  function TimeController({ className, time_idx }, ref) {
    const div_ref = useRef<HTMLDivElement>(null)
    const [is_playing, setPlaying] = useState(false)
    const time = useClusterStore((state) => state.time.slots.map.get(time_idx))
    const playTime = useClusterStore((state) => state.time.play)
    const pauseTime = useClusterStore((state) => state.time.pause)
    const pin = useClusterStore((state) => state.time.pin)
    const variables = useClusterStore((state) => state.variables)


    const active_variable = useMemo(() => {
      return Object.values(variables)
        .filter((v) => v.active)
        .map((e) => e.name)
    }, [variables])

    useEffect(() => {
      if (time?.state === TimeState.playing) {
        setPlaying(true)
      } else {
        setPlaying(false)
      }
    }, [time?.state])

    useImperativeHandle(ref, () => {
      return {
        onChange: (collection_idx: number, frame: TimeFrame) => {
          if (!time) {
            return
          }
          if (
            time.state === TimeState.paused ||
            time.state === TimeState.stopped ||
            time.state === TimeState.zero ||
            time.state === TimeState.ready
          ) {
            return
          }
          const first = frame.variables.values().next().value as
            | TimeFrameValue
            | undefined
          if (!first) {
            return
          }

          if (!div_ref.current) {
            return
          }
          const exp = first.current.exp.id
          const metadata = first.current.exp.metadata[0].metadata.text ?? ""
          if (time.mode === TimeMode.ts) {
            const s = first.current.info.timesteps
            const f = first.current.frame
            const c = first.current.time_chunk
            const [cs, fpc] = chunksDetails(first.current.info)
            const t = f + c * fpc
            const time_title = titleOf(t, s) ?? t.toString()
            div_ref.current.innerText = `${exp} ${metadata} : ${time_title}`
          } else {
            div_ref.current.innerText = `${exp} ${metadata}`
          }
        },
      }
    })

    if (!time) {
      return null
    }
    return (
      <div className={className + "align-middle flex"}>
        {is_playing ? (
          // PAUSE BUTTON
          <Pause
            className={`w-8 h-8 inline-block text-slate-500`}
            onClick={() => {
              if (time.state === TimeState.playing) {
                console.log("PAUSE")
                pauseTime(time_idx)
              }
            }}
          />
        ) : (
          // PLAY BUTTON
          <Play
            className={`w-8 h-8 inline-block text-slate-500`}
            onClick={() => {
              if (active_variable.length > 0 && time.state !== TimeState.zero) {
                console.log("PLAY")
                playTime(time_idx)
              }
            }}
          />
        )}
        <Stop
          className={`w-8 h-8 block text-slate-500`}
          onClick={() => {
            // if(stop()) {
            //     setPlaying(false)
            // }
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
