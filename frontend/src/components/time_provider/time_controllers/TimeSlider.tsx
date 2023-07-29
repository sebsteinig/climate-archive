import { useClusterStore } from "@/utils/store/cluster.store"
import {
  RefObject,
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react"
import {
  TimeFrame,
  TimeFrameRef,
  TimeFrameValue,
  TimeMode,
  TimeState,
} from "@/utils/store/time/time.type"
import { Collection } from "@/utils/store/collection.store"
import { chunksDetails, getCurrentPos } from "@/utils/store/time/handlers/utils"

type Props = {
  onChange: (value: number) => void
  className?: string
  time_idx: number
  current_frame: TimeFrameRef
}

export type InputRef = {
  onChange: (collection_idx: number, frame: TimeFrame) => void
}

export const TimeSlider = forwardRef<InputRef, Props>(function TimeSlider(
  { time_idx, className, current_frame, onChange }: Props,
  ref,
) {
  const time = useClusterStore((state) => state.time.slots.map.get(time_idx))
  const collections = useClusterStore((state) => state.collections)
  const surf = useClusterStore((state) => state.time.surf)
  const try_surfing = useClusterStore((state) => state.time.try_surfing)
  const updateSurfingDestination = useClusterStore(
    (state) => state.time.updateSurfingDestination,
  )
  const pin = useClusterStore((state) => state.time.pin)
  const input_ref = useRef<HTMLInputElement>(null)
  const own_collections = useMemo(() => {
    if (!time) {
      return []
    }
    return Array.from(time.collections, ([idx, _]) => {
      const collection = collections.get(idx)
      return collection
    }).filter((e) => e) as Collection[]
  }, [time?.collections])
  const max = useMemo(() => {
    if (!time) {
      return 0
    }
    if (time.mode === TimeMode.ts) {
      return 12 * 10
    }
    if (own_collections.length === 0) {
      return 0
    }
    return own_collections[0].exps.length * 10
  }, [time?.mode])
  //const snap_frames = useRef<Map<number, TimeFrame>>(new Map())

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
        if (!input_ref.current) {
          return
        }
        const first = frame.variables.values().next().value as
          | TimeFrameValue
          | undefined
        if (!first) {
          return
        }
        
        if (time.state === TimeState.surfing) {
          return
        }
        // UPDATE SLIDER
        if (time.mode === TimeMode.ts) {
          const s = first.current.info.timesteps
          const f = first.current.frame
          const c = first.current.time_chunk
          const [cs, fpc] = chunksDetails(first.current.info)
          const t = f + c * fpc

          const w = Math.floor(frame.weight * 10)
          input_ref.current.value = `${t * 10 + w}`
        } else {
          const t = first.current.idx
          const w = Math.floor(frame.weight * 10)
          input_ref.current.value = `${t * 10 + w}`
        }
      },
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
          const idx = parseInt(e.target.value)
          const unweighted_idx = Math.floor(idx / 10)
          if (time?.state === TimeState.playing) {
            pin(time_idx)
            const frame = current_frame.current.map
              .get(time_idx)!
              .values()
              .next().value as TimeFrame | undefined
            if (!frame) {
              return
            }
            const [pos, _] = getCurrentPos(time, frame)
            try_surfing(time_idx, pos)
          } else if (time?.state === TimeState.paused) {
            const frame = current_frame.current.map
              .get(time_idx)!
              .values()
              .next().value as TimeFrame | undefined
            if (!frame) {
              return
            }
            const [pos, _] = getCurrentPos(time, frame)
            try_surfing(time_idx, pos)
            surf(time_idx, unweighted_idx)
          } else if (time?.state === TimeState.surfing) {
            updateSurfingDestination(time_idx, unweighted_idx)
          }
        }}
      />
    </div>
  )
})
