"use client";
import { useState, useEffect, useRef } from 'react'
import { searchPublication } from '@/utils/api/api';
import FilterPublication from './filters/FilterPublication';
import FilterLabels from './filters/FilterLabels';
import FilterAdvanced from './filters/FilterAdvanced';
import {Publication,PublicationShort} from './publication';
import { DefaultParameter, SearchPublication } from '@/utils/api/api.types';
import Image from 'next/image';
import SearchIcon from "$/assets/icons/magnifying-glass-emerald-400.svg";
import ArrowUp from "$/assets/icons/arrow-up-emerald-400.svg";
import ArrowDown from "$/assets/icons/arrow-down-emerald-400.svg";
import { FullWidthSeparator, MdSeparator } from '../separators/separators';
import { RequestMultipleTexture, RequestTexture, TextureLeaf, TextureInfo } from '@/utils/texture_provider/texture_provider.types';
import { texture_provider } from '@/utils/texture_provider/TextureProvider';
import { PropsWithChildren } from "react"
import { useClusterStore } from '@/utils/store/cluster.store';

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

type MoreOptionsProps = {
    filters:SearchPublication,
    setRequestFilters:(filters:SearchPublication) => void,
    load:(x:RequestMultipleTexture) => void
}

function MoreOptions({filters,setRequestFilters,load,children}:PropsWithChildren<MoreOptionsProps>) {
    return  (
        <div >

            <FilterPublication filters={filters} setRequestFilters={setRequestFilters}>{children}</FilterPublication>
            <br />
            {/* <FilterLabels setRequestFilters={setRequestFilters}/> */}
            <FilterAdvanced load={load}/>
            <br />
        </div>
    )
}

type Props = {
    
}

async function load(update: (x:TextureLeaf[]) => void,request:RequestMultipleTexture){
    const res = await texture_provider.loadAll({
        exp_ids:request.exp_ids,
        variables:request.variables,
    })
    update(res.flat())
}

export default function SearchBar({children}:PropsWithChildren<Props>) {
    const [search_panel_visible,setSearchPanelVisible] = useState(false)
    const [searched_content, setSearchContent] = useState<string>("")
    const search_panel_ref = useRef<HTMLDivElement>(null)
    const [publications,setPublications] = useState<Publication[]>([])
    const [display_more_options,setDisplayMoreOptions] = useState(false)

    const [requestFilters,setRequestFilters] = useState<SearchPublication>({})

    const updateTextureTree = useClusterStore((state) => state.pushAll)


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
                            mb-4
                            placeholder:tracking-wider`}
                            
                        type="text"
                        name="searchbar" 
                        id="searchbar" 
                        placeholder="Search a publication ..." 
                        value={searched_content} 
                        onChange={(e) => setSearchContent(e.target.value)}
                        onClick={() => setSearchPanelVisible(true)}
                    />
                    <FullWidthSeparator className='mb-2'/>
                    {search_panel_visible && 
                        <>  
                            <div className='block text-end'>
                                <p  className='text-right text-emerald-300 inline-flex'
                                    onClick={() => {setDisplayMoreOptions((prev) => !prev)}}
                                >More options {
                                    display_more_options ?
                                    <Image 
                                        priority
                                        alt='close'
                                        className={`w-4 h-4 self-center ml-4`}
                                        src={ArrowUp}
                                    /> :
                                    <Image
                                        priority
                                        alt='open'
                                        className={`w-4 h-4 self-center ml-4`}
                                        src={ArrowDown} 
                                    />
                                }
                                </p>
                            </div>
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
                                load={(x) => {load(updateTextureTree,x)}}>
                                    {children}
                                </MoreOptions>
                            }
                            { 
                                publications.length > 0 && 
                                <>  
                                    <br />
                                    {display_more_options && <MdSeparator className='block self-center'/>}
                                    <p className='text-slate-400'>
                                        {`${publications.length} result${publications.length > 1 ? "s" : ""} ...`}
                                    </p>
                                    <br />
                                </>
                            }
                        </>
                    }
                </div>
                {search_panel_visible && 
                    <div className='overflow-y-auto overflow-x-hidden max-h-96' >
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
                                            load={(x) => {load(updateTextureTree,x)}}
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