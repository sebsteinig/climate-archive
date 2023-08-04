'use client'
import { TimeProvider } from "@/components/time_provider/TimeProvider"
import SideBar from "@/components/sidebar/SideBar"
import { useEffect, useMemo } from "react"
import { searchPublication } from "@/utils/api/api"
import { Publication } from "@/utils/types"
import { database_provider } from "@/utils/database_provider/DatabaseProvider"
import { useClusterStore } from "@/utils/store/cluster.store"
import { useRouter, useSearchParams } from 'next/navigation'

//example : /?Lunt.et.al*2010=tbpie&publication.2*year==expid2
export default function PublicationPage(){
  const replace = useClusterStore((state) => state.time.replace)
  const add = useClusterStore((state) => state.time.add)
  const addCollection = useClusterStore((state) => state.addCollection)
  const searchParams = useSearchParams()
  const router = useRouter()

  const reload = useMemo(() => {
    if (!searchParams.has("reload")) return false;
    return (searchParams.get("reload") == "true")
  }, [searchParams])

  useEffect(() => {
    let do_replace = true 
    for (let [key, value] of searchParams.entries()){
      if (key == "reload") continue;
      const [author,year] = key.split("*")  
      console.log(author);            
      searchPublication({authors_short:author.replaceAll(".", " "), year:[parseInt(year)]})?.then(async (publications : Publication[]) =>{
        if(publications.length == 0) return;
        const publication = publications[0]
        await database_provider.load({
          exp_id: value,
        })          
        const idx = await database_provider.addCollectionToDb(publication)
        addCollection(idx, publication)
        do_replace ? replace( publication) : add(publication)
        do_replace = false        
      }).then(() => {})
      
    }    
  },[reload])

    return(
      <>
        <TimeProvider />
        <SideBar journals={<></>} />
      </>
    )
}