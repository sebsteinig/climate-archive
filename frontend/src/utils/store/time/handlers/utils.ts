import { texture_provider } from "@/utils/texture_provider/TextureProvider";
import { VariableName } from "../../variables/variable.types";
import { Time, TimeDirection, TimeFrame, TimeFrameValue, TimeMode } from "../time.type";
import { TextureInfo } from "@/utils/database/Texture";

export function chunksDetails(info:TextureInfo):[number,number] {
    const cs = info.paths_ts.paths[0].grid[0].length // number of chunks
    const fs = info.timesteps / cs
    return [cs,fs]
}

function computeRatio(ref:TimeFrameValue) : number {
    const [_,fpc] = chunksDetails(ref.current.info)
    const ts = ref.current.info.timesteps
    const f = ref.current.frame
    const c = ref.current.time_chunk

    return (f+c*fpc)/ts
}

function computeFramePos(ratio:number,timesteps:number,fpc:number):[number,number] {
    const tmp_frame = Math.floor(timesteps * ratio)
    const time_chunk = Math.floor(tmp_frame / fpc)
    const frame = tmp_frame % fpc
    return [frame,time_chunk]
}

async function peekNextTs(
    exps:string[],
    variable:VariableName,
    nb_c:number,
    fpc:number,
    current_frame:number,
    current_chunk:number,
    current_idx:number,):Promise<[number,number,number,string,TextureInfo]>{
        let next_idx = current_idx
        let next_chunk = current_chunk
        let next_frame = current_frame + 1
        if (next_frame >= fpc) {
            next_frame = 0
            next_chunk += 1
        }
        if ( current_chunk >= nb_c) {
            next_chunk = 0
            next_idx = (next_idx + 1) % exps.length
        }
        const info = await texture_provider.getInfo(exps[next_idx],variable)
        return [next_frame,next_chunk,next_idx,exps[next_idx],info]
}

async function peekPreviousTs(
    exps:string[],
    variable:VariableName,
    nb_c:number,
    fpc:number,
    current_frame:number,
    current_chunk:number,
    current_idx:number,):Promise<[number,number,number,string,TextureInfo]>{
        let next_idx = current_idx
        let next_chunk = current_chunk
        let next_frame = current_frame - 1
        if (next_frame < 0) {
            next_frame = fpc - 1
            next_chunk -= 1
        }
        let info = await texture_provider.getInfo(exps[next_idx],variable)
        if ( current_chunk < 0) {
            next_idx = (exps.length + next_idx - 1) % exps.length
            info = await texture_provider.getInfo(exps[next_idx],variable)
            const [new_nb_c,new_fpc] = chunksDetails(info) 
            next_chunk = new_nb_c - 1
            next_frame = new_fpc - 1 
        }
        return [next_frame,next_chunk,next_idx,exps[next_idx],info]
}

async function syncMean(time:Time,frame:TimeFrame,active_variable:VariableName[]):Promise<TimeFrame> {
    const sync_frame : TimeFrame = {
        variables : new Map(),
        initialized : true,
    }
    const [_,ref] = frame.variables.entries().next().value as [VariableName, TimeFrameValue]
    
    const didx = time.direction === TimeDirection.forward ? 1 : -1
    
    for( let variable of active_variable) {
        const res = frame.variables.get(variable)
        if(res) {
            sync_frame.variables.set(variable,res)
            continue;
        }
        const current_info = await texture_provider.getInfo(ref.current.exp,variable)
        const current = {
            idx : ref.current.idx,
            exp : ref.current.exp,
            info : current_info,
            time_chunk : 0, // because mean => no chunks
            frame : 0, // same here 
        }

        const next_idx = (ref.current.idx + didx) % time.exps.length
        const next_exp = time.exps[next_idx]
        const next_info = await texture_provider.getInfo(next_exp,variable)
        
        const next = {
            idx : next_idx,
            exp: next_exp,
            info : next_info,
            time_chunk : 0, 
            frame : 0,
        }
        sync_frame.variables.set(variable,
            {
                current,
                next,
                weight:ref.weight
            }
        )

    }
    return sync_frame
}

async function syncTs(time:Time,frame:TimeFrame,active_variable:VariableName[]):Promise<TimeFrame> {
    const sync_frame : TimeFrame = {
        variables : new Map(),
        initialized : true,
    }    
    const [_,ref] = frame.variables.entries().next().value as [VariableName, TimeFrameValue]
    
    for( let variable of active_variable) {
        const res = frame.variables.get(variable)
        if(res) {
            sync_frame.variables.set(variable,res)
            continue;
        }
        const current_info = await texture_provider.getInfo(ref.current.exp,variable)

        const ratio = computeRatio(ref)
        const [nb_c,fpc] = chunksDetails(current_info)

        const [current_frame,current_chunk] = computeFramePos(ratio,current_info.timesteps,fpc)

        const current = {
            idx : ref.current.idx,
            exp : ref.current.exp,
            info : current_info,
            time_chunk : current_chunk,
            frame : current_frame,
        }
        let next_frame,next_chunk,next_idx,next_exp,next_info;
        if (time.direction === TimeDirection.forward ) {
            [next_frame,next_chunk,next_idx,next_exp,next_info] = await peekNextTs(time.exps,variable,nb_c,fpc,current_frame,current_chunk,ref.current.idx)
        }else {
            [next_frame,next_chunk,next_idx,next_exp,next_info] = await peekPreviousTs(time.exps,variable,nb_c,fpc,current_frame,current_chunk,ref.current.idx)
        }

        const next = {
            idx : next_idx,
            exp: next_exp,
            info : next_info,
            time_chunk : next_chunk, 
            frame : next_frame,
        }
        sync_frame.variables.set(variable,
            {
                current,
                next,
                weight:ref.weight
            }
        )
    }
    return sync_frame
}

export async function sync(time:Time,frame:TimeFrame,active_variable:VariableName[]):Promise<TimeFrame> {
    switch (time.mode) {
        case TimeMode.mean:
            return await syncMean(time,frame,active_variable)
        case TimeMode.ts:
            return await syncTs(time,frame,active_variable)
    }
}

export async function initMean(time:Time,active_variable:VariableName[]):Promise<TimeFrame> {
    const frame:TimeFrame = {
        variables: new Map(),
        initialized : true,
    }
    let idx_zero:number
    let idx_one:number
    switch (time.direction) {
        case TimeDirection.forward:
            idx_zero = 0
            idx_one = 1
            break;
        case TimeDirection.backward:
            idx_zero = time.exps.length - 1
            idx_one = time.exps.length - 2 
            break;
        }
    let exp_zero = time.exps[idx_zero]
    let exp_one = time.exps[idx_one]
    for( let variable of active_variable) {

        const info_zero = await texture_provider.getInfo(exp_zero,variable)
        const info_one = await texture_provider.getInfo(exp_one,variable)

        const value : TimeFrameValue = {
            current : {
                exp : exp_zero,
                idx : idx_zero,
                info : info_zero,
                frame : 0,
                time_chunk : 0.
            },
            next : {
                exp : exp_one,
                idx : idx_one,
                info : info_one,
                frame : 0,
                time_chunk : 0.
            },
            weight : 0
        }
        frame.variables.set(variable,value)
    }
            return frame
}
export async function initTs(time:Time,active_variable:VariableName[]):Promise<TimeFrame> {
    const frame:TimeFrame = {
        variables: new Map(),
        initialized : true,
    }
    let idx:number

    switch (time.direction) {
        case TimeDirection.forward:
            idx = 0
            break;
        case TimeDirection.backward:
            idx = time.exps.length - 1
            break;
    }
    let exp= time.exps[idx]

    for( let variable of active_variable) {
        const info = await texture_provider.getInfo(exp,variable)
        const ts = info.timesteps
        const [cs,fs] = chunksDetails(info)

        let frame_zero : number
        let chunks_zero : number
        let frame_one : number
        let chunks_one : number

        switch (time.direction) {
            case TimeDirection.forward:
                frame_zero = 0
                chunks_zero = 0
                if( fs > 1) {
                    frame_one = 1
                    chunks_one = 0
                }else {
                    frame_one = 0
                    chunks_one = 1
                }
                break;
            case TimeDirection.backward:
                idx = time.exps.length - 1
                if( fs > 1) {
                    frame_zero = fs - 1
                    chunks_zero = cs - 1
                    chunks_one = cs - 1
                    frame_one = fs - 2
                }else {
                    frame_zero = 0
                    frame_one = 0
                    chunks_zero = cs - 1
                    chunks_one = cs - 2
                }
                break;
        }

        const value : TimeFrameValue = {
            current : {
                exp,
                idx,
                info,
                frame : frame_zero,
                time_chunk : chunks_zero,
            },
            next : {
                exp,
                idx,
                info,
                frame : frame_one,
                time_chunk : chunks_one,
            },
            weight : 0
        }
        frame.variables.set(variable,value)
    }
    return frame
}