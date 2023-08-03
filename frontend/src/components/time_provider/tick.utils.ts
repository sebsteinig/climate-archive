import { TextureInfo } from "@/utils/database/database.types"
import { database_provider } from "@/utils/database_provider/DatabaseProvider"
import { TimeFrameState, TimeMode } from "@/utils/store/time/time.type"
import { LRUCache } from "lru-cache"
import { CanvasRef } from "./useCanvas"
import { TickData, TickDataState } from "./tick"
import { VariableName } from "@/utils/store/variables/variable.types"
import { chunksDetails } from "@/utils/store/time/time.utils"

export function getPath(
    mode: TimeMode,
    data: TimeFrameState,
    vertical:number,
    info: TextureInfo,
): {current_path:string,next_path:string}[] {

    return info.paths_ts.paths.map((path)=> {
        const paths = path.grid[vertical]
        return {
            current_path:paths[data.current.time_chunk],
            next_path:paths[data.next.time_chunk],
        }
    })
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

function surf(
departure: number,
current: number,
weight: number,
destination: number,
): number {
return 0
}

function processInfo(variable:VariableName,t:number,z:number,info:TextureInfo) : TickDataState{
    const metadata = info.metadata as {
        metadata : {
            bounds_matrix:{
                max:string
                min:string
            }[][]
        }[]
    }
    const bound_matrices = metadata.metadata.map((m) => m.bounds_matrix)

    const min = bound_matrices.map(matrix => parseFloat(matrix[z][t].min))
    const max = bound_matrices.map(matrix => parseFloat(matrix[z][t].max))
    return {
        min,
        max,
        levels:info.levels,
        timesteps:info.timesteps,
        xsize:info.xsize,
        xfirst:info.xfirst,
        xinc:info.xinc,
        ysize:info.ysize,
        yfirst:info.yfirst,
        yinc:info.yinc,
        nan_value_encoding:info.nan_value_encoding,
    }
}

async function getTextureFromPath(path:string,time:number,vertical:number,info:TextureInfo,canvas:HTMLCanvasElement,ctx:CanvasRenderingContext2D) {
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

export async function compute(variable:VariableName,data:TimeFrameState,canvas:CanvasRef) : Promise<TickData|undefined>{
    const paths = getPath(
        TimeMode.ts,
        data,
        0,
        data.info,
      )
    if (!canvas.current|| !canvas.current.current.ctx || !canvas.current.next.ctx) {
        return
    }
    const textures = await Promise.all(paths.map(async ({current_path,next_path}) => {
        const current_url = await getTextureFromPath(current_path,data.current.frame,0,data.info,canvas.current!.current.canvas,canvas.current!.current.ctx!)
        const next_url = await getTextureFromPath(current_path,data.current.frame,0,data.info,canvas.current!.next.canvas,canvas.current!.next.ctx!)

        return {
            current_url,
            next_url
        }
    }))
    
    const [_, fpc] = chunksDetails(data.info)
    const current_t = data.current.frame + data.current.time_chunk*fpc
    const next_t = data.next.frame + data.next.time_chunk*fpc

    return {
        textures,
        current:processInfo(variable,current_t,0,data.info),
        next:processInfo(variable,next_t,0,data.info),
    }
}