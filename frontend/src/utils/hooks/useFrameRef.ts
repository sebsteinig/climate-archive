import {
  TimeFrame,
  TimeFrameHolder,
  TimeFrameState,
  TimeMode,
  WorldData,
} from "@/utils/store/worlds/time/time.type"
import { EVarID } from "@/utils/store/variables/variable.types"
import { Experiment } from "@/utils/types"
import { useRef } from "react"
import {
  getMaxTimesteps,
  sync,
  updateFrame,
} from "../store/worlds/time/time.utils"
import { useStore } from "@/utils/store/store";

export function useFrameRef() {
  const current_frame = useRef<TimeFrameHolder>({
    map: new Map(),
    _observed_id: undefined,
    _waiters: new Map(),
    _lock: {
      handle: undefined,
      lock: false,
    },
    reference: undefined,
    async update(world_id, world_data, active_variables) {
      if (this._observed_id === undefined) {
        let frame: TimeFrame = this.map.get(world_id)!
        await updateFrame(frame, active_variables, world_data)
        return frame
      }
      if (world_id !== this._observed_id) {
        await this.wait(world_id)
      } else {
        await this.lock(world_id)
      }
      if (world_id !== this._observed_id) {
        await this.wait(world_id)
      }
      let frame: TimeFrame = this.map.get(world_id)!
      await updateFrame(frame, active_variables, world_data)
      if (world_id === this._observed_id) {
        await this.notify()
      }
      return frame
    },
    get(world_id) {
      return this.map.get(world_id)
    },
    async wait(world_id) {
      if (!this._lock.lock) {
        return
      }
      await new Promise<void>((resolve, reject) => {
        this._waiters.set(world_id, { resolve, reject })
        if (this._waiters.size === this.map.size - 1) {
          this._lock.handle?.resolve()
        }
      })
      this._waiters.delete(world_id)
    },
    async lock(world_id) {
      this._lock.lock = true
      await new Promise<void>((resolve, reject) => {
        this._lock.handle = { resolve, reject }
      })
    },

    async notify() {
      this._lock.handle = undefined
      this._lock.lock = false
      for (let [world_id, { resolve, reject }] of this._waiters) {
        resolve()
      }
    },
    observe(world_id, worlds) {
      if (world_id) {
        this._observed_id = world_id
        this._lock.lock = true
      } else {
        this._lock.lock = false
        this.reference = undefined
      }


      function executeLoop(ref) {
        for (let w of worlds) {
          const frame = ref.map.get(w[0]);
          if (!frame) return;
          console.log("force update" + w[0])
          frame.swap_flag = true;
        }
      }
      setTimeout(executeLoop(this), 100); // 200ms or 0.2 seconds


    },
    saveReference(reference) {
      this.reference = reference
    },
    async init(
      world_id,
      exp: Experiment,
      active_variables: EVarID[],
      world_data: WorldData,
    ) {
      if (this._observed_id !== undefined) {
        this._lock.lock = true
      }
      const data = this.map.get(world_id)
      console.log("INIT USEFRAMEREF")

      const frame: TimeFrame = {
        exp: exp,
        swap_flag: true,
        swapping: false,
        uSphereWrapAmount: data?.uSphereWrapAmount ?? 1.0,
        weight: data?.weight ?? 0,
        variables: data?.variables ?? new Map(),
        mode: data?.mode,
      }
      const max_ts = await getMaxTimesteps(frame)
      frame.timesteps = max_ts
      if (
        world_data.time.mode_state.is_writable &&
        world_data.time.mode_state.previous !== world_data.time.mode &&
        (frame.mode === undefined || world_data.time.mode !== frame.mode)
      ) {
        frame.mode = world_data.time.mode
        //const copy_world_data = deepCopy(world_data)
        switch (world_data.time.mode) {
          case TimeMode.mean:
            frame.weight = world_data.collection.exps.indexOf(exp)
            break
          case TimeMode.ts:
            const e = world_data.collection.exps.at(frame.weight)
            // weird hack but works
            frame.exp = JSON.parse(JSON.stringify(e))
            frame.weight = 0
          default:
            break
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

      this.map.set(world_id, frame)
    },
  })
  return current_frame
}
