import { StateCreator } from "zustand"
import { CurrentsSlice, CltSlice, HeightSlice, LiconcSlice, MlotstSlice, PftsSlice, 
    PrSlice, SicSlice, SncSlice, TasSlice, TosSlice, WindsSlice, VariableName } from "./variable.types"


export type VariableSlice =  {
    variables : {
        currents : CurrentsSlice,
        clt : CltSlice,
        height : HeightSlice,
        liconc : LiconcSlice,
        mlotst : MlotstSlice,
        pfts : PftsSlice,
        pr : PrSlice,
        sic : SicSlice,
        snc : SncSlice,
        tas : TasSlice,
        tos : TosSlice,
        winds : WindsSlice,
    }
}

export const createVariableSlice: StateCreator<VariableSlice,[["zustand/immer",never]],[],VariableSlice> = 
(set) => {
    return {
        variables : {
            currents : {
                active : false,
                name : VariableName.currents,
                toggle : () => set((state) => {state.variables.currents.active = !state.variables.currents.active})
            },
            clt : {
                active : false,
                name : VariableName.clt,
                toggle : () => set((state) => {state.variables.clt.active = !state.variables.clt.active})
            },
            height : {
                active : false,
                name : VariableName.height,
                toggle : () => set((state) => {state.variables.height.active = !state.variables.height.active})
            },
            liconc : {
                active : false,
                name : VariableName.liconc,
                toggle : () => set((state) => {state.variables.liconc.active = !state.variables.liconc.active})
            },
            mlotst : {
                active : false,
                name : VariableName.mlotst,
                toggle : () => set((state) => {state.variables.mlotst.active = !state.variables.mlotst.active})
            },
            pfts : {
                active : false,
                name : VariableName.pfts,
                toggle : () => set((state) => {state.variables.pfts.active = !state.variables.pfts.active})
            },
            pr : {
                active : false,
                name : VariableName.pr,
                toggle : () => set((state) => {state.variables.pr.active = !state.variables.pr.active})
            },
            sic : {
                active : false,
                name : VariableName.sic,
                toggle : () => set((state) => {state.variables.sic.active = !state.variables.sic.active})
            },
            snc : {
                active : false,
                name : VariableName.snc,
                toggle : () => set((state) => {state.variables.snc.active = !state.variables.snc.active})
            },
            tas : {
                active : false,
                name : VariableName.tas,
                toggle : () => set((state) => {state.variables.tas.active = !state.variables.tas.active})
            },
            tos : {
                active : false,
                name : VariableName.tos,
                toggle : () => set((state) => {state.variables.tos.active = !state.variables.tos.active})
            },
            winds : {
                active : false,
                name : VariableName.winds,
                toggle : () => set((state) => {state.variables.winds.active = !state.variables.winds.active})
            }
            
        }
    }
}
