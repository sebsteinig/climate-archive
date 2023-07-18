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

export type TimeResultValue = {
    current : {
        idx : number
        exp : string
        info : TextureInfo
        time_chunk : number
        frame : number
    }
    next ?: {
        idx : number
        exp : string
        info : TextureInfo
        time_chunk : number
        frame : number
    }
    weight : number
}
export type TimeResult = Map<VariableName,TimeResultValue>

export type Time = {
    mode : TimeMode
    direction : TimeDirection
    kind : TimeKind
    state : TimeState
    speed : number
    current_result? : TimeResult
    exps : string[]
    next : (time:Time,current:TimeResult, delta:number,active_variable:VariableName[]) => Promise<TimeResult>
}
