import { enableMapSet  } from "immer";
import { StateCreator } from "zustand";
import { TextureBranch, TextureLeaf, TextureTree } from "../texture_provider/texture_provider.types";
import { VariableName } from "./variables/variable.types";
import { Collection, Publication } from "../types";
enableMapSet()


export interface TextureTreeSlice {
    texture_tree : TextureTree,
    collections :  Map<number,Publication | Collection>,
    __collections_lookup : Map<Publication | Collection,number>
    displayed_collections : Set<number>,
    addCollection : (collection:(Collection|Publication)) => void
    push : ((branch : TextureBranch) => void),
    pushAll :((branches : TextureBranch[]) => void)
    displayCollection:((idx : number) => void)
    hideCollection:((idx : number) => void)
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
            collections : new Map(),
            __collections_lookup : new Map(),
            displayed_collections : new Set(),
            addCollection : (collection : (Collection | Publication)) => {
                set(state => {
                    let idx  = state.__collections_lookup.get(collection)
                    if ( ! idx){
                        idx = state.collections.size
                        state.collections.set(idx,collection)
                    }
                    state.displayed_collections.add(idx)
                })
            },
            push : (branch : TextureBranch) => {
                set((state) =>{
                    pushBranchToTree(branch,state.texture_tree)
                })
            },
            pushAll : (branches : TextureBranch[]) => {
                set((state) =>{
                    branches.forEach((branch) => {
                        pushBranchToTree(branch,state.texture_tree)
                    })                
                })
            },
            displayCollection : (idx : number) => {
                set((state) =>{
                    if(state.collections.has(idx)) {
                        state.displayed_collections.add(idx)
                    }
                })
            },
            hideCollection : (idx : number) => {
                set((state) =>{
                    if(state.collections.has(idx)) {
                        state.displayed_collections.delete(idx)
                    }
                })
            }
        }
    }

