export enum EVarID {
  clt,
  currents,
  height,
  liconc,
  mlotst,
  pfts,
  pr,
  sic,
  snc,
  tas,
  tos,
  winds,
}
export const ALL_VARIABLES = [
  EVarID.clt,
  EVarID.currents,
  EVarID.height,
  EVarID.liconc,
  EVarID.mlotst,
  EVarID.pfts,
  EVarID.pr,
  EVarID.sic,
  EVarID.snc,
  EVarID.tas,
  EVarID.tos,
  EVarID.winds,
] as const

type Variable = {
  name: EVarID
}

export type Currents = Variable & {
  animation_speed: number
  reference_speed: number
  arrows: number
  arrows_size: number
  scale_by_magnitude: boolean
  color_by_magnitude: boolean
  colormap: string
}
export interface CurrentsSlice extends Currents {
  updateColormap: (value: string) => void
  updateAnimationSpeed: (value: number) => void
  updateReferenceSpeed: (value: number) => void
  updateArrows: (value: number) => void
  updateArrowsSize: (value: number) => void
  toggleScaleByMagnitude: () => void
  toggleColorByMagnitude: () => void
}

export type Clt = Variable & {}
export interface CltSlice extends Clt {}

export type Height = Variable & {
  diplacement: number
  colormap: string
}
export interface HeightSlice extends Height {
  updateColormap: (value: string) => void
  updateDiplacement: (value: number) => void
}

export type Liconc = Variable & {}
export interface LiconcSlice extends Liconc {}

export type Mlotst = Variable & {}
export interface MlotstSlice extends Mlotst {}

export type Pfts = Variable & {}
export interface PftsSlice extends Pfts {}

export type Pr = Variable & {
  min: number
  max: number
  colormap: string
  colormap_index: number
  anomaly_range: number
}
export interface PrSlice extends Pr {
  updateColormap: (value: string, index: number) => void
  updateMin: (value: number) => void
  updateMax: (value: number) => void
  updateAnomalyRange: (value: number) => void
}

export type Sic = Variable & {}
export interface SicSlice extends Sic {}

export type Snc = Variable & {}
export interface SncSlice extends Snc {}

export type Tas = Variable & {}
export interface TasSlice extends Tas {}

export type Tos = Variable & {
  min: number
  max: number
  anomaly_range: number
  anomalies_lower_bound: number
  sea_ice: boolean
  colormap: string
}
export interface TosSlice extends Tos {
  updateColormap: (value: string) => void
  updateMin: (value: number) => void
  updateMax: (value: number) => void
  updateAnomalyRange: (value: number) => void
  updateAnomaliesLowerBound: (value: number) => void
  toggleSeaIce: () => void
}

export type Winds = Variable & {
  animation_speed: number
  reference_speed: number
  min_speed: number
  arrows: number
  arrows_size: number
  scale_by_magnitude: boolean
  color_by_magnitude: boolean
  colormap: string
}
export interface WindsSlice extends Winds {
  updateColormap: (value: string) => void
  updateAnimationSpeed: (value: number) => void
  updateReferenceSpeed: (value: number) => void
  updateMinSpeed: (value: number) => void
  updateArrows: (value: number) => void
  updateArrowsSize: (value: number) => void
  toggleScaleByMagnitude: () => void
  toggleColorByMagnitude: () => void
}
