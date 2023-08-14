import { forwardRef, useImperativeHandle, useRef, useState } from "react"
import { ControllerRef, TimeController } from "./utils/TimeController"
import { IControllerRef } from "./controller.types"
import { TimeFrameRef, TimeID, WorldData } from "@/utils/store/time/time.type"
import { ProgessBarRef, ProgressBar } from "./utils/ProgressBar"
import { goto } from "@/utils/store/time/time.utils"




type MonthlyControllerProps = {
    data: WorldData
    current_frame: TimeFrameRef
    time_id: TimeID
}

export const MonthlyController = forwardRef<IControllerRef,MonthlyControllerProps>(
    function MonthlyController({current_frame,time_id,data},ref) {
        const controller_ref = useRef<ControllerRef>(null)
        const progress_bar_ref = useRef<ProgessBarRef>(null)
        const [highlighted_month,setHighLightMonth] = useState<number|undefined>(undefined)
        const [focus,setFocus] = useState<number|undefined>(undefined)
        useImperativeHandle(ref,() => {
            return {
                onChange(frame) {
                    controller_ref.current?.onChange(frame)
                },
                onWeightUpdate(frame) {
                    progress_bar_ref.current?.update(frame.weight/((frame.timesteps ?? 12)));
                },
            }
        })
        return (
            <div className="w-full pt-5 px-5">
                <TimeController
                    current_frame={current_frame}
                    time_id={time_id}
                    data={data}
                    ref={controller_ref}
                />
                <div className="w-full my-2">
                    <ProgressBar ref={progress_bar_ref}/>
                </div>
                <div className="
                    w-full rounded-lg 
                    flex flex-row
                    overflow-hidden
                    border-2 border-slate-200
                "
                onMouseLeave={() => {
                    if(focus === undefined) {
                        setHighLightMonth(undefined)
                    }
                }}>
                    {MONTHS.map((month,idx) => {
                        
                        return( 
                            <Month 
                                key = {idx}
                                highlight={highlighted_month === undefined || highlighted_month === idx}
                                focus={focus}
                                idx={idx}
                                month={month}
                                color={MONTHS_COLOR[idx]}
                                onChange={(idx,focus) => {
                                    const frame = current_frame.current.get(time_id)
                                    if (!frame) return
                                    setHighLightMonth(idx)
                                    if(focus) {
                                        setFocus((prev) => {
                                            if(prev === idx) {
                                                return undefined
                                            }
                                            return idx
                                        })
                                    }
                                    controller_ref.current?.pause()
                                    goto(frame,idx)
                                }}
                            />
                        )
                    })}
                </div>
            </div>
        )
    }
)



type MonthProps = {
    idx : number
    month : string
    highlight : boolean
    focus : number | undefined
    color : string
    onChange : (idx:number,focus:boolean) => void
}

function Month({idx,month,color,focus,onChange,highlight} : MonthProps) {
    return (
        <div className={`${focus === idx ? "flex-grow-[2]" : "grow"} cursor-pointer truncate text-clip tracking-widest 
        small-caps py-1 text-slate-900 text-center ${color}
        border-r-2 border-slate-200 ${highlight ? "brightness-100" : "brightness-50"}
        transition-all duration-100 ease-in-out `}
            onClick={()=> {
                onChange(idx,true)
            }}
            onMouseOver={()=> {
                if(focus === undefined) {
                    onChange(idx,false)
                }
            }}>
            {month.slice(0,3)}
        </div>
    )
}

const MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ] as const
  
const MONTHS_COLOR = [
    "bg-sky-300",
    "bg-sky-200",
    "bg-sky-100",
    "bg-emerald-200",
    "bg-emerald-300",
    "bg-emerald-400",
    "bg-emerald-300",
    "bg-emerald-200",
    "bg-sky-100",
    "bg-sky-200",
    "bg-sky-300",
    "bg-sky-400",
  ] as const