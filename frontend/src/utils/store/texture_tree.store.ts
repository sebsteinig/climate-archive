import { enableMapSet  } from "immer";
import { StateCreator } from "zustand";
import { TextureLeaf, TextureTree } from "../texture_provider/texture_provider.types";
enableMapSet()

export interface TextureTreeSlice {
    texture_tree : TextureTree,
    current ?: string,
    push : ((leaf : TextureLeaf) => void),
    pushAll :((leaves : TextureLeaf[]) => void)
}

export const createTextureTreeSlice : StateCreator<TextureTreeSlice,[["zustand/immer",never]],[],TextureTreeSlice> = 
    (set) => {
        return {
            texture_tree : {root : new Map()},
            current : undefined,
            push : ((leaf : TextureLeaf) => set((state) =>{
                const element = state.texture_tree.root.get(leaf.exp_id)
                if(element){
                    const variables = element.get(leaf.variable)
                    if(variables){
                        variables.push(leaf)
                    } else{
                        element.set(leaf.variable, [leaf])
                    }
                } else{
                    state.texture_tree.root.set(leaf.exp_id, new Map().set(leaf.variable, [leaf]))
                }
            })),
            pushAll : ((leaves : TextureLeaf[]) => set((state) =>{
                state.current = leaves[0].exp_id
                leaves.forEach((leaf) => {
                    const element = state.texture_tree.root.get(leaf.exp_id)
                    if(element){
                        const variables = element.get(leaf.variable)
                        if(variables){
                            variables.push(leaf)
                        } else{
                            element.set(leaf.variable, [leaf])
                        }
                    } else{
                        state.texture_tree.root.set(leaf.exp_id, new Map().set(leaf.variable, [leaf]))
                    }
                })                
            }))
        }
    }

