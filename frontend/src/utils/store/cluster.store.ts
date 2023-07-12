import { StateCreator, create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { VariableSlice, createVariableSlice } from "./variables/variable.store";
import { SearchTexture } from "../texture_provider/texture_provider.types";

interface SearchTextureSlice {
    searchTextures : SearchTexture[],
    updateSearchTextures : ((searchTextures : SearchTexture[]) => void)
}
const createSearchTextureSlice : StateCreator<SearchTextureSlice,[["zustand/immer",never]],[],SearchTextureSlice> = 
    (set) => {
        return {
            searchTextures : [],
            updateSearchTextures : 
                (searchTextures : SearchTexture[]) => 
                set((state) => {
                    state.searchTextures.push(...searchTextures)
                })
        }
    }


type Store = VariableSlice & SearchTextureSlice


export const useClusterStore =  create<Store,[["zustand/immer",never]]>(
    immer(
    (...a) => {
        return {
            ...createVariableSlice(...a),
            ...createSearchTextureSlice(...a),
        }
    })
)