import { findInTree } from "@/utils/store/texture_tree.store";
import { Time, TimeFrame, TimeFrameValue, TimeMode, TimeState } from "@/utils/store/time/time.type";
import { nextBuilder } from "@/utils/store/time/time.utils";
import { VariableName } from "@/utils/store/variables/variable.types";
import { texture_provider } from "@/utils/texture_provider/TextureProvider";
import { TextureBranch, TextureTree } from "@/utils/texture_provider/texture_provider.types";

export type CanvasHolder = {
    current : {
        canvas : HTMLCanvasElement
        ctx : CanvasRenderingContext2D | null
    },
    next : {
        canvas : HTMLCanvasElement
        ctx : CanvasRenderingContext2D | null
    },
}

export function getPath(mode:TimeMode,data:TimeFrameValue,current_branch:TextureBranch,next_branch:TextureBranch):[string,string] {
    let current_path:string;
    let next_path:string;
    switch (mode) {
        case TimeMode.mean:
            current_path = current_branch.mean.paths[0].grid[0][data.current.time_chunk]
            next_path = next_branch.mean.paths[0].grid[0][data.next.time_chunk]
            return [current_path,next_path]
        case TimeMode.ts:
            current_path = current_branch.ts.paths[0].grid[0][data.current.time_chunk]
            next_path = next_branch.ts.paths[0].grid[0][data.next.time_chunk]
            // console.log(
            //     {
            //         current_path,
            //         next_path,
            //         data,
            //     }
            // );
            
            return [current_path,next_path]
    }
}

export function crop(canvas:HTMLCanvasElement,
    ctx:CanvasRenderingContext2D,
    img:ImageBitmap,
    frame:number,
    vertical:number,
    xsize:number,
    ysize:number) {
    canvas.width = xsize
    canvas.height = ysize
    ctx.drawImage(img,
        frame * xsize,
        vertical * ysize, // TODO VERTICAL
        xsize,
        ysize,
        0,
        0,
        xsize,
        ysize
    )
    return canvas.toDataURL("image/png")
}

export function tickBuilder(time:Time,frame:TimeFrame,active_variable:VariableName[],tree:TextureTree,context:CanvasHolder){
    const next = nextBuilder(time)
    return async function tick(delta:number) {
        if (time.state !== TimeState.playing || !frame.initialized) {
            return new Map()
        }
        //console.log('tick');
        frame = await next(time,frame,delta,active_variable)
        if(!frame.initialized) {
            return new Map()
        }
        const res = new Map()
        for ( let [variable,data] of frame.variables ) {
            const current_branch = findInTree(data.current.exp,variable,tree)
            const next_branch = findInTree(data.next.exp,variable,tree)
            if(!current_branch || !next_branch) {
                continue;
            }
            const [current_path,next_path] = getPath(time.mode,data,current_branch,next_branch)
            
            const current_texture = await texture_provider.getTexture(current_path)
            const next_texture = await texture_provider.getTexture(next_path)


            const current_blob = new Blob([current_texture.image], { type: "image/png" });
            const next_blob = new Blob([next_texture.image], { type: "image/png" });

            const current_bitmap = await createImageBitmap(current_blob)
            const next_bitmap = await createImageBitmap(next_blob)
            if(!context.current.ctx || !context.next.ctx) {
                continue;
            }

            const current_url = crop(
                context.current.canvas,
                context.current.ctx,current_bitmap,
                data.current.frame ,
                0,
                data.current.info.xsize,
                data.current.info.ysize,
            )
            const next_url = crop(
                context.next.canvas,
                context.next.ctx,current_bitmap,
                data.next.frame ,
                0,
                data.next.info.xsize,
                data.next.info.ysize,
            )

            res.set(variable,
                {
                    current_url,
                    next_url,
                    weight : data.weight,
                    current_info : data.current.info,
                    next_info : data.next.info,
                }
            )
        }
        return res
    }
}
