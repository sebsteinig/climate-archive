import { gsap } from "gsap"

import { MutableRefObject } from "react"
import { TimeFrame, TimeMode, WorldData } from "./time.type"

function calcDuration(from: number, to: number, speed: number): number {
  const t = speed * 2 // 2 sec to go + 1 weight

  return Math.abs(to - from) * t
}
const EPSILON = 0.00001

export function goto(frame: TimeFrame, to: number, onComplete?: () => void) {
  let state = {
    previous_idx: Math.floor(frame.weight),
  }
  const rounded_to = Math.round(to)
  const duration = 5.2 // 1s
  return gsap.to(frame, {
    ease: "power2.out",
    duration: duration,
    weight: rounded_to,
    // onCompleteParams: [frame],
    // onComplete: (frame: TimeFrame) => {
    //   frame.swap_flag = true
    //   if (onComplete) {
    //     onComplete()
    //   }
    // },
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

export function jumpTo(frame: TimeFrame, to: number, onComplete?: () => void) {
  let previous_idx = Math.floor(frame.weight)
  let new_idx = Math.floor(to)

  const rounded_to = Math.round(to)
  const duration = 0 // 5s
  frame.weight = to
  //     new_idx = Math.floor(frame.weight)

  if (previous_idx !== new_idx && new_idx !== to) {
        frame.swap_flag = true
  }

  // return gsap.to(frame, {
  //   ease: "power2.out",
  //   duration: duration,
  //   weight: to,
  //   onCompleteParams: [frame],
  //   onComplete: (frame: TimeFrame) => {
  //     frame.swap_flag = true
  //     if (onComplete) {
  //       onComplete()
  //     }
  //   },
  //   onUpdateParams: [frame, state],
  //   onUpdate: (frame: TimeFrame, state: { previous_idx: number }) => {
  //     const idx = Math.floor(frame.weight)
  //     if (state.previous_idx !== idx && idx !== to) {
  //       state.previous_idx = idx

  //       frame.swap_flag = true
  //     }
  //   },
  //   onInterruptParams: [frame],
  //   onInterrupt: (frame: TimeFrame) => {
  //     pin(frame)
  //   },
  // })
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
  world_data: WorldData,
) {
  if (!frame.timesteps) return undefined
  let state = {
    previous_idx: Math.floor(frame.weight),
  }
  let to: number
  if (world_data.time.mode === TimeMode.mean) {
    to = world_data.collection.exps.length
  } else {
    to = frame.timesteps
  }
  const duration = calcDuration(
    Math.floor(frame.weight),
    to,
    world_data.time.speed,
  )
  return gsap.to(frame, {
    duration: duration,
    ease: "none",
    weight: to,
    onCompleteParams: [frame, tween_ref, world_data],
    onComplete: (
      frame: TimeFrame,
      tween_ref: MutableRefObject<gsap.core.Tween | undefined>,
      world_data: WorldData,
    ) => {
      frame.weight = 0
      frame.swap_flag = true
      tween_ref.current = circular(frame, tween_ref, world_data)
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
  world_data: WorldData,
  onComplete: () => void,
) {
  if (!frame.timesteps) return undefined
  let state = {
    previous_idx: Math.floor(frame.weight),
  }
  let to: number
  if (world_data.time.mode === TimeMode.mean) {
    to = world_data.collection.exps.length
  } else {
    to = frame.timesteps
  }
  const duration = calcDuration(
    Math.floor(frame.weight),
    to,
    world_data.time.speed,
  )
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
  world_data: WorldData,
) {
  if (!frame.timesteps) return undefined

  let to: number
  if (world_data.time.mode === TimeMode.mean) {
    const size = world_data.collection.exps.length
    to = frame.weight === size - 1 ? 0 : size - 1
  } else {
    to = frame.weight === frame.timesteps - 1 ? 0 : frame.timesteps - 1
  }

  let state = {
    previous_idx: Math.floor(frame.weight),
  }

  const duration = calcDuration(
    Math.floor(frame.weight),
    to,
    world_data.time.speed,
  )
  return gsap.to(frame, {
    duration: duration,
    ease: "none",
    weight: to,
    onCompleteParams: [frame, tween_ref, world_data],
    onComplete: (
      frame: TimeFrame,
      tween_ref: MutableRefObject<gsap.core.Tween | undefined>,
      world_data: WorldData,
    ) => {
      frame.swap_flag = true
      tween_ref.current = walk(frame, tween_ref, world_data)
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
