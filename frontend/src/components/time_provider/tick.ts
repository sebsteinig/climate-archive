import { TextureInfo } from "@/utils/database/database.types"
import { database_provider } from "@/utils/database_provider/DatabaseProvider"
import {
  Time,
  TimeFrame,
  TimeFrameValue,
  TimeMode,
  TimeState,
} from "@/utils/store/time/time.type"
import { nextBuilder } from "@/utils/store/time/time.utils"
import { VariableName } from "@/utils/store/variables/variable.types"

import { Experiment } from "@/utils/types"
import { LRUCache } from "lru-cache"

export type CanvasHolder = {
  current: {
    canvas: HTMLCanvasElement
    ctx: CanvasRenderingContext2D | null
  }
  next: {
    canvas: HTMLCanvasElement
    ctx: CanvasRenderingContext2D | null
  }
}

export function getPath(
  mode: TimeMode,
  data: TimeFrameValue,
  current_branch: TextureInfo,
  next_branch: TextureInfo,
): [string, string] {
  let current_path: string
  let next_path: string
  switch (mode) {
    case TimeMode.mean:
      current_path =
        current_branch.paths_mean.paths[0].grid[0][data.current.time_chunk]
      next_path = next_branch.paths_mean.paths[0].grid[0][data.next.time_chunk]
      return [current_path, next_path]
    case TimeMode.ts:
      current_path = current_branch.paths_ts.paths[0].grid[0][data.current.time_chunk]
      next_path = next_branch.paths_ts.paths[0].grid[0][data.next.time_chunk]
      // console.log(
      //     {
      //         current_path,
      //         next_path,
      //         data,
      //     }
      // );

      return [current_path, next_path]
  }
}

const cache: LRUCache<string, string> = new LRUCache({
  max: 100,
})

export function crop(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  img: ImageBitmap,
  path: string,
  frame: number,
  vertical: number,
  xsize: number,
  ysize: number,
) {
  canvas.width = xsize
  canvas.height = ysize

  let res = cache.get(JSON.stringify({ path, frame, vertical }))
  if (res) {
    return res
  }
  ctx.drawImage(
    img,
    frame * xsize,
    vertical * ysize, // TODO VERTICAL
    xsize,
    ysize,
    0,
    0,
    xsize,
    ysize,
  )
  res = canvas.toDataURL("image/png")
  cache.set(JSON.stringify({ path, frame, vertical }), res)
  return res
}

export function tickBuilder(
  time: Time,
  exps: Experiment[],
  frame: TimeFrame,
  active_variable: VariableName[],
  context: CanvasHolder,
  onChange : (frame:TimeFrame) => void
) {
  const next = nextBuilder(time)
  return async function tick(delta: number) {
    if (time.state !== TimeState.playing || !frame.initialized) {
      return new Map()
    }
    //console.log('tick');
    frame = await next(time, exps, frame, delta, active_variable)
    if (!frame.initialized) {
      return new Map()
    }
    
    onChange(frame)
    const res = new Map()
    
    for (let [variable, data] of frame.variables) {
      const [current_path, next_path] = getPath(
        time.mode,
        data,
        data.current.info,
        data.next.info,
      )

      const current_texture = await database_provider.getTexture(current_path)
      const next_texture = await database_provider.getTexture(next_path)

      const current_blob = new Blob([current_texture.image], {
        type: "image/png",
      })
      const next_blob = new Blob([next_texture.image], { type: "image/png" })

      const current_bitmap = await createImageBitmap(current_blob)
      const next_bitmap = await createImageBitmap(next_blob)
      if (!context.current.ctx || !context.next.ctx) {
        continue
      }

      const current_url = crop(
        context.current.canvas,
        context.current.ctx,
        current_bitmap,
        current_path,
        data.current.frame,
        0,
        data.current.info.xsize,
        data.current.info.ysize,
      )
      const next_url = crop(
        context.next.canvas,
        context.next.ctx,
        next_bitmap,
        next_path,
        data.next.frame,
        0,
        data.next.info.xsize,
        data.next.info.ysize,
      )
        
      res.set(variable, {
        current_url,
        next_url,
        weight: data.weight,
        current_info: data.current.info,
        next_info: data.next.info,
      })
    }
    return res
  }
}
