import { useEffect, useState } from "react"
import styles from './filter.module.css'

type Exp = {
    id : string,
    display : boolean,
}

const SUPPORTED_EXTENSION = ["png","webp","jpg"]
const SUPPORTED_RESOLUTION = ["default",1,2]


function ExpButton({exp,remove}:{exp:Exp,remove:Function}) {
    return (
        <div className={`${!exp.display ? styles.invisible : ""}`}>
            <p>{exp.id}</p>
            <p onClick={() => remove()}></p>
        </div>
    )
}


export default function FilterAdvanced() {
    const [display,setDisplay] = useState(false)
    const [exp_ids,setExpIds] = useState<{exp_ids:Exp[], search:string}>({exp_ids:[],search:""})
    const [config,setConfig] = useState("")
    const [extension,setExtension] = useState(SUPPORTED_EXTENSION[0])
    const [lossless,setLossless] = useState(true)
    const [resolution,setResolution] = useState<{x?:number,y?:number}>({})
    if (!display) {
        return (
            <>
                <span onClick={() => setDisplay(true)} onMouseEnter={() => setDisplay(true)}>

                    <p>Advanced filters</p>
                </span>

            </>
        )
    }
    return (
        <>
            <span onClick={() => {
                setDisplay(false)
            }}>
                <p>Advanced filters</p>
            </span>
            <span>
                {exp_ids.exp_ids?.map((exp,idx) => {
                    return <ExpButton exp={exp} key={idx} remove={()=> {
                        setExpIds((prev) => {
                            prev.exp_ids[idx].display = false
                            return {...prev,exp_ids:prev.exp_ids}
                        })
                    }}/>
                })}
            </span>
                <input 
                    type="text" 
                    name="expid_input" 
                    id="expid_input" 
                    placeholder="experiment id ..."
                    value={exp_ids.search}
                    onChange={(e)=>{
                        setExpIds((prev) => {
                            return {
                                ...prev,
                                search:e.target.value,
                                exp_ids:prev.exp_ids.filter((e) => e.display),
                            }
                        })
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            setExpIds((prev) => {
                                return {
                                    ...prev,
                                    search:"",
                                    exp_ids : [...prev.exp_ids,{id:prev.search,display:true}]
                                }
                            })
                        }
                    }}
                />
                <input type="text" name="config" id="config" placeholder="configuration ..." 
                    value={config}
                    onChange={(e) => setConfig(e.target.value)}
                />
                <span>
                <p>extension :</p>
                <select name="extension" id="extension" defaultValue={extension}
                    onChange={(e) => setExtension(e.target.value)}
                >
                    {SUPPORTED_EXTENSION.map((ext,idx) => {
                        return <option value={ext} key={idx}>{ext}</option>
                    })}
                </select>
                </span>
                <span>
                    <p>lossless :</p>
                    <input type="checkbox" name="lossless" id="lossless" checked={lossless} onChange={(e) => setLossless((prev)=> !prev)} />
                </span>
                <span>
                    <p>resolution :</p>
                    <p>y :</p>
                    <select name="rx" id="rx" defaultValue={SUPPORTED_RESOLUTION[0]}
                        onChange={(e) => {
                            if (e.target.value == SUPPORTED_RESOLUTION[0]) {
                                setResolution((prev) => {
                                    return {
                                        ...prev,
                                        x : 0,
                                    }
                                })
                            }else {
                                setResolution((prev) => {
                                    return {
                                        ...prev,
                                        x : parseFloat(e.target.value),
                                    }
                                })
                            }
                        }}
                    >
                        {SUPPORTED_RESOLUTION.map((ext,idx) => {
                            return <option value={ext} key={idx}>{ext}</option>
                        })}
                    </select>
                    <p>x :</p>
                    <select name="ry" id="ry" defaultValue={SUPPORTED_RESOLUTION[0]}
                        onChange={(e) => {
                            if (e.target.value == SUPPORTED_RESOLUTION[0]) {
                                setResolution((prev) => {
                                    return {
                                        ...prev,
                                        y : 0,
                                    }
                                })
                            }else {
                                setResolution((prev) => {
                                    return {
                                        ...prev,
                                        y : parseFloat(e.target.value),
                                    }
                                })
                            }
                        }}
                    >
                        {SUPPORTED_RESOLUTION.map((ext,idx) => {
                            return <option value={ext} key={idx}>{ext}</option>
                        })}
                    </select>
                </span>
                <button>Search</button>
        </>
    )
}