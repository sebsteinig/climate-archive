import { TextureInfo } from "@/utils/database/database.types"
import { VariableName } from "../variables/variable.types"
import { Experiment } from "@/utils/types"
import { MutableRefObject } from "react"

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

export type TimeConfig = {
  kind?: TimeKind
  direction?: TimeDirection
  speed?: TimeSpeed | number
  mode?: TimeMode
}

export type TimeFrameValue = {
  current: {
    idx: number
    exp: Experiment
    info: TextureInfo
    time_chunk: number
    frame: number
  }
  next: {
    idx: number
    exp: Experiment
    info: TextureInfo
    time_chunk: number
    frame: number
  }
}
export type TimeFrame = {
  variables: Map<VariableName, TimeFrameValue>
  initialized: boolean
  weight: number
  swap_flag : boolean
}

export type TimeFrameHolder = {
  map: Map<number, Map<number, TimeFrame>>
  update: (frame: TimeFrame, time_id: number, collection_id: number) => TimeFrame
  get: (time_id: number, collection_id: number) => TimeFrame | undefined
}

export type TimeFrameRef = MutableRefObject<TimeFrameHolder>

export type TimeID = number
export type CollectionID = number

export type Time = {
  mode: TimeMode
  direction: TimeDirection
  kind: TimeKind
  state: TimeState
  speed: number
  surfing_departure: number
  surfing_destination: number
  collections: Map<CollectionID, ContainerConf>
}

export type ContainerConf = {
  camera: {
    is_linked: boolean
  }
}

export type TimeMap = {
  map: Map<TimeID, Time>
  lookup: Map<CollectionID, Set<TimeID>>
  auto_increment: number
}
