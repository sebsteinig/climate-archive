import { useClusterStore } from "@/utils/store/cluster.store"
import { RefObject, forwardRef, useRef, useState } from "react"
import Main from "../3D_components/Main"



type Props = {
}

export function TimeSlider({}:Props) {
    const div_ref = useRef<HTMLDivElement>(null)
    const input_ref = useRef<HTMLInputElement>(null)
    const exps = useClusterStore((state) => state.collections.current)
    let [t,setT] = useState(0)
    if (!exps) {
        return  null
    }
    
    return (
        <>
            <div ref={div_ref}></div>
            <Main tick={(delta) => {
                //console.log("tick "+ delta);
                t = (t + delta)  % exps.exps.length
                let idx = Math.floor(t)
                
                if ( input_ref.current) {
                    input_ref.current.value = idx.toString()
                }
                if (div_ref.current) {
                    div_ref.current.textContent = exps.exps[idx]
                }

            }}/>
            <input ref={input_ref} className="absolute" type="range" min={0} max={exps.exps.length-1} 
                onChange={(e)=>{
                    if (div_ref.current) {
                        setT(parseInt(e.target.value))
                        div_ref.current.textContent = exps.exps[parseInt(e.target.value)]
                    }
                }}
            />

        </>
    )
}