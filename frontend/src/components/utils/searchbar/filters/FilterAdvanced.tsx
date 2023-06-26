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
                <span className={`${styles.line}`}  onClick={() => setDisplay(true)}>

                    <p className={styles.field}>Advanced filters</p>
                </span>

            </>
        )
    }
    return (
        <>
            <span className={`${styles.line}`}  onClick={() => {
                setDisplay(false)
            }}>
                <p className={styles.field}>Advanced filters</p>
            </span>
            <span className={`${styles.line}`} >
                {exp_ids.exp_ids?.map((exp,idx) => {
                    return <ExpButton exp={exp} key={idx} remove={()=> {
                        setExpIds((prev) => {
                            prev.exp_ids[idx].display = false
                            return {...prev,exp_ids:prev.exp_ids}
                        })
                    }}/>
                })}
            </span>
                <span className={`${styles.line}`} >
                    <p className={styles.field} >experiments :</p>
                    <input 
                        type="text" 
                        name="expid_input" 
                        id="expid_input" 
                        placeholder="experiment id ..."
                        className={`${styles.text_input}`}
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
                </span>
                <span className={`${styles.line}`} >
                    <p className={styles.field} >configuration :</p>
                    <input className={`${styles.text_input}`} type="text" name="config" id="config" placeholder="configuration ..." 
                        value={config}
                        onChange={(e) => setConfig(e.target.value)}
                    />
                </span>
                <span className={`${styles.line}`} >
                <p className={styles.field} >extension :</p>
                <select className={`${styles.select_input}`} name="extension" id="extension" defaultValue={extension}
                    onChange={(e) => setExtension(e.target.value)}
                >
                    {SUPPORTED_EXTENSION.map((ext,idx) => {
                        return <option className={`${styles.option}`} value={ext} key={idx}>{ext}</option>
                    })}
                </select>
                </span>
                <span className={`${styles.line}`} >
                    <p className={styles.field}>lossless :</p>
                    <input type="checkbox" name="lossless" id="lossless" checked={lossless} onChange={(e) => setLossless((prev)=> !prev)} />
                </span>
                <span className={`${styles.line}`} >
                    <p className={styles.field}  >resolution :</p>
                    <p className={styles.field} >x :</p>              
                    <select className={`${styles.select_input}`} name="ry" id="ry" defaultValue={SUPPORTED_RESOLUTION[0]}
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
                            return <option className={`${styles.option}`}  value={ext} key={idx}>{ext}</option>
                        })}
                    </select>
                    <p className={styles.field} >y :</p>                 
                        <select className={`${styles.select_input}`} name="rx" id="rx" defaultValue={SUPPORTED_RESOLUTION[0]}
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
                                return <option className={`${styles.option}`} value={ext} key={idx}>{ext}</option>
                            })}
                        </select>
                </span>
                <button className={styles.load_button}>Search</button>
        </>
    )
}