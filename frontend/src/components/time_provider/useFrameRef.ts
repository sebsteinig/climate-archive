import { TimeFrameHolder } from "@/utils/store/time/time.type"
import { useRef } from "react"



export function useFrameRef() {
    const current_frame = useRef<TimeFrameHolder>({
        map: new Map(),
        update(frame, time_id) {
          this.map.set(time_id, frame)
          return frame
        },
        get(time_id) {
          return this.map.get(time_id)
        },
      })
    return current_frame
}