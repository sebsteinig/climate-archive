"use client";
import { useState, useEffect } from 'react'
import {getImage, search, select} from "@/utils/api/api"
import styles from "./searchbar.module.css"

export default function SearchBar() {
    
    const [searched_content, setSearchContent] = useState<string>("")
    const [data,setData] = useState("")

    useEffect(
         () => {

            let ignore = false;
            if (searched_content !== "" && searched_content.length > 3) {
                search("publication",{title:searched_content}).then((data) => {
                    console.log(data);
                    select("collection",{ids:data[0].Exps}).then((data) => {
                        for(let exp in data) {
                            let path = data[exp][0].paths_ts[0];
                            //console.log(data[exp][0].paths_ts);
                            getImage(path).then(
                                (image_data) => {
                                    setData(image_data);
                                }
                            )
                            break;
                        }
                    })
                })
                
            }

            return () => {
              ignore = true;
            };

        }
    ,[searched_content])

    return <div className={`${styles.container} ${styles.search}`}>
        <input className={`${styles.input} ${styles.search}`} 
            type="text"
            name="searchbar" 
            id="searcbar" 
            placeholder="Search a publication" 
            value={searched_content} 
            onChange={(e) => setSearchContent(e.target.value)}/>

            {data && <img src={`data:image/jpeg;base64,${data}`} />}
    </div>
}