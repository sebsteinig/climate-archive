import { Time, TimeFrame } from "@/utils/store/time/time.type";
import { nextBuilder } from "@/utils/store/time/time.utils";
import { VariableName } from "@/utils/store/variables/variable.types";


export function tickBuilder(time:Time,frame:TimeFrame,active_variable:VariableName[]){
    const next = nextBuilder(time)
    return async function tick(delta:number) {
        //console.log('tick');
        frame = await next(time,frame,delta,active_variable)
        return new Map()
    }
}
