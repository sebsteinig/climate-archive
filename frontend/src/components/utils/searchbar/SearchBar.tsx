"use client";
import { useState, useEffect, useRef } from 'react'
import styles from "./searchbar.module.css"
import Publication from './publication';
import { searchPublication } from '@/utils/api/api';
import FilterPublication from './filters/FilterPublication';
import FilterLabels from './filters/FilterLabels';
import FilterAdvanced from './filters/FilterAdvanced';

function useOutsideClick(ref: HTMLDivElement, onClickOut: () => void){
    useEffect(() => {
        if (ref) {
            const onClick = ({target}: any) => {
                if(target.parentNode && !ref.contains(target)) {
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
        <div className={styles.more_options}>

            <FilterPublication />
            <FilterLabels/>
            <FilterAdvanced />

            <span className={styles.more_options_sep}/>
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
        <div className={`${styles.container}`} ref={search_panel_ref}>
            <div  className={`${styles.search} ${search_panel_visible && styles.open_panel}`}
             onClick={() => setSearchPanelVisible(true)}
             >
                <input className={`${styles.input} ${search_panel_visible && styles.sep}`} 
                    type="text"
                    name="searchbar" 
                    id="searcbar" 
                    placeholder="Search a publication ..." 
                    value={searched_content} 
                    onChange={(e) => setSearchContent(e.target.value)}
                    onClick={() => setSearchPanelVisible(true)}
                />
                {search_panel_visible && 
                    <div className={styles.search_panel}>
                        <p className={styles.options}
                            onClick={() => {setDisplayMoreOptions((prev) => !prev)}}
                        >More options ...</p>
                        {display_more_options && <MoreOptions/>}
                        { publications.length > 0 && 
                            <p className={styles.results}>
                                {`${publications.length} result${publications.length > 1 ? "s" : ""} ...`}
                            </p>
                        }
                        <div className={styles.publications_results}>
                            {
                                publications.length > 0 && 
                                publications.slice(0,5).map((publication: { title: string; year: string; 
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