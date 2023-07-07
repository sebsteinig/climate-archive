

import { useState } from "react"
import Checkbox from "../inputs/Checkbox"
import ButtonPrimary from "../buttons/ButtonPrimary"

type Props = {
    setDisplaySeeDetails:Function,
    title:string,
    journal:string,
    year:number,
    authors_full:string
    abstract:string,
    exps:string[],
    load:Function,
}

export default function PublicationDetails({setDisplaySeeDetails, title,journal,year,authors_full,abstract,exps, load}:Props) {
    const [display_abstract,setDisplayAbstract] = useState(false)
    const [checked_all,setCheckedAll] = useState(false)
    const [checked, setChecked] = useState<string[]>([])
    
    function selectAll(is_checked : boolean){
        setCheckedAll(is_checked)
        is_checked ? setChecked(exps.map((exp : string) => {return JSON.parse(exp).id})) : setChecked([])
    }

    return(
        <>
        <div className='border-s-4 border-sky-700 mt-2 mb-2 pl-4'>
            <p className="font-semibold text-sky-200">{title}</p>
            <p className="italic">{journal}, {year}</p>
            <p className="font-medium tracking-wide">{authors_full}</p>
            <div>
            <p className="pt-2 pb-2">Abstract : {display_abstract? abstract : abstract.slice(0,60) + ' ...'}</p>
            <p className="hover:underline cursor-pointer" onClick={() => {setDisplayAbstract((prev => !prev))}}>
                {display_abstract ? "Hide" : "Full abstract"}
            </p>
            </div>
            <ButtonPrimary onClick={() => {load();console.log("load exps : TODO")}}>
                {`Load all ${exps.length} experiments`}
            </ButtonPrimary>
                <div className="pt-3">
                <div className="overflow-y-visible overflow-x-hidden max-h-48">
                <table className='w-11/12 table-fixed border' id="exps-table">
                    <thead className="border-b text-left font-medium border-neutral-500 bg-slate-600 sticky top-0">
                        <tr className="">
                            <th scope="col" className="border-r px-6 py-2 border-neutral-500">Experiments</th>
                            <th scope="col" className="border-r px-6 py-2 border-neutral-500">Age</th>
                            <th scope="col" className="border-r px-6 py-2 border-neutral-500 w-1/4">
                                <Checkbox name="checked_all" checked={checked_all}
                                onChange={(event : any) => {selectAll(event.target.checked)}}></Checkbox>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                            {exps.length>0 && exps.map((exp : string) => {
                                let exp_object = JSON.parse(exp)
                                let label = exp_object.metadata[0].metadata.text
                                return( 
                                <tr className="w-6 border-b dark:border-neutral-500" key={exp_object.id}>                                    
                                    <td className="border px-6 py-2 font-medium dark:border-neutral-500">{exp_object.id}</td>
                                    <td className="border px-6 py-2 font-medium dark:border-neutral-500">{label}</td>
                                    <td className="border px-6 py-2 font-medium dark:border-neutral-500">
                                        <Checkbox name={title+"_"+exp_object.id}
                                        onChange={(event : any) => checkExperiment(event.target.checked, setChecked, checked, exp_object.id, setCheckedAll)}
                                        checked={checked.includes(exp_object.id)}></Checkbox>
                                    </td>
                                </tr>
                                )})}
                    </tbody>
                </table>
                </div>
                </div>
            <button className="hover:underline" onClick={() => {setDisplaySeeDetails(false)}}>
                Hide
            </button>
        </div>
        </>
    )
}


function checkExperiment(is_checked : boolean, setChecked : Function, checked : string[], id : string, setCheckedAll:Function){
    if (is_checked) {
        setChecked([...checked, id])
    } else {
        setChecked(checked.filter((exp) => exp !== id))
        setCheckedAll(false)
    }
    //TODO
}