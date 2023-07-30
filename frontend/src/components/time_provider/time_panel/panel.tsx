import {
  CollectionID,
  Time,
  TimeFrame,
  TimeFrameRef,
} from "@/utils/store/time/time.type"
import {
  MutableRefObject,
  RefObject,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
} from "react"
import {
  ControllerRef,
  TimeController,
} from "../time_controllers/TimeController"
import { InputRef, TimeSlider } from "../time_controllers/TimeSlider"
import { Container } from "./container"
import { cssGrid, uniqueIdx } from "@/utils/types.utils"

export type PanelProps = {
  time_idx: number
  time: Time
  current_frame: TimeFrameRef
}

export type ContainerRef = {
  ref: MutableRefObject<HTMLDivElement>
  onChange: (frame: TimeFrame) => void
}

export type Refs = {
  //input_ref: RefObject<HTMLInputElement>
  container_refs: RefObject<Map<CollectionID, ContainerRef>>
}

function buildDivHolder(time: Time) {
  const res = new Map<CollectionID, MutableRefObject<HTMLDivElement>>()
  for (let collection_id of time.collections.keys()) {
    res.set(collection_id, useRef<HTMLDivElement>(null!))
  }
  return res
}

export const Panel = forwardRef<Refs, PanelProps>(function Panel(
  { time, time_idx, current_frame },
  refs,
) {
  const input_ref = useRef<InputRef>(null)
  const controller_ref = useRef<ControllerRef>(null)
  const container_refs = useRef<Map<CollectionID, ContainerRef>>(new Map())

  const divs_holder = useRef(buildDivHolder(time))

  useImperativeHandle(refs, () => {
    return {
      container_refs: container_refs,
    }
  })
  const css_grid = useCallback((size:number) => {
    const grid = cssGrid(size)
    return `w-full h-full grid gap-4 ${grid.cols} ${grid.rows}`

  },[time.collections.size])
  return (
    <div className="w-full h-full grid grid-cols-1 grid-rows-2 gap-2">
      <div className="row-span-4 border-2 border-slate-900 rounded-md">
        <div className={css_grid(time.collections.size)}>
        
          {Array.from(time.collections, ([collection_idx, _]) => {
            return (
              <Container
                key={collection_idx}
                ref={(el: HTMLDivElement) => {
                  const div_ref = divs_holder.current.get(collection_idx)!
                  div_ref.current = el

                  const container_ref: ContainerRef = {
                    ref: div_ref,
                    onChange: (frame) => {
                      input_ref.current?.onChange(collection_idx, frame)
                      controller_ref.current?.onChange(collection_idx, frame)
                    },
                  }
                  container_refs.current.set(collection_idx, container_ref)
                  return el
                }}
                time_idx={time_idx}
                collection_idx={collection_idx}
              />
            )
          })}
        </div>
      </div>
      <div className="row-start-5 z-10">
        <TimeController
          current_frame={current_frame}
          time_idx={time_idx}
          ref={controller_ref}
        />
        <TimeSlider
          current_frame={current_frame}
          time_idx={time_idx}
          className="w-full"
          onChange={(value) => {}}
          ref={input_ref}
        />
      </div>
    </div>
  )
})
