import { useEffect, useState } from "react"


type Label = {
    label : string
    display: boolean
}

function LabelButton({label,remove}:{label:Label,remove:Function}) {
    return (
        <div className={label.display ? 'label' : 'invisible'}>
            {label.label}
            <div onClick={() => remove()}></div>
        </div>
    )
}

function FoundLabelButton({label,add}:{label:Label,add:Function}) {
    return (
        <div className={label.display ? 'label' : 'invisible'} onClick={() => add()} >
            {label.label}
        </div>
    )
}
export default function FilterLabels() {
    const [display,setDisplay] = useState(false)
    const [labels,setLabels] = useState<{searched : string, found : Label[], selected: Label[]}>({searched : "",found:[],selected:[]})
    useEffect(() => {
        let ignore = false;

        if (labels.searched !== "") {
            setLabels((prev) =>{
                return {
                    ...prev,
                    found:[...prev.found.filter(({display}) => display),{label:labels.searched,display:true}],
                    selected:prev.selected.filter(({display}) => display),
                }
            })
        }

        return () => {
            ignore = true;
        };
    },[labels.searched])
    if (!display) {
        return (
            <>
                <span onClick={() => setDisplay(true)}>

                    <h3>Filter with labels</h3>
                </span>

            </>
        )
    }
    
    return (
        <>
            <span   onClick={() => {
                setLabels((prev) => {
                    return {
                        searched:"",
                        found:prev.found.filter(({display}) => display),
                        selected:prev.selected.filter(({display}) => display),
                    }
                })
                setDisplay(false)
            }}>
                <h3 >Filter with labels</h3>
            </span>
            <span  >
                {labels.selected?.map((label,idx) => {
                    return <LabelButton label={label} key={idx} remove={()=> {
                        setLabels((prev) => {
                            prev.selected[idx].display = false
                            return {...prev,selected:prev.selected}
                        })
                    }}/>
                })}
            </span>
            
            <div >
                <input 
                    className="input-field"
                    type="text" 
                    name="searched_label" 
                    id="searched_label"  
                    placeholder="Search a label ..."
                    value={labels.searched} 
                    onChange={(e) => setLabels((prev) => {return {...prev,searched:e.target.value}})}
                />
                {
                    labels.found?.map((label,idx) => {
                        return <FoundLabelButton label={label} add={() => {
                            if ( ! labels.selected.map(({label})=>label).includes(label.label)) {
                                setLabels((prev) => {
                                    prev.found[idx].display = false
                                    return {
                                        ...prev,
                                        searched:"",
                                        selected : [...prev.selected,{...label,display:true}]
                                    }
                                })
                            }else {
                                setLabels((prev) => {
                                    prev.found[idx].display = false
                                    return {
                                        ...prev,
                                        searched:"",
                                    }
                                })
                            }
                        }}  key={idx} />
                    })
                }
            </div>
        </>
    )
}