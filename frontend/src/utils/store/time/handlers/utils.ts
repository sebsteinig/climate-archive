import { TextureInfo } from "@/utils/database/database.types"
import { VariableName } from "../../variables/variable.types"
import {
  Time,
  TimeDirection,
  TimeFrame,
  TimeFrameValue,
  TimeMode,
} from "../time.type"
import { Experiment } from "@/utils/types"
import { database_provider } from "@/utils/database_provider/DatabaseProvider"

export function chunksDetails(info: TextureInfo): [number, number] {
  const cs = info.paths_ts.paths[0].grid[0].length // number of chunks
  const fs = info.timesteps / cs
  return [cs, fs]
}

function computeRatio(ref: TimeFrameValue): number {
  const [_, fpc] = chunksDetails(ref.current.info)
  const ts = ref.current.info.timesteps
  const f = ref.current.frame
  const c = ref.current.time_chunk

  return (f + c * fpc) / ts
}

function computeFramePos(
  ratio: number,
  timesteps: number,
  fpc: number,
): [number, number] {
  const tmp_frame = Math.floor(timesteps * ratio)
  const time_chunk = Math.floor(tmp_frame / fpc)
  const frame = tmp_frame % fpc
  return [frame, time_chunk]
}

export function getCurrentPos(time: Time, frame: TimeFrame): [number, number] {
  const departure = time.surfing_departure
  const first = frame.variables.values().next().value as
    | TimeFrameValue
    | undefined
  if (!first) {
    return [0, 0]
  }
  const weight = first.weight
  switch (time.mode) {
    case TimeMode.mean:
      const idx = first.current.idx
      return [idx - departure, weight]
    case TimeMode.ts:
      const s = first.current.info.timesteps
      const f = first.current.frame
      const c = first.current.time_chunk
      const [cs, fpc] = chunksDetails(first.current.info)
      const t = f + c * fpc
      return [t - departure, weight]
  }
}

export async function peekNextTs(
  exps: Experiment[],
  variable: VariableName,
  nb_c: number,
  fpc: number,
  current_frame: number,
  current_chunk: number,
  current_idx: number,
): Promise<[number, number, number, Experiment, TextureInfo]> {
  let next_idx = current_idx
  let next_chunk = current_chunk
  let next_frame = current_frame + 1
  if (next_frame >= fpc) {
    next_frame = 0
    next_chunk += 1
  }

  if (next_chunk >= nb_c) {
    next_chunk = 0
    next_idx = (next_idx + 1) % exps.length
  }
  const info = await database_provider.getInfo(exps[next_idx].id, variable)
  return [next_frame, next_chunk, next_idx, exps[next_idx], info]
}

export async function peekPreviousTs(
  exps: Experiment[],
  variable: VariableName,
  nb_c: number,
  fpc: number,
  current_frame: number,
  current_chunk: number,
  current_idx: number,
): Promise<[number, number, number, Experiment, TextureInfo]> {
  let next_idx = current_idx
  let next_chunk = current_chunk
  let next_frame = current_frame - 1
  if (next_frame < 0) {
    next_frame = fpc - 1
    next_chunk -= 1
  }
  let info = await database_provider.getInfo(exps[next_idx].id, variable)
  if (current_chunk < 0) {
    next_idx = (exps.length + next_idx - 1) % exps.length
    info = await database_provider.getInfo(exps[next_idx].id, variable)
    const [new_nb_c, new_fpc] = chunksDetails(info)
    next_chunk = new_nb_c - 1
    next_frame = new_fpc - 1
  }
  return [next_frame, next_chunk, next_idx, exps[next_idx], info]
}

async function syncMean(
  time: Time,
  exps: Experiment[],
  frame: TimeFrame,
  active_variable: VariableName[],
): Promise<TimeFrame> {
  const sync_frame: TimeFrame = {
    variables: new Map(),
    initialized: true,
  }
  if (!frame.initialized || frame.variables.size === 0) {
    return await initMean(time, exps, active_variable)
  }
  const [_, ref] = frame.variables.entries().next().value as [
    VariableName,
    TimeFrameValue,
  ]

  const didx = time.direction === TimeDirection.forward ? 1 : -1

  for (let variable of active_variable) {
    const res = frame.variables.get(variable)
    if (res) {
      sync_frame.variables.set(variable, res)
      continue
    }
    const current_info = await database_provider.getInfo(
      ref.current.exp.id,
      variable,
    )
    const current = {
      idx: ref.current.idx,
      exp: ref.current.exp,
      info: current_info,
      time_chunk: 0, // because mean => no chunks
      frame: 0, // same here
    }

    const next_idx = (ref.current.idx + didx) % exps.length
    const next_exp = exps[next_idx]
    const next_info = await database_provider.getInfo(next_exp.id, variable)

    const next = {
      idx: next_idx,
      exp: next_exp,
      info: next_info,
      time_chunk: 0,
      frame: 0,
    }
    sync_frame.variables.set(variable, {
      current,
      next,
      weight: ref.weight,
    })
  }
  return sync_frame
}

async function syncTs(
  time: Time,
  exps: Experiment[],
  frame: TimeFrame,
  active_variable: VariableName[],
): Promise<TimeFrame> {
  const sync_frame: TimeFrame = {
    variables: new Map(),
    initialized: true,
  }
  if (!frame.initialized || frame.variables.size === 0) {
    return await initTs(time, exps, active_variable)
  }
  const [_, ref] = frame.variables.entries().next().value as [
    VariableName,
    TimeFrameValue,
  ]

  for (let variable of active_variable) {
    const res = frame.variables.get(variable)
    if (res) {
      sync_frame.variables.set(variable, res)
      continue
    }
    const current_info = await database_provider.getInfo(
      ref.current.exp.id,
      variable,
    )

    const ratio = computeRatio(ref)
    const [nb_c, fpc] = chunksDetails(current_info)

    const [current_frame, current_chunk] = computeFramePos(
      ratio,
      current_info.timesteps,
      fpc,
    )

    const current = {
      idx: ref.current.idx,
      exp: ref.current.exp,
      info: current_info,
      time_chunk: current_chunk,
      frame: current_frame,
    }
    let next_frame, next_chunk, next_idx, next_exp, next_info
    if (time.direction === TimeDirection.forward) {
      ;[next_frame, next_chunk, next_idx, next_exp, next_info] =
        await peekNextTs(
          exps,
          variable,
          nb_c,
          fpc,
          current_frame,
          current_chunk,
          ref.current.idx,
        )
    } else {
      ;[next_frame, next_chunk, next_idx, next_exp, next_info] =
        await peekPreviousTs(
          exps,
          variable,
          nb_c,
          fpc,
          current_frame,
          current_chunk,
          ref.current.idx,
        )
    }

    const next = {
      idx: next_idx,
      exp: next_exp,
      info: next_info,
      time_chunk: next_chunk,
      frame: next_frame,
    }
    sync_frame.variables.set(variable, {
      current,
      next,
      weight: ref.weight,
    })
  }
  return sync_frame
}

export async function sync(
  time: Time,
  exps: Experiment[],
  frame: TimeFrame,
  active_variable: VariableName[],
): Promise<TimeFrame> {
  switch (time.mode) {
    case TimeMode.mean:
      return await syncMean(time, exps, frame, active_variable)
    case TimeMode.ts:
      return await syncTs(time, exps, frame, active_variable)
  }
}

export async function initMean(
  time: Time,
  exps: Experiment[],
  active_variable: VariableName[],
): Promise<TimeFrame> {
  const frame: TimeFrame = {
    variables: new Map(),
    initialized: true,
  }
  let idx_zero: number
  let idx_one: number
  switch (time.direction) {
    case TimeDirection.forward:
      idx_zero = 0
      idx_one = 1
      break
    case TimeDirection.backward:
      idx_zero = exps.length - 1
      idx_one = exps.length - 2
      break
  }
  let exp_zero = exps[idx_zero]
  let exp_one = exps[idx_one]
  for (let variable of active_variable) {
    const info_zero = await database_provider.getInfo(exp_zero.id, variable)
    const info_one = await database_provider.getInfo(exp_one.id, variable)

    const value: TimeFrameValue = {
      current: {
        exp: exp_zero,
        idx: idx_zero,
        info: info_zero,
        frame: 0,
        time_chunk: 0,
      },
      next: {
        exp: exp_one,
        idx: idx_one,
        info: info_one,
        frame: 0,
        time_chunk: 0,
      },
      weight: 0,
    }
    frame.variables.set(variable, value)
  }
  return frame
}
export async function initTs(
  time: Time,
  exps: Experiment[],
  active_variable: VariableName[],
): Promise<TimeFrame> {
  const frame: TimeFrame = {
    variables: new Map(),
    initialized: true,
  }
  let idx: number

  switch (time.direction) {
    case TimeDirection.forward:
      idx = 0
      break
    case TimeDirection.backward:
      idx = exps.length - 1
      break
  }
  let exp = exps[idx]

  for (let variable of active_variable) {
    const info = await database_provider.getInfo(exp.id, variable)
    const ts = info.timesteps
    const [cs, fs] = chunksDetails(info)

    let frame_zero: number
    let chunks_zero: number
    let frame_one: number
    let chunks_one: number

    switch (time.direction) {
      case TimeDirection.forward:
        frame_zero = 0
        chunks_zero = 0
        if (fs > 1) {
          frame_one = 1
          chunks_one = 0
        } else {
          frame_one = 0
          chunks_one = 1
        }
        break
      case TimeDirection.backward:
        idx = exps.length - 1
        if (fs > 1) {
          frame_zero = fs - 1
          chunks_zero = cs - 1
          chunks_one = cs - 1
          frame_one = fs - 2
        } else {
          frame_zero = 0
          frame_one = 0
          chunks_zero = cs - 1
          chunks_one = cs - 2
        }
        break
    }

    const value: TimeFrameValue = {
      current: {
        exp,
        idx,
        info,
        frame: frame_zero,
        time_chunk: chunks_zero,
      },
      next: {
        exp,
        idx,
        info,
        frame: frame_one,
        time_chunk: chunks_one,
      },
      weight: 0,
    }
    frame.variables.set(variable, value)
  }
  return frame
}
