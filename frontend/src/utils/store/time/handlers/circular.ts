import { VariableName } from "../../variables/variable.types";
import { Time, TimeDirection, TimeFrame, TimeMode } from "../time.type";

async function nextCircularMean(time:Time,frame:TimeFrame,delta:number,active_variable:VariableName[]):Promise<TimeFrame> {

}

async function nextCircularTs(time:Time,frame:TimeFrame,delta:number,active_variable:VariableName[]):Promise<TimeFrame> {

}

export function nextCircular(time:Time,frame:TimeFrame,delta:number,active_variable:VariableName[]):Promise<TimeFrame> {
    switch (time.mode) {
        case TimeMode.mean:
            return nextCircularMean(time,frame,delta,active_variable)
        case TimeMode.ts :
            return nextCircularTs(time,frame,delta,active_variable)
    }
}
