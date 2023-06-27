import { useEffect, useState } from "react"
type Exp = {
    id : string,
    display : boolean,
}

const SUPPORTED_EXTENSION = ["png","webp","jpg"]
const SUPPORTED_RESOLUTION = ["default",1,2]


function ExpButton({exp,remove}:{exp:Exp,remove:Function}) {
    return (
        <div className="label">
            <p>{exp.id}</p>
            <h4 onClick={() => remove()}></h4>
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
                <span onClick={() => setDisplay(true)}>

                    <h3>Advanced filters</h3>
                </span>

            </>
        )
    }
    return (
        <>
            <span onClick={() => {
                setDisplay(false)
            }}>
                <h3>Advanced filters</h3>
            </span>
            <span >
                {exp_ids.exp_ids?.map((exp,idx) => {
                    return <ExpButton exp={exp} key={idx} remove={()=> {
                        setExpIds((prev) => {
                            prev.exp_ids[idx].display = false
                            return {...prev,exp_ids:prev.exp_ids}
                        })
                    }}/>
                })}
            </span>
                <span  >
                    <h4  >experiments :</h4>
                    <input 
                        type="text" 
                        name="expid_input" 
                        id="expid_input" 
                        placeholder="experiment id ..."
                        className="input-field"
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
                <span  >
                    <h4  >configuration :</h4>
                    <input  type="text" name="config" id="config" placeholder="configuration ..." 
                        value={config}
                        className="input-field"
                        onChange={(e) => setConfig(e.target.value)}
                    />
                </span>
                <span  >
                <h4>extension :</h4>
                <select className="select"  name="extension" id="extension" defaultValue={extension}
                    onChange={(e) => setExtension(e.target.value)}
                >
                    {SUPPORTED_EXTENSION.map((ext,idx) => {
                        return <option value={ext} key={idx}>{ext}</option>
                    })}
                </select>
                </span>
                <span  >
                    <h4 >lossless :</h4>
                    <input className="checkbox"  type="checkbox" name="lossless" id="lossless" checked={lossless} onChange={(e) => setLossless((prev)=> !prev)} />
                </span>
                <span  >
                    <h4   >resolution :</h4>
                    <h5  >x :</h5>              
                    <select className="select" name="ry" id="ry" defaultValue={SUPPORTED_RESOLUTION[0]}
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
                    <h5  >y :</h5>                 
                        <select className="select"  name="rx" id="rx" defaultValue={SUPPORTED_RESOLUTION[0]}
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
                </span>
                <button className="btn-secondary">Search</button>
        </>
    )
}