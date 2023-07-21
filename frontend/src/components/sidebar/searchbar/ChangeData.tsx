import ButtonSecondary from '@/components/buttons/ButtonSecondary';
import { useEffect, useMemo, useState } from 'react'
import { Publication, isPublication, Collection } from '../../../utils/types';
import { useClusterStore } from '@/utils/store/cluster.store';
import { MdSeparator } from '@/components/separators/separators';

type Props = {
    display_details : boolean
    current_details : {collection : Publication|Collection, idx : number}
    hover : boolean
}

export function ChangeData({display_details, current_details, hover} : Props){
    const [collections, displayCollection] = useClusterStore((state) => [state.collections, state.displayCollection])
    const other_data = useMemo(()=>collections.map((e,idx) => {return {idx,collection:e}}).filter((e) => e.idx !== current_details.idx ),[collections])
    if (other_data.length > 0){
        return(
            <div>
                {(display_details || hover) && <div className='pt-2' >
                    <MdSeparator className=' block self-center'/>
                    <h4 className='py-3'>Change Data : </h4>
                    {other_data.map(({collection,idx} : {collection : Publication | Collection, idx : number}, key : number)=> {
                            return(
                                <div key={key} className='border-s-4 group border-sky-300 m-2 px-4 hover:opacity-100 opacity-80'>
                                    <p className="font-semibold text-sky-200">{isPublication(collection) ? collection.title:"Collection"}</p>
                                    {isPublication(collection) &&
                                        <p className="italic text-right text-slate-400">{`${collection.authors_short} (${collection.year})`}</p>}                                    
                                    <ButtonSecondary onClick={() => {
                                        displayCollection(idx)
                                    }} className='hidden group-hover:block'>LOAD
                                    </ButtonSecondary>                                    
                                </div>
                            )
                        }
                    )}
                </div>}            
            </div>
        )
    }
    return null
}


function differentFromCurrent(element : Publication | Collection, current : Publication | Collection){
    if (isPublication(element) && isPublication(current)){
        return element.title !== current.title
    }
    if(!isPublication(element) && !isPublication(current)){
        if (element.exps.length != current.exps.length){
            return true
        } else {
            let different = false
            let i = 0
            while(!different && i<element.exps.length){
                if (!current.exps.includes(element.exps[i])){
                    different = true
                }
                i++
            }
            return different
        }
    }
    return true
}