import { useState } from "react"
import PublicationDetails from "./publicationDetails"

type Publication = {
    title : string
    author : string
    year : number
    authors_full : string
    abstract : string
    journal : string
    exps:any[]
}

export default function Publication({title,author,year,authors_full, abstract, journal, exps} : Publication) {
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
                <p>{`${author} (${year})`}</p>
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
        <PublicationDetails title={title} abstract={abstract} year={year} authors_full={authors_full} exps={exps} journal={journal}/>
    )
}

function checkExperiment(is_checked : boolean, setChecked : Function, checked : string[], id : string){
    is_checked ? setChecked([...checked, id]) : setChecked(checked.filter((exp) => exp !== id))
    //TODO
}