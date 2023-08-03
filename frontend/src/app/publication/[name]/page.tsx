'use client'
import { TimeProvider } from "@/components/time_provider/TimeProvider"
import SideBar from "@/components/sidebar/SideBar"
import { useEffect } from "react"
import { searchPublication } from "@/utils/api/api"
import { Publication } from "@/utils/types"
import { database_provider } from "@/utils/database_provider/DatabaseProvider"
import { useClusterStore } from "@/utils/store/cluster.store"

export default function PublicationPage({params}:{params:{name : string}}){
  const replace = useClusterStore((state) => state.time.replace)
  const addCollection = useClusterStore((state) => state.addCollection)
    useEffect(() => {
      const [author,year] = params.name.split("*")
      searchPublication({authors_short:author.replaceAll(".", " "), year:[parseInt(year)]})?.then(async (publications : Publication[]) =>{
        const publication = publications[0]
        await database_provider.load({
          exp_id: publication.exps[0].id,
        })
        
        const idx = await database_provider.addCollectionToDb(publication)
        addCollection(idx, publication)
        replace( publication )
      }).then(() => {})
    },[])
    return(
      <>
        <TimeProvider />
        <SideBar journals={<></>} />
      </>
    )
}