import {
  TimeFrame,
  TimeFrameHolder,
  TimeFrameState,
  TimeMode,
  WorldData,
} from "@/utils/store/worlds/time.type"
import { getMaxTimesteps, sync } from "@/utils/store/worlds/world.utils"
import { EVarID } from "@/utils/store/variables/variable.types"
import { Experiment } from "@/utils/types"
import { useRef } from "react"

export function useFrameRef() {
  const current_frame = useRef<TimeFrameHolder>({
    map: new Map(),
    update(frame, world_id) {
      this.map.set(world_id, frame)
      return frame
    },
    get(world_id) {
      return this.map.get(world_id)
    },
    async init(
      world_id,
      exp: Experiment,
      active_variables: EVarID[],
      world_data: WorldData,
    ) {
      const data = this.map.get(world_id)
      console.log("INIT USEFRAMEREF");

      const frame: TimeFrame = {
        exp: exp,
        swap_flag: true,
        swapping: false,
        uSphereWrapAmount: data?.uSphereWrapAmount ?? 1,
        weight: data?.weight ?? 0,
        variables: data?.variables ?? new Map(),
        mode : data?.mode,
      }
      const max_ts = await getMaxTimesteps(frame)
      frame.timesteps = max_ts    
      if(world_data.time.mode_state.is_writable 
        && world_data.time.mode_state.previous !== world_data.time.mode 
          && (frame.mode === undefined || world_data.time.mode !== frame.mode)) {
          frame.mode = world_data.time.mode
          //const copy_world_data = deepCopy(world_data)
          switch (world_data.time.mode) {
            case TimeMode.mean:
              frame.weight = world_data.collection.exps.indexOf(exp)
              break;
            case TimeMode.ts: 
              const e = world_data.collection.exps.at(frame.weight)
              // weird hack but works
              frame.exp = JSON.parse(JSON.stringify(e))
              frame.weight = 0
            default:
              break;
          }
      }
      
      for (let variable of frame.variables.keys()) {
        if (!active_variables.includes(variable)) {
          frame.variables.delete(variable)
        }
      }
      for (let variable of active_variables) {
        frame.variables.set(variable, await sync(frame, variable, world_data))
      }

      current_frame.current.update(frame, world_id)
    },
  })
  return current_frame
}
