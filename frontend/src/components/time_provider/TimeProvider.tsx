import { Canvas } from "@react-three/fiber"
import { Leva } from "leva"
import { World } from "../3D_components/World"
import { useEffect, useRef, useState } from "react"
import { useClusterStore } from "@/utils/store/cluster.store"
import { useTimeSlider } from "./time_controllers/TimeSlider"
import { TimeController } from "./time_controllers/TimeController"
import { TimeState } from "@/utils/store/time/time.type"


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
    useEffect(
        () => {
            console.log("USE EFFECT TIME PROVIDER");
            if(exps){
                time_store.add(exps.exps,{})
            }
        }
    ,[exps])
    const [TimeInput,setTime,time_ref] = useTimeSlider()
    let [t,setT] = useState(time_store.frames[0]?.idx || 0)
    if (!exps) {
        return  null
    }
    

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
                            (delta) => {
                                //console.log("tick "+ delta);
                                if (time_store.frames[0]) {
                                    if (time_store.frames[0].state === TimeState.playing){
                                        t = (t + delta)  % exps.exps.length
                                        let idx = Math.floor(t)
                                        setTime(idx)
        
                                        if (div_ref.current) {
                                            div_ref.current.textContent = exps.exps[idx]
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
                <TimeInput min={0} max={exps.exps.length}
                    className="w-full"
                    onChange = {(value) => {
                        if (div_ref.current) {
                            setT(value)
                            div_ref.current.textContent = exps.exps[value]
                        }
                    }}
                    ref={time_ref}
                />
            </div>
        </>
    )
}