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
  MutableRefObject,
  SetStateAction,
  Dispatch,
} from "react"
import {
  TimeFrame,
  TimeFrameRef,
  TimeFrameState,
  TimeID,
  TimeKind,
  TimeMode,
  TimeState,
  WorldData,
} from "@/utils/store/time/time.type"
import { useClusterStore } from "@/utils/store/cluster.store"
import { circular, goto, once, walk } from "@/utils/store/time/time.utils"
import { getTitleOfExp } from "@/utils/types.utils"

type Props = {
  className?: string
  time_id: TimeID
  data: WorldData
  current_frame: TimeFrameRef
}
export type ControllerRef = {
  onChange: (frame: TimeFrame) => void
}

export const TimeController = forwardRef<ControllerRef, Props>(
  function TimeController({ className, current_frame, time_id, data }, ref) {
    const time_title_ref = useRef<HTMLParagraphElement>(null)
    const exp_title_ref = useRef<HTMLParagraphElement>(null)
    const tween_ref = useRef<gsap.core.Tween | undefined>(null!)
    useImperativeHandle(ref, () => {
      return {
        onChange: (frame: TimeFrame) => {
          let id: string
          let label: string
          let title: string
          if (data.time.mode === TimeMode.mean) {
            const first = frame.variables.values().next().value as
              | TimeFrameState
              | undefined
            if (!first || !first.mean) {
              const t = getTitleOfExp(frame.exp)
              id = t.id
              label = t.label
              title = t.label
            } else {
              const t = getTitleOfExp(first.mean.current.exp)
              id = t.id
              label = t.label
              title = t.label
            }
          } else {
            const t = getTitleOfExp(frame.exp)
            id = t.id
            label = t.label
            title = titleOf(Math.floor(frame.weight), frame.timesteps ?? 0)!
          }
          if (time_title_ref.current) {
            time_title_ref.current.innerText = title
          }
          if (exp_title_ref.current) {
            exp_title_ref.current.innerText = `${id} | ${label}`
          }
        },
      }
    })
    const [is_playing, setPlaying] = useState(false)
    return (
      <div
        className={`grid grid-cols-3 grid-rows-1 gap-5 px-5 py-2 ${
          className ?? ""
        }`}
      >
        <div className="cursor-default col-span-2 overflow-hidden">
          <p
            className="text-emerald-600 font-semibold small-caps tracking-[.5em]"
            ref={time_title_ref}
          ></p>
          <p
            className="truncate italic text-sm text-slate-600"
            ref={exp_title_ref}
          ></p>
        </div>
        <div className="col-start-3 flex gap-5 justify-center">
          {is_playing ? (
            // PAUSE BUTTON
            <Pause
              className={`cursor-pointer w-8 h-8 inline-block text-slate-300 child:fill-slate-300`}
              onClick={() => {
                pause(tween_ref, setPlaying)
              }}
            />
          ) : (
            // PLAY BUTTON
            <Play
              className={`cursor-pointer w-8 h-8 inline-block text-slate-300 child:fill-slate-300`}
              onClick={() => {
                play(data, time_id, current_frame, tween_ref, setPlaying)
              }}
            />
          )}
          <Stop
            className={`cursor-pointer w-8 h-8 block text-slate-300 child:fill-slate-300`}
            onClick={() => {}}
          />
        </div>
        <div className="flex-grow"></div>
      </div>
    )
  },
)

function pause(
  tween_ref: MutableRefObject<gsap.core.Tween | undefined>,
  setPlaying: Dispatch<SetStateAction<boolean>>,
) {
  tween_ref.current?.kill()
  setPlaying(false)
}

function play(
  data: WorldData,
  time_id: TimeID,
  current_frame: TimeFrameRef,
  tween_ref: MutableRefObject<gsap.core.Tween | undefined>,
  setPlaying: Dispatch<SetStateAction<boolean>>,
) {
  const frame = current_frame.current.get(time_id)
  if (!frame) return
  switch (data.time.kind) {
    case TimeKind.circular:
      tween_ref.current = circular(frame, tween_ref, data)
      break
    case TimeKind.once:
      tween_ref.current = once(frame, tween_ref, data, () => {
        setPlaying(false)
      })
      break
    case TimeKind.walk:
      tween_ref.current = walk(frame, tween_ref, data)
      break
  }
  setPlaying(true)
}

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
