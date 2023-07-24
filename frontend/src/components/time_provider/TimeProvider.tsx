"use client";
import { Canvas } from "@react-three/fiber"
import { Leva } from "leva"
import { World } from "../3D_components/World"
import { useEffect, useRef, useState, useMemo, RefObject } from "react"
import { useClusterStore } from "@/utils/store/cluster.store"
import { TimeSlider, useTimeSlider } from "./time_controllers/TimeSlider"
import { TimeController } from "./time_controllers/TimeController"
import { Time, TimeMode, TimeFrame, TimeState } from "@/utils/store/time/time.type"
import { texture_provider } from "@/utils/texture_provider/TextureProvider"
import { findInTree } from "@/utils/store/texture_tree.store"
import { initFrame } from "@/utils/store/time/time.utils";
import { View } from "@react-three/drei";
import { CanvasHolder, tickBuilder } from "./tick";
import { produce } from "immer";
import { sync } from "@/utils/store/time/handlers/utils";


type Props = {

}

var config = {
    model: "Dune",
    heightData: "/assets/textures/tfgzk_height.smoothed.png"
  }

export function TimeProvider(props:Props) {
    const prepareTime = useClusterStore((state)=> state.time.prepareAll)
    const saveAll = useClusterStore((state)=> state.time.saveAll)
    const playTime = useClusterStore((state)=> state.time.play)
    const pauseTime = useClusterStore((state)=> state.time.pause)
    const time_slots = useClusterStore((state) => state.time.slots.map) 
    const tracking = useRef<HTMLDivElement>(null!)
    const [time_ref,setTime] = useTimeSlider()
    const variables = useClusterStore((state) => state.variables)
    const tree = useClusterStore(state => state.texture_tree)
    const collections = useClusterStore(state => state.collections)
    const active_variable = useMemo(() => {
        return Object.values(variables).filter((v)=> v.active).map(e => e.name)
    },[variables])

    const saved_frames = useClusterStore(state=> state.time.saved_frames)

    const current_canvas = document.createElement("canvas")
    const current_ctx = current_canvas.getContext('2d')
    const next_canvas = document.createElement("canvas")
    const next_ctx = next_canvas.getContext('2d')
    const context = {
        current : {
            canvas : current_canvas,
            ctx : current_ctx,
        },
        next : {
            canvas : next_canvas,
            ctx : next_ctx,
        }
    } as CanvasHolder
    console.log({time_slots});
    
    useEffect(
        ()=>{
            // PREPARE EACH TIME FRAMES
            async function prepare() {
                const res : [number,[number,TimeFrame][]][] = []
                
                for(let [time_idx,time] of time_slots) {
                    const row:[number,TimeFrame][] = []
                    for(let collection_idx of time.collections) {
                        const collection = collections.get(collection_idx)
                        
                        if (!collection) {
                            continue;
                        }
                        let frame:TimeFrame;
                        if(time.state === TimeState.playing || time.state === TimeState.paused) {
                            frame = await sync(time,collection.exps,saved_frames.get(time_idx)!.get(collection_idx)!,active_variable)
                        }else {
                            frame = await initFrame(time,collection.exps,active_variable)
                        }
                        row.push([collection_idx,frame])
                    }
                    res.push([time_idx,row])
                }
                return res
            }
            prepare().then(
                (res)=>{
                    if(res.every((e)=> e[1].length > 0)) {
                        prepareTime(res.map(e=>e[0]))
                        saveAll(res)
                    }
                }
            )
            // Promise.all(Array.from(time_slots, (
            //     async ([idx,time]):Promise<[number,TimeFrame]> =>{
            //         const frame = await initFrame(time,active_variable)
            //         return [idx,frame]
            //     }
            // ))).then(
            //     (start_frames)=>{
            //         start_frames.map(([idx,frame])=>{
            //             prepareTime(idx,frame,
            //                 (is_ready)=>{
            //                     if(is_ready) {
            //                         setFrames(
            //                             produce((draft) => {
            //                                 draft[idx] = frame;
            //                             })
            //                         )
            //                     }else {
                                    
            //                     }
            //                 }
            //             )
            //         })
            //     }
            // )
        }
    ,[time_slots,active_variable])
    console.log('TIME PROVIDER CALL');
    
    return (
        <>
        {/* <div ref={tracking} > */}
            <Canvas
                camera={{
                fov: 55,
                near: 0.1,
                far: 200,
                position: [3, 2, 9],
                }}
                shadows
            >
                {Array.from(time_slots, ([idx,time]) => {
                    return Array.from(time.collections, (collection_idx)=> {
                        if(saved_frames.has(idx) && saved_frames.get(idx)?.get(collection_idx)) {
                            const frame = saved_frames.get(idx)!.get(collection_idx)!
                            return (
                                // <View track={tracking} key={idx}></View>
                                <World key={idx} config={config} tick={tickBuilder(time,collections.get(collection_idx)!.exps,frame,active_variable,tree,context)}/>
                                // </View>
                            )
                        }else {
                            return null
                        }
                    })
                }).flat()}
            </Canvas>
            {Array.from(time_slots,
                ([idx,time]) => {

                    return (
                        <div key={idx} className="absolute bottom-0 left-1/2 lg:-translate-x-1/2 w-1/2">
                            {/* <div ref={div_ref}></div> */}
                            <TimeController          
                                play = {() => {
                                    if(time.state !== TimeState.zero) {
                                        console.log('PLAY');
                                        
                                        playTime(idx)
                                        return true
                                    }
                                    return false
                                }}
                                pause = {() => {
                                    console.log({state:time.state});
                                    
                                    if(time.state === TimeState.playing) {
                                        console.log('PAUSE');
                                        
                                        pauseTime(idx)
                                        return true
                                    }
                                    return false
                                }}
                                stop = {() => {
                                    return true
                                }}
                            />
                            <TimeSlider min={0} max={time.collections.size}
                                className="w-full"
                                onChange = {
                                    (value) => {
                                    }
                                }
                                ref={time_ref}
                            />
                        </div>
                    )
                }
            )}
        {/* </div> */}
        </>
    )
}