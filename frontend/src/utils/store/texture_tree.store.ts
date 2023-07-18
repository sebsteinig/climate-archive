import { enableMapSet  } from "immer";
import { StateCreator } from "zustand";
import { TextureBranch, TextureLeaf, TextureTree } from "../texture_provider/texture_provider.types";
import { VariableName } from "./variables/variable.types";
import { Collection, Publication } from "../types";
enableMapSet()


export interface TextureTreeSlice {
    texture_tree : TextureTree,
    collections : {
        current ?: Publication | Collection
        store : (Publication | Collection)[]
    }
    current ?: string,
    addCollection : (collection:(Collection|Publication)) => void
    push : ((branch : TextureBranch) => void),
    pushAll :((branches : TextureBranch[]) => void)
}

function pushBranchToTree(branch:TextureBranch,tree:TextureTree) {
    const element = tree.get(branch.exp_id)
    if(element){
        const variables = element.get(branch.variable)
        if(!variables){
            element.set(branch.variable, branch)
        } 
    } else{
        tree.set(branch.exp_id, new Map().set(branch.variable, branch))
    }
}

export function findInTree(exp_id:string,variable:VariableName,tree:TextureTree) {
    const element = tree.get(exp_id)
    if(element){
        const variables = element.get(variable)
        if(variables){
            return variables
        } 
    }
    return undefined
}

export const createTextureTreeSlice : StateCreator<TextureTreeSlice,[["zustand/immer",never]],[],TextureTreeSlice> = 
    (set) => {
        return {
            texture_tree : new Map(),
            current : undefined,
            collections : {
                store : []
            },
            addCollection : (collection : (Collection | Publication)) => {
                set(state => {
                    state.collections.store.push(collection)
                    state.collections.current = collection
                })
            },
            push : (branch : TextureBranch) => {
                set((state) =>{
                    pushBranchToTree(branch,state.texture_tree)
                })
            },
            pushAll : (branches : TextureBranch[]) => {
                set((state) =>{
                    state.current = branches[0].exp_id
                    branches.forEach((branch) => {
                        pushBranchToTree(branch,state.texture_tree)
                    })                
                })
            }
        }
    }

