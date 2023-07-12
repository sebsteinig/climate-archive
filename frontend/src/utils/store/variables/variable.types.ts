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
    winds
}


type Variable = {
    active : boolean
    name : VariableName
}

export type Currents = Variable & {
}
export interface CurrentsSlice extends Currents {
    toggle : () => void
}

export type Clt = Variable & {
}
export interface CltSlice extends Clt {
    toggle : () => void
}

export type Height = Variable & {
}
export interface HeightSlice extends Height {
    toggle : () => void
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
}
export interface PrSlice extends Pr {
    toggle : () => void
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
}
export interface TosSlice extends Tos {
    toggle : () => void
}

export type Winds = Variable & {
}
export interface WindsSlice extends Winds {
    toggle : () => void
}

