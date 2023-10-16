import {
  TimeFrameRef,
  WorldID,
  WorldData,
} from "@/utils/store/worlds/time/time.type"
import { EVarID } from "@/utils/store/variables/variable.types"
import { MutableRefObject, RefObject } from "react"
import { TextureInfo } from "@/utils/database/database.types"
import { compute, getPath } from "./tick.utils"
import { database_provider } from "@/utils/database_provider/DatabaseProvider"
import { PanelRef } from "@/components/worlds_manager/world_panel/Panel"
import { CanvasRef } from "../hooks/useCanvas"
import { useStore } from "@/utils/store/store"
import { jumpTo } from "@/utils/store/worlds/time/loop"

export type TickDataState = {
  min: number[]
  max: number[]
  levels: number
  timesteps: number
  xsize: number
  xfirst: number
  xinc: number
  ysize: number
  yfirst: number
  yinc: number
  nan_value_encoding: number
}

export type TickData = {
  textures: {
    current_url: string
    next_url: string
  }[]
  current: TickDataState
  next: TickDataState
}

export type TickFn = (delta: number) => Promise<{
  weight: number
  update_texture: boolean
  uSphereWrapAmount: number
  variables: Map<EVarID, TickData>
  reference?: Map<EVarID, TickData>
}>

export function tickBuilder(
  world_id: WorldID,
  panel_ref: RefObject<PanelRef>,
  world_data: WorldData,
  current_frame: TimeFrameRef,
  active_variables: EVarID[],
  canvas: CanvasRef,
): TickFn {

  const worlds = useStore((state) => state.worlds)

  return async function tick(delta: number) {
    const res: Map<EVarID, TickData> = new Map()
    let frame = current_frame.current.get(world_id)
    if (!frame)
      return {
        weight: 0,
        update_texture: false,
        uSphereWrapAmount: 0,
        variables: res,
      }
    let update_texture = false

    // console.log(world_id, frame.weight)
    // handle play/pause loop animation
    if (worlds.animated_world !== undefined) {
      // only update the world selected by the user (i.e. key world)
      // and sync other worlds with the key world
      if (world_id == worlds.animated_world) {
        jumpTo(frame, frame.weight + delta, false)
      } else {
        let targetWeight = current_frame.current.get(worlds.animated_world)?.weight
        jumpTo(frame, targetWeight, false)
      }
    } 

    if (frame.swap_flag) {

      if (!frame.swapping) {
        frame.swapping = true
        update_texture = true

        // const updateLabel = `update frame for world ${world_id}-${Date.now()}`;
        // console.time(updateLabel);

        frame = await current_frame.current.update(
          world_id,
          world_data,
          active_variables,
        )
        // console.timeEnd(updateLabel);
        //await update(frame, active_variables, world_data)



        for (let [variable, state] of frame.variables) {
        
          const computeLabel = `compute texture for world ${world_id} and variable ${variable} ${Date.now()}`;
          console.time(computeLabel);
          const data = await compute(variable, state, canvas, world_data)
          console.log(data)
          console.timeEnd(computeLabel);

          if (data) {
            res.set(variable, data)
          }
        }


        if (world_id === current_frame.current._observed_id) {
          current_frame.current.saveReference(res)
        }
        panel_ref.current?.controller_ref.current?.onChange(frame)
        panel_ref.current?.container_ref.current?.controller.onChange(frame)
        frame.swapping = false
        frame.swap_flag = false
      } else {
        // console.log("skipping frame")
      }
    }

    // if (update_texture) {
    //   console.log(res)
    //   console.log(current_frame.current.reference)
    // }
    // console.log(update_texture)

    // console.log(frame.weight)
    panel_ref.current?.controller_ref.current?.onWeightUpdate(frame)
    return {
      weight: frame.weight,
      uSphereWrapAmount: frame.uSphereWrapAmount,
      update_texture: update_texture,
      variables: res,
      reference: world_id === current_frame.current._observed_id ? null : current_frame.current.reference,
    }
  }
}
