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
  ContainerConf,
  TimeID,
  CollectionID,
  TimeMap,
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
    surfing_departure: 0,
    surfing_destination: 0,
    current_frame: new Map(),
    collections: new Map(),
  } as Time
  return time
}

export function buildContainerConfig(config?: ContainerConf): ContainerConf {
  return {
    camera: config?.camera ?? {
      is_linked: true,
    },
  }
}

export function genID(slots: TimeMap) {
  slots.auto_increment += 1
  return slots.auto_increment
}

export function setTime(slots: TimeMap, time: Time): TimeID {
  const id = genID(slots)
  slots.map.set(id, time)

  for (let collection_id of time.collections.keys()) {
    const times = slots.lookup.get(collection_id) ?? new Set()
    times.add(id)
    slots.lookup.set(collection_id, times)
  }
  return id
}

export function lastID(slots: TimeMap): TimeID | undefined {
  return Array.from(slots.map.keys()).pop()
}

export function get(slots: TimeMap, time_id: TimeID): Time | undefined {
  return slots.map.get(time_id)
}

export function getConf(
  slots: TimeMap,
  time_id: TimeID,
  collection_id: CollectionID,
): ContainerConf | undefined {
  const time = slots.map.get(time_id)
  if (!time) return
  return time.collections.get(collection_id)
}

export function getTimesOf(slots: TimeMap, collection_id: CollectionID) {
  return slots.lookup.get(collection_id)
}

export function timeCloseAll(slots: TimeMap, collection_id: CollectionID) {
  const times = slots.lookup.get(collection_id)
  if (!times) return
  for (let time_id of times) {
    const time = slots.map.get(time_id)
    if (!time) continue
    time.collections.delete(collection_id)
    if (time.collections.size === 0) {
      slots.map.delete(time_id)
    }
  }
  slots.lookup.delete(collection_id)
}

export function timeClose(
  slots: TimeMap,
  time_id: TimeID,
  collection_id: CollectionID,
) {
  const time = slots.map.get(time_id)
  if (!time) return
  time.collections.delete(collection_id)
  if (time.collections.size === 0) {
    slots.map.delete(time_id)
  }
  const times = slots.lookup.get(collection_id)
  times?.delete(time_id)
  if (times?.size === 0) {
    slots.lookup.delete(collection_id)
  }
}
