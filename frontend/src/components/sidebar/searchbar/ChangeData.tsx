import ButtonSecondary from '@/components/buttons/ButtonSecondary';
import { useEffect, useState } from 'react'
import { Publication, isPublication, Collection } from '../../../utils/types';
import { useClusterStore } from '@/utils/store/cluster.store';
import { MdSeparator } from '@/components/separators/separators';

type Props = {
    display_details : boolean
    current_details : Publication|Collection
    hover : boolean
}

export function ChangeData({display_details, current_details, hover} : Props){
    const [collections, setCurrent] = useClusterStore((state) => [state.collections, state.setCurrent])
    const [other_data, setOtherData] = useState<(Publication|Collection)[]>([])
    const [hover_single_element, setHoverSingleElement] = useState(false)
    useEffect(() =>{
        if (current_details){
            setOtherData(collections.store.filter((element) => differentFromCurrent(element, current_details)))    
        }
    }, [current_details] )
    if (other_data.length > 0){
        return(
            <div>
                {(display_details || hover) && <div className='pt-2' >
                    <MdSeparator className=' block self-center'/>
                    <h4 className='py-3'>Change Data : </h4>
                    {other_data.map((element : Publication | Collection, idx : number)=> {
                            return(
                                <div key={idx} onMouseOver = {() => setHoverSingleElement(true)}
                                onMouseLeave={() => setHoverSingleElement(false)}
                                className='border-s-4 group border-sky-300 m-2 px-4 hover:opacity-100 opacity-80'>
                                    <p className="font-semibold text-sky-200">{isPublication(element) ? element.title:"Collection"}</p>
                                    {isPublication(element) &&
                                        <p className="italic text-right text-slate-400">{`${element.authors_short} (${element.year})`}</p>}
                                    
                                        <ButtonSecondary onClick={() => {
                                            setCurrent(element)
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
    return(<></>)
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