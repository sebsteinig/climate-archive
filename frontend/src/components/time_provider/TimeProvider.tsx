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


type Props = {

}

var config = {
    model: "Dune",
    heightData: "/assets/textures/tfgzk_height.smoothed.png"
  }

export function TimeProvider(props:Props) {
    const current = useClusterStore((state) => state.collections.current)
    const addTime = useClusterStore((state)=> state.time.add)
    const prepareTime = useClusterStore((state)=> state.time.prepare)
    const playTime = useClusterStore((state)=> state.time.play)
    const pauseTime = useClusterStore((state)=> state.time.pause)
    const time_slots = useClusterStore((state) => state.time.slots) 
    const tracking = useRef<HTMLDivElement>(null!)
    const [time_ref,setTime] = useTimeSlider()
    const variables = useClusterStore((state) => state.variables)
    const tree = useClusterStore(state => state.texture_tree)
    const active_variable = useMemo(() => {
        return Object.values(variables).filter((v)=> v.active).map(e => e.name)
    },[variables])

    let [frames,setFrames] = useState<TimeFrame[]>(time_slots.map(time=>time.current_frame))

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

    useEffect(
        ()=>{
            if(current) {
                console.log('ADD NEW TIME');
                addTime(current.exps,{
                    mode:TimeMode.ts
                })
            }
        }
    ,[current])
    useEffect(
        ()=>{
            // PREPARE EACH TIME FRAMES
            Promise.all(time_slots.map(
                async (time,idx):Promise<[number,TimeFrame]> =>{
                    const frame = await initFrame(time,active_variable)
                    return [idx,frame]
                }
            )).then(
                (start_frames)=>{
                    start_frames.map(([idx,frame])=>{
                        prepareTime(idx,frame,
                            (is_ready)=>{
                                if(is_ready) {
                                    setFrames(
                                        produce((draft) => {
                                            draft[idx] = frame;
                                          })
                                    )
                                }else {
                                    
                                }
                            }
                        )
                    })
                }
            )
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
                {time_slots.map((time,idx) => {
                    return (
                        // <View track={tracking} key={idx}>
                            <World key={idx} config={config} tick={tickBuilder(time,frames[idx],active_variable,tree,context)}/>
                        // </View>
                    )
                })}
            </Canvas>
            {time_slots.map(
                (time,idx) => {

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
                            <TimeSlider min={0} max={time.exps.length}
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