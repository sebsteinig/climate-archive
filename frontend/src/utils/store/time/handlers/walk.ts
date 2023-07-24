import { Experiment } from "@/utils/types";
import { VariableName } from "../../variables/variable.types";
import { Time, TimeFrame, TimeMode } from "../time.type";

async function nextWalkMean(time:Time,frame:TimeFrame,delta:number,active_variable:VariableName[]):Promise<TimeFrame> {

}

async function nextWalkTs(time:Time,frame:TimeFrame,delta:number,active_variable:VariableName[]):Promise<TimeFrame> {

}


export function nextWalk(time:Time,exps:Experiment[],frame:TimeFrame,delta:number,active_variable:VariableName[]):Promise<TimeFrame> {
    switch (time.mode) {
        case TimeMode.mean:
            return nextWalkMean(time,frame,delta,active_variable)
        case TimeMode.ts :
            return nextWalkTs(time,frame,delta,active_variable)
    }
}
