"use client";
import { Canvas } from "@react-three/fiber"
import { Leva } from "leva"
import { World } from "../3D_components/World"
import { useEffect, useRef, useState, useMemo } from "react"
import { useClusterStore } from "@/utils/store/cluster.store"
import { TimeSlider, useTimeSlider } from "./time_controllers/TimeSlider"
import { TimeController } from "./time_controllers/TimeController"
import { TimeMode, TimeResult, TimeState } from "@/utils/store/time/time.type"
import { texture_provider } from "@/utils/texture_provider/TextureProvider"
import { findInTree } from "@/utils/store/texture_tree.store"


type Props = {

}

var config = {
    model: "Dune",
    heightData: "/assets/textures/tfgzk_height.smoothed.png"
  }

export function TimeProvider(props:Props) {
    const div_ref = useRef<HTMLDivElement>(null)
    const exps = useClusterStore((state) => state.collections.current)
    const time_store = useClusterStore((state)=> state.time)
    const variables = useClusterStore((state) => state.variables)
    const setInitTimeResult = useClusterStore((state) => state.time.set)
    const active_variable = useMemo(() => {
        return Object.values(variables).filter((v)=> v.active).map(e => e.name)
    },[variables])
    const tree = useClusterStore(state => state.texture_tree)
    const [time_ref,setTime] = useTimeSlider()
    let [time_result,setTimeResult] = useState<TimeResult | undefined>(time_store.frames[0]?.current_result)
    useEffect(
        () => {
            console.log("USE EFFECT 1 TIME PROVIDER");
            if(exps){
                time_store.add(exps.exps,{
                    mode : TimeMode.ts
                })
            }
        }
        ,[exps]
    )
    useEffect(
        () => {
            console.log("USE EFFECT 2 TIME PROVIDER");
            if(exps){
                if (Array.isArray(active_variable) && active_variable.length) {

                    Promise.all(
                        active_variable.map(
                            async (variable) => {
                                return {
                                    variable : variable,
                                    info:await texture_provider.getInfo(exps.exps[0],variable)
                                }
                            }
                        )
                    ).then(
                        (res) => {
                            const tr : TimeResult = new Map()
                            for ( let {variable,info} of res) {
                                tr.set(variable,{
                                    current : {
                                        exp : exps.exps[0],
                                        frame : 0,
                                        idx : 0,
                                        time_chunk : 0,
                                        info,
                                    },
                                    weight : 0,
                                })
                            }
                            setInitTimeResult(0,tr)
                            setTimeResult(tr)
                        }
                    )
                }   
            }
        }
    ,[exps,active_variable])
    //let [t,setT] = useState(time_store.frames[0]?.idx || 0)
    const current_canvas = document.createElement("canvas")
    const current_ctx = current_canvas.getContext('2d')
    const next_canvas = document.createElement("canvas")
    const next_ctx = next_canvas.getContext('2d')
    if (!exps) {
        return  null
    }
    
    console.log("TIME PROVIDER (CALL)");
    
    return (
        <>
            <div className='h-screen w-screen absolute top-0 left-0'>
                <Leva
                    collapsed={false}
                    oneLineLabels={false}
                    flat={true}
                />
                <Canvas
                    camera={{
                    fov: 55,
                    near: 0.1,
                    far: 200,
                    position: [3, 2, 9],
                    }}
                    shadows
                >
                    <World config={config} 
                        tick={
                            async (delta) => {
                                
                                if (time_store.frames[0] && Array.isArray(active_variable) && active_variable.length) {
                                    if (time_store.frames[0].state === TimeState.playing){
                                        //console.log({active_variable}); 
                                        // t = (t + delta)  % exps.exps.length
                                        // let idx = Math.floor(t)
                                        // setTime(idx)
                                        if ( time_result ) { 

                                            time_result = await time_store.frames[0].next(time_store.frames[0],time_result,delta,active_variable)
                                            //console.log({time_result});
                                            
                                            if (div_ref.current) {
                                                div_ref.current.textContent = time_result.get(active_variable[0])?.current.exp ?? ""
                                            }

                                            //const branch = findInTree(exps.exps[idx],variable.name,tree)
                                            const res = new Map()
                                            for ( let [variable,tr] of time_result ) {
                                                const current_branch = findInTree(tr.current.exp,variable,tree)
                                                if(!current_branch) {
                                                    continue;
                                                }
                                                const next_branch = findInTree(tr.current.exp,variable,tree)
                                                if(!next_branch) {
                                                    continue;
                                                }
                                                let current_path : string
                                                let next_path : string
                                                if(time_store.frames[0].mode === TimeMode.mean) {
                                                    current_path = current_branch.mean.paths[0].grid[0][tr.current.time_chunk]
                                                    next_path = current_branch.mean.paths[0].grid[0][tr.next!.time_chunk]
                                                }else {
                                                    current_path = current_branch.ts.paths[0].grid[0][tr.current.time_chunk]
                                                    next_path = current_branch.ts.paths[0].grid[0][tr.next!.time_chunk]
                                                }


                                                const current_texture = await texture_provider.getTexture(next_path)
                                                const next_texture = await texture_provider.getTexture(next_path)
                                                
                                                const current_blob = new Blob([current_texture.image], { type: "image/png" });
                                                //const current_url = URL.createObjectURL(current_blob);

                                                const next_blob = new Blob([current_texture.image], { type: "image/png" });
                                                //const next_url = URL.createObjectURL(current_blob);

                                                const current_bitmap = await createImageBitmap(current_blob)
                                                const next_bitmap = await createImageBitmap(current_blob)
                                                if(current_ctx && next_ctx) {
                                                    current_canvas.width = tr.current.info.xsize
                                                    current_canvas.height = tr.current.info.ysize
                                                    current_ctx.drawImage(current_bitmap,
                                                        tr.current.frame * tr.current.info.xsize,
                                                        0, // TODO VERTICAL
                                                        tr.current.info.xsize,
                                                        tr.current.info.ysize,
                                                        0,
                                                        0,
                                                        tr.current.info.xsize,
                                                        tr.current.info.ysize
                                                    )
                                                    const current_url = current_canvas.toDataURL("image/png")

                                                    next_canvas.width = tr.current.info.xsize
                                                    next_canvas.height = tr.current.info.ysize
                                                    next_ctx.drawImage(next_bitmap,
                                                        tr.next!.frame * tr.next!.info.xsize,
                                                        0, // TODO VERTICAL
                                                        tr.next!.info.xsize,
                                                        tr.next!.info.ysize,
                                                        0,
                                                        0,
                                                        tr.next!.info.xsize,
                                                        tr.next!.info.ysize
                                                    )
                                                    const next_url = current_canvas.toDataURL("image/png")

                                                    res.set(variable,{
                                                        current_url,
                                                        next_url,
                                                        weight : tr.weight
                                                    })
                                                }

                                            }
                                            return res
                                            // if (branch) {
                                            //     const path = branch.mean.paths[0].grid[0][0]
                                
                                            //     Promise.all([texture_provider.getTexture(path),
                                            //         texture_provider.getInfo(exps.exps[idx], variable.name)]
                                            //         )
                                            //         .then(callback)
    
                                            // }
                                        }
                                    }
                                }
                                return new Map()
                            }
                        }
                    />
                </Canvas>
            </div>
            <div className="absolute bottom-0 left-1/2 lg:-translate-x-1/2 w-1/2">
                <div ref={div_ref}></div>
                <TimeController          
                    play = {() => {
                        console.log("play");
                        time_store.play(0)
                        return true
                    }}
                    pause = {() => {
                        console.log("pause");
                        time_store.pause(0)
                        //setT(Math.floor(t))
                        setTimeResult(time_result)
                        setInitTimeResult(0,time_result)
                        return true
                        
                    }}
                    stop = {() => {
                        console.log("stop");
                        time_store.stop(0)
                        //setT(Math.floor(t))
                        setTimeResult(time_result)
                        setInitTimeResult(0,time_result)
                        return true
                        
                    }}
                />
                <TimeSlider min={0} max={exps.exps.length}
                    className="w-full"
                    onChange = {(value) => {
                        if (div_ref.current) {
                            //setT(value)
                            div_ref.current.textContent = exps.exps[value]
                        }
                    }}
                    ref={time_ref}
                />
            </div>
        </>
    )
}