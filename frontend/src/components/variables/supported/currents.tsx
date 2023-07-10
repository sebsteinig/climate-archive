import { useState } from "react"
import { Variable } from "../utils"
import Image from 'next/image';
import WindsIcon from "$/assets/icons/winds-slate-500.svg";

type Props = {

}

export function Currents(props:Props) {
    return (
        <>
            <Variable>
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