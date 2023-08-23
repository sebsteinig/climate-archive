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
  WorldID,
  TimeKind,
  TimeMode,
  WorldData,
} from "@/utils/store/worlds/time.type"
import { useStore } from "@/utils/store/store"
import { circular, goto, once, walk } from "@/utils/store/worlds/world.utils"
import { getTitleOfExp } from "@/utils/types.utils"

type Props = {
  className?: string
  world_id: WorldID
  data: WorldData
  current_frame: TimeFrameRef
}
export type ControllerRef = {
  onChange: (frame: TimeFrame) => void
  play: () => void
  pause: () => void
  stop: () => void
}

export const TimeController = forwardRef<ControllerRef, Props>(
  function TimeController({ className, current_frame, world_id, data }, ref) {
    const time_title_ref = useRef<HTMLDivElement>(null)
    const exp_title_ref = useRef<HTMLDivElement>(null)
    const tween_ref = useRef<gsap.core.Tween | undefined>(null!)

    const stored_active_variables = useStore((state) => state.active_variables)
    const active_variables = useMemo(() => {
      let actives = []
      for (let [key, active] of stored_active_variables.entries()) {
        if (active) actives.push(key)
      }
      return actives
    }, [stored_active_variables])

    useEffect(() => {
      pause(tween_ref, setPlaying)
    }, [active_variables])

    useImperativeHandle(ref, () => {
      return {
        play() {
          play(data, world_id, current_frame, tween_ref, setPlaying)
        },
        pause() {
          pause(tween_ref, setPlaying)
        },
        stop() {
          stop(data, world_id, current_frame, tween_ref, setPlaying)
        },
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
            title = titleOf(Math.round(frame.weight), frame.timesteps ?? 0)!
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
      <div className={`flex flex-row flex-wrap gap-5 ${className ?? ""}`}>
        <div className="grow-[3] cursor-default col-span-2 overflow-hidden flex flex-col justify-between">
          <div
            className="text-emerald-600 font-semibold small-caps tracking-[.5em] my-auto"
            ref={time_title_ref}
          ></div>
          <div
            className="truncate italic text-sm text-slate-600  my-auto"
            ref={exp_title_ref}
          ></div>
        </div>
        <div className="grow flex flex-wrap gap-5 justify-center">
          {is_playing ? (
            // PAUSE BUTTON
            <Pause
              className={`pointer-events-auto shrink-0 grow-0 cursor-pointer w-8 h-8 inline-block text-slate-300 child:fill-slate-300`}
              onClick={() => {
                pause(tween_ref, setPlaying)
              }}
            />
          ) : (
            // PLAY BUTTON
            <Play
              className={`pointer-events-auto shrink-0 grow-0 cursor-pointer w-8 h-8 inline-block text-slate-300 child:fill-slate-300`}
              onClick={() => {
                if (active_variables.length > 0) {
                  play(data, world_id, current_frame, tween_ref, setPlaying)
                }
              }}
            />
          )}
          <Stop
            className={`shrink-0 grow-0 cursor-pointer w-8 h-8 block text-slate-300 child:fill-slate-300`}
            onClick={() => {
              stop(data, world_id, current_frame, tween_ref, setPlaying)
            }}
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
function stop(
  data: WorldData,
  world_id: WorldID,
  current_frame: TimeFrameRef,
  tween_ref: MutableRefObject<gsap.core.Tween | undefined>,
  setPlaying: Dispatch<SetStateAction<boolean>>,
) {
  const frame = current_frame.current.get(world_id)
  if (!frame) return
  frame.weight = 0
  frame.swap_flag = true
  tween_ref.current?.kill()
  setPlaying(false)
}
function play(
  data: WorldData,
  world_id: WorldID,
  current_frame: TimeFrameRef,
  tween_ref: MutableRefObject<gsap.core.Tween | undefined>,
  setPlaying: Dispatch<SetStateAction<boolean>>,
) {
  const frame = current_frame.current.get(world_id)
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
