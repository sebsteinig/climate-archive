import Play from "$/assets/icons/play-slate-400.svg"
import Pause from "$/assets/icons/pause-slate-400.svg"
import Stop from "$/assets/icons/stop-slate-400.svg"
import Clock from "$/assets/icons/clock.svg"
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
} from "@/utils/store/worlds/time/time.type"
import { useStore } from "@/utils/store/store"
import { getTitleOfExp } from "@/utils/types.utils"
import { Experiment } from "@/utils/types"
import { database_provider } from "@/utils/database_provider/DatabaseProvider"
import { circular, once, walk } from "@/utils/store/worlds/time/loop"
import { useActiveVariables } from "@/utils/hooks/useActiveVariables"

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
    const switchTimeMode = useStore((state) => state.worlds.switchTimeMode)
    const observed_id = useStore((state) => state.worlds.observed_world)
    const active_variables = useActiveVariables()

    useEffect(() => {
      pause(tween_ref, setPlaying)
    }, [active_variables])
    useEffect(() => {
      pause(tween_ref, setPlaying)
    }, [observed_id])
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
            title =
              titleOf(Math.round(frame.weight), frame.timesteps ?? 0) ?? ""
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
        className={`flex flex-row flex-wrap gap-5
      ${observed_id === world_id ? "brightness-50 pointer-events-none" : ""}
      ${className ?? ""}`}
      >
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
              className={`${
                observed_id === world_id
                  ? "pointer-events-none"
                  : "pointer-events-auto"
              } shrink-0 grow-0 cursor-pointer w-8 h-8 inline-block text-slate-300 child:fill-slate-300`}
              onClick={() => {
                pause(tween_ref, setPlaying)
              }}
            />
          ) : (
            // PLAY BUTTON
            <Play
              className={`${
                observed_id === world_id
                  ? "pointer-events-none"
                  : "pointer-events-auto"
              } shrink-0 grow-0 cursor-pointer w-8 h-8 inline-block text-slate-300 child:fill-slate-300`}
              onClick={() => {
                if (active_variables.length > 0) {
                  play(data, world_id, current_frame, tween_ref, setPlaying)
                }
              }}
            />
          )}
          <Stop
            className={`${
              observed_id === world_id
                ? "pointer-events-none"
                : "pointer-events-auto"
            } shrink-0 grow-0 cursor-pointer w-8 h-8 block text-slate-300 child:fill-slate-300`}
            onClick={() => {
              stop(data, world_id, current_frame, tween_ref, setPlaying)
            }}
          />
          {data.time.mode_state.is_writable ? (
            <Clock
              className={`${
                observed_id === world_id
                  ? "pointer-events-none"
                  : "pointer-events-auto"
              } shrink-0 grow-0 cursor-pointer w-8 h-8 block text-slate-300`}
              onClick={() => {
                const frame = current_frame.current.get(world_id)
                if (!frame) return
                let exp: Experiment
                if (data.time.mode === TimeMode.mean) {
                  exp = data.collection.exps[Math.floor(frame.weight)]
                  database_provider.load({ exp_id: exp.id }).then(async () => {
                    console.log("SWITCHING MODE")

                    switchTimeMode(world_id, exp)
                  })
                } else {
                  exp = data.exp ?? data.collection.exps[0]
                  switchTimeMode(world_id, exp)
                }
              }}
            />
          ) : null}
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
