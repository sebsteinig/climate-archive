import Checkbox from "@/components/inputs/Checkbox"
import InputField from "@/components/inputs/InputField"
import Select from "@/components/inputs/Select"
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
                    <InputField name="expid_input" value={exp_ids.search}
                    id="expid_input" placeholder="experiment id ..."
                    onChange={(e : any)=>{
                            setExpIds((prev) => {
                                return {
                                    ...prev,
                                    search:e.target.value,
                                    exp_ids:prev.exp_ids.filter((e) => e.display),
                                }
                            })
                        }}
                        onKeyDown={(e : any) => {
                            if (e.key === 'Enter') {
                                setExpIds((prev) => {
                                    return {
                                        ...prev,
                                        search:"",
                                        exp_ids : [...prev.exp_ids,{id:prev.search,display:true}]
                                    }
                                })
                            }
                        }}></InputField>
                </span>
                <span  >
                    <h4  >configuration :</h4>
                    <InputField name="config" id="config" placeholder="configuration ..." 
                        value={config} onChange={(e : any) => setConfig(e.target.value)} ></InputField>
                </span>
                <span  >
                <h4>extension :</h4>
                    <Select name="extension" id="extension" defaultValue={extension}
                    onChange={(e : any) => setExtension(e.target.value)}>
                            {SUPPORTED_EXTENSION.map((ext,idx) => {
                                return <option value={ext} key={idx}>{ext}</option>
                            })}
                    </Select>
                
                </span>
                <span  >
                    <h4 >lossless :</h4>
                    <Checkbox name="lossless" id="lossless" checked={lossless} 
                    onChange={(e:any) => setLossless((prev)=> !prev)}></Checkbox>
                </span>
                <span  >
                    <h4   >resolution :</h4>
                    <h5  >x :</h5>  
                    <Select name="ry" id="ry" defaultValue={SUPPORTED_RESOLUTION[0].toString()}
                    onChange={(e:any) => {
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
                    }}>
                        {SUPPORTED_RESOLUTION.map((ext,idx) => {
                            return <option value={ext} key={idx}>{ext}</option>
                        })}
                    </Select>

                    <h5  >y :</h5>  
                        <Select name="rx" id="rx" defaultValue={SUPPORTED_RESOLUTION[0].toString()}
                        onChange={(e:any) => {
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
                        }}>
                            {SUPPORTED_RESOLUTION.map((ext,idx) => {
                                return <option value={ext} key={idx}>{ext}</option>
                            })}
                        </Select>
                </span>
                <button className="btn-secondary">Search</button>
        </>
    )
}