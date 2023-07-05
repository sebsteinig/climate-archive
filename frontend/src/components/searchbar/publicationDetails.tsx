

import { useState } from "react"
import Checkbox from "../inputs/Checkbox"

type Props = {
    title:string,
    journal:string,
    year:number,
    authors_full:string
    abstract:string,
    exps:string[],
    load:Function,
}

    

export default function PublicationDetails({title,journal,year,authors_full,abstract,exps, load}:Props) {
    const [display_see_details,setDisplaySeeDetails] = useState(false)
    const [display_abstract,setDisplayAbstract] = useState(false)
    const [checked_all,setCheckedAll] = useState(false)
    const [checked, setChecked] = useState<string[]>([])
    
    function selectAll(is_checked : boolean){
        setCheckedAll(is_checked)
        is_checked ? setChecked(exps.map((exp : string) => {return JSON.parse(exp).id})) : setChecked([])
    }

    return(
        <>
        <div className="bg-slate-700">
            <p>{title}</p>
            <p>{journal}, {year}</p>
            <p>{authors_full}</p>
            <div >
            <p>Abstract : {display_abstract? abstract : abstract.slice(0,60) + ' ...'}</p>
            <p  onClick={() => {setDisplayAbstract((prev => !prev))}}>
                {display_abstract ? "Hide" : "Full abstract"}
            </p>
            </div>
            <button onClick={() => {
                load()
            }}>
                {`Load all ${exps.length} experiments`}
            </button>
            <table id="exps-table">
                <thead>
                    <tr>
                        <th>Experiments</th>
                        <th>Age</th>
                        <th>
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
                            <tr key={exp_object.id}>
                                <td>{exp_object.id}</td>
                                <td>{label}</td>
                                <td>
                                    <Checkbox name={title+"_"+exp_object.id}
                                    onChange={(event : any) => checkExperiment(event.target.checked, setChecked, checked, exp_object.id)}
                                    checked={checked.includes(exp_object.id)}></Checkbox>
                                </td>
                            </tr>
                            )})}
                </tbody>
            </table>
            <button onClick={() => {setDisplaySeeDetails(false)}}>
                Hide
            </button>
        </div>
        </>
    )
}


function checkExperiment(is_checked : boolean, setChecked : Function, checked : string[], id : string){
    is_checked ? setChecked([...checked, id]) : setChecked(checked.filter((exp) => exp !== id))
    //TODO
}