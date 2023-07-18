import { useEffect, useState } from 'react'
import { useClusterStore } from "@/utils/store/cluster.store"
import Image from 'next/image';
import ArrowDown from "$/assets/icons/arrow-down-gray-50.svg";
import ArrowUp from "$/assets/icons/arrow-up-gray-50.svg";
import { Publication, isPublication, Collection, Experiment } from '../../utils/types';
import Select from '../inputs/Select';

type Props ={
    search_bar_visible : boolean
}

type CurrentPublicationProps = {
    current : Publication
}

type CurrentCollectionProps = {
    current : Collection
}

export function CurrentData({search_bar_visible} : Props){
    const [collections] = useClusterStore((state) => [state.collections])
    const [current, setCurrent] = useState<Publication|Collection>()
    useEffect(()=>{    
        setCurrent(collections.current)
    }, [collections.current])
    if (current){
        return(
            <div className={`bg-gray-900 group max-w-full rounded-md ${search_bar_visible?"hidden":""}`}>
                {isPublication(current) ?
                <CurrentPublication current = {current}/>
                :<CurrentCollection current = {current}/>
                }
                <div className='p-4 hidden group-hover:block'>
                    <Select onChange={(e:any) => {console.log(e.target.value)
                        setCurrent(collections.store[e.target.value])}}>
                        <option value="" disabled selected>Change publication or collection...</option>
                        {collections.store.map((element :  (Collection | Publication), idx) => 
                            <option key = {idx} value={idx} >
                                {isPublication(element) ? 
                                element.title
                                :`Collection of ${element.exps.length} experiment${element.exps.length > 0? "s":""}`}
                            </option>
                        )}
                    </Select>
                </div>
            </div>
        )
    }
    //no current publication or collection yet
    return(<></>)
}


function CurrentPublication({current} : CurrentPublicationProps){
    const [see_details, setSeeDetails] = useState(false)
    const [display_abstract,setDisplayAbstract] = useState(false)
    return(
        <div className={`${see_details?"":"border-s-4 border-sky-300"} py-2 px-2`}>            
            <p className="font-semibold text-sky-200">{current.title}</p>
            {!see_details && <div className='flex place-content-between items-center'>
                <Image src = {ArrowDown} 
                onClick ={() => setSeeDetails(true)} className='w-4 h-4 cursor-pointer' priority alt=""/>
                <p className="italic text-right text-slate-400">
                    {`${current.authors_short} (${current.year})`}
                </p>
            </div>}
            {see_details && <div className='overflow-y-auto overflow-x-hidden max-h-[80vh] '>
                <p className="italic text-slate-400 text-sm">{current.journal}, {current.year}</p>
                <p className="font-medium tracking-wide">{current.authors_full}</p>
                <div className="pt-2 pr-4" >
                    <p className="pb-1 font-semibold">Abstract : </p>
                    <p>{display_abstract? current.abstract : current.abstract.slice(0,90) + ' ...'}</p>
                    <div className='cursor-pointer flex flex-row-reverse gap-2 items-center' 
                        onClick={() => {setDisplayAbstract((prev => !prev))}}>
                        <Image src={display_abstract?ArrowUp:ArrowDown} priority alt="up" className='w-3 h-3'/>
                        <p className="hover:underline text-right" >
                            {display_abstract ? "Hide" : "Full abstract"}</p>
                    </div>
                </div>
                <ExperimentsTab exps = {current.exps}/>
                <Image src = {ArrowUp} 
                onClick ={() => setSeeDetails(false)} className='w-4 h-4 cursor-pointer' priority alt=""/>
            </div>}

        </div>
    )
}

function CurrentCollection({current} : CurrentCollectionProps){
    return(
        <div>
            <h4> Collection of {current.exps.length} Experiment{current.exps.length>1?"s":""}</h4>
            <ExperimentsTab exps={current.exps}/>
        </div>
    )
}

type ExperimentsTabProps = {
    exps : Experiment[]
}

function ExperimentsTab({exps}:ExperimentsTabProps){
    return (
        <div className="pt-3 pr-5">
            <div className="overflow-y-visible overflow-x-hidden max-w-sm max-h-52">
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
                            <tr className="w-6 border-b dark:border-neutral-500" key={exp.id}>                                    
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