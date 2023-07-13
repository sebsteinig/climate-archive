import { useClusterStore } from "@/utils/store/cluster.store"
import { ForwardRefExoticComponent, RefAttributes, RefObject, forwardRef, useRef, useState } from "react"
import Main from "../../3D_components/Main"
import ButtonSecondary from "@/components/buttons/ButtonSecondary"



type Props = {
    onChange : (value:number) => void
    min : number
    max : number
    className?:string
}


const TimeSlider = forwardRef<HTMLInputElement,Props>(
    function TimeSlider({min,max,className,onChange}:Props,ref) {
        return (
            <div className={className}>
                <input ref={ref} type="range" className="w-full"
                    min={min} max={max}
                    onChange={
                        (e)=>{
                            onChange(parseInt(e.target.value))
                        }
                    }
                />
            </div>
        )
    }
)

export function useTimeSlider():[ForwardRefExoticComponent<Props & RefAttributes<HTMLInputElement>>,(v:number)=>void,RefObject<HTMLInputElement>] {
    const input_ref = useRef<HTMLInputElement>(null)
    const update = (value:number) => {
        if(input_ref.current) {
            input_ref.current.value = value.toString()  
        }
    }
    
    return [TimeSlider, update,input_ref]
}


