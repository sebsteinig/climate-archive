"use client"

import { useEffect, useMemo } from "react"
import { searchPublication } from "@/utils/api/api"
import { Experiments, Publication } from "@/utils/types"
import { database_provider } from "@/utils/database_provider/DatabaseProvider"
import { useClusterStore } from "@/utils/store/cluster.store"
import { useRouter, useSearchParams } from "next/navigation"
import dynamic from "next/dynamic"
import { RequestMultipleTexture } from "@/utils/database_provider/database_provider.types"


const ClientMain = dynamic(() => import("@/components/ClientMain"), {
  ssr: false,
})
export default function PublicationPage() {
  const replace = useClusterStore((state) => state.time.replace)
  const add = useClusterStore((state) => state.time.add)
  const addCollection = useClusterStore((state) => state.addCollection)
  const searchParams = useSearchParams()

  
  const reload = useMemo(() => {
    if (!searchParams.has("reload")) return false
    return searchParams.get("reload") == "true"
  }, [searchParams])
  
  useEffect(() => {
    let do_replace = true
    for (let [key, value] of searchParams.entries()) {
      if (key == "reload") continue
      const [author, year] = key.split("*")
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
  }, [reload])

  return (
    <>
      <ClientMain />
    </>
  )
}
