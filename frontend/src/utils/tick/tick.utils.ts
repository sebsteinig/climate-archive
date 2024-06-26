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

  const cacheLabel = `getCache ${Date.now()}`;
  console.time(cacheLabel);
  let res = cache.get(JSON.stringify({ path, frame, vertical }))
  console.timeEnd(cacheLabel);
  if (res) {
    console.log(res)
    return res
  }

  console.log('cropping')
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
  };

  const calculateMinMax = (matrix, index, isMax) => {
    if (mean) {
      const sum = matrix.reduce((acc, val) => acc + parseFloat(isMax ? val.max : val.min), 0);
      return sum / matrix.length;
    } else {
      return parseFloat(isMax ? matrix[index].max : matrix[index].min);
    }
  };

  const min = metadata.metadata.map(m => {
    const matrix = m.bounds_matrix_ts;
  
    if (matrix.length === 1) {
      // Use original logic for matrices with only one row
      return [Array(matrix[0].length).fill(0).map((_, index) => calculateMinMax(matrix[0], index, false))];
    } else {
      // Use new logic for matrices with multiple rows
      return matrix.map(row =>
        Array(row.length).fill(0).map((_, index) => calculateMinMax(row, index, false))
      );
    }
  });
  
  const max = metadata.metadata.map(m => {
    const matrix = m.bounds_matrix_ts;
  
    if (matrix.length === 1) {
      // Use original logic for matrices with only one row
      return [Array(matrix[0].length).fill(0).map((_, index) => calculateMinMax(matrix[0], index, true))];
    } else {
      // Use new logic for matrices with multiple rows
      return matrix.map(row =>
        Array(row.length).fill(0).map((_, index) => calculateMinMax(row, index, true))
      );
    }
  });
  
  
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
};


async function getTextureFromPath(
  path: string,
  time: number,
  vertical: number,
  info: TextureInfo,
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
) {
          
  const texture = await database_provider.getTexture(path)

  // const blob = new Blob([texture.image], {
  //   type: `image/${info.extension.toLowerCase()}`,
  // })
  // const bmpLabel = `create bitmap for world ${Date.now()}`;
  // console.time(bmpLabel);
  // const bitmap = await createImageBitmap(blob, 0, 0, 10, 10)
  // console.timeEnd(bmpLabel);

  // const cropLabel = `ccrop for world ${Date.now()}`;
  // console.time(cropLabel);

  // Convert the Blob into an ObjectURL
  // const imageURL = URL.createObjectURL(texture.image);


  // const url = crop(
  //   canvas,
  //   ctx,
  //   img,
  //   path,
  //   time,
  //   vertical,
  //   info.xsize,
  //   info.ysize,
  // )
  // console.timeEnd(cropLabel);
  return texture
}

async function getTextureFromPathCrop(
  path: string,
  time: number,
  vertical: number,
  info: TextureInfo,
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
) {
          

  const textureLabel = `getTexture ${Date.now()}`;
  console.time(textureLabel);
  const texture = await database_provider.getTexture(path)
  console.log(texture)
  console.timeEnd(textureLabel);

  return new Promise((resolve, reject) => {
    const img = new Image();


    img.onload = function() {
      try {
        const url = crop(
          canvas,
          ctx,
          img,
          path,
          time,
          vertical,
          info.xsize,
          info.ysize,
        );
      
        console.log(url)
        resolve(url); // resolve the Promise with the url
      } catch(error) {
        reject(error); // in case of any errors during the crop, reject the Promise
      }
    };

    img.onerror = function() {
      reject(new Error("Error loading the image."));
    };
    
    img.src = URL.createObjectURL(texture.image)
    
  });
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
    !canvas.current.current.ctx
  ) {
    return
  }

  let current_frame: number
  let current_info: TextureInfo
  if (world_data.time.mode === TimeMode.mean) {
    current_frame = 0
    current_info = data.mean!.current.info
  } else {
    current_frame = data.ts!.current.frame
    current_info = data.ts!.info
  }
  
  const textures = await Promise.all(
    paths.map(async ({ current_path }) => {
      const current_url = await getTextureFromPath(
        current_path,
        current_frame,
        0,
        current_info,
        canvas.current!.current.canvas,
        canvas.current!.current.ctx!,
      )

      return {
        current_url,
      }
    }),
  )

  console.log(data)

  if (world_data.time.mode === TimeMode.mean) {
    return {
      textures,
      info: processInfo(variable, 0, 0, data.mean!.current.info, true),
    }
  } else {
    const [_, fpc] = chunksDetails(data.ts!.info)
    const current_t = data.ts!.current.frame + data.ts!.current.time_chunk * fpc

    // should return a single texture and info with field min/max for each timestep
    return {
      textures,
      info: processInfo(variable, current_t, 0, data.ts!.info),
    }
  }
}
