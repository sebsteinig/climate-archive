"use client";
import { useState, useEffect } from 'react'
import {search} from "@/utils/api/api"

export default function SearchBar() {
    
    const [searched_content, setSearchContent] = useState<string>("")

    useEffect(
         () => {

            let ignore = false;
            if (searched_content !== "") {
                search("publication",{title:searched_content})
            }

            return () => {
              ignore = true;
            };

        }
    ,[searched_content])

    return <div>
        <input type="text" name="searchbar" id="searcbar" placeholder="Search a publication" value={searched_content} onChange={(e) => setSearchContent(e.target.value)}/>
    </div>
}