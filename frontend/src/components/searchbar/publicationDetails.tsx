

import { useState } from "react"
import Checkbox from "../inputs/Checkbox"
import ButtonPrimary from "../buttons/ButtonPrimary"
import { DefaultParameter } from "@/utils/api/api.types"
import { RequestMultipleTexture } from "@/utils/texture_provider/texture_provider.types"

type Props = {
    setDisplaySeeDetails:Function,
    title:string,
    journal:string,
    year:number,
    authors_full:string
    abstract:string,
    exps:{
        id:string,
        metadata:{
            label:string,
            metadata:{
                text:string
            }|any
        }[]
    }[],
    load:(x:RequestMultipleTexture) => void
}

type CheckedExp = {
    exp : string,
    checked : boolean
}

export default function PublicationDetails({setDisplaySeeDetails, title,journal,year,authors_full,abstract,exps, load}:Props) {
    const [display_abstract,setDisplayAbstract] = useState(false)
    const [checked, setChecked] = useState<CheckedExp[]>(exps.map((exp) => {
        return {
            exp : exp.id,
            checked : false,
        }
    }))
    
    function selectAll(is_checked : boolean){
        setChecked((prev) => {
            return prev.map(({exp}) => {
                return {
                    exp,
                    checked : is_checked
                }
            })
        })
    }
    const nb_checked = checked.reduce((acc,e)=> acc + Number(e.checked),0)
    return(
        <>
        <div className='border-s-4 border-sky-700 mt-2 mb-2 pl-4'>
            <p className="font-semibold text-sky-200">{title}</p>
            <p className="italic text-slate-400 text-sm">{journal}, {year}</p>
            <p className="font-medium tracking-wide">{authors_full}</p>
            <div className="pt-2 pr-4" >
                <p className="pb-1 font-semibold">Abstract : </p><p>{display_abstract? abstract : abstract.slice(0,90) + ' ...'}</p>
                <p className="hover:underline text-right cursor-pointer" onClick={() => {setDisplayAbstract((prev => !prev))}}>
                    {display_abstract ? "Hide" : "Full abstract"}</p>
            </div>
            <div><ButtonPrimary onClick={() => {
                load({
                    exp_ids : checked.filter(e => e.checked).map(e => e.exp),
                });
                } 

            }>
                {`Load ${nb_checked === checked.length ? "all " : nb_checked } experiment${nb_checked >1 ? "s" : ""}`}
            </ButtonPrimary></div>
                <div className="pt-3">
                <div className="overflow-y-visible overflow-x-hidden max-h-48">
                <table className='w-11/12 table-fixed border' id="exps-table">
                    <thead className="border-b text-left font-medium border-neutral-500 bg-slate-600 sticky top-0">
                        <tr className="">
                            <th scope="col" className="border-r px-6 py-2 border-neutral-500">Experiments</th>
                            <th scope="col" className="border-r px-6 py-2 border-neutral-500">Age</th>
                            <th scope="col" className="border-r px-6 py-2 border-neutral-500 w-1/4">
                                <Checkbox name="checked_all" checked={nb_checked === checked.length}
                                onChange={(event : any) => {selectAll(event.target.checked)}}></Checkbox>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                            {exps.length>0 && exps.map((exp) => {
                                let label = exp.metadata[0].metadata.text
                                return( 
                                <tr className="w-6 border-b dark:border-neutral-500" key={exp.id}>                                    
                                    <td className="border px-6 py-2 font-medium dark:border-neutral-500">{exp.id}</td>
                                    <td className="border px-6 py-2 font-medium dark:border-neutral-500">{label}</td>
                                    <td className="border px-6 py-2 font-medium dark:border-neutral-500">
                                        <Checkbox name={title+"_"+exp.id}
                                        onChange={
                                            (event : any) => {
                                                setChecked((prev) => {
                                                    return prev.map((e) => {
                                                        if (e.exp === exp.id) {
                                                            return {
                                                                exp:e.exp,
                                                                checked : event.target.checked
                                                            }
                                                        }
                                                        return e
                                                    })
                                                })
                                            }
                                        }
                                        checked={checked.find(e => e.exp === exp.id)?.checked ?? false}></Checkbox>
                                    </td>
                                </tr>
                                )})}
                    </tbody>
                </table>
                </div>
                </div>

                <p className="hover:underline text-right pt-3 pr-4 cursor-pointer" 
                    onClick={() => {setDisplaySeeDetails((false))}}>Hide</p>
        </div>
        </>
    )
}
