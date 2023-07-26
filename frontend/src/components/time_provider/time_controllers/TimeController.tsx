import Image from "next/image"
import Play from "$/assets/icons/play-slate-400.svg"
import Pause from "$/assets/icons/pause-slate-400.svg"
import Stop from "$/assets/icons/stop-slate-400.svg"
import { useState, useMemo, useEffect, forwardRef, useImperativeHandle, useRef } from "react"
import { Time, TimeFrame, TimeFrameValue, TimeMode, TimeState } from "@/utils/store/time/time.type"
import { useClusterStore } from "@/utils/store/cluster.store"
import { chunksDetails } from "@/utils/store/time/handlers/utils"

type Props = {
  className?: string
  time_idx: number
}
export type ControllerRef = {
  onChange:(frame:TimeFrame) => void
}

function titleOf(t:number,size:number) {
  if (size === 12) {
    switch (t) {
      case 0:
        return "January" 
      case 1:
        return "February" 
      case 2:
        return "March" 
      case 3:
        return "April" 
      case 4:
        return "May" 
      case 5:
        return "June" 
      case 6:
        return "July" 
      case 7:
        return "August" 
      case 8:
        return "September" 
      case 9:
        return "October" 
      case 10:
        return "November"  
      case 11:
        return "December"
    }
  }
  return undefined
}

export const TimeController = forwardRef<ControllerRef,Props>(
  function TimeController({ className, time_idx },ref) {
    
  const div_ref = useRef<HTMLDivElement>(null) 
  const [is_playing, setPlaying] = useState(false)
  const time = useClusterStore((state) => state.time.slots.map.get(time_idx))
  const playTime = useClusterStore((state) => state.time.play)
  const pauseTime = useClusterStore((state) => state.time.pause)
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

  useImperativeHandle(ref,
    ()=>{
      return {
        onChange : (frame:TimeFrame) => {
          if(!time) {
            return
          }
          if ( div_ref.current) {
            const first = frame.variables.values().next().value as TimeFrameValue | undefined
            if(!first) {
              return
            }
            const exp = first.current.exp.id
            const metadata = first.current.exp.metadata[0].metadata.text ?? ""
            if (time.mode === TimeMode.ts) {
              const s = first.current.info.timesteps
              const f = first.current.frame 
              const c = first.current.time_chunk
              const [cs,fpc] = chunksDetails(first.current.info)
              const t = f + c*fpc
              const time_title = titleOf(t,s) ?? t.toString()
              div_ref.current.innerText = `${exp} ${metadata} : ${time_title}`
            }else {
              div_ref.current.innerText = `${exp} ${metadata}`
            }
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
