import { TextureInfo } from "@/utils/database/database.types"
import { EVarID } from "../../variables/variable.types"
import { Experiment } from "@/utils/types"
import { MutableRefObject } from "react"
import { TickData } from "@/utils/tick/tick"
import { Collection } from "../../collection/collection.store"
export enum TimeKind {
  circular,
  walk,
  once,
}

export enum TimeController {
  monthly,
  geologic,
  slider
}

export enum TimeSpeed {
  very_slow,
  slow,
  medium,
  fast,
  very_fast,
}

export enum TimeMode {
  ts,
  mean,
}

export type TimeFrameStateTS = {
  current: {
    time_chunk: number
    frame: number
  }
  next: {
    time_chunk: number
    frame: number
  }
  info: TextureInfo
  is_freezed: boolean
}

export type TimeFrameStateMean = {
  current: {
    info: TextureInfo
    exp: Experiment
    idx: number
  }
  next: {
    info: TextureInfo
    exp: Experiment
    idx: number
  }
  is_freezed: boolean
}

export type TimeFrameState = {
  ts?: TimeFrameStateTS
  mean?: TimeFrameStateMean
}

export type TimeFrame = {
  exp: Experiment
  timesteps?: number
  uSphereWrapAmount: number
  variables: Map<EVarID, TimeFrameState>
  weight: number
  swap_flag: boolean
  swapping: boolean
  mode?: TimeMode
}

export type TimeFrameHolder = {
  map: Map<WorldID, TimeFrame>
  _observed_id: WorldID | undefined
  _waiters: Map<
    WorldID,
    {
      resolve: (value: void | PromiseLike<void>) => void
      reject: (reason?: any) => void
    }
  >
  _lock: {
    lock: boolean
    handle:
      | {
          resolve: (value: void | PromiseLike<void>) => void
          reject: (reason?: any) => void
        }
      | undefined
  }
  reference: Map<EVarID, TickData> | undefined
  saveReference: (reference: Map<EVarID, TickData>) => void
  update: (
    world_id: WorldID,
    world_data: WorldData,
    active_variables: EVarID[],
  ) => Promise<TimeFrame>
  get: (world_id: WorldID) => TimeFrame | undefined
  init: (
    world_id: WorldID,
    exp: Experiment,
    active_variables: EVarID[],
    world_data: WorldData,
  ) => Promise<void>
  observe: (world_id: WorldID | undefined) => void
  notify: () => Promise<void>
  lock: (world_id: WorldID) => Promise<void>
  wait: (world_id: WorldID) => Promise<void>
}

export type TimeFrameRef = MutableRefObject<TimeFrameHolder>

export type WorldID = number
export type CollectionID = number

export type TimeConf = {
  controller: TimeController
  kind: TimeKind
  speed: number
  mode: TimeMode
  mode_state: {
    is_writable: boolean
    previous?: TimeMode
  }
}

export type WorldConf = {
  camera: {
    is_linked: boolean
  }
}

export type WorldData = {
  //conf: WorldConf
  collection: Collection
  time: TimeConf
  exp?: Experiment
}

export type Slots = Map<WorldID, WorldData>
