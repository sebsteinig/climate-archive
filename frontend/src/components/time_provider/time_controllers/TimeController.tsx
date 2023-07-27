import Play from "$/assets/icons/play-slate-400.svg"
import Pause from "$/assets/icons/pause-slate-400.svg"
import Stop from "$/assets/icons/stop-slate-400.svg"
import { useState, useMemo, useEffect } from "react"
import { Time, TimeState } from "@/utils/store/time/time.type"
import { useClusterStore } from "@/utils/store/cluster.store"

type Props = {
  className?: string
  time_idx: number
}

export function TimeController({ className, time_idx }: Props) {
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
  if (!time) {
    return null
  }
  return (
    <div className={className + "align-middle flex"}>
      {is_playing ? (
        // PAUSE BUTTON
        <Pause 
          className={`w-8 h-8 inline-block text-slate-500`}
          onClick={() => {
            if (time.state === TimeState.playing) {
              console.log("PAUSE")
              pauseTime(time_idx)
            }
          }}
        />
        
      ) : (
        // PLAY BUTTON
        <Play 
          className={`w-8 h-8 inline-block text-slate-500`}
          onClick={() => {
            if (active_variable.length > 0 && time.state !== TimeState.zero) {
              console.log("PLAY")
              playTime(time_idx)
            }
          }}
        />
      )}
      <Stop
        className={`w-8 h-8 block text-slate-500`}
        onClick={() => {
          // if(stop()) {
          //     setPlaying(false)
          // }
        }}
      />
    </div>
  )
}
