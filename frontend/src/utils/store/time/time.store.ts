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

        prepare : (idx:number) => void
        prepareAll : (idxs:number[]) => void
        play : (idx:number) => void
        pause : (idx:number) => void
        stop : (idx:number) => void
        save : (time_idx:number,collection_idx:number,t:TimeFrame) => void
        saveAll : (x: [number,[number,TimeFrame][]][]) => void
        pauseAll : () => void
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
                        time.collections.set(collection_idx,(time.collections.get(collection_idx) ?? 0) + 1)
                        state.time.binder.set(collection_idx,time_idx)
                    })
                },
                addUnSync : (collection_idx:number, config : TimeConfig) => {
                    set((state) => {
                        let time = buildTime(config)
                        time.collections.set(collection_idx,(time.collections.get(collection_idx) ?? 0) + 1)
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
                        new_time.collections.set(collection_idx,(new_time.collections.get(collection_idx) ?? 0) + 1)
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
                        time.collections.set(collection_idx,(time.collections.get(collection_idx) ?? 0) + 1)
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



                prepare : (idx) => {
                    set((state) => {
                        const time = state.time.slots.map.get(idx)
                        if(!time) { 
                            return
                        }

                        // if(frame.variables.size > 0) {
                        //     if(time.state === TimeState.zero || time.state === TimeState.stopped) {
                        //         time.state = TimeState.ready
                        //         //time.current_frame = frame
                        //     }
                        //     callback(true,frame)
                        // }else {
                        //     callback(false,undefined)
                        // }
                    })
                },           
                prepareAll : (idxs:number[]) => {
                    set((state) => {
                        for (let idx of idxs) {
                            const time = state.time.slots.map.get(idx)
                            
                            if(!time) { 
                                continue
                            }
                            if(time.state === TimeState.zero || time.state === TimeState.stopped) {
                                time.state = TimeState.ready
                            }
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
                pauseAll : () => {
                    set(state => {
                        for(let [idx,time] of state.time.slots.map) {
                            time.state =  TimeState.paused
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
                save : (time_idx:number,collection_idx:number,t:TimeFrame) => {
                    set(state=>{
                        const time = state.time.slots.map.get(time_idx)
                        if(!time) { 
                            return
                        }
                        if(time.collections.has(collection_idx)) {
                            const x = state.time.saved_frames.get(time_idx)
                            if(x) {
                                x.set(collection_idx,t)
                            }
                        } 
                    })
                },
                saveAll : (res: [number,[number,TimeFrame][]][]) => {
                    set(state=> {
                        
                        for(let [time_idx,frames] of res){
                            for(let [collection_idx,frame] of frames) {
                                const x = state.time.saved_frames.get(time_idx)
                                if(x) {
                                    x.set(collection_idx,frame)
                                }else {
                                    const map = new Map()
                                    map.set(collection_idx,frame)
                                    state.time.saved_frames.set(time_idx,map)
                                }
                            }
                        }
                    })
                }
            }
        }
    }