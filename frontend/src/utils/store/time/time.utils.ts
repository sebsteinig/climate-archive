import { gsap } from "gsap"
import {
  TimeConf,
  TimeDirection,
  TimeFrame,
  TimeFrameState,
  TimeKind,
  TimeMode,
  TimeSpeed,
  WorldConf,
  WorldData,
} from "./time.type"
import { database_provider } from "@/utils/database_provider/DatabaseProvider"
import { ALL_VARIABLES, EVarID } from "../variables/variable.types"
import { TextureInfo } from "@/utils/database/database.types"
import { MutableRefObject, RefObject } from "react"

export function buildWorldConf(config?: Partial<WorldConf>): WorldConf {
  return {
    camera: config?.camera ?? {
      is_linked: true,
    },
  }
}

export function buildTimeConf(config?: Partial<TimeConf>): TimeConf {
  let speed : number;
  switch (config?.speed) {
    case TimeSpeed.very_fast:
      speed = 0.25
      break;
    case TimeSpeed.fast:
      speed = 0.5
      break;
    case TimeSpeed.slow :
      speed = 2
      break;
    case TimeSpeed.very_slow :
        speed = 4
        break;
    case TimeSpeed.medium : 
    default:
      speed = 1
      break;
  }
  return {
    direction: config?.direction ?? TimeDirection.forward,
    kind: config?.kind ?? TimeKind.circular,
    speed: speed,
    mode : config?.mode ?? TimeMode.ts
  }
}

export function chunksDetails(info: TextureInfo): [number, number] {
  const cs = info.paths_ts.paths[0].grid[0].length // number of chunks
  const fs = info.timesteps / cs
  return [cs, fs]
}

// function computeRatio(ref: TimeFrameState): number {
//   const [_, fpc] = chunksDetails(ref.info)
//   const ts = ref.info.timesteps
//   const f = ref.current.frame
//   const c = ref.current.time_chunk

//   return (f + c * fpc) / ts
// }

// function computeFramePos(
//   ratio: number,
//   timesteps: number,
//   fpc: number,
// ): [number, number] {
//   const tmp_frame = Math.floor(timesteps * ratio)
//   const time_chunk = Math.floor(tmp_frame / fpc)
//   const frame = tmp_frame % fpc
//   return [frame, time_chunk]
// }

export async function getMaxTimesteps(frame: TimeFrame) {
  const ts = await Promise.all(
    ALL_VARIABLES.map(async (variable) => {
      try {
        const info = await database_provider.getInfo(frame.exp.id, variable)
        return info.timesteps
      } catch (error) {
        return 0
      }
    }),
  )
  return Math.max(...ts)
}

export async function sync(
  frame: TimeFrame,
  variable: EVarID,
  data : WorldData,
): Promise<TimeFrameState> {

  const current_time = Math.floor(frame.weight)
  
  if(data.time.mode === TimeMode.mean) {
    const size = data.collection.exps.length 
    let next_time = current_time + 1
    if (next_time >= size) {
      next_time = current_time
    }

    const current_info = await database_provider.getInfo(data.collection.exps[current_time].id, variable)
    const next_info = await database_provider.getInfo(data.collection.exps[next_time].id, variable)
    return {
      mean : {
        current: {
          exp : data.collection.exps[current_time],
          idx : current_time,
          info : current_info,
        },
        next : {
          exp : data.collection.exps[next_time],
          idx : next_time,
          info : next_info,
        },
        is_freezed : false
      }
    }
  }else {
    const info = await database_provider.getInfo(frame.exp.id, variable)
    const [nb_c, fpc] = chunksDetails(info)
  
    let next_time = current_time + 1
    if (next_time >= info.timesteps) {
      next_time = current_time
    }
  
    const current_time_chunk = Math.floor(current_time / fpc)
    const current_frame = current_time % fpc
    const next_time_chunk = Math.floor(next_time / fpc)
    const next_frame = next_time % fpc
  
    return {
      ts : {
        current: {
          frame: current_frame,
          time_chunk: current_time_chunk,
        },
        next: {
          frame: next_frame,
          time_chunk: next_time_chunk,
        },
        info,
        is_freezed: info.timesteps !== frame.timesteps,
      }
    }
  }

}

export async function update(frame: TimeFrame, active_variables: EVarID[],data:WorldData) {
  const current_time = Math.floor(frame.weight)
  let next_time = current_time + 1
  for (let variable of active_variables) {
    const state = frame.variables.get(variable)
    if (!state) {
      // NEED TO BE SYNCHRONIZED
      const synced = await sync(frame, variable,data)
      frame.variables.set(variable, synced)
      continue
    }
    if(data.time.mode === TimeMode.mean) {
      if(!state.mean) continue;
      const size = data.collection.exps.length
      if (next_time >= size) {
        next_time = current_time
      }
      const current_info = await database_provider.getInfo(data.collection.exps[current_time].id, variable)
      const next_info = await database_provider.getInfo(data.collection.exps[next_time].id, variable)

      state.mean.current = {
        exp : data.collection.exps[current_time],
        idx : current_time,
        info : current_info,
      }

      state.mean.next = {
        exp : data.collection.exps[next_time],
        idx : next_time,
        info : next_info,
      }

    }else {
      if(!state.ts) continue;
      if (state.ts.is_freezed) continue;
  
      if (next_time >= state.ts.info.timesteps) {
        next_time = current_time
      }
      const [nb_c, fpc] = chunksDetails(state.ts.info)
      const current_time_chunk = Math.floor(current_time / fpc)
      const current_frame = current_time % fpc
      const next_time_chunk = Math.floor(next_time / fpc)
      const next_frame = next_time % fpc
  
      state.ts.current = {
        frame: current_frame,
        time_chunk: current_time_chunk,
      }
      state.ts.next = {
        frame: next_frame,
        time_chunk: next_time_chunk,
      }
    }
  }
}

function calcDuration(from:number,to:number,speed : number) : number {
  const t = speed * 2 // 2 sec to go + 1 weight

  return Math.abs(to-from)*t
}
const EPSILON = 0.00001
export function goto(
  frame: TimeFrame,
  to: number,
  onComplete?: () => void,
) {
  let state = {
    previous_idx: Math.floor(frame.weight),
  }
  const rounded_to = Math.round(to)
  const duration = 5 // 5s
  return gsap.to(frame, {
    ease: "power1.inOut",
    duration: duration,
    weight: rounded_to,
    onCompleteParams: [frame],
    onComplete: (frame: TimeFrame) => {
      //pin(frame, onComplete)
    },
    onUpdateParams: [frame, state],
    onUpdate: (frame: TimeFrame, state: { previous_idx: number }) => {
      const idx = Math.floor(frame.weight)
      if (state.previous_idx !== idx && idx !== to) {
        state.previous_idx = idx

        frame.swap_flag = true
      }
    },
    onInterruptParams: [frame],
    onInterrupt: (frame: TimeFrame) => {
      pin(frame)
    },
  })
}

export function pin(frame: TimeFrame, onComplete?: () => void) {
  const to = Math.round(frame.weight)
  return gsap.to(frame, {
    weight: to,
    onCompleteParams: [frame],
    onComplete: (frame) => {
      frame.swap_flag = true
      if (onComplete) {
        onComplete()
      }
    },
  })
}

export function next(frame: TimeFrame, onComplete?: () => void) {
  const to = Math.floor(frame.weight) + 1
  return gsap.to(frame, { weight: to, ease: "none" })
}

export function previous(frame: TimeFrame, onComplete?: () => void) {
  const to = Math.floor(frame.weight) - 1
  return gsap.to(frame, { weight: to, ease: "none" })
}

export function circular(
  frame: TimeFrame,
  tween_ref: MutableRefObject<gsap.core.Tween | undefined>,
  world_data : WorldData,
) {
  if (!frame.timesteps) return undefined
  let state = {
    previous_idx: Math.floor(frame.weight),
  }
  let to:number;
  if(world_data.time.mode === TimeMode.mean) {
    to = world_data.collection.exps.length
  }else {
    to = frame.timesteps
  }
  const duration = calcDuration(Math.floor(frame.weight),to,world_data.time.speed)
  return gsap.to(frame, {
    duration: duration,
    ease: "none",
    weight: to - 1,
    onCompleteParams: [frame, tween_ref,world_data],
    onComplete: (
      frame: TimeFrame,
      tween_ref: MutableRefObject<gsap.core.Tween | undefined>,
      world_data : WorldData
    ) => {
      frame.weight = 0
      frame.swap_flag = true
      tween_ref.current = circular(frame, tween_ref,world_data)
    },
    onUpdateParams: [frame, state],
    onUpdate: (frame: TimeFrame, state: { previous_idx: number }) => {
      const idx = Math.floor(frame.weight)
      if (state.previous_idx !== idx && idx !== to) {
        state.previous_idx = idx
        frame.swap_flag = true
      }
    },
    onInterruptParams: [frame],
    onInterrupt: (frame: TimeFrame) => {
      pin(frame)
    },
  })
}

export function once(
  frame: TimeFrame,
  tween_ref: MutableRefObject<gsap.core.Tween | undefined>,
  world_data : WorldData,
  onComplete: () => void,
) {
  if (!frame.timesteps) return undefined
  let state = {
    previous_idx: Math.floor(frame.weight),
  }  
  let to:number;
  if(world_data.time.mode === TimeMode.mean) {
    to = world_data.collection.exps.length
  }else {
    to = frame.timesteps
  }
  const duration = calcDuration(Math.floor(frame.weight),to,world_data.time.speed)
  return gsap.to(frame, {
    duration: duration,
    ease: "none",
    weight: to - 1,
    onCompleteParams: [frame],
    onComplete: (frame: TimeFrame) => {
      frame.weight = 0
      frame.swap_flag = true
      onComplete()
    },
    onUpdateParams: [frame, state],
    onUpdate: (frame: TimeFrame, state: { previous_idx: number }) => {
      const idx = Math.floor(frame.weight)
      if (state.previous_idx !== idx && idx !== to) {
        state.previous_idx = idx
        frame.swap_flag = true
      }
    },
    onInterruptParams: [frame],
    onInterrupt: (frame: TimeFrame) => {
      pin(frame)
    },
  })
}

export function walk(
  frame: TimeFrame,
  tween_ref: MutableRefObject<gsap.core.Tween | undefined>,
  world_data : WorldData,
) {
  if (!frame.timesteps) return undefined

  let to:number;
  if(world_data.time.mode === TimeMode.mean) {
    const size = world_data.collection.exps.length
    to = frame.weight === size - 1 ? 0 : size - 1
  }else {
    to = frame.weight === frame.timesteps - 1 ? 0 : frame.timesteps - 1
  }
  
  let state = {
    previous_idx: Math.floor(frame.weight),
  }

  const duration = calcDuration(Math.floor(frame.weight),to,world_data.time.speed)
  return gsap.to(frame, {
    duration: duration,
    ease: "none",
    weight: to,
    onCompleteParams: [frame, tween_ref,world_data],
    onComplete: (
      frame: TimeFrame,
      tween_ref: MutableRefObject<gsap.core.Tween | undefined>,
      world_data : WorldData
    ) => {
      frame.swap_flag = true
      tween_ref.current = walk(frame, tween_ref,world_data)
    },
    onUpdateParams: [frame, state],
    onUpdate: (frame: TimeFrame, state: { previous_idx: number }) => {
      const idx = Math.floor(frame.weight)
      if (state.previous_idx !== idx && idx !== to) {
        state.previous_idx = idx
        frame.swap_flag = true
      }
    },
    onInterruptParams: [frame],
    onInterrupt: (frame: TimeFrame) => {
      pin(frame)
    },
  })
}
