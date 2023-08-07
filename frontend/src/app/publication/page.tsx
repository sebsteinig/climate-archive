"use client"

import { useEffect, useMemo } from "react"
import { searchPublication } from "@/utils/api/api"
import { Experiments, Publication } from "@/utils/types"
import { database_provider } from "@/utils/database_provider/DatabaseProvider"
import { useClusterStore } from "@/utils/store/cluster.store"
import { useRouter, useSearchParams } from "next/navigation"
import dynamic from "next/dynamic"
import { getContainers } from "@/utils/URL_params/url_params.utils"

const ClientMain = dynamic(() => import("@/components/ClientMain"), {
  ssr: false,
})
export default function PublicationPage() {
  const addCollection = useClusterStore((state) => state.addCollection)
  const search_params = useSearchParams()
  const addAll = useClusterStore((state) => state.time.addAll)
  const clear = useClusterStore((state) => state.time.clear)

  const reload = useMemo(() => {
    if (!search_params.has("reload")) return false
    return search_params.get("reload") == "true"
  }, [search_params])

  useEffect(() => {
    clear()

    const containers = getContainers(search_params)

    Promise.all(containers.map(
      async ({authors_short,year,exp_id}) => {
        const [publication] = await searchPublication({authors_short,year:[year]})
        if(!publication) return
        await database_provider.load({exp_id})
        const idx = await database_provider.addPublicationToDb(publication)
        addCollection(idx, publication)
        return {
          publication,
          exp_id
        }
      })
    ).then((publications:({publication:Publication,exp_id:string}|undefined)[])=> {
      addAll(publications.filter(e=>e) as {publication:Publication,exp_id:string}[])
    })

  }, [reload])

  return (
    <>
      <ClientMain />
    </>
  )
}
