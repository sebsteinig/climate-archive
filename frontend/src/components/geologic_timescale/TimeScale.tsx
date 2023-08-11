"use client"
import { RefObject, forwardRef, useImperativeHandle, useRef, useState } from "react";
import { useGeologicTree } from "./geologic_tree";
import { GeoBranch, GeoID } from "./geologic_tree.types";
import { GeoTreeRepr } from "./utils/geo_tree";




export function TimeScale() {
    const tree = useGeologicTree()
    function onSelect(param:Selection) {
        const next_selection = {
            id : tree.root.id,
            pid : tree.root.id,
            name: tree.root.data.name,
            fallthrought : param.fallthrought,
            action : param.action,
            child : param,
        }
        if(selection && is_focus && selectionEquality(selection,next_selection)) {
            setSelection(undefined)
            setFocus(false)
        }else {
            if(next_selection.action === SelectionAction.focus) {
                setFocus(true)
            }
            setSelection(next_selection)
        }
    }
    function r_onSelect(param:Selection) {
        param.action = SelectionAction.highlight
        setSelection(param)
        setFocus(false)
    }
    const [selection,setSelection] = useState<Selection | undefined>()
    const [is_focus,setFocus] = useState<boolean>(false)
    return (
    <div className="w-full border-4 border-slate-200 rounded-md" onMouseLeave={() => {
        if(!is_focus) {
            setSelection(undefined)
        }
    }}>
        <Cell 
            id={tree.root.id}
            pid={tree.root.id}
            lid={undefined}
            rid={undefined}
            className="w-full"
            onSelect={r_onSelect}
            is_focus={is_focus}
            appearance={BlockAppereance.full}
            highlight={true}
            color={tree.root.data.color} 
            name={tree.root.data.name} />
        <div className="w-full flex flex-row max-w-full overflow-hidden transition-all duration-100 ease-in-out ">
            {Array.from(tree.root.branches)
                .map(([id,branch]) => {   
                    const next_selection = nextSelection(id,tree.root.id,selection)
                    
                    return (
                        <Block 
                            key={id} 
                            pid={tree.root.id} 
                            id={id} 
                            onSelect={onSelect}
                            status={statusOf(branch,next_selection)}
                            selection={next_selection}
                            lid={branch.left_id}
                            rid={branch.right_id}
                            is_focus={is_focus}
                            branch={branch} />
                    )
                })
            }
        </div>
    </div>
    )
}

enum BlockAppereance {
    reduced,
    full,
    hidden,
}

type BlockStatus = {
    highlight : boolean
    appearance : BlockAppereance 
}
type Selection = {
    name : string
    id:GeoID
    pid:GeoID
    fallthrought ?: boolean
    unselected ?: boolean
    must_falthrought ?: boolean
    child ?: Selection
    action : SelectionAction
}
function selectionEquality(sel1:Selection,sel2:Selection) : boolean {
    if(sel1.id !== sel2.id) return false;
    if(sel1.child) {
        if(sel2.child) {
            return selectionEquality(sel1.child,sel2.child)
        }
        return false
    }else {
        if(sel2.child) return false
        return true
    }
}
enum SelectionAction {
    focus,
    highlight
}

function nextSelection(id:GeoID,pid:GeoID,selection:Selection|undefined):Selection|undefined {
    if(!selection) return undefined
    if(pid === selection.id) {
        if(selection.child) {
            if(id === selection.child.id) return selection.child
        }else {
            if( selection.fallthrought) {
                return {
                    ...selection,
                    id,
                    pid,
                    must_falthrought : true
                }
            }
        }
    }
    if(selection.child) {
        return {
            ...selection.child,
            unselected : true
        }
    }
    return {
        ...selection,
        unselected : true
    }
}

function statusOf(branch:GeoBranch,selection:Selection|undefined):BlockStatus {
    if(selection === undefined) {
        return {
            highlight:true,
            appearance : BlockAppereance.full
        }
    }
    if(selection.action === SelectionAction.focus && (branch.right_id === selection.id || branch.left_id === selection.id)) {
        return {
            highlight:false,
            appearance : BlockAppereance.reduced
        }
    }
    if(selection.unselected) {
        return {
            highlight:false,
            appearance : selection.action === SelectionAction.focus ? BlockAppereance.hidden : BlockAppereance.full
        }
    }
    if(selection.must_falthrought || branch.id === selection.id) {
        return {
            highlight:true,
            appearance : BlockAppereance.full
        }
    }
    return {
        highlight:false,
        appearance : selection.action === SelectionAction.focus ? BlockAppereance.hidden : BlockAppereance.full
    }
}

type BlockProps = {
    id : GeoID,
    pid : GeoID,
    lid:GeoID|undefined
    rid:GeoID|undefined
    branch : GeoBranch
    selection : Selection | undefined
    onSelect : (param:Selection) => void
    status : BlockStatus
    is_focus:boolean
}

function Block({id,pid,lid,rid,branch,onSelect,selection,status,is_focus}:BlockProps) {

    function b_onSelect(param:Selection) {
        onSelect({
            id,
            pid,
            name:branch.data.name,
            fallthrought : param.fallthrought,
            action : param.action,
            child : param,
        })
    }

    if(branch.branches.size === 0) {
        return (
            <Cell key={id} 
                id = {branch.id}
                pid = {pid}
                lid={branch.left_id}
                rid={branch.right_id}
                highlight={status.highlight}
                is_focus={is_focus}
                appearance={status.appearance}
                onSelect={onSelect}
                className="w-full"
                color={branch.data.color} 
                name={branch.data.name} />
        )
    }
    
    return (
        <div className={`
            ${status.appearance === BlockAppereance.full ? "w-full":''}
            ${status.appearance === BlockAppereance.hidden ? "hidden":''}
            ${status.appearance === BlockAppereance.reduced ? "w-[2em] h-10":''}
            grow truncate transition-all duration-100 ease-in-out `} key={id}>
            <Cell key={id} 
                id = {branch.id}
                pid = {pid}
                lid={branch.left_id}
                rid={branch.right_id}
                className="w-full"
                onSelect={onSelect}
                is_focus={is_focus}
                appearance={status.appearance}
                highlight={status.highlight}
                color={branch.data.color} 
                name={branch.data.name} />
            <div className="w-full flex flex-row grow truncate transition-all duration-100 ease-in-out ">
                {Array.from(branch.branches)
                    .map(([sub_id,sub_branch]) => {
                        const next_selection = nextSelection(sub_id,id,selection)
                        return (
                            <Block 
                            key={sub_id} 
                            id={sub_id} 
                            onSelect={b_onSelect}
                            status={statusOf(sub_branch,next_selection)}
                            selection={next_selection}
                            lid={sub_branch.left_id}
                            rid={sub_branch.right_id}
                            pid={branch.id}
                            is_focus={is_focus}
                            branch={sub_branch}/>
                        )
                    })
                }
            </div>
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
    onSelect : (param:Selection) => void
    appearance : BlockAppereance,
    is_focus : boolean
    highlight : boolean
}

function Cell({className,color,name,id,pid,lid,rid,onSelect,highlight,is_focus,appearance}:CellProps) {
    const div_ref = useRef<HTMLDivElement>(null)
    return (
        <div 
            ref={div_ref}
            className={`cursor-pointer truncate text-clip tracking-widest 
            small-caps py-1 text-slate-900 text-center ${className ?? ""}
            border border-slate-200 ${!highlight ? "brightness-50":""}
            transition-all duration-100 ease-in-out 
            `}
            style={{backgroundColor:color, maxWidth: '100%'}}
            onMouseOver={()=> {
                if(appearance === BlockAppereance.full && !is_focus) {
                    onSelect({
                        id,
                        pid,
                        name,
                        fallthrought:false,
                        action:SelectionAction.highlight,
                    })
                }
            }}
            onClick={() => {                
                onSelect({
                    id,
                    pid,
                    name,
                    fallthrought:true,
                    action:SelectionAction.focus,
                })
            }}
            >
            {appearance === BlockAppereance.full ? name :name.charAt(0)}
        </div>
    )
}
