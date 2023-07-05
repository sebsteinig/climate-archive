import { useState } from "react"
import PublicationDetails from "./publicationDetails"

export type Publication = {
    title : string
    authors_short : string
    year : number
    authors_full : string
    abstract : string
    journal : string
    exps:any[],
}

export function PublicationShort({title,authors_short,year,authors_full, abstract, journal, exps, load} : Publication & {load:Function}) {
    const [display_see_details,setDisplaySeeDetails] = useState(false)
    const [display_abstract,setDisplayAbstract] = useState(false)
    const [checked_all,setCheckedAll] = useState(false)
    const [checked, setChecked] = useState<string[]>([])
    
    function selectAll(is_checked : boolean){
        setCheckedAll(is_checked)
        is_checked ? setChecked(exps.map((exp : string) => {return JSON.parse(exp).id})) : setChecked([])
    }

    if (!display_see_details){
        return (
            < >
                <p>{title}</p>
                <p>{`${authors_short} (${year})`}</p>
                <button 
                    
                    onClick={() => {
                        setDisplaySeeDetails(true)
                        console.log("load")
                    }}
                >
                    See Details
                </button>
            </>
        )
    } 
    return (
        <PublicationDetails load={load} title={title} abstract={abstract} year={year} authors_full={authors_full} exps={exps} journal={journal}/>
    )
}

function checkExperiment(is_checked : boolean, setChecked : Function, checked : string[], id : string){
    is_checked ? setChecked([...checked, id]) : setChecked(checked.filter((exp) => exp !== id))
    //TODO
}