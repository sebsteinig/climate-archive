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

type Props=   {
    publications : Publication[] 
    setSearchPanelVisible : Function
    more_options : boolean
}

export function Publications( {publications, more_options, setSearchPanelVisible} : Props){
    const [display_see_details,setDisplaySeeDetails] = useState(false)
    const [displayed_publication, setDisplayedPublication] = useState<Publication>()
    return (
        <div className={`${publications.length > 0 && !more_options ?'h-[64vh]':''} 
            ${more_options ? "h-[8vh]":""} overflow-y-auto overflow-x-hidden max-h-full`} >
            <div>
                {(publications.length > 0 && !display_see_details) && 
                    publications.map((publication: Publication,idx:number) => {
                        return(
                            <div key={idx} className='border-s-4 border-sky-300 mt-2 mb-2 pl-4 hover:opacity-100 opacity-80'>
                                <p className="font-semibold text-sky-200">{publication.title}</p>
                                <p className="italic text-slate-400">{`${publication.authors_short} (${publication.year})`}</p>
                                    <ButtonSecondary onClick={() => {
                                        setDisplaySeeDetails(true)
                                        setDisplayedPublication(publication)
                                        console.log("load")
                                    }}>See Details
                                </ButtonSecondary>
                            </div>
                        )                        
                })}
                {displayed_publication != undefined && display_see_details &&
                    <PublicationDetails 
                        setSearchPanelVisible = {setSearchPanelVisible}
                        setDisplaySeeDetails={setDisplaySeeDetails} 
                        title={displayed_publication.title} 
                        abstract={displayed_publication.abstract} 
                        authors_short={displayed_publication.authors_short} 
                        year={displayed_publication.year} 
                        authors_full={displayed_publication.authors_full} 
                        exps={displayed_publication.exps} 
                        journal={displayed_publication.journal}
                    />
                }
            </div>
        </div>
    )
}