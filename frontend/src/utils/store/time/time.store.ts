import { StateCreator } from "zustand";
import { Time, TimeConfig, TimeDirection, TimeKind, TimeMode, TimeFrame, TimeSpeed, TimeState } from "./time.type";



export interface TimeSlice {
    time : {
        slots : Time[]
    
        add : (exps:string[],config:TimeConfig) => void
        remove : (idx:number) => void

        prepare : (idx:number,frame:TimeFrame,callback:(is_ready:boolean,frame:TimeFrame|undefined)=>void) => void
        play : (idx:number) => void
        pause : (idx:number) => void
        stop : (idx:number) => void
        set : (idx:number,t:TimeFrame) => void
    }
}



export const createTimeSlice : StateCreator<TimeSlice,[["zustand/immer",never]],[],TimeSlice> = 
    (set) => {
        return {
            time : {
                slots : [],
    
                add : (exps:string[],config:TimeConfig) => {
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
                    const mode =  config.mode ?? TimeMode.mean
                    const time = {
                        mode,
                        kind,
                        direction,
                        speed,
                        state,
                        current_frame: {
                            variables : new Map(),
                            initialized : false,
                        },
                        exps,
                        idx : direction === TimeDirection.forward ? 0 : exps.length - 1,
                    } as Time
                    set((state) => {
                        state.time.slots.push(time)
                    })
                },
                remove : (idx:number) => {
                    set((state) => {
                        const size = state.time.slots.length
                        if (idx >= 0 && idx < size) {
                            state.time.slots.splice(idx,idx)
                        }
                    })
                },
                prepare : (idx,frame,callback) => {
                    set((state) => {
                        const size = state.time.slots.length
                        if (idx < 0 || idx >= size) {
                            return
                        }
                        const time = state.time.slots[idx]

                        if(frame.variables.size > 0) {
                            if(time.state === TimeState.zero || time.state === TimeState.stopped) {
                                time.state = TimeState.ready
                                time.current_frame = frame
                            }
                            callback(true,frame)
                        }else {
                            callback(false,undefined)
                        }
                    })
                },
                play : (idx:number) => {
                    set((state) => {
                        const size = state.time.slots.length
                        if (idx < 0 || idx >= size) {
                            return
                        }
                        const time = state.time.slots[idx]
                        if (time.state === TimeState.ready || time.state === TimeState.paused) {
                            time.state = TimeState.playing
                        }
                    })
                },
                pause : (idx:number) => {
                    set((state) => {
                        const size = state.time.slots.length
                        if (idx < 0 || idx >= size) {
                            return
                        }
                        const time = state.time.slots[idx]
                        if (time.state === TimeState.playing) {
                            time.state = TimeState.paused
                        }
                    })
                },
                stop : (idx:number) => {
                    set((state) => {
                        const size = state.time.slots.length
                        if (idx < 0 || idx >= size) {
                            return
                        }
                        const time = state.time.slots[idx]
                        if (time.state === TimeState.playing || time.state === TimeState.paused) {
                            time.state = TimeState.stopped
                        }
                    })
                },
                set : (idx:number,t:TimeFrame) => {
                    set(state=>{
                        state.time.slots[idx].current_frame = t
                    })
                },
            }
        }
    }