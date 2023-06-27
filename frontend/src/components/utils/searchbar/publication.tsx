import { useState } from "react"
import styles from "./publication.module.css"

type Publication = {
    title : string
    author : string
    year : string
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
            <div className={styles.publication}>
                <p>{title}</p>
                <p className={styles.author}>{`${author} (${year})`}</p>
                <button 
                    className={styles.load_button}
                    onClick={() => {
                        setDisplaySeeDetails(true)
                        console.log("load")
                    }}
                >
                    See Details
                </button>
            </div>
        )
    } else {
        let short_abstract = abstract.slice(0, 60)
        return(
            <>
            <div>
                <p>{title}</p>
                <p>{journal}, {year}</p>
                <p>{authors_full}</p>
                <div className={styles.abstract}>
                <p>Abstract : {display_abstract? abstract : short_abstract + ' ...'}</p>
                <p className={styles.full_abstract} onClick={() => {setDisplayAbstract((prev => !prev))}}>
                    {display_abstract ? "Hide" : "Full abstract"}
                </p>
                </div>
                <button className={styles.load_button} onClick={() => {console.log("load exps : TODO")}}>
                    {`Load all ${exps.length} experiments`}
                </button>
                <table className={styles.table_exps} id="exps-table">
                    <thead>
                        <tr>
                            <th>Experiments</th>
                            <th>Age</th>
                            <th><input name="checked_all" type="checkbox" 
                            checked={checked_all} onChange={(event) => {selectAll(event.target.checked)}}/></th>
                        </tr>
                    </thead>
                    <tbody>
                            {exps.length>0 && exps.map((exp : string) => {
                                let exp_object = JSON.parse(exp)
                                let label = exp_object.metadata[0].metadata.text
                                return( 
                                <tr>
                                <td>{exp_object.id}</td>
                                <td>{label}</td>
                                <td><input type="checkbox" name={title+"_"+exp_object.id}
                                     onChange={(event) => checkExperiment(event.target.checked, setChecked, checked, exp_object.id)}
                                    checked={checked.includes(exp_object.id)}/></td>
                                </tr>
                                )})}
                    </tbody>
                </table>
                <button className={styles.load_button} onClick={() => {setDisplaySeeDetails(false)}}>
                    Hide
                </button>
                <p></p>
            </div>
            </>
        )
    }
}

function checkExperiment(is_checked : boolean, setChecked : Function, checked : string[], id : string){
    is_checked ? setChecked([...checked, id]) : setChecked(checked.filter((exp) => exp !== id))
    //TODO
}