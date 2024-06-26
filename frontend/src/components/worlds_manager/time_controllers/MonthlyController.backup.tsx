import {
  RefObject,
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react"
import { ControllerRef, TimeController } from "./utils/TimeController"
import { IControllerRef } from "./controller.types"
import {
  TimeFrameRef,
  WorldID,
  WorldData,
} from "@/utils/store/worlds/time/time.type"
import { ProgessBarRef, ProgressBar } from "./utils/ProgressBar"
import { goto } from "@/utils/store/worlds/time/loop"
import { useStore } from "@/utils/store/store"
import { TimeSlider, InputRef as TimeSliderRef } from "./utils/TimeSlider"

type MonthlyControllerProps = {
  data: WorldData
  current_frame: TimeFrameRef
  world_id: WorldID
  controller_ref: ControllerRef | undefined
}

export const MonthlyController = forwardRef<
  IControllerRef,
  MonthlyControllerProps
>(function MonthlyController({ current_frame, world_id, data, controller_ref }, ref) {
  const time_slider_ref = useRef<TimeSliderRef>(null); // updated ref name
  // const monthlyRef = useRef(); // This ref is to connect to TimeScale

  const [highlighted_month, setHighLightMonth] = useState<number | undefined>(
    undefined,
  )
  const [focus, setFocus] = useState<number | undefined>(undefined)
  const observed_id = useStore((state) => state.worlds.observed_world)
  // useImperativeHandle(ref, () => {
  //   return {
  //     onChange(frame) {},
  //     onWeightUpdate(frame) {
  //       progress_bar_ref.current?.update(frame.weight / (frame.timesteps ?? 12))
  //     },
  //   }
  // })

  const monthlyControllerRef = useRef(); // This ref is to connect to TimeScale

  return (
    <div
      className={`select-none w-full pt-2 px-7 ${
        observed_id === world_id
          ? "brightness-50 pointer-events-none"
          : "pointer-events-auto"
      }`}
    >
      <div className="w-full my-2">
      <TimeSlider 
            world_id={world_id} 
            data={data} 
            current_frame={current_frame} 
            controller_ref={controller_ref} 
            ref={time_slider_ref} 
            labels={false}
            onSliderChange={() => {
              monthlyControllerRef.current?.updateFromSlider();
            }}
          />
      </div>
      <div
        className="
                    w-full rounded-lg 
                    flex flex-row
                    overflow-hidden
                    border-2 border-slate-200
                "
        onMouseLeave={() => {
          if (focus === undefined) {
            setHighLightMonth(undefined)
          }
        }}
      >
        {MONTHS.map((month, idx) => {
          return (
            <Month ref={monthlyControllerRef} // This ref is to connect to TimeScale
              key={idx}
              highlight={
                highlighted_month === undefined || highlighted_month === idx
              }
              focus={focus}
              idx={idx}
              month={month}
              color={MONTHS_COLOR[idx]}
              onChange={(idx, focus) => {
                const frame = current_frame.current.get(world_id)
                if (!frame) return
                setHighLightMonth(idx)
                if (focus) {
                  setFocus((prev) => {
                    if (prev === idx) {
                      return undefined
                    }
                    return idx
                  })
                }
                controller_ref?.pause()
                goto(frame, idx, 5.0)
                time_slider_ref.current?.onChange(idx)
              }}
              resetHighlight={() => {
                setHighLightMonth(undefined)
              }}
            />
          )
        })}
      </div>
    </div>
  )
})

type MonthProps = {
  idx: number
  month: string
  highlight: boolean
  focus: number | undefined
  color: string
  onChange: (idx: number, focus: boolean) => void
  resetHighlight: () => void
}

export type InputRef = {
  updateFromSlider: () => void
}


const Month = forwardRef((props: MonthProps, ref: RefObject<InputRef>) => {
  const { idx, month, color, focus, onChange, resetHighlight, highlight } = props;

  useImperativeHandle(ref, () => ({
    updateFromSlider() {
      resetHighlight()
      // ref.setSelection(undefined)
    }
  }));

  return (
    <div
      className={`grow cursor-pointer truncate text-clip tracking-widest 
        small-caps py-1 text-slate-900 text-center ${color}
        border-r-2 border-slate-200 ${
          highlight ? "brightness-100" : "brightness-50"
        }
        transition-all duration-100 ease-in-out `}
      onClick={() => {
        onChange(idx, true);
      }}
      // onMouseOver={() => {
      //   if (focus === undefined) {
      //     onChange(idx, false);
      //   }
      // }}
    >
      {month.slice(0, 3)}
    </div>
  );
})
  

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

const MONTHS_COLOR = [
  "bg-sky-300",
  "bg-sky-200",
  "bg-sky-100",
  "bg-emerald-200",
  "bg-emerald-300",
  "bg-emerald-400",
  "bg-emerald-300",
  "bg-emerald-200",
  "bg-sky-100",
  "bg-sky-200",
  "bg-sky-300",
  "bg-sky-400",
] as const
