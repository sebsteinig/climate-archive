import { StateCreator } from "zustand";
import { Time, TimeConfig, TimeDirection, TimeKind, TimeMode, TimeFrame, TimeSpeed, TimeState } from "./time.type";
import { buildTime } from "./time.utils";



export interface TimeSlice {
    time : {
        slots : {map:Map<number,Time>,last:number}
        binder : Map<number,number> // collection => slot

        saved_frames : Map<number,Map<number,TimeFrame>>

        addSync : (collection_idx:number , config : TimeConfig| undefined) => void
        addUnSync : (collection_idx:number, config : TimeConfig) => void

        link : (collection_idx:number,time_slots_idx:number) => void
        unlink : (collection_idx : number,config : TimeConfig) => void

        remove : (collection_idx:number) => void

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
                slots : {map:new Map(),last:-1},
                binder : new Map(),
                saved_frames : new Map(),
                addSync : (collection_idx:number , config : TimeConfig| undefined) => {
                    set((state) => {
                        const slots_size = state.time.slots.map.size
                        let time:Time;
                        let time_idx:number;
                        if(slots_size === 0) {
                            time = buildTime(config ?? {})
                            state.time.slots.map.set(slots_size,time)
                            time_idx = 0
                            state.time.slots.last = time_idx
                        }else {
                            time = state.time.slots.map.get(state.time.slots.last)!
                            time_idx = state.time.slots.last
                        }
                        time.collections.add(collection_idx)
                        state.time.binder.set(collection_idx,time_idx)
                    })
                },
                addUnSync : (collection_idx:number, config : TimeConfig) => {
                    set((state) => {
                        let time = buildTime(config)
                        time.collections.add(collection_idx)
                        let idx = state.time.slots.map.size + 1
                        state.time.slots.map.set(idx,time)
                        state.time.slots.last = idx
                        state.time.binder.set(collection_idx,idx)
                    })
                },
        
                link : (collection_idx:number,time_slots_idx:number) => {
                    set(state => {
                        const new_time = state.time.slots.map.get(time_slots_idx)
                        if(!new_time) {
                            return 
                        }
                        const prev_time_idx = state.time.binder.get(collection_idx)
                        if (!prev_time_idx) {
                            return
                        }
                        state.time.binder.set(collection_idx,time_slots_idx)
                        new_time.collections.add(collection_idx)
                        const prev_time = state.time.slots.map.get(prev_time_idx)
                        if(prev_time) {
                            prev_time.collections.delete(collection_idx)
                            if(prev_time.collections.size === 0) {
                                state.time.slots.map.delete(prev_time_idx)
                                if(prev_time_idx === state.time.slots.last) {
                                    let new_last = -1
                                    if(state.time.slots.map.size) {
                                        new_last = state.time.slots.map.keys().next().value
                                    }
                                    state.time.slots.last = new_last
                                }
                            }
                        }
                    })
                },
                unlink : (collection_idx : number,config : TimeConfig) => {
                    set(state => {
                        let time = buildTime(config)
                        time.collections.add(collection_idx)
                        let idx = state.time.slots.map.size + 1
                        state.time.slots.map.set(idx,time)
                        const prev_time_idx = state.time.binder.get(collection_idx)
                        if (!prev_time_idx) {
                            return
                        }
                        state.time.binder.set(collection_idx,idx)
                        const prev_time = state.time.slots.map.get(prev_time_idx)
                        if(prev_time) {
                            prev_time.collections.delete(collection_idx)
                            if(prev_time.collections.size === 0) {
                                state.time.slots.map.delete(prev_time_idx)
                                if(prev_time_idx === state.time.slots.last) {
                                    let new_last = -1
                                    if(state.time.slots.map.size) {
                                        new_last = state.time.slots.map.keys().next().value
                                    }
                                    state.time.slots.last = new_last
                                }
                            }
                        }
                    })
                },

                remove : (collection_idx:number) => {
                    set((state) => {
                        const prev_time_idx = state.time.binder.get(collection_idx)
                        if (!prev_time_idx) {
                            return
                        }
                        state.time.binder.delete(collection_idx)
                        const prev_time = state.time.slots.map.get(prev_time_idx)
                        if(prev_time) {
                            prev_time.collections.delete(collection_idx)
                            if(prev_time.collections.size === 0) {
                                state.time.slots.map.delete(prev_time_idx)
                                if(prev_time_idx === state.time.slots.last) {
                                    let new_last = -1
                                    if(state.time.slots.map.size) {
                                        new_last = state.time.slots.map.keys().next().value
                                    }
                                    state.time.slots.last = new_last
                                }
                            }
                        }
                    })
                },



                prepare : (idx,frame,callback) => {
                    set((state) => {
                        const time = state.time.slots.map.get(idx)
                        if(!time) { 
                            return
                        }

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
                        const time = state.time.slots.map.get(idx)
                        if(!time) { 
                            return
                        }

                        if (time.state === TimeState.ready || time.state === TimeState.paused) {
                            time.state = TimeState.playing
                        }
                    })
                },
                pause : (idx:number) => {
                    set((state) => {
                        const time = state.time.slots.map.get(idx)
                        if(!time) { 
                            return
                        }

                        if (time.state === TimeState.playing) {
                            time.state = TimeState.paused
                        }
                    })
                },
                stop : (idx:number) => {
                    set((state) => {
                        const time = state.time.slots.map.get(idx)
                        if(!time) { 
                            return
                        }

                        if (time.state === TimeState.playing || time.state === TimeState.paused) {
                            time.state = TimeState.stopped
                        }
                    })
                },
                set : (idx:number,t:TimeFrame) => {
                    set(state=>{
                        const time = state.time.slots.map.get(idx)
                        if(!time) { 
                            return
                        }

                        time.current_frame = t
                    })
                },
            }
        }
    }