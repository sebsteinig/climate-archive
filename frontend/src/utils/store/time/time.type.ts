

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

export type TimeConfig = {
    kind? : TimeKind,
    direction? : TimeDirection,
    speed? : TimeSpeed | number
}


export type Time = {
    direction : TimeDirection
    kind : TimeKind
    state : TimeState
    speed : number
    exps : string[]
}
