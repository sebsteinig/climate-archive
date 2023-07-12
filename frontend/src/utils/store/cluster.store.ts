import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { VariableSlice, createVariableSlice } from "./variables/variable.store";
import { TextureTreeSlice, createTextureTreeSlice } from "./texture_tree.store";

type Store = VariableSlice & TextureTreeSlice


export const useClusterStore =  create<Store,[["zustand/immer",never]]>(
    immer(
    (...a) => {
        return {
            ...createVariableSlice(...a),
            ...createTextureTreeSlice(...a),
        }
    })
)