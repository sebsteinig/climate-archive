import Image from "next/image"
import Play from "$/assets/icons/play-slate-400.svg"
import Pause from "$/assets/icons/pause-slate-400.svg"
import Stop from "$/assets/icons/stop-slate-400.svg"
import { useState, useMemo, useEffect, forwardRef, useImperativeHandle, useRef } from "react"
import { Time, TimeFrame, TimeFrameValue, TimeState } from "@/utils/store/time/time.type"
import { useClusterStore } from "@/utils/store/cluster.store"

type Props = {
  className?: string
  time_idx: number
}
export type ControllerRef = {
  onChange:(frame:TimeFrame) => void
}
export const TimeController = forwardRef<ControllerRef,Props>(
  function TimeController({ className, time_idx },ref) {

  const [is_playing, setPlaying] = useState(false)
  const time = useClusterStore((state) => state.time.slots.map.get(time_idx))
  const playTime = useClusterStore((state) => state.time.play)
  const pauseTime = useClusterStore((state) => state.time.pause)
  const variables = useClusterStore((state) => state.variables)

  const div_ref = useRef<HTMLDivElement>(null) 

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


  useImperativeHandle(ref,
    ()=>{
      return {
        onChange : (frame:TimeFrame) => {
          if ( div_ref.current) {
            const first = frame.variables.values().next().value as TimeFrameValue | undefined
            if(!first) {
              return
            }
            div_ref.current.innerText = `${first.current.exp.id} ${first.current.exp.metadata}`
          }
        }
      }
    }
  )

  if (!time) {
    return null
  }
  return (
    <div className={className + "align-middle flex"}>
      <div ref={div_ref}></div>
      {is_playing ? (
        // PAUSE BUTTON
        <Image
          priority
          src={Pause}
          className={`w-8 h-8 inline-block`}
          alt="pause"
          onClick={() => {
            if (time.state === TimeState.playing) {
              console.log("PAUSE")
              pauseTime(time_idx)
            }
          }}
        />
      ) : (
        // PLAY BUTTON
        <Image
          priority
          src={Play}
          className={`w-8 h-8 inline-block`}
          alt="play"
          onClick={() => {
            if (active_variable.length > 0 && time.state !== TimeState.zero) {
              console.log("PLAY")
              playTime(time_idx)
            }
          }}
        />
      )}
      <Image
        priority
        src={Stop}
        className={`w-8 h-8 block`}
        alt="stop"
        onClick={() => {
          // if(stop()) {
          //     setPlaying(false)
          // }
        }}
      />
    </div>
  )
})
