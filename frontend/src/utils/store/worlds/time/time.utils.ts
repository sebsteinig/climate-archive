import { database_provider } from "@/utils/database_provider/DatabaseProvider"
import { TextureInfo } from "@/utils/database/database.types"
import { TimeFrame, TimeFrameState, TimeMode, WorldData } from "./time.type"
import { ALL_VARIABLES, EVarID } from "../../variables/variable.types"

export function chunksDetails(info: TextureInfo): [number, number] {
  const cs = info.paths_ts.paths[0].grid[0].length // number of chunks
  const fs = info.timesteps / cs
  return [cs, fs]
}

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
  data: WorldData,
): Promise<TimeFrameState> {
  const current_time = Math.floor(frame.weight)

  if (data.time.mode === TimeMode.mean) {
    const size = data.collection.exps.length
    let next_time = current_time + 1
    if (next_time >= size) {
      next_time = current_time
    }

    console.log(data.collection.exps[current_time].id)
    console.log(variable)
    
    const current_info = await database_provider.getInfo(
      data.collection.exps[current_time].id,
      variable,
    )
    const next_info = await database_provider.getInfo(
      data.collection.exps[next_time].id,
      variable,
    )

    console.log(current_info)

    return {
      mean: {
        current: {
          exp: data.collection.exps[current_time],
          idx: current_time,
          info: current_info,
        },
        next: {
          exp: data.collection.exps[next_time],
          idx: next_time,
          info: next_info,
        },
        is_freezed: false,
      },
    }
  } else {
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
      ts: {
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
      },
    }
  }
}

export async function updateFrame(
  frame: TimeFrame,
  active_variables: EVarID[],
  data: WorldData,
) {
  // clean the frame of unused variables
  for (let variable of frame.variables.keys()) {
    if (!active_variables.includes(variable)) {
      frame.variables.delete(variable)
    }
  }

  const current_time = Math.floor(frame.weight)
  let next_time = current_time + 1
  for (let variable of active_variables) {
    const state = frame.variables.get(variable)
    if (!state) {
      // NEED TO BE SYNCHRONIZED
      const synced = await sync(frame, variable, data)
      frame.variables.set(variable, synced)
      continue
    }
    if (data.time.mode === TimeMode.mean) {

      if (!state.mean) continue
      const size = data.collection.exps.length
      if (next_time >= size) {
        next_time = current_time
      }

      const current_info = await database_provider.getInfo(
        data.collection.exps[current_time].id,
        variable,
      )

      const next_info = await database_provider.getInfo(
        data.collection.exps[next_time].id,
        variable,
      )

      // use pre-loaded Info for less computation between farmes
      // const current_info = data.collection.allInfo[variable][current_time]
      // const next_info = data.collection.allInfo[variable][next_time]

      console.log(current_info)

      state.mean.current = {
        exp: data.collection.exps[current_time],
        idx: current_time,
        info: current_info,
      }

      state.mean.next = {
        exp: data.collection.exps[next_time],
        idx: next_time,
        info: next_info,
      }
    } else {
      if (!state.ts) continue
      if (state.ts.is_freezed) continue

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
