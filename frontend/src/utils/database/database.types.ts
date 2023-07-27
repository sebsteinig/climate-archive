import { Experiments, Publication } from "../types"

export class TextureInfo {
  exp_id!: string
  variable!: string

  paths_ts!: {
    paths: {
      grid: string[][]
    }[]
  }
  paths_mean!: {
    paths: {
      grid: string[][]
    }[]
  }

  resolution?: {
    x: number
    y: number
  }
  levels!: number
  timesteps!: number
  xsize!: number
  xfirst!: number
  xinc!: number
  ysize!: number
  yfirst!: number
  yinc!: number
  //metadata! : Object
  created_at!: string
  config_name!: string
  extension!: string
  lossless!: boolean
  nan_value_encoding!: number
  threshold!: number
}
export class Texture {
  path!: string
  image!: ArrayBuffer
}

export class Collection {
  data!: Publication | Experiments
  id?: number
}
