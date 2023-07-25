import { Time, TimeFrame, TimeState } from "@/utils/store/time/time.type";
import { VariableName } from "@/utils/store/variables/variable.types";
import { TextureTree } from "@/utils/texture_provider/texture_provider.types";
import { Collection, Experiment, Publication } from "@/utils/types";
import { MutableRefObject, RefObject, createRef, forwardRef, useImperativeHandle, useRef } from "react";
import { CanvasHolder, tickBuilder } from "./tick";
import { View } from "@react-three/drei";
import { World } from "../3D_components/World";
import { TimeController } from "./time_controllers/TimeController";
import { useClusterStore } from "@/utils/store/cluster.store";
import { TimeSlider } from "./time_controllers/TimeSlider";
import React from "react";

export type SceneProps = {
    track : MutableRefObject<HTMLElement>
    time : Time
    exps : Experiment[]
    frame : TimeFrame
    active_variables : VariableName[]
    tree : TextureTree
    context : CanvasHolder
}

export function Scene({track,time,exps,frame,active_variables,tree,context}:SceneProps) {
    
    var config = {
        model: "Dune",
        heightData: "/assets/textures/tfgzk_height.smoothed.png"
      }

    return (
    <View track={track}>
        <World config={config} tick={tickBuilder(time,exps,frame,active_variables,tree,context)}/>
    </View>
    )
}

export type PanelProps = {
    time_idx:number
    time:Time
}


type Refs = {
    input_ref : RefObject<HTMLInputElement>
    container_refs : RefObject<Map<number,MutableRefObject<HTMLDivElement>[]>>
}
function range(start:number,end:number) {
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

export const Panel = forwardRef<Refs,PanelProps>(({time,time_idx},refs) => {
    const playTime = useClusterStore((state)=> state.time.play)
    const pauseTime = useClusterStore((state)=> state.time.pause)
    const first = time.collections.entries().next().value as [number,number]|undefined
    const is_alone = time.collections.size === 1 
        && first && first[1] === 1;
    const input_ref = useRef<HTMLInputElement>(null);
    const container_refs = useRef<Map<number,MutableRefObject<HTMLDivElement>[]>>(new Map());

    const elementsRef = useRef(
        range(0,
            Array.from(time.collections,([_,occ])=>occ)
            .reduce((acc,e)=>acc+e,0))
        .map(() => useRef<HTMLDivElement>(null!)));
    
    useImperativeHandle(refs,() => {
        return {
            input_ref,
            container_refs:container_refs,
        }
    })
    return (
        <div className="grid">
            {
                is_alone ?

                <div ref={(el: HTMLDivElement) => {
                    elementsRef.current[0].current = el
                    container_refs.current.set(first![0], [elementsRef.current[0]])
                    return el
                  }}></div>

                :

                <div>
                    {
                        Array.from(time.collections, 
                            ([collection_idx,occurence],i) => {
                                return range(0,occurence).map(
                                    () => {
                                        return (
                                            <div ref={
                                                (el: HTMLDivElement) => {
                                                    elementsRef.current[i].current = el
                                                    const tmp = container_refs.current.get(i)
                                                    tmp?.push(elementsRef.current[i])
                                                    container_refs.current.set(collection_idx, tmp ?? [elementsRef.current[i]])
                                                    return el;
                                                }
                                            }></div>
                                        )
                                    }
                                )
                            }
                        ).flat()
                    }
                </div>
            }
            <div>
                <TimeController          
                    play = {() => {
                        if(time.state !== TimeState.zero) {
                            console.log('PLAY');
                            
                            playTime(time_idx)
                            return true
                        }
                        return false
                    }}
                    pause = {() => {
                        console.log({state:time.state});
                        
                        if(time.state === TimeState.playing) {
                            console.log('PAUSE');
                            
                            pauseTime(time_idx)
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
                    ref={input_ref}
                />
            </div>
        </div>
    )
})


export function useTimePanel(time_slots:Map<number,Time>,
    saved_frames: Map<number, Map<number, TimeFrame>>,
    collections: Map<number, Publication | Collection>,
    active_variables : VariableName[],
    tree : TextureTree,
    context : CanvasHolder) {
    const scenes:JSX.Element[]  = []
    const panels:JSX.Element[] = []
    const container_refs = useRef<Map<number,Refs>>(new Map());
    for(let [time_idx,time] of time_slots) {
        panels.push(<Panel time={time} time_idx={time_idx} ref={(el:Refs) => {
            container_refs.current.set(time_idx, el)
            return el;
          }}/>)
        for(let [collection_idx,occurence] of time.collections) {
            const refs = container_refs.current.get(time_idx)
            if(!refs) continue;
            const r = refs.container_refs.current?.get(collection_idx)
            if(!r) continue;
            const frame = saved_frames.get(time_idx)!.get(collection_idx)!
            const exps = collections.get(collection_idx)!.exps
            for(let ref of r){
                scenes.push(
                    <Scene 
                        time={time} 
                        frame={frame} 
                        exps={exps}
                        tree={tree}
                        context={context}
                        active_variables={active_variables}
                        track={ref}
                    />)
            }
        }
    }
    return [scenes,panels]
}