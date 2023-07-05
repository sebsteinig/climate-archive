"use client";
import { useState, useEffect, useRef } from 'react'
import Publication from './publication';
import { searchPublication } from '@/utils/api/api';
import FilterPublication from './filters/FilterPublication';
import FilterLabels from './filters/FilterLabels';
import FilterAdvanced from './filters/FilterAdvanced';

function useOutsideClick(ref: HTMLDivElement, onClickOut: () => void){
    useEffect(() => {
        if (ref) {
            const onClick = ({target}: any) => {
                //console.log(target);
                
                if(target.parentNode && target.parentNode.parentNode && !ref.contains(target)) {
                    !ref.contains(target) && onClickOut?.()
                }
            }
            document.addEventListener("click", onClick);
            return () => document.removeEventListener("click", onClick);
        }
    }, [ref]);
}

function MoreOptions() {
    return  (
        <div >

            <FilterPublication />
            <FilterLabels/>
            <FilterAdvanced />

            <span />
        </div>
    )
}

export default function SearchBar() {
    const [search_panel_visible,setSearchPanelVisible] = useState(false)
    const [searched_content, setSearchContent] = useState<string>("")
    const search_panel_ref = useRef<HTMLDivElement>(null)
    const [publications,setPublications] = useState<any[]>([])
    const [display_more_options,setDisplayMoreOptions] = useState(false)

    useOutsideClick(search_panel_ref.current!, () => {
        setSearchPanelVisible(false)
        setSearchContent("")
    });

    useEffect(
        () => {
        let ignore = false;
        if (searched_content !== "" ) {
            searchPublication({
                title: searched_content
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
    ,[searched_content])

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
                    <div >
                        <p  className='text-right text-emerald-300'
                            onClick={() => {setDisplayMoreOptions((prev) => !prev)}}
                        >More options ...</p>
                        {display_more_options && <MoreOptions/>}
                        { publications.length > 0 && 
                            <p >
                                {`${publications.length} result${publications.length > 1 ? "s" : ""} ...`}
                            </p>
                        }
                        <div >
                            {
                                publications.length > 0 && 
                                publications.slice(0,5).map((publication: { title: string; year: number; 
                                                            authors_short: string; authors_full : string;
                                                            abstract : string; journal : string; exps : any[]},idx:number) => {
                                    return (
                                        <Publication key={idx}
                                            title={publication.title} 
                                            year={publication.year} 
                                            author={publication.authors_short}
                                            authors_full={publication.authors_full}
                                            abstract={publication.abstract}
                                            journal={publication.journal}
                                            exps={publication.exps}
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