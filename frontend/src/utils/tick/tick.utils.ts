import { TextureInfo } from "@/utils/database/database.types"
import { database_provider } from "@/utils/database_provider/DatabaseProvider"
import {
  TimeFrameState,
  TimeMode,
  WorldData,
} from "@/utils/store/worlds/time/time.type"
import { LRUCache } from "lru-cache"
import { TickData, TickDataState } from "./tick"
import { EVarID } from "@/utils/store/variables/variable.types"
import { CanvasRef } from "../hooks/useCanvas"
import { chunksDetails } from "../store/worlds/time/time.utils"

export function getPath(
  mode: TimeMode,
  data: TimeFrameState,
  vertical: number,
): { current_path: string; next_path: string }[] {
  if (mode === TimeMode.mean) {
    if (!data.mean?.current || !data.mean.next) return []
    const currents = data.mean!.current.info.paths_mean.paths.map((path) => {
      const paths = path.grid[vertical]
      return {
        current_path: paths[0].replaceAll(".ts.", ".avg."),
      }
    })
    const nexts = data.mean!.next.info.paths_mean.paths.map((path) => {
      const paths = path.grid[vertical]
      return {
        next_path: paths[0].replaceAll(".ts.", ".avg."),
      }
    })
    const res = []
    for (let i = 0; i < currents.length; i++) {
      res.push({
        current_path: currents[i].current_path,
        next_path: nexts[i].next_path,
      })
    }
    return res
  } else {
    if (!data.ts?.current || !data.ts.next) return []
    return data.ts!.info.paths_ts.paths.map((path) => {
      let paths: string[]
      if (path.grid.length > vertical) {
        paths = path.grid[vertical]
      } else {
        paths = path.grid[0]
      }
      if (paths.length === 1) {
        return {
          current_path: paths[0],
          next_path: paths[0],
        }
      }
      return {
        current_path: paths[data.ts!.current.time_chunk],
        next_path: paths[data.ts!.next.time_chunk],
      }
    })
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
  // res = canvas.toDataURL("image/png")
  res = canvas.toDataURL("image/webp")
  cache.set(JSON.stringify({ path, frame, vertical }), res)
  return res
}

function processInfo(
  variable: EVarID,
  t: number,
  z: number,
  info: TextureInfo,
  mean?: boolean,
): TickDataState {
  const metadata = info.metadata as {
    metadata: {
      bounds_matrix: {
        max: string
        min: string
      }[][]
    }[]
  }
  const bound_matrices = metadata.metadata.map((m) => m.bounds_matrix)

  const min = bound_matrices.map((matrix) => {
    if (mean) {
      const sum = matrix[z].reduce((acc, val) => acc + parseFloat(val.min), 0)
      const average = sum / matrix[z].length
      return average
    } else {
      const _z = matrix.length > z ? z : 0
      const _t = matrix[_z].length > t ? t : 0
      return parseFloat(matrix[_z][_t].min)
    }
  })
  const max = bound_matrices.map((matrix) => {
    if (mean) {
      const sum = matrix[z].reduce((acc, val) => acc + parseFloat(val.max), 0)
      const average = sum / matrix[z].length
      return average
    } else {
      const _z = matrix.length > z ? z : 0
      const _t = matrix[_z].length > t ? t : 0
      return parseFloat(matrix[_z][_t].max)
    }
  })
  return {
    min,
    max,
    levels: info.levels,
    timesteps: info.timesteps,
    xsize: info.xsize,
    xfirst: info.xfirst,
    xinc: info.xinc,
    ysize: info.ysize,
    yfirst: info.yfirst,
    yinc: info.yinc,
    nan_value_encoding: info.nan_value_encoding,
  }
}

async function getTextureFromPath(
  path: string,
  time: number,
  vertical: number,
  info: TextureInfo,
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
) {
  const texture = await database_provider.getTexture(path)
  const blob = new Blob([texture.image], {
    type: `image/${info.extension.toLowerCase()}`,
  })
  const bitmap = await createImageBitmap(blob)
  const url = crop(
    canvas,
    ctx,
    bitmap,
    path,
    time,
    vertical,
    info.xsize,
    info.ysize,
  )
  return url
}

export async function compute(
  variable: EVarID,
  data: TimeFrameState,
  canvas: CanvasRef,
  world_data: WorldData,
): Promise<TickData | undefined> {
  const paths = getPath(world_data.time.mode, data, 0)
  if (paths.length === 0) return
  if (
    !canvas.current ||
    !canvas.current.current.ctx ||
    !canvas.current.next.ctx
  ) {
    return
  }

  let current_frame: number
  let next_frame: number
  let current_info: TextureInfo
  let next_info: TextureInfo
  if (world_data.time.mode === TimeMode.mean) {
    current_frame = 0
    current_info = data.mean!.current.info
    next_frame = 0
    next_info = data.mean!.next.info
  } else {
    current_frame = data.ts!.current.frame
    next_frame = data.ts!.next.frame
    current_info = data.ts!.info
    next_info = data.ts!.info
  }

  const textures = await Promise.all(
    paths.map(async ({ current_path, next_path }) => {
      const current_url = await getTextureFromPath(
        current_path,
        current_frame,
        0,
        current_info,
        canvas.current!.current.canvas,
        canvas.current!.current.ctx!,
      )
      const next_url = await getTextureFromPath(
        next_path,
        next_frame,
        0,
        next_info,
        canvas.current!.next.canvas,
        canvas.current!.next.ctx!,
      )

      return {
        current_url,
        next_url,
      }
    }),
  )
  if (world_data.time.mode === TimeMode.mean) {
    return {
      textures,
      current: processInfo(variable, 0, 0, data.mean!.current.info, true),
      next: processInfo(variable, 0, 0, data.mean!.current.info, true),
    }
  } else {
    const [_, fpc] = chunksDetails(data.ts!.info)
    const current_t = data.ts!.current.frame + data.ts!.current.time_chunk * fpc
    const next_t = data.ts!.next.frame + data.ts!.next.time_chunk * fpc

    return {
      textures,
      current: processInfo(variable, current_t, 0, data.ts!.info),
      next: processInfo(variable, next_t, 0, data.ts!.info),
    }
  }
}
