export enum VariableName {
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


type Variable = {
    active : boolean
    name : VariableName
}

export type Currents = Variable & {
    animation_speed : number
    reference_speed : number
    arrows : number
    arrows_size : number
    scale_by_magnitude : boolean
    color_by_magnitude : boolean
}
export interface CurrentsSlice extends Currents {
    toggle : () => void
    updateAnimationSpeed : (value : number) => void
    updateReferenceSpeed : (value : number) => void
    updateArrows : (value : number) => void
    updateArrowsSize : (value : number) => void
    toggleScaleByMagnitude : () => void
    toggleColorByMagnitude : () => void
}

export type Clt = Variable & {
}
export interface CltSlice extends Clt {
    toggle : () => void
}

export type Height = Variable & {
    diplacement : number
}
export interface HeightSlice extends Height {
    toggle : () => void
    updateDiplacement: (value : number) => void
}

export type Liconc = Variable & {
}
export interface LiconcSlice extends Liconc {
    toggle : () => void
}

export type Mlotst = Variable & {
}
export interface MlotstSlice extends Mlotst {
    toggle : () => void
}

export type Pfts = Variable & {
}
export interface PftsSlice extends Pfts {
    toggle : () => void
}

export type Pr = Variable & {
    min : number
    max : number
}
export interface PrSlice extends Pr {
    toggle : () => void
    updateMin : (value : number) => void
    updateMax : (value : number) => void
}

export type Sic = Variable & {
}
export interface SicSlice extends Sic {
    toggle : () => void
}

export type Snc = Variable & {
}
export interface SncSlice extends Snc {
    toggle : () => void
}

export type Tas = Variable & {
}
export interface TasSlice extends Tas {
    toggle : () => void
}

export type Tos = Variable & {
    min : number
    max : number
    anomaly_range : number
    anomalies_lower_bound : number
    sea_ice : boolean
}
export interface TosSlice extends Tos {
    toggle : () => void
    updateMin : (value : number) => void
    updateMax : (value : number) => void
    updateAnomalyRange : (value : number) => void
    updateAnomaliesLowerBound : (value : number) => void
    toggleSeaIce : () => void
}

export type Winds = Variable & {
    animation_speed : number
    reference_speed : number
    min_speed : number
    arrows : number
    arrows_size : number
    scale_by_magnitude : boolean
    color_by_magnitude : boolean
}
export interface WindsSlice extends Winds {
    toggle : () => void
    updateAnimationSpeed : (value : number) => void
    updateReferenceSpeed : (value : number) => void
    updateMinSpeed : (value : number) => void
    updateArrows : (value : number) => void
    updateArrowsSize : (value : number) => void
    toggleScaleByMagnitude : () => void
    toggleColorByMagnitude : () => void
}

