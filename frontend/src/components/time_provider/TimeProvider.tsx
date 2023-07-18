import { Canvas } from "@react-three/fiber"
import { Leva } from "leva"
import { World } from "../3D_components/World"
import { useEffect, useRef, useState, useMemo } from "react"
import { useClusterStore } from "@/utils/store/cluster.store"
import { TimeSlider, useTimeSlider } from "./time_controllers/TimeSlider"
import { TimeController } from "./time_controllers/TimeController"
import { TimeState } from "@/utils/store/time/time.type"
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
    const variable = useMemo(() => {
        return Object.values(variables).find((v)=> v.active)
    },[variables])
    const tree = useClusterStore(state => state.texture_tree)
    useEffect(
        () => {
            console.log("USE EFFECT TIME PROVIDER");
            if(exps){
                time_store.add(exps.exps.map((exp) => exp.id),{})
            }
        }
    ,[exps])
    const [time_ref,setTime] = useTimeSlider()
    let [t,setT] = useState(time_store.frames[0]?.idx || 0)
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
                            (delta,callback) => {
                                if (time_store.frames[0] && variable) {
                                    if (time_store.frames[0].state === TimeState.playing){
                                        t = (t + delta)  % exps.exps.length
                                        let idx = Math.floor(t)
                                        setTime(idx)
        
                                        if (div_ref.current) {
                                            div_ref.current.textContent = exps.exps[idx].id
                                        }
                                        const branch = findInTree(exps.exps[idx].id,variable.name,tree)
                                        if (branch) {
                                            const path = branch.mean.paths[0].grid[0][0]
                            
                                            Promise.all([texture_provider.getTexture(path),
                                                texture_provider.getInfo(exps.exps[idx].id, variable.name)]
                                                )
                                                .then(callback)

                                        }
                                    }
                                }
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
                        setT(Math.floor(t))
                        return true
                        
                    }}
                    stop = {() => {
                        console.log("stop");
                        time_store.stop(0)
                        setT(Math.floor(t))
                        return true
                        
                    }}
                />
                <TimeSlider min={0} max={exps.exps.length}
                    className="w-full"
                    onChange = {(value) => {
                        if (div_ref.current) {
                            setT(value)
                            div_ref.current.textContent = exps.exps[value].id
                        }
                    }}
                    ref={time_ref}
                />
            </div>
        </>
    )
}