import { gsap } from "gsap"
import {
  TimeConf,
  TimeDirection,
  TimeFrame,
  TimeFrameState,
  TimeKind,
  WorldConf,
} from "./time.type"
import { database_provider } from "@/utils/database_provider/DatabaseProvider"
import { VariableName } from "../variables/variable.types"
import { TextureInfo } from "@/utils/database/database.types"
import { MutableRefObject, RefObject } from "react"

export function buildWorldConf(config?: WorldConf): WorldConf {
  return {
    camera: config?.camera ?? {
      is_linked: true,
    },
  }
}

export function buildTimeConf(config?: TimeConf): TimeConf {
  return {
    direction: config?.direction ?? TimeDirection.forward,
    kind: config?.kind ?? TimeKind.circular,
    speed: 1,
  }
}

export function chunksDetails(info: TextureInfo): [number, number] {
  const cs = info.paths_ts.paths[0].grid[0].length // number of chunks
  const fs = info.timesteps / cs
  return [cs, fs]
}

function computeRatio(ref: TimeFrameState): number {
  const [_, fpc] = chunksDetails(ref.info)
  const ts = ref.info.timesteps
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

export async function sync(
  frame: TimeFrame,
  variable: VariableName,
): Promise<TimeFrameState> {
  const info = await database_provider.getInfo(frame.exp.id, variable)
  const [nb_c, fpc] = chunksDetails(info)

  const current_time = Math.floor(frame.weight)
  let next_time = current_time + 1
  if (next_time >= info.timesteps) {
    next_time = current_time
  }

  const current_time_chunk = Math.floor(current_time / fpc)
  const current_frame = current_time % fpc
  const next_time_chunk = Math.floor(next_time / fpc)
  const next_frame = next_time % fpc

  return {
    current: {
      frame: current_frame,
      time_chunk: current_time_chunk,
    },
    next: {
      frame: next_frame,
      time_chunk: next_time_chunk,
    },
    info,
  }
}

export async function update(
  frame: TimeFrame,
  active_variables: VariableName[],
) {
  const current_time = Math.floor(frame.weight)
  let next_time = current_time + 1
  for (let variable of active_variables) {
    const state = frame.variables.get(variable)
    if (!state) {
      // NEED TO BE SYNCHRONIZED
      const synced = await sync(frame, variable)
      frame.variables.set(variable, synced)
      continue
    }
    if (next_time >= state.info.timesteps) {
      next_time = current_time
    }
    const [nb_c, fpc] = chunksDetails(state.info)
    const current_time_chunk = Math.floor(current_time / fpc)
    const current_frame = current_time % fpc
    const next_time_chunk = Math.floor(next_time / fpc)
    const next_frame = next_time % fpc

    state.current = {
      frame: current_frame,
      time_chunk: current_time_chunk,
    }
    state.next = {
      frame: next_frame,
      time_chunk: next_time_chunk,
    }
  }
}
const EPSILON = 0.00001
export function goto(
  frame: TimeFrame,
  to: number,
  duration?: number,
  onComplete?: () => void,
) {
  let state = {
    previous_idx: Math.floor(frame.weight),
  }
  return gsap.to(frame, {
    ease: "power3.out",
    duration: duration ?? 1,
    weight: to,
    onCompleteParams: [frame],
    onComplete: (frame: TimeFrame) => {
      pin(frame, onComplete)
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
) {
  const first = frame.variables.values().next().value as
    | TimeFrameState
    | undefined
  if (!first) return undefined
  let state = {
    previous_idx: Math.floor(frame.weight),
  }
  const to = first.info.timesteps
  return gsap.to(frame, {
    duration: to,
    ease: "none",
    weight: to - 1,
    onCompleteParams: [frame, tween_ref],
    onComplete: (
      frame: TimeFrame,
      tween_ref: MutableRefObject<gsap.core.Tween | undefined>,
    ) => {
      frame.weight = 0
      frame.swap_flag = true
      tween_ref.current = circular(frame, tween_ref)
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
  onComplete: () => void,
) {
  const first = frame.variables.values().next().value as
    | TimeFrameState
    | undefined
  if (!first) return undefined
  let state = {
    previous_idx: Math.floor(frame.weight),
  }
  const to = first.info.timesteps
  return gsap.to(frame, {
    duration: to,
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
) {
  const first = frame.variables.values().next().value as
    | TimeFrameState
    | undefined
  if (!first) return undefined
  const to =
    frame.weight === first.info.timesteps - 1 ? 0 : first.info.timesteps - 1
  let state = {
    previous_idx: Math.floor(frame.weight),
  }
  return gsap.to(frame, {
    duration: first.info.timesteps,
    ease: "none",
    weight: to,
    onCompleteParams: [frame, tween_ref],
    onComplete: (
      frame: TimeFrame,
      tween_ref: MutableRefObject<gsap.core.Tween | undefined>,
    ) => {
      frame.swap_flag = true
      tween_ref.current = walk(frame, tween_ref)
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
