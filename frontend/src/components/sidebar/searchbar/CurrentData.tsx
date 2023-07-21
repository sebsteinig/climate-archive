import { useEffect, useState } from 'react'
import { useClusterStore } from "@/utils/store/cluster.store"
import Image from 'next/image';
import ArrowDown from "$/assets/icons/arrow-down-gray-50.svg";
import ArrowUp from "$/assets/icons/arrow-up-gray-50.svg";
import { Publication, isPublication, Collection, Experiment } from '../../../utils/types';
import { ChangeData } from './ChangeData';

type Props ={
    display_details : boolean
    setDisplayDetails : Function
    setCurrentVariableControls : Function
    search_bar_visible : boolean
}


export function CurrentData({search_bar_visible, display_details, setDisplayDetails, setCurrentVariableControls} : Props){
    const [collections] = useClusterStore((state) => [state.collections])
    const [current_details, setCurrentDetails] = useState<Publication|Collection>()
    const [hover, setHover] = useState(false)
    useEffect(()=>{    
        setCurrentDetails(collections.current)
        setDisplayDetails(false)
    }, [collections.current])
    
    if (current_details){
        return(
            <div className={`bg-gray-900 max-w-full mt-3 rounded-md ${search_bar_visible?"hidden":""}`} >
                <div className='overflow-y-auto overflow-x-hidden max-h-[80vh]' 
                    onMouseOver={() => setHover(true)} onMouseLeave={() => setHover(false)} >
                    <CurrentTitle onClick={()=> setDisplayDetails((prev : boolean) => {
                                setCurrentVariableControls(undefined)
                                return !prev})} 
                        display_details={display_details} current_details = {current_details} />
                    { display_details && <>{isPublication(current_details) ?
                        <CurrentPublication current_details = {current_details}/>
                        :<ExperimentsTab exps={current_details.exps}/>
                    }</>}
                    <ChangeData display_details={display_details} hover={hover} current_details = {current_details}/>
                </div>
            </div>
        )
    }
    //no current publication or collection yet
    return(<></>)
}

function CurrentTitle({current_details, display_details, onClick} : {current_details : Publication | Collection, display_details : boolean, onClick : Function}){
    return(
        <div onClick={() => onClick()} 
        className={`${display_details?"":" border-s-4 border-sky-300"} m-2 cursor-pointer px-4`}>
            {isPublication(current_details)
            ?<>
                <p className="py-2 font-semibold text-sky-200">{current_details.title}</p>
                <div className={display_details?"":"flex place-content-between items-center"}>
                    <Image 
                        src = {display_details?ArrowUp:ArrowDown} 
                        className='w-4 h-4 cursor-pointer' 
                        priority 
                        alt=""
                    />
                {!display_details && <p className="py-2 italic text-right text-slate-400">
                    {`${current_details.authors_short} (${current_details.year})`}
                </p>}
                </div>
            </>
            :<>
                {current_details.exps.length>0 && <>
                    <p className="font-semibold text-sky-200"> 
                        Collection of {current_details.exps.length}
                        Experiment{current_details.exps.length>1?"s":""} :
                        {current_details.exps[0].id}, ...
                    </p>
                    <Image 
                        src = {display_details?ArrowUp:ArrowDown} 
                        className='w-4 h-4 cursor-pointer' 
                        priority 
                        alt=""
                    />
                </>}
            </>
            }
        </div>
    )    
}

function CurrentPublication({current_details} : {current_details : Publication}){
    const [display_abstract,setDisplayAbstract] = useState(false)
    return(
        <div className={`px-2`}>    
            <p className="italic py-2 text-slate-400 text-sm">{current_details.journal}, {current_details.year}</p>
            <p className="font-medium tracking-wide">{current_details.authors_full}</p>
            <div className="pt-2 pr-4" >
                <p className="pb-1 font-semibold">Abstract : </p>
                <p>{display_abstract? current_details.abstract : current_details.abstract.slice(0,90) + ' ...'}</p>
                <div className='cursor-pointer hover:underline text-right' 
                    onClick={() => {setDisplayAbstract((prev => !prev))}}>
                        {display_abstract ? "Hide" : "Full abstract"}
                </div>
            </div>
            <ExperimentsTab exps = {current_details.exps}/>
        </div>
    )
}

function ExperimentsTab({exps}:{exps : Experiment[]}){
    return (
        <div className="py-3 pr-5">
            <div className="overflow-y-visible overflow-x-hidden max-h-52">
            <table className='w-11/12 table-fixed border-t-0 border' id="exps-table">
                <thead className="border-b  text-left font-medium border-neutral-500 bg-slate-600 sticky top-0">
                    <tr className="">
                        <th scope="col" className="border-r px-6 py-2 border-neutral-500">Experiments</th>
                        <th scope="col" className="border-r px-6 py-2 border-neutral-500">Age</th>
                    </tr>
                </thead>
                <tbody className="">
                        {exps.length>0 && exps.map((exp) => {
                            let label = exp.metadata.length>0?exp.metadata[0].metadata.text:""
                            return( 
                            <tr className="w-full border-b dark:border-neutral-500" key={exp.id}>                                    
                                <td className="border px-6 py-2 font-medium dark:border-neutral-500">{exp.id}</td>
                                <td className="border px-6 py-2 font-medium dark:border-neutral-500">{label}</td>
                            </tr>
                            )})}
                </tbody>
            </table>
            </div>
        </div>
    )
}
