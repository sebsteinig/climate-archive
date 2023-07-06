"use client";
import { useState, useEffect, useRef } from 'react'
import { searchPublication } from '@/utils/api/api';
import FilterPublication from './filters/FilterPublication';
import FilterLabels from './filters/FilterLabels';
import FilterAdvanced from './filters/FilterAdvanced';
import {Publication,PublicationShort} from './publication';
import { DefaultParameter, SearchPublication } from '@/utils/api/types';

function useOutsideClick(ref: HTMLDivElement, onClickOut: () => void){
    useEffect(() => {
        if (ref) {
            const onClick = ({target}: any) => {
                if(target.parentNode && target.parentNode.parentNode && !ref.contains(target)) {
                    !ref.contains(target) && onClickOut?.()
                }
            }
            document.addEventListener("click", onClick);
            return () => document.removeEventListener("click", onClick);
        }
    }, [ref, onClickOut]);
}

function MoreOptions({filters,setRequestFilters,load}:{filters:SearchPublication,setRequestFilters:(filters:SearchPublication) => void,
    load:(x:{exp_ids:string[],variables:string[]} & {paramaters : DefaultParameter}) => void}) {
    return  (
        <div >

            <FilterPublication filters={filters} setRequestFilters={setRequestFilters}/>
            {/* <FilterLabels setRequestFilters={setRequestFilters}/> */}
            <FilterAdvanced load={load}/>

            <span />
        </div>
    )
}

async function load({exp_ids,variables,paramaters}:{exp_ids:string[],variables:string[]} & {paramaters : DefaultParameter}){
    console.log({exp_ids,variables,paramaters});

}

export default function SearchBar() {
    const [search_panel_visible,setSearchPanelVisible] = useState(false)
    const [searched_content, setSearchContent] = useState<string>("")
    const search_panel_ref = useRef<HTMLDivElement>(null)
    const [publications,setPublications] = useState<Publication[]>([])
    const [display_more_options,setDisplayMoreOptions] = useState(false)

    const [requestFilters,setRequestFilters] = useState<SearchPublication>({})

    useOutsideClick(search_panel_ref.current!, () => {
        setSearchPanelVisible(false)
        setSearchContent("")
    });

    useEffect(
        () => {
        let ignore = false;
        if (searched_content !== "" ) {
            searchPublication({
                ...requestFilters,
                title: searched_content,
            })?.then((data) => 
                    setPublications(data)
                ).catch(

                )
        }else {
            setPublications([])
        }
        return () => {
            ignore = true;
        };
    }
    ,[searched_content, requestFilters])

    return (
        <div className="bg-slate-700 p-5 rounded-md " ref={search_panel_ref}>
            <div  
             onClick={() => setSearchPanelVisible(true)}
             >
                <input  
                    className='w-full bg-transparent hover:placeholder:opacity-90  placeholder:text-emerald-300 placeholder:opacity-70 outline-none placeholder:tracking-wider'
                    type="text"
                    name="searchbar" 
                    id="searchbar" 
                    placeholder="Search a publication ..." 
                    value={searched_content} 
                    onChange={(e) => setSearchContent(e.target.value)}
                    onClick={() => setSearchPanelVisible(true)}
                />
                {search_panel_visible && 
                    <div className='overflow-y-auto overflow-x-hidden max-h-96' >
                        <p  className='text-right text-emerald-300'
                            onClick={() => {setDisplayMoreOptions((prev) => !prev)}}
                        >More options ...</p>
                        {
                        display_more_options && 
                        <MoreOptions   
                            filters={requestFilters}
                            setRequestFilters={(filters:SearchPublication) => {
                                setRequestFilters((prev) => {
                                    return {
                                        ...prev,
                                        ...filters,
                                    }
                                })
                            }} 
                            load={load}/>
                        }
                        { publications.length > 0 && 
                            <p >
                                {`${publications.length} result${publications.length > 1 ? "s" : ""} ...`}
                            </p>
                        }
                        <div>
                            {
                                publications.length > 0 && 
                                publications.slice(0,5).map((publication: Publication,idx:number) => {
                                    return (
                                        <PublicationShort key={idx}
                                            title={publication.title} 
                                            year={publication.year} 
                                            authors_short={publication.authors_short}
                                            authors_full={publication.authors_full}
                                            abstract={publication.abstract}
                                            journal={publication.journal}
                                            exps={publication.exps}
                                            load={load}
                                        />
                                    )
                                })
                            }
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}