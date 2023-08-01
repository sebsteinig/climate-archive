import {
  TimeFrameRef,
  TimeID,
  WorldData,
} from "@/utils/store/time/time.type"
import { VariableName } from "@/utils/store/variables/variable.types"
import { CanvasRef } from "./useCanvas"
import { PanelRef } from "./time_panel/panel"
import { MutableRefObject, RefObject } from "react"
import { update } from "@/utils/store/time/time.utils"
import { TextureInfo } from "@/utils/database/database.types"
import { compute, getPath } from "./tick.utils"
import { database_provider } from "@/utils/database_provider/DatabaseProvider"

export type TickData =       {
  current_url: string
  next_url: string
  info: TextureInfo
}

export type TickFn = (delta:number) => Promise<{
  weight:number,
  variables : Map<VariableName,TickData>
}>

export function tickBuilder(
  time_id: TimeID,
  panel_ref : RefObject<PanelRef>,
  data: WorldData,
  current_frame: TimeFrameRef,
  active_variables: VariableName[],
  canvas: CanvasRef,
) : TickFn{




  return async function tick(delta: number) {
    const res:Map<VariableName,TickData> = new Map()
    let frame = current_frame.current.get(time_id)
    if(!frame) return {
      weight:0,
      variables:res
    }
    if(frame.swap_flag) {
      if(!frame.swapping) {
        frame.swapping = true
        
        await update(frame,active_variables)
        
        for(let [variable,state] of frame.variables) {
          const data = await compute(state,canvas)
          if(data) {
            res.set(variable,data)
          }
        }
        panel_ref.current?.controller_ref.current?.onChange(frame)
        frame.swapping = false
        frame.swap_flag = false
      }
    }
    panel_ref.current?.input_ref.current?.onWeightUpdate(frame)
    return {
      weight:frame.weight,
      variables:res
    }
  }
}


// return async function tick(delta: number) {
//   let frame = current_frame.current.get(time_id, collection_id)
//   if (
//     !frame ||
//     !frame.initialized ||
//     time.state === TimeState.paused ||
//     time.state === TimeState.stopped ||
//     time.state === TimeState.zero ||
//     time.state === TimeState.ready
//   ) {
//     return new Map()
//   }
//   if (time.state === TimeState.surfing) {
//     const [current_pos, weight] = getCurrentPos(time, frame)
//     const surfing_rate = surf(
//       time.surfing_departure,
//       current_pos,
//       weight,
//       time.surfing_destination,
//     )
//     current_frame.current.update(
//       await next(time, exps, frame, surfing_rate, active_variable),
//       time_id,
//       collection_id,
//     )
//   } else if (
//     time.state === TimeState.playing ||
//     time.state === TimeState.pinning
//   ) {
//     frame = current_frame.current.update(
//       await next(time, exps, frame, delta, active_variable),
//       time_id,
//       collection_id,
//     )
//     if (time.state === TimeState.pinning && frame.weight === 0) {
//         pauseTime(time_id)
//     }
//   }

//   const res = new Map()

//   if ( !frame.swap_flag) {
//     onChange(frame)
//     return res
//   }

//   for (let [variable, data] of frame.variables) {
//     const [current_path, next_path] = getPath(
//       time.mode,
//       data,
//       data.current.info,
//       data.next.info,
//     )

//     const current_texture = await database_provider.getTexture(current_path)
//     const next_texture = await database_provider.getTexture(next_path)

//     const current_blob = new Blob([current_texture.image], {
//       type: "image/png",
//     })
//     const next_blob = new Blob([next_texture.image], { type: "image/png" })

//     const current_bitmap = await createImageBitmap(current_blob)
//     const next_bitmap = await createImageBitmap(next_blob)
//     if (!context.current.ctx || !context.next.ctx) {
//       continue
//     }

//     const current_url = crop(
//       context.current.canvas,
//       context.current.ctx,
//       current_bitmap,
//       current_path,
//       data.current.frame,
//       0,
//       data.current.info.xsize,
//       data.current.info.ysize,
//     )
//     const next_url = crop(
//       context.next.canvas,
//       context.next.ctx,
//       next_bitmap,
//       next_path,
//       data.next.frame,
//       0,
//       data.next.info.xsize,
//       data.next.info.ysize,
//     )

//     res.set(variable, {
//       current_url,
//       next_url,
//       weight: frame.weight,
//       current_info: data.current.info,
//       next_info: data.next.info,
//     })
//   }
//   onChange(frame)
//   return res
// }