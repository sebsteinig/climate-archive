import {
  TimeFrame,
  TimeFrameHolder,
  TimeFrameState,
  WorldData,
} from "@/utils/store/time/time.type"
import { getMaxTimesteps, sync } from "@/utils/store/time/time.utils"
import { EVarID } from "@/utils/store/variables/variable.types"
import { Experiment } from "@/utils/types"
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
    async init(
      time_id,
      exp: Experiment,
      active_variables: EVarID[],
      world_data: WorldData,
    ) {
      const data = this.map.get(time_id)
      console.log(`init`)
      const frame: TimeFrame = {
        exp: exp,
        swap_flag: true,
        swapping: false,
        uSphereWrapAmount: data?.uSphereWrapAmount ?? 1,
        weight: data?.weight ?? 0,
        variables: data?.variables ?? new Map(),
      }
      const max_ts = await getMaxTimesteps(frame)
      frame.timesteps = max_ts
      for(let variable of frame.variables.keys()) {
        if(!active_variables.includes(variable)) {
          frame.variables.delete(variable)
        }
      }
      for (let variable of active_variables) {
        frame.variables.set(variable, await sync(frame, variable, world_data))
      }
      
      current_frame.current.update(frame, time_id)
    },
  })
  return current_frame
}
