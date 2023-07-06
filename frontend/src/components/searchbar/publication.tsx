import { useState } from "react"
import PublicationDetails from "./publicationDetails"
import ButtonSecondary from "../buttons/ButtonSecondary"

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

    if (!display_see_details){
        return (
            < >
                <div  className='border-s-4 border-sky-300 mt-2 mb-2 pl-4 hover:opacity-100 opacity-50'>
                <p className="font-semibold text-sky-200">{title}</p>
                <p className="italic text-slate-400">{`${authors_short} (${year})`}</p>
                    <ButtonSecondary
                        
                        onClick={() => {
                            setDisplaySeeDetails(true)
                            console.log("load")
                        }}
                        >
                        See Details
                    </ButtonSecondary>
                </div>
            </>
        )
    } 
    return (
        <PublicationDetails load={load} setDisplaySeeDetails={setDisplaySeeDetails} title={title} 
            abstract={abstract} year={year} authors_full={authors_full} exps={exps} journal={journal}/>
    )
}
