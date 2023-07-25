"use client";
import { Canvas } from "@react-three/fiber"
import { World } from "../3D_components/World"
import { useEffect, useRef, useState, useMemo, RefObject } from "react"
import { useClusterStore } from "@/utils/store/cluster.store"
import { TimeSlider, useTimeSlider } from "./time_controllers/TimeSlider"
import { TimeController } from "./time_controllers/TimeController"
import { Time, TimeMode, TimeFrame, TimeState } from "@/utils/store/time/time.type"
import { texture_provider } from "@/utils/texture_provider/TextureProvider"
import { findInTree } from "@/utils/store/texture_tree.store"
import { initFrame } from "@/utils/store/time/time.utils";
import { CameraControls, OrbitControls, PerspectiveCamera, PivotControls, View } from "@react-three/drei";
import { CanvasHolder, tickBuilder } from "./tick";
import { produce } from "immer";
import { sync } from "@/utils/store/time/handlers/utils";
import { Plane } from "../3D_components/Plane";
import THREE from "three";
import { useTimePanel } from "./useTimePanel";


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
                    for(let [collection_idx,_] of time.collections) {
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
        }
    ,[time_slots,active_variable])
    console.log('TIME PROVIDER CALL');
    const container_ref = useRef<HTMLDivElement>(null!)
    const [scenes,panels] = useTimePanel(time_slots,saved_frames,collections,active_variable,tree,context)
    return (
        <>        
        <div ref={container_ref} className="relative w-full h-full grid grid-cols-3 grid-rows-1 gap-4">
            <div className="fixed top-0 left-0 -z-10 w-screen h-screen border-2 border-yellow-300">
                <Canvas
                camera={{
                fov: 55,
                near: 0.1,
                far: 200,
                position: [3, 2, 9],
                }}
                //frameloop="demand"
                shadows
                eventSource={container_ref}
                >
                    {scenes}
                    {/* <View track={view1}>
                        <World config={config} tick={async (x)=>new Map()}/>
                        <PerspectiveCamera makeDefault position={[3, 2, 9]} fov={55} near={0.1} far={200} />
                        <OrbitControls makeDefault />
                    </View> */}
                    <OrbitControls  makeDefault enableZoom={true} enableRotate={true}/>
                </Canvas>
            </div>
            {panels}
        </div>
        
            </>
    )
}