import { StateCreator } from "zustand"


export type VariableSlice =  {
    variables : {
        currents : CurrentsSlice,
    }
}

export const createVariableSlice: StateCreator<VariableSlice,[["zustand/immer",never]],[],VariableSlice> = 
(set) => {
    return {
        variables : {
            currents : {
                active : false,
                name : "currents",
                toggle : () => set((state) => {
                    console.log(`toggle ${state.variables.currents.active} -> ${!state.variables.currents.active}`);
                    
                    state.variables.currents.active = !state.variables.currents.active
                })
            },
        }
    }
}
