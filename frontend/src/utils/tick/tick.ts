import { TimeFrameRef, WorldID, WorldData } from "@/utils/store/worlds/time.type"
import { EVarID } from "@/utils/store/variables/variable.types"
import { MutableRefObject, RefObject } from "react"
import { update } from "@/utils/store/worlds/world.utils"
import { TextureInfo } from "@/utils/database/database.types"
import { compute, getPath } from "./tick.utils"
import { database_provider } from "@/utils/database_provider/DatabaseProvider"
import { PanelRef } from "@/components/worlds_manager/world_panel/Panel"
import { CanvasRef } from "../hooks/useCanvas"

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
}>

export function tickBuilder(
  world_id: WorldID,
  panel_ref: RefObject<PanelRef>,
  world_data: WorldData,
  current_frame: TimeFrameRef,
  active_variables: EVarID[],
  canvas: CanvasRef,
): TickFn {
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

    if (frame.swap_flag) {
      if (!frame.swapping) {
        frame.swapping = true
        update_texture = true
        await update(frame, active_variables, world_data)

        for (let [variable, state] of frame.variables) {
          const data = await compute(variable, state, canvas, world_data)
          if (data) {
            res.set(variable, data)
          }
        }
        panel_ref.current?.controller_ref.current?.onChange(frame)
        panel_ref.current?.container_ref.current?.controller.onChange(frame)
        frame.swapping = false
        frame.swap_flag = false
      }
    }
    panel_ref.current?.controller_ref.current?.onWeightUpdate(frame)
    return {
      weight: frame.weight,
      uSphereWrapAmount: frame.uSphereWrapAmount,
      update_texture: update_texture,
      variables: res,
    }
  }
}
