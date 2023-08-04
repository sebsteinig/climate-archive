import {
  TimeFrame,
  TimeFrameHolder,
  TimeFrameState,
} from "@/utils/store/time/time.type"
import { sync } from "@/utils/store/time/time.utils"
import { VariableName } from "@/utils/store/variables/variable.types"
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
    async init(time_id, exp: Experiment, active_variables: VariableName[]) {
      const data = this.map.get(time_id)!
      const frame: TimeFrame = {
        exp: exp,
        swap_flag: true,
        swapping: false,
        uSphereWrapAmount: 0,
        //ts_idx:0,
        weight: 0,
        variables: new Map(),
      }
      const variables = new Map()
      for (let variable of active_variables) {
        variables.set(variable, await sync(frame, variable))
      }
      current_frame.current.update(frame, time_id)
    },
  })
  return current_frame
}
