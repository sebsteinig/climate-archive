import { Time, TimeFrame } from "@/utils/store/time/time.type"
import {
  MutableRefObject,
  RefObject,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react"
import { ControllerRef, TimeController } from "../time_controllers/TimeController"
import { InputRef, TimeSlider } from "../time_controllers/TimeSlider"
import { Container } from "./container"
import { uniqueIdx } from "@/utils/types.utils"

export type PanelProps = {
  time_idx: number
  time: Time
}

export type ContainerRef = {
  ref : MutableRefObject<HTMLDivElement>,
  
  onChange : (frame:TimeFrame) => void
}

export type Refs = {
  //input_ref: RefObject<HTMLInputElement>
  container_refs: RefObject<Map<number, ContainerRef[]>>
}
function range(start: number, end: number) {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
}

export const Panel = forwardRef<Refs, PanelProps>(
  function Panel({ time, time_idx }, refs) {
    const first_collection = time.collections.entries().next().value as
      | [number, number]
      | undefined
    const is_alone =
      time.collections.size === 1 &&
      first_collection &&
      first_collection[1] === 1
    const input_ref = useRef<InputRef>(null)
    const controller_ref = useRef<ControllerRef>(null)
    const container_refs = useRef<
      Map<number, ContainerRef[]>
    >(new Map())

    const elementsRef = useRef(
      range(
        0,
        Array.from(time.collections, ([_, occ]) => occ).reduce(
          (acc, e) => acc + e,
          0,
        ),
      ).map(() => useRef<HTMLDivElement>(null!)),
    )

    useImperativeHandle(refs, () => {
      return {
        //input_ref,
        container_refs: container_refs,
      }
    })
    const controllers = <>

    </>
    return (
      <div className="grid grid-cols-1 grid-rows-2 gap-2">
        <div className="row-span-4 border-2 border-slate-900 rounded-md">
          {is_alone ? (
            <Container
              ref={(el: HTMLDivElement) => {
                elementsRef.current[0].current = el
                container_refs.current.set(first_collection[0], [
                  {
                    ref : elementsRef.current[0],
                    onChange : (frame) => {
                      input_ref.current?.onChange(first_collection[0],frame)
                      controller_ref.current?.onChange(first_collection[0],frame)
                    }
                  }
                ])
                return el
              }}
              time_idx={time_idx}
              collection_idx={first_collection[0]}
            ></Container>
          ) : (
            <div>
              {Array.from(
                time.collections,
                ([collection_idx, occurence], i) => {
                  return range(0, occurence).map((i) => {
                    return (
                      <Container
                        key={uniqueIdx(i,collection_idx,0)}
                        ref={(el: HTMLDivElement) => {
                          elementsRef.current[i].current = el
                          const tmp = container_refs.current.get(i)
                          tmp?.push(                  
                            {
                              ref : elementsRef.current[0],
                              onChange : (frame) => {
                                input_ref.current?.onChange(collection_idx,frame)
                                controller_ref.current?.onChange(collection_idx,frame)
                                
                              }
                            }
                          )
                          container_refs.current.set(
                            collection_idx,
                            tmp ?? [                          
                              {
                                ref : elementsRef.current[0],
                                onChange : (frame) => {
                                  input_ref.current?.onChange(collection_idx,frame)
                                  controller_ref.current?.onChange(collection_idx,frame)
                                  
                                }
                              }
                            ],
                          )
                          return el
                        }}
                        time_idx={time_idx}
                        collection_idx={collection_idx}
                      ></Container>
                    )
                  })
                },
              ).flat()}
            </div>
          )}
        </div>
        <div className="row-start-5 z-10">
          <TimeController time_idx={time_idx} ref={controller_ref} />
          <TimeSlider
            time_idx={time_idx} 
            className="w-full"
            onChange={(value) => {}}
            ref={input_ref}
          />
        </div>
      </div>
    )
  },
)
