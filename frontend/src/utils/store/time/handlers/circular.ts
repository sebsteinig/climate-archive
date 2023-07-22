import { texture_provider } from "@/utils/texture_provider/TextureProvider";
import { VariableName } from "../../variables/variable.types";
import { Time, TimeDirection, TimeFrame, TimeMode } from "../time.type";
import { chunksDetails, peekNextTs, peekPreviousTs, sync } from "./utils";
import { Experiment } from "@/utils/types";

async function nextCircularMean(time:Time,exps:Experiment[],frame:TimeFrame,delta:number,active_variable:VariableName[]):Promise<TimeFrame> {
    const sync_frame = await sync(time,exps,frame,active_variable)
    for( let [variable,data] of sync_frame.variables) {
            let new_weight = (data.weight + delta)
            if (new_weight < 1) {
                sync_frame.variables.set(variable,
                    {
                        current : data.current,
                        next : data.next,
                        weight : new_weight,
                    }
                )
                continue;
            } 
            new_weight = 0
            const didx = time.direction === TimeDirection.forward ? 1 : -1

            const new_current = data.next

            const new_idx = (exps.length + new_current.idx + didx) % exps.length
            const new_exp = exps[new_idx]
            const new_info = await texture_provider.getInfo(new_exp.id,variable)

            const new_next = {
                idx : new_idx,
                exp : new_exp,
                info : new_info,
                frame : data.current.frame, // only in mean => takes the first and only frame of each texture
                time_chunk : data.current.time_chunk, // only in mean => takes the first and only chunks of each texture
            }
            sync_frame.variables.set(variable,
                {
                    current : new_current,
                    next : new_next,
                    weight : new_weight,
                }
            )
    }
    return sync_frame
}

async function nextCircularTs(time:Time,exps:Experiment[],frame:TimeFrame,delta:number,active_variable:VariableName[]):Promise<TimeFrame> {
    const sync_frame = await sync(time,exps,frame,active_variable)
    for( let [variable,data] of sync_frame.variables) {
        let new_weight = (data.weight + delta)
        if (new_weight < 1) {
            sync_frame.variables.set(variable,
                {
                    current : data.current,
                    next : data.next,
                    weight : new_weight,
                }
            )
            continue;
        } 
        new_weight = 0
        const new_current = data.next

        const [nb_c,fpc] = chunksDetails(new_current.info)

        let next_frame,next_chunk,next_idx,next_exp,next_info;
        if (time.direction === TimeDirection.forward ) {
            [next_frame,next_chunk,next_idx,next_exp,next_info] = await peekNextTs(exps,variable,nb_c,fpc,new_current.frame,new_current.time_chunk,new_current.idx)
        }else {
            [next_frame,next_chunk,next_idx,next_exp,next_info] = await peekPreviousTs(exps,variable,nb_c,fpc,new_current.frame,new_current.time_chunk,new_current.idx)
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
                current:new_current,
                next,
                weight:new_weight
            }
        )

    }
    return sync_frame
}

export function nextCircular(time:Time,exps:Experiment[],frame:TimeFrame,delta:number,active_variable:VariableName[]):Promise<TimeFrame> {
    switch (time.mode) {
        case TimeMode.mean:
            return nextCircularMean(time,exps,frame,delta,active_variable)
        case TimeMode.ts :
            return nextCircularTs(time,exps,frame,delta,active_variable)
    }
}
