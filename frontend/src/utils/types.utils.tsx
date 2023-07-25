import { Experiments, Publication } from "./types"

export const isPublication = (obj :   Experiments | Publication) : obj is Publication =>{
    return (obj as Publication).title != undefined
}

export function collectionEquals(c1 : Experiments | Publication, c2 : Experiments | Publication){
    if(isPublication(c1) && isPublication(c2)){
        return (c1.title===c2.title && c1.authors_short === c2.authors_short && c1.year === c2.year)
    }
    if(!isPublication(c1) && !isPublication(c2)){
        if (c1.exps.length !== c2.exps.length){
            return false
        } else{
            let equals = true
            let i = 0
            while(equals && i<c1.exps.length){
                if (!c1.exps.includes(c2.exps[i])){
                    equals = false
                }
                i++
            }
            return equals
        }
    }
    return false
}