"use client"
import { RefObject, forwardRef, useImperativeHandle, useRef, useState } from "react";
import { useGeologicTree } from "./geologic_tree";
import { GeoBranch, GeoID } from "./geologic_tree.types";
import { GeoTreeRepr } from "./utils/geo_tree";




export function TimeScale() {
    const tree = useGeologicTree()
    const root_ref:CellFn = {
        onHover(child_ids:GeoID[]) {
            setState({
                is_darken:true,
                except : child_ids,
                no_exception : false,
            })
        },
        onClick(child_ids:{id:GeoID,lid?:GeoID,rid?:GeoID}[]) {
            setFocus({
                is_focus_active:true,
                is_focus:child_ids,
            })
        },
    }
    const [state,setState] = useState({
        is_darken:false,
        except : [] as GeoID[],
        no_exception : true,
    })    
    const [focus_on,setFocus] = useState({
        is_focus_active : false,
        is_focus : [] as {id:GeoID,lid?:GeoID,rid?:GeoID}[]
    })   
    return (
    <div className="w-full border-4 border-slate-200 rounded-md" onMouseLeave={() => {
        setState({
            is_darken:false,
            except : [],
            no_exception : true,
        })
        setFocus({
            is_focus_active : false,
            is_focus : [] as {id:GeoID,lid?:GeoID,rid?:GeoID}[]
        })
    }}>
        <Cell 
            is_darken={false}
            parent_ref={root_ref}
            id={tree.root.id}
            pid={tree.root.id}
            lid={undefined}
            rid={undefined}
            className="w-full"
            color={tree.root.data.color} 
            name={tree.root.data.name} />
        <div className="w-full flex flex-row max-w-full overflow-hidden transition-all duration-100 ease-in-out ">
            {Array.from(tree.root.branches)
                .map(([id,branch]) => {     
                    let is_darken : boolean;
                    if(state.except.length === 0) {
                        if(state.no_exception) {
                            is_darken = state.is_darken
                        }else {
                            is_darken = true
                        }
                    }else {
                        is_darken = state.except[state.except.length - 1] !== branch.id
                    }
                    let small = false
                    let maintain = false
                    const size = focus_on.is_focus.length
                    if(focus_on.is_focus_active) {
                        if(focus_on.is_focus.length === 0 || focus_on.is_focus[0].id === tree.root.id) {
                            maintain = true
                        }else if(focus_on.is_focus.length !== 0 && focus_on.is_focus[size - 1].id === branch.id) {

                        }else if(focus_on.is_focus.length !== 0 && 
                            (focus_on.is_focus[size - 1].lid === branch.id
                            || focus_on.is_focus[size - 1].rid === branch.id)) {
                                small = true
                        }else {
                            return <div key={id} className="hidden"></div>
                        }
                    }
                    return (
                        <Block 
                            state={{
                                is_darken,
                                except : state.except.slice(0,state.except.length - 1),
                                no_exception : state.no_exception
                            }}
                            focus_on={{
                                maintain,
                                is_focus_active:focus_on.is_focus_active,
                                is_focus : focus_on.is_focus.slice(0,size-1)
                            }}
                            parent_ref={root_ref}
                            small={small}
                            key={id} 
                            pid={tree.root.id} 
                            id={id} 
                            lid={branch.left_id}
                            rid={branch.right_id}
                            branch={branch} />
                    )
                })
            }
        </div>
    </div>
    )
}

type BlockProps = {
    id : GeoID,
    pid : GeoID,
    small : boolean
    lid:GeoID|undefined
    rid:GeoID|undefined
    branch : GeoBranch
    parent_ref : CellFn 
    state : {
        is_darken : boolean,
        except : GeoID[]
        no_exception : boolean
    }
    focus_on : {
        maintain : boolean
        is_focus_active : boolean,
        is_focus : {id:GeoID,lid?:GeoID,rid?:GeoID}[]
    }
}

function Block({id,pid,lid,rid,branch,parent_ref,state,small,focus_on}:BlockProps) {
    const ref:CellFn = {
        onHover(child_ids:GeoID[]) {
            parent_ref.onHover([...child_ids,id])
        },
        onClick(child_ids:{id:GeoID,lid?:GeoID,rid?:GeoID}[]) {
            parent_ref.onClick([...child_ids,{
                id,
                lid,
                rid,
            }])
            
        },
    }
    
    if(branch.branches.size === 0) {
        
        return (
            <Cell key={id} 
                id = {branch.id}
                pid = {pid}
                lid={branch.left_id}
                rid={branch.right_id}
                is_darken={state.is_darken}
                parent_ref={parent_ref}
                className="w-full"
                color={branch.data.color} 
                name={branch.data.name} />
        )
    }

    return (
        <div className={`${small ? "w-[2em]" : "w-full"} grow truncate transition-all duration-100 ease-in-out `} key={id}>
            {small && 
                <div  style={{backgroundColor:branch.data.color}}
                    className="w-full h-full cursor-pointer border border-slate-200  ">
                        
                </div>}
            {!small &&
                <>
                    <Cell key={id} 
                        id = {branch.id}
                        pid = {pid}
                        lid={branch.left_id}
                        rid={branch.right_id}
                        parent_ref={parent_ref}
                        is_darken={state.is_darken}
                        className="w-full"
                        color={branch.data.color} 
                        name={branch.data.name} />
                        <div className="w-full flex flex-row grow truncate transition-all duration-100 ease-in-out ">
                            {Array.from(branch.branches)
                                .map(([sub_id,sub_branch]) => {
                                    let is_darken : boolean;
                                    if(state.except.length === 0) {
                                        if(state.no_exception) {
                                            is_darken = state.is_darken
                                        }else {
                                            is_darken = true
                                        }
                                    }else {
                                        is_darken = state.except[state.except.length - 1] !== sub_branch.id
                                    }

                                    let small = false
                                    let maintain = false
                                    const size = focus_on.is_focus.length
                                    if(focus_on.is_focus_active ) {
                                        if(focus_on.is_focus.length === 0) {
                                            maintain = true
                                        }else if(focus_on.is_focus.length !== 0 && focus_on.is_focus[size - 1].id === sub_branch.id) {
                
                                        }else if(focus_on.is_focus.length !== 0 && 
                                            (focus_on.is_focus[size - 1].lid === sub_branch.id
                                            || focus_on.is_focus[size - 1].rid === sub_branch.id)) {
                                                small = true
                                        }else {
                                            return <div key={sub_id} className="hidden"></div>
                                        }
                                    }
                                    return (
                                        <Block 
                                        state={{
                                            is_darken,
                                            except : state.except.slice(0,state.except.length - 1),
                                            no_exception : state.no_exception
                                        }} 
                                        focus_on={{
                                            maintain : focus_on.maintain,
                                            is_focus_active:focus_on.is_focus_active,
                                            is_focus : focus_on.is_focus.slice(0,size-1)
                                        }}
                                        small={small}
                                        parent_ref={ref}
                                        key={sub_id} 
                                        id={sub_id} 
                                        lid={sub_branch.left_id}
                                        rid={sub_branch.right_id}
                                        pid={branch.id} 
                                        branch={sub_branch}/>
                                    )
                                })
                            }
                        </div>
                </>
            
            }
        </div>
    )
}

type CellProps = {
    className ?: string
    name : string
    id:GeoID
    pid:GeoID
    lid:GeoID|undefined
    rid:GeoID|undefined
    color : string
    parent_ref ?: CellFn
    is_darken : boolean
}
type CellFn = {
    onHover : (child_ids:GeoID[]) => void
    onClick : (child_ids:{id:GeoID,lid?:GeoID,rid?:GeoID}[]) => void
}
function Cell({parent_ref,className,color,name,id,pid,lid,rid,is_darken}:CellProps) {
    const div_ref = useRef<HTMLDivElement>(null)
    return (
        <div 
            ref={div_ref}
            className={`cursor-pointer truncate text-clip tracking-widest 
            small-caps py-2 text-slate-900 text-center ${className ?? ""}
            border border-slate-200 ${is_darken && "brightness-50"}
            transition-all duration-100 ease-in-out 
            `}
            style={{backgroundColor:color, maxWidth: '100%'}}
            onMouseOver={()=> {
                parent_ref?.onHover([id])
            }}
            onClick={() => {
                parent_ref?.onClick([{
                    id,
                    lid,
                    rid,
                }])
            }}
            >
            {name}
        </div>
    )
}
