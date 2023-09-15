import {
  TimeConf,
  TimeController,
  TimeKind,
  TimeMode,
  TimeSpeed,
  WorldConf,
} from "./time/time.type"

export function buildWorldConf(config?: Partial<WorldConf>): WorldConf {
  return {
    camera: config?.camera ?? {
      is_linked: true,
    },
  }
}

export function buildTimeConf(config?: Partial<TimeConf>): TimeConf {
  let speed: number
  switch (config?.speed) {
    case TimeSpeed.very_fast:
      speed = 0.25
      break
    case TimeSpeed.fast:
      speed = 0.5
      break
    case TimeSpeed.slow:
      speed = 2
      break
    case TimeSpeed.very_slow:
      speed = 4
      break
    case TimeSpeed.medium:
    default:
      speed = 1
      break
  }
  return {
    controller: config?.controller ?? TimeController.monthly,
    kind: config?.kind ?? TimeKind.circular,
    speed: speed,
    mode: config?.mode ?? TimeMode.ts,
    mode_state: config?.mode_state ?? {
      is_writable: false,
    },
    animation: false,
  }
}
