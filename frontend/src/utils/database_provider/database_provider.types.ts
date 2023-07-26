import { VariableName } from "../store/variables/variable.types"

export type RequestTexture = {
  exp_id: string
  variables?: string[]

  chunk_time?:
    | {
        lower_bound: number
        upper_bound: number
      }
    | number
  chunk_vertical?:
    | {
        lower_bound: number
        upper_bound: number
      }
    | number

  resolution?: {
    x: number
    y: number
  }
  config_name?: string
  extension?: string
  lossless?: boolean
  nan_value_encoding?: number
  threshold?: number
}

export type RequestMultipleTexture = {
  exp_ids: string[]
  variables?: string[]

  chunk_time?:
    | {
        lower_bound: number
        upper_bound: number
      }
    | number
  chunk_vertical?:
    | {
        lower_bound: number
        upper_bound: number
      }
    | number

  resolution?: {
    x: number
    y: number
  }
  config_name?: string
  extension?: string
  lossless?: boolean
  nan_value_encoding?: number
  threshold?: number
}

export type TextureLeaf = {
  paths: {
    grid: string[][]
  }[]
}

export type TextureBranch = {
  exp_id: string
  variable: VariableName
  mean: TextureLeaf
  ts: TextureLeaf
}

export type TextureTree = Map<string, Map<VariableName, TextureBranch>>
