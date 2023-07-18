import { PropsWithChildren } from "react"
import Image from 'next/image';
import {useState} from 'react'
import Eye from "$/assets/icons/eye-slate-500.svg";
import EyeClosed from "$/assets/icons/eye-closed-slate-500.svg";
import ArrowUp from "$/assets/icons/arrow-up-emerald-400.svg";
import ArrowDown from "$/assets/icons/arrow-down-emerald-400.svg";

type Props = {
    toggle : Function
    src : any
    controls : boolean 
    active : boolean
    title : string

}

export function Variable({toggle, src, active, title, controls, children}:PropsWithChildren<Props>) {
    const [open_control, setOpenControl] = useState(false)
    return (
        <div className={`group flex flex-row bg-gray-900 cursor-pointer
         rounded-lg p-2 h-fit w-fit ${active ? "shadow-[-1px_4px_4px_rgba(74,222,128,_0.2)]" : ""}`}>
            <Image onClick={() => toggle()}
                priority
                src={src}
                className="w-12 h-12 px-2"
                alt={title}
            />
            <div className={open_control?"":"hidden group-hover:block"}>
                <div onClick={() => toggle()} className="flex flex-wrap items-center" >
                    <h3>{title} </h3>                
                    <Image priority
                        alt=''
                        src={active?EyeClosed:Eye} 
                        className="w-8 px-1 ml-2 h-8"/>
                </div>
                {controls && <div className="flex flex-wrap">
                    <h4 className='inline-flex'
                        onClick={() => {setOpenControl((prev) => !prev)}}
                    >{open_control?"Close controls":"Open controls"}
                        <Image priority
                            alt='close'
                            className={`w-4 h-4 self-center ml-4`}
                            src={open_control ? ArrowUp : ArrowDown} />
                    </h4>
                </div>}
                {open_control && children}
            </div>
        </div>
    )
}
