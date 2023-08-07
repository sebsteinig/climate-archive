"use client"

import { useEffect, useMemo } from "react"
import { searchPublication } from "@/utils/api/api"
import { Experiments, Publication } from "@/utils/types"
import { database_provider } from "@/utils/database_provider/DatabaseProvider"
import { useClusterStore } from "@/utils/store/cluster.store"
import { useRouter, useSearchParams } from "next/navigation"
import dynamic from "next/dynamic"


const ClientMain = dynamic(() => import("@/components/ClientMain"), {
  ssr: false,
})
export default function PublicationPage() {
  const replace = useClusterStore((state) => state.time.replace)
  const add = useClusterStore((state) => state.time.add)
  const addCollection = useClusterStore((state) => state.addCollection)
  const searchParams = useSearchParams()
  const addWorld = useClusterStore((state) => state.time.add)
  const router = useRouter()
  
  const reload = useMemo(() => {
    if (!searchParams.has("reload")) return false
    return searchParams.get("reload") == "true"
  }, [searchParams])

  const loadExperiments = async(request : Map<string, any>) =>{
    await database_provider.loadAll({
      exp_ids: request.get("exp_ids")!,
    })
    const collection = {
      exps: request.get("exp_ids")!.map((exp : string) => {
        return { id: exp, metadata: [] }
      }),
    } as Experiments
    console.log(collection);
    
    const idx = await database_provider.addCollectionToDb(collection)
    addCollection(idx, collection)
    addWorld(collection)
  }

  useEffect(() => {
    let do_replace = true
    for (let [key, value] of searchParams.entries()) {
      if (key == "reload") continue


      if (key=="experiments"){
        const values = value.replace("{", "").replace("}", "").split(";")
        const request = new Map()
        for (let i = 0; i< values.length; i++){
          const [k, v] = values[i].split("=")
          switch (k){
            case "resolution":
              request.set(k, {x : v.split("*")[0], y : v.split("*")[1]})
              break
            case "exp_ids":
              const ids = v.split(".")
              if(ids[ids.length-1]=="") ids.pop()
              request.set(k, ids)
              break
            default:
              request.set(k, v)
          }
        }
        loadExperiments(request)  


      } else {
        const [author, year] = key.split("*")
        console.log(author)
        searchPublication({
          authors_short: author.replaceAll(".", " "),
          year: [parseInt(year)],
        })
          ?.then(async (publications: Publication[]) => {
            if (publications.length == 0) return
            const publication = publications[0]
            await database_provider.load({
              exp_id: value,
            })
            const idx = await database_provider.addCollectionToDb(publication)
            addCollection(idx, publication)
            do_replace ? replace(publication) : add(publication)
            do_replace = false
          })
          .then(() => {})
      }
    }
  }, [reload])

  return (
    <>
      <ClientMain />
    </>
  )
}
