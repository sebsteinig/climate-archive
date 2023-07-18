import { texture_provider } from "@/utils/texture_provider/TextureProvider";
import { Time, TimeDirection, TimeMode, TimeResult, TimeResultValue } from "./time.type";
import { VariableName } from "../variables/variable.types";



export async function nextCircular(time:Time,current:TimeResult,  delta:number,active_variable:VariableName[]):Promise<TimeResult> {
    if(time.mode === TimeMode.mean) {
        const new_res = new Map<VariableName,TimeResultValue>()
        for (let variable of active_variable) {
            const res = current.get(variable)
            if (!res) {
                continue;
            }
            
            let new_weight = (res.weight + delta)
            if (new_weight < 1) {
                new_res.set(variable,
                    {
                        current : res.current,
                        next : res.next,
                        weight : new_weight,
                    }
                )
                continue;
            } 
            new_weight = 0
            const new_current = res.next

            const didx = time.direction === TimeDirection.forward ? 1 : -1

            const new_idx = (res.next.idx + didx) % time.exps.length
            const new_exp = time.exps[new_idx]
            const new_info = await texture_provider.getInfo(new_exp,variable)

            const new_next = {
                idx : new_idx,
                exp : new_exp,
                info : new_info,
                frame : res.current.frame, // only in mean => takes the first and only frame of each texture
                time_chunk : res.current.time_chunk, // only in mean => takes the first and only chunks of each texture
            }
            new_res.set(variable,
                {
                    current : new_current,
                    next : new_next,
                    weight : new_weight,
                }
            )
        }
        return new_res;
    }else { // mode ts
        const new_res = new Map<VariableName,TimeResultValue>()
        for (let variable of active_variable) {
            const res = current.get(variable)
            if (!res) {
                continue;
            }
            let new_weight = (res.weight + delta)
            if (new_weight < 1) {
                new_res.set(variable,
                    {
                        current : res.current,
                        next : res.next,
                        weight : new_weight,
                    }
                )
                continue;
            } 
            new_weight = 0
            const new_current = res.next

            const ts_chunks_size = res.current.info.paths_ts.paths[0].grid[0].length
            const frames_size = res.current.info.timesteps / ts_chunks_size

            const didx = time.direction === TimeDirection.forward ? 1 : -1

            let new_frame = res.next.frame + didx
            let new_time_chunk = res.next.time_chunk 

            let new_idx = res.next.idx
            let new_exp = time.exps[new_idx]
            let new_info = res.next.info
            
            if (new_frame >= frames_size) {
                new_frame = 0
                new_time_chunk += 1
                if ( new_time_chunk === ts_chunks_size) {
                    // end of the ts for the current exp
                    new_idx = (res.next.idx + 1) % time.exps.length
                    new_exp = time.exps[new_idx]
                    new_info = await texture_provider.getInfo(new_exp,variable)
                    new_time_chunk = 0
                }
            }else if( new_frame < 0) {
                new_frame = frames_size - 1
                new_time_chunk -= 1
                if ( new_time_chunk < 0) {
                    new_idx = (res.next.idx - 1) % time.exps.length
                    new_exp = time.exps[new_idx]
                    new_info = await texture_provider.getInfo(new_exp,variable)

                    const new_ts_chunks_size = new_info.paths_ts.paths[0].grid[0].length
                    new_time_chunk = new_ts_chunks_size - 1
                }
            }

            const new_next = {
                idx : new_idx,
                exp : new_exp,
                info : new_info,
                frame : new_frame,
                time_chunk : new_time_chunk,
            }
            new_res.set(variable,
                {
                    current : new_current,
                    next : new_next,
                    weight : new_weight,
                }
            )
        }
        return new_res;
    }
}

// export function nextWalk(time:Time,current:TimeResult,  delta:number,active_variable:VariableName[]):TimeResult {

// }

// export function nextOnce(time:Time,current:TimeResult,  delta:number,active_variable:VariableName[]):TimeResult {

// }