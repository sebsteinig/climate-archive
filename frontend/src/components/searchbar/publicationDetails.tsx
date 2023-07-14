

import { useState } from "react"
import Checkbox from "../inputs/Checkbox"
import ButtonPrimary from "../buttons/ButtonPrimary"
import { texture_provider } from "@/utils/texture_provider/TextureProvider"
import { useClusterStore } from "@/utils/store/cluster.store"
import { Publication } from "@/utils/store/texture_tree.store"

type Props = {
    setDisplaySeeDetails:Function,
    title:string,
    journal:string,
    year:number,
    authors_full:string
    authors_short:string
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
}

type CheckedExp = {
    exp : string,
    checked : boolean
}

export default function PublicationDetails({setDisplaySeeDetails, title,journal,year,authors_full,authors_short,abstract,exps}:Props) {
    const [display_abstract,setDisplayAbstract] = useState(false)
    const [checked, setChecked] = useState<CheckedExp[]>(exps.map((exp) => {
        return {
            exp : exp.id,
            checked : true,
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
    const [pushAll,addCollection] = useClusterStore((state) => [state.pushAll,state.addCollection])

    return(
        <>
        <div className='border-s-4 flex flex-wrap gap-2 border-sky-700 mt-2 mb-2 pl-4'>
            <p className="hover:underline cursor-pointer" onClick={() => setDisplaySeeDetails(false)}>{"<"} Back</p>
            <p className="font-semibold tracking-widest text-center pr-4 text-sky-200">{title}</p>
            <p className="italic text-slate-400 text-sm">{journal}, {year}</p>
            <p className="font-medium tracking-wide">{authors_full}</p>
            <div className="pt-2 pr-4" >
                <p className="pb-1 font-semibold">Abstract : </p><p>{display_abstract? abstract : abstract.slice(0,90) + ' ...'}</p>
                <p className="hover:underline text-right cursor-pointer" onClick={() => {setDisplayAbstract((prev => !prev))}}>
                    {display_abstract ? "Hide" : "Full abstract"}</p>
            </div>
            <div><ButtonPrimary onClick={
                async () => {
                    const request = {
                        exp_ids : checked.filter(e => e.checked).map(e => e.exp),
                    }
                    const res = await texture_provider.loadAll({
                        exp_ids:request.exp_ids,
                    })
                    pushAll(res.flat())
                    addCollection({
                        exps : request.exp_ids,
                        abstract,
                        authors_full,
                        authors_short,
                        journal,
                        title,
                        year,
                    } as Publication)
                }
            }> {`Load ${nb_checked === checked.length ? "all ":""} ${nb_checked} experiment${nb_checked >1 ? "s" : ""}`}
            </ButtonPrimary></div>
                <div className="pt-3 pr-5">
                <div className="overflow-y-visible overflow-x-hidden max-h-52">
                <table className='w-11/12 table-fixed border-t-0 border' id="exps-table">
                    <thead className="border-b  text-left font-medium border-neutral-500 bg-slate-600 sticky top-0">
                        <tr className="">
                            <th scope="col" className="border-r px-6 py-2 border-neutral-500">Experiments</th>
                            <th scope="col" className="border-r px-6 py-2 border-neutral-500">Age</th>
                            <th scope="col" className="border-r px-6 py-2 border-neutral-500 w-1/4">
                                <Checkbox name="checked_all" checked={nb_checked === checked.length}
                                onChange={(event : any) => {selectAll(event.target.checked)}}></Checkbox>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="">
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
        </div>
        </>
    )
}
