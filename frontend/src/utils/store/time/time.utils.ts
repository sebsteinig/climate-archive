import { texture_provider } from "@/utils/texture_provider/TextureProvider"
import {
  Time,
  TimeDirection,
  TimeKind,
  TimeMode,
  TimeFrame,
  TimeFrameValue,
  TimeState,
  TimeConfig,
  TimeSpeed,
} from "./time.type"
import { VariableName } from "../variables/variable.types"
import { initMean, initTs, sync } from "./handlers/utils"
import { nextOnce } from "./handlers/once"
import { nextWalk } from "./handlers/walk"
import { nextCircular } from "./handlers/circular"
import { Experiment } from "@/utils/types"

export function nextBuilder(time: Time) {
  switch (time.kind) {
    case TimeKind.once:
      return nextOnce
    case TimeKind.walk:
      return nextWalk
    case TimeKind.circular:
      return nextCircular
  }
}

export async function initFrame(
  time: Time,
  exps: Experiment[],
  active_variable: VariableName[],
) {
  switch (time.mode) {
    case TimeMode.mean:
      return await initMean(time, exps, active_variable)
    case TimeMode.ts:
      return await initTs(time, exps, active_variable)
  }
}

export function buildTime(config: TimeConfig): Time {
  const kind = config.kind ?? TimeKind.circular
  const direction = config.direction ?? TimeDirection.forward
  const state = TimeState.zero
  let config_speed = config.speed ?? TimeSpeed.medium
  let speed = config_speed
  if (config_speed === TimeSpeed.slow) {
    speed = 1000
  }
  if (config_speed === TimeSpeed.medium) {
    speed = 500
  }
  if (config_speed === TimeSpeed.fast) {
    speed = 250
  }
  const mode = config.mode ?? TimeMode.mean
  const time = {
    mode,
    kind,
    direction,
    speed,
    state,
    current_frame: new Map(),
    collections: new Map(),
  } as Time
  return time
}

// export async function nextCircular(time:Time,current:TimeFrame,  delta:number,active_variable:VariableName[]):Promise<TimeFrame> {
//     if(time.mode === TimeMode.mean) {
//         const new_res = new Map<VariableName,TimeFrameValue>()
//         for (let variable of active_variable) {
//             const res = current.get(variable)
//             if (!res) {
//                 // newly selected variable
//                 const [_,tr] = current.entries().next().value as [VariableName, TimeFrameValue]

//                 const current_info = await texture_provider.getInfo(tr.current.exp,variable)
//                 const new_current = {
//                     idx : tr.current.idx,
//                     exp : tr.current.exp,
//                     info : current_info,
//                     time_chunk : 0, // because mean => no chunks
//                     frame : 0, // same here
//                 }

//                 const didx = time.direction === TimeDirection.forward ? 1 : -1
//                 const new_idx = (tr.current.idx + didx) % time.exps.length
//                 const new_exp = time.exps[new_idx]
//                 const new_info = await texture_provider.getInfo(new_exp,variable)

//                 const new_next = {
//                     idx : new_idx,
//                     exp: new_exp,
//                     info : new_info,
//                     time_chunk : 0,
//                     frame : 0,
//                 }
//                 new_res.set(variable,
//                     {
//                         current:new_current,
//                         next:new_next,
//                         weight:tr.weight
//                     }
//                 )
//                 continue;
//             }

//             let new_weight = (res.weight + delta)
//             if (new_weight < 1) {
//                 new_res.set(variable,
//                     {
//                         current : res.current,
//                         next : res.next,
//                         weight : new_weight,
//                     }
//                 )
//                 continue;
//             }
//             new_weight = 0
//             let new_current
//             if(!res.next) {

//                 const didx = time.direction === TimeDirection.forward ? 1 : -1
//                 const new_idx = (res.current.idx + didx) % time.exps.length
//                 const new_exp = time.exps[new_idx]
//                 const new_info = await texture_provider.getInfo(new_exp,variable)

//                 new_current = {
//                     idx : new_idx,
//                     exp: new_exp,
//                     info : new_info,
//                     time_chunk : 0,
//                     frame : 0,
//                 }
//             }else {
//                 new_current = res.next
//             }

//             const didx = time.direction === TimeDirection.forward ? 1 : -1

//             const new_idx = (new_current.idx + didx) % time.exps.length
//             const new_exp = time.exps[new_idx]
//             const new_info = await texture_provider.getInfo(new_exp,variable)

//             const new_next = {
//                 idx : new_idx,
//                 exp : new_exp,
//                 info : new_info,
//                 frame : res.current.frame, // only in mean => takes the first and only frame of each texture
//                 time_chunk : res.current.time_chunk, // only in mean => takes the first and only chunks of each texture
//             }
//             new_res.set(variable,
//                 {
//                     current : new_current,
//                     next : new_next,
//                     weight : new_weight,
//                 }
//             )
//         }
//         return new_res;
//     }else { // mode ts
//         const new_res = new Map<VariableName,TimeFrameValue>()
//         for (let variable of active_variable) {
//             const res = current.get(variable)
//             if (!res) {
//                 // newly selected variable
//                 const [_,tr] = current.entries().next().value as [VariableName, TimeFrameValue]

//                 const current_info = await texture_provider.getInfo(tr.current.exp,variable)

//                 const tr_ts_chunks_size = tr.current.info.paths_ts.paths[0].grid[0].length
//                 const tr_frames_size = tr.current.info.timesteps / tr_ts_chunks_size

//                 const tr_ratio = (tr.current.frame+tr.current.time_chunk*tr_frames_size) / tr.current.info.timesteps

//                 const ts_chunks_size = current_info.paths_ts.paths[0].grid[0].length
//                 const frames_size = current_info.timesteps / ts_chunks_size

//                 const tmp_frame = Math.floor(current_info.timesteps * tr_ratio)
//                 const time_chunk = Math.floor(tmp_frame / frames_size)
//                 const frame = tmp_frame % frames_size

//                 const new_current = {
//                     idx : tr.current.idx,
//                     exp : tr.current.exp,
//                     info : current_info,
//                     time_chunk : time_chunk,
//                     frame :frame,
//                 }

//                 const didx = time.direction === TimeDirection.forward ? 1 : -1
//                 let new_frame = frame + didx
//                 let new_time_chunk = time_chunk

//                 let new_idx = tr.current.idx
//                 let new_exp = time.exps[new_idx]
//                 let new_info = current_info

//                 if (new_frame >= frames_size) {
//                     new_frame = 0
//                     new_time_chunk += 1
//                     if ( new_time_chunk === ts_chunks_size) {
//                         // end of the ts for the current exp
//                         new_idx = (new_idx + 1) % time.exps.length
//                         new_exp = time.exps[new_idx]
//                         new_info = await texture_provider.getInfo(new_exp,variable)
//                         new_time_chunk = 0
//                     }
//                 }else if( new_frame < 0) {
//                     new_frame = frames_size - 1
//                     new_time_chunk -= 1
//                     if ( new_time_chunk < 0) {
//                         new_idx = (new_idx - 1) % time.exps.length
//                         new_exp = time.exps[new_idx]
//                         new_info = await texture_provider.getInfo(new_exp,variable)

//                         const new_ts_chunks_size = new_info.paths_ts.paths[0].grid[0].length
//                         new_time_chunk = new_ts_chunks_size - 1
//                     }
//                 }

//                 const new_next = {
//                     idx : new_idx,
//                     exp: new_exp,
//                     info : new_info,
//                     time_chunk : new_time_chunk,
//                     frame : new_frame,
//                 }
//                 new_res.set(variable,
//                     {
//                         current:new_current,
//                         next:new_next,
//                         weight:tr.weight
//                     }
//                 )
//                 continue;
//             }

//             let new_weight = (res.weight + delta)
//             if (new_weight < 1) {
//                 new_res.set(variable,
//                     {
//                         current : res.current,
//                         next : res.next,
//                         weight : new_weight,
//                     }
//                 )
//                 continue;
//             }
//             new_weight = 0

//             const ts_chunks_size = res.current.info.paths_ts.paths[0].grid[0].length
//             const frames_size = res.current.info.timesteps / ts_chunks_size
//             let new_current
//             if(!res.next) {

//                 const didx = time.direction === TimeDirection.forward ? 1 : -1
//                 let new_frame = res.current.frame + didx
//                 let new_time_chunk = res.current.time_chunk

//                 let new_idx = res.current.idx
//                 let new_exp = time.exps[new_idx]
//                 let new_info = res.current.info

//                 if (new_frame >= frames_size) {
//                     new_frame = 0
//                     new_time_chunk += 1
//                     if ( new_time_chunk === ts_chunks_size) {
//                         // end of the ts for the current exp
//                         new_idx = (res.current.idx + 1) % time.exps.length
//                         new_exp = time.exps[new_idx]
//                         new_info = await texture_provider.getInfo(new_exp,variable)
//                         new_time_chunk = 0
//                     }
//                 }else if( new_frame < 0) {
//                     new_frame = frames_size - 1
//                     new_time_chunk -= 1
//                     if ( new_time_chunk < 0) {
//                         new_idx = (res.current.idx - 1) % time.exps.length
//                         new_exp = time.exps[new_idx]
//                         new_info = await texture_provider.getInfo(new_exp,variable)

//                         const new_ts_chunks_size = new_info.paths_ts.paths[0].grid[0].length
//                         new_time_chunk = new_ts_chunks_size - 1
//                     }
//                 }

//                 new_current = {
//                     idx : new_idx,
//                     exp : new_exp,
//                     info : new_info,
//                     frame : new_frame,
//                     time_chunk : new_time_chunk,
//                 }
//             }else {
//                 new_current = res.next
//             }

//             const didx = time.direction === TimeDirection.forward ? 1 : -1

//             let new_frame = new_current.frame + didx
//             let new_time_chunk = new_current.time_chunk

//             let new_idx = new_current.idx
//             let new_exp = time.exps[new_idx]
//             let new_info = new_current.info

//             if (new_frame >= frames_size) {
//                 new_frame = 0
//                 new_time_chunk += 1
//                 if ( new_time_chunk === ts_chunks_size) {
//                     // end of the ts for the current exp
//                     new_idx = (new_current.idx + 1) % time.exps.length
//                     new_exp = time.exps[new_idx]
//                     new_info = await texture_provider.getInfo(new_exp,variable)
//                     new_time_chunk = 0
//                 }
//             }else if( new_frame < 0) {
//                 new_frame = frames_size - 1
//                 new_time_chunk -= 1
//                 if ( new_time_chunk < 0) {
//                     new_idx = (new_current.idx - 1) % time.exps.length
//                     new_exp = time.exps[new_idx]
//                     new_info = await texture_provider.getInfo(new_exp,variable)

//                     const new_ts_chunks_size = new_info.paths_ts.paths[0].grid[0].length
//                     new_time_chunk = new_ts_chunks_size - 1
//                 }
//             }

//             const new_next = {
//                 idx : new_idx,
//                 exp : new_exp,
//                 info : new_info,
//                 frame : new_frame,
//                 time_chunk : new_time_chunk,
//             }
//             new_res.set(variable,
//                 {
//                     current : new_current,
//                     next : new_next,
//                     weight : new_weight,
//                 }
//             )
//         }
//         return new_res;
//     }
// }

// // export function nextWalk(time:Time,current:TimeFrame,  delta:number,active_variable:VariableName[]):TimeFrame {

// // }

// // export function nextOnce(time:Time,current:TimeFrame,  delta:number,active_variable:VariableName[]):TimeFrame {

// // }
