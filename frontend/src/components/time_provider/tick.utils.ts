import { TextureInfo } from "@/utils/database/database.types"
import { database_provider } from "@/utils/database_provider/DatabaseProvider"
import { TimeFrameState, TimeMode } from "@/utils/store/time/time.type"
import { LRUCache } from "lru-cache"
import { CanvasRef } from "./useCanvas"
import { TickData } from "./tick"

export function getPath(
mode: TimeMode,
data: TimeFrameState,
info: TextureInfo,
): [string, string] {
    let current_path: string
    let next_path: string
    switch (mode) {
        case TimeMode.mean:
        current_path =
        info.paths_mean.paths[0].grid[0][data.current.time_chunk]
        next_path = info.paths_mean.paths[0].grid[0][data.next.time_chunk]
        return [current_path, next_path]
        case TimeMode.ts:
        current_path =
        info.paths_ts.paths[0].grid[0][data.current.time_chunk]
        next_path = info.paths_ts.paths[0].grid[0][data.next.time_chunk]
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

function surf(
departure: number,
current: number,
weight: number,
destination: number,
): number {
return 0
}



export async function compute(data:TimeFrameState,canvas:CanvasRef) : Promise<TickData|undefined>{
    const [current_path, next_path] = getPath(
        TimeMode.ts,
        data,
        data.info,
      )
    const current_texture = await database_provider.getTexture(current_path)
    const next_texture = await database_provider.getTexture(next_path)

    const current_blob = new Blob([current_texture.image], {
    type: "image/png",
    })
    const next_blob = new Blob([next_texture.image], { type: "image/png" })

    const current_bitmap = await createImageBitmap(current_blob)
    const next_bitmap = await createImageBitmap(next_blob)
    if (!canvas.current|| !canvas.current.current.ctx || !canvas.current.next.ctx) {
        return
    }

    const current_url = crop(
        canvas.current.current.canvas,
        canvas.current.current.ctx,
        current_bitmap,
        current_path,
        data.current.frame,
        0,
        data.info.xsize,
        data.info.ysize,
    )
    const next_url = crop(
        canvas.current.next.canvas,
        canvas.current.next.ctx,
        next_bitmap,
        next_path,
        data.next.frame,
        0,
        data.info.xsize,
        data.info.ysize,
    )
    return {
        current_url,
        next_url,
        info: data.info,
    }
}