import { useState } from "react"
import { Variable, addVariable } from "../utils"
import Image from 'next/image';
import WindsIcon from "$/assets/icons/winds-slate-500.svg";

type Props = {
    setVariables : Function
}

export function Currents({setVariables}:Props) {
    return (
        <>
            <Variable onClick={addVariable("currents", setVariables)}>
                <div className="flex flex-row">
                    <Image 
                        priority
                        src={WindsIcon}
                        className="w-12 h-12 "
                        alt="Currents"
                    />
                    <div className="hidden group-hover:block">
                        Currents
                    </div>
                </div>
                <div className="hidden group-hover:block">
                    
                </div>
            </Variable> 
        </>
    )
}