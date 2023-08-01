import { TextureInfo } from "@/utils/database/database.types"
import { VariableName } from "../variables/variable.types"
import { Experiment } from "@/utils/types"
import { MutableRefObject } from "react"
import { Collection } from "../collection.store"

export enum TimeKind {
  circular,
  walk,
  once,
}
export enum TimeDirection {
  forward,
  backward,
}
export enum TimeState {
  paused,
  stopped,
  playing,
  pinning,
  surfing,
  ready,
  zero,
}

export enum TimeSpeed {
  slow,
  medium,
  fast,
}

export enum TimeMode {
  ts,
  mean,
}

export type TimeFrameState = {
  current: {
    time_chunk: number
    frame: number
  }
  next: {
    time_chunk: number
    frame: number
  }
  info: TextureInfo
}
export type TimeFrame = {
  exp: Experiment
  //ts_idx : number
  variables: Map<VariableName, TimeFrameState>
  weight: number
  swap_flag : boolean
  swapping : boolean
}

export type TimeFrameHolder = {
  map: Map<TimeID, TimeFrame>
  update: (frame: TimeFrame, time_id: TimeID) => TimeFrame
  get: (time_id: TimeID) => TimeFrame | undefined
}

export type TimeFrameRef = MutableRefObject<TimeFrameHolder>

export type TimeID = number
export type CollectionID = number

export type TimeConf = {
  direction: TimeDirection
  kind: TimeKind
  speed: number
}

export type WorldConf = {
  camera: {
    is_linked: boolean
  }
}

export type WorldData = {
  conf : WorldConf,
  collection : Collection
  time : TimeConf
}

export type Slots = Map<TimeID,WorldData>