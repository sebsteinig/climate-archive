import { TextureInfo } from "@/utils/database/Texture"
import { VariableName } from "../variables/variable.types"

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
    ready,
    zero,
} 

export enum TimeSpeed {
    slow,
    medium,
    fast
}

export enum TimeMode {
    ts,
    mean,
}

export type TimeConfig = {
    kind? : TimeKind,
    direction? : TimeDirection,
    speed? : TimeSpeed | number
    mode? : TimeMode
}

export type TimeFrameValue = {
    current : {
        idx : number
        exp : string
        info : TextureInfo
        time_chunk : number
        frame : number
    }
    next : {
        idx : number
        exp : string
        info : TextureInfo
        time_chunk : number
        frame : number
    }
    weight : number
}
export type TimeFrame = {
    variables : Map<VariableName,TimeFrameValue>,
    initialized:boolean
}

export type TimeMultipleFrames = Map<number,TimeFrame>

export type Time = {
    mode : TimeMode
    direction : TimeDirection
    kind : TimeKind
    state : TimeState
    speed : number
    //current_frame : TimeMultipleFrames
    collections : Set<number>
}
