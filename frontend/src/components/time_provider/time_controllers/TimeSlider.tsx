import { useClusterStore } from "@/utils/store/cluster.store"
import {
  RefObject,
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react"
import { TimeFrame, TimeFrameValue, TimeMode } from "@/utils/store/time/time.type"
import { Collection } from "@/utils/store/texture_tree.store"
import { chunksDetails } from "@/utils/store/time/handlers/utils"

type Props = {
  onChange: (value: number) => void
  className?: string
  time_idx: number
}

export type InputRef = {
  onChange:(frame:TimeFrame) => void
}

export const TimeSlider = forwardRef<InputRef, Props>(
  function TimeSlider({time_idx, className, onChange }: Props, ref) {

  const time = useClusterStore((state) => state.time.slots.map.get(time_idx))
  const collections = useClusterStore((state) => state.collections)
  const input_ref = useRef<HTMLInputElement>(null)
  const own_collections = useMemo(
    () => {
      if(!time) {
        return []
      }
      return Array.from(time.collections ,([idx,_])=> {
        const collection = collections.get(idx)
        return collection
      }).filter(e=>e) as Collection[]
    }
  ,[time?.collections])
  const max = useMemo(
    () => {
      if(!time) {
        return 0
      }
      if(time.mode === TimeMode.ts) {
        return 12 * 10
      }
      if(own_collections.length === 0) {
        return 0
      }
      return own_collections[0].exps.length * 10
    }
  ,[time?.mode])

  useImperativeHandle(ref,
    ()=>{
      return {
        onChange : (frame:TimeFrame) => {
          if(!time) {
            return 
          }
          if(!input_ref.current) {
            return
          }
          const first = frame.variables.values().next().value as TimeFrameValue | undefined
          if(!first) {
            return
          }
          if (time.mode === TimeMode.ts) {
            const s = first.current.info.timesteps
            const f = first.current.frame 
            const c = first.current.time_chunk
            const [cs,fpc] = chunksDetails(first.current.info)
            const t = f + c*fpc

            const w = Math.floor(first.weight*10)
            input_ref.current.value = `${t*10 + w}`
          }
      }
    }
  })
    return (
      <div className={className}>
        <input
          ref={input_ref}
          type="range"
          className="w-full"
          min={0}
          max={max}
          onChange={(e) => {
            onChange(parseInt(e.target.value))
          }}
        />
      </div>
    )
  },
)