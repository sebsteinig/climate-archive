import { StateCreator } from "zustand";
import { Time, TimeConfig, TimeDirection, TimeKind, TimeSpeed, TimeState } from "./time.type";



export interface TimeSlice {
    time : {
        frames : Time[]
    
        add : (exps:string[],config:TimeConfig) => void
        remove : (idx:number) => void

        prepare : (idx:number) => void
        start : (idx:number) => void
        pause : (idx:number) => void
        stop : (idx:number) => void
        set : (idx:number) => void
    }
}

export const createTimeSlice : StateCreator<TimeSlice,[["zustand/immer",never]],[],TimeSlice> = 
    (set) => {
        return {
            time : {
                frames : [],
    
                add : (exps:string[],config:TimeConfig) => {
                    const kind = config.kind ?? TimeKind.circular
                    const direction = config.direction ?? TimeDirection.forward
                    const state = TimeState.ready
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
                    const time = {
                        kind,
                        direction,
                        speed,
                        state,
                        exps,
                        frame : {
                            current : "",
                            next : "",
                            cursor : 0,
                        }
                    }
                    set((state) => {
                        state.time.frames.push(time)
                    })
                },
                remove : (idx:number) => {
                    set((state) => {
                        const size = state.time.frames.length
                        if (idx >= 0 && idx < size) {
                            state.time.frames.splice(idx,idx)
                        }
                    })
                },
                prepare : (idx:number) => {
                    set((state) => {
                        const size = state.time.frames.length
                        if (idx < 0 || idx >= size) {
                            return
                        }
                        const time = state.time.frames[idx]
                        time.state = TimeState.ready
                    })
                },
                start : (idx:number) => {
                    set((state) => {
                        const size = state.time.frames.length
                        if (idx < 0 || idx >= size) {
                            return
                        }
                        const time = state.time.frames[idx]
                        if (time.state === TimeState.ready || time.state === TimeState.paused) {
                            time.state = TimeState.playing
                        }
                    })
                },
                pause : (idx:number) => {
                    set((state) => {
                        const size = state.time.frames.length
                        if (idx < 0 || idx >= size) {
                            return
                        }
                        const time = state.time.frames[idx]
                        if (time.state === TimeState.playing) {
                            time.state = TimeState.paused
                        }
                    })
                },
                stop : (idx:number) => {
                    set((state) => {
                        const size = state.time.frames.length
                        if (idx < 0 || idx >= size) {
                            return
                        }
                        const time = state.time.frames[idx]
                        if (time.state === TimeState.playing || time.state === TimeState.paused) {
                            time.state = TimeState.stopped
                        }
                    })
                },
                set : (idx:number) => {
                    
                },
            }
        }
    }