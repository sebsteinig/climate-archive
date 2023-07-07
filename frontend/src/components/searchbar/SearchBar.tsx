"use client";
import { useState, useEffect, useRef } from 'react'
import { searchPublication } from '@/utils/api/api';
import FilterPublication from './filters/FilterPublication';
import FilterLabels from './filters/FilterLabels';
import FilterAdvanced from './filters/FilterAdvanced';
import {Publication,PublicationShort} from './publication';
import { DefaultParameter, SearchPublication } from '@/utils/api/types';
import Image from 'next/image';
import SearchIcon from "$/assets/icons/magnifying-glass-emerald-400.svg";
import ArrowUp from "$/assets/icons/arrow-up-emerald-400.svg";
import ArrowDown from "$/assets/icons/arrow-down-emerald-400.svg";


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
        <div className={`bg-slate-700 
        p-5 m-5 
        rounded-md 
        lg:w-1/3 
        absolute top-0 right-0 lg:left-1/2 lg:-translate-x-1/2
        ${search_panel_visible && "max-sm:w-[calc(100%_-_2.5rem)]"}
        `} ref={search_panel_ref}>
            <div  
             onClick={() => setSearchPanelVisible(true)}
             >
                <Image 
                    priority
                    src={SearchIcon}
                    className={`w-8 h-8 lg:invisible lg:hidden ${search_panel_visible ? "hidden": ""}`}
                    alt="Search a publication"
                />
                <div>

                    <input  
                        className={`${search_panel_visible ?  "max-sm:block":"max-sm:hidden" }
                            w-full
                            bg-transparent 
                            hover:placeholder:opacity-90
                            placeholder:text-emerald-300 
                            placeholder:opacity-70 
                            outline-none 
                            sticky
                            top-0
                            placeholder:tracking-wider`}
                            
                        type="text"
                        name="searchbar" 
                        id="searchbar" 
                        placeholder="Search a publication ..." 
                        value={searched_content} 
                        onChange={(e) => setSearchContent(e.target.value)}
                        onClick={() => setSearchPanelVisible(true)}
                    />
                    {search_panel_visible && <p  className='text-right text-emerald-300 inline-flex sticky top-0'
                            onClick={() => {setDisplayMoreOptions((prev) => !prev)}}
                        >More options {
                            display_more_options ?
                            <Image 
                                priority
                                alt='close'
                                className={`w-4 h-4 self-center`}
                                src={ArrowUp}
                            /> :
                            <Image
                                priority
                                alt='open'
                                className={`w-4 h-4 self-center`}
                                src={ArrowDown} 
                             />
                        }
                        </p>}
                        { publications.length > 0 && 
                            <p>
                                {`${publications.length} result${publications.length > 1 ? "s" : ""} ...`}
                            </p>
                        }
                </div>
                {search_panel_visible && 
                    <div className='overflow-y-auto overflow-x-hidden max-h-96' >
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
                        <div>
                            {
                                publications.length > 0 && 
                                publications.map((publication: Publication,idx:number) => {
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