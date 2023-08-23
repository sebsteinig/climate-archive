"use client"
import LoadingSpinner from "@/components/loadings/LoadingSpinner"
import { useEffect, useMemo } from "react"
import { searchPublication } from "@/utils/api/api"
import { Publication } from "@/utils/types"
import { database_provider } from "@/utils/database_provider/DatabaseProvider"
import { useClusterStore } from "@/utils/store/cluster.store"
import { useSearchParams } from "next/navigation"
import dynamic from "next/dynamic"
import { getContainers } from "@/utils/URL_params/url_params.utils"
import { Loading, useLoading } from "@/utils/useLoading"

const ClientMain = dynamic(() => import("@/components/ClientMain"), {
  ssr: false,
})

export default function PublicationPage() {
  const clearGraph = useClusterStore((state) => state.graph.clear)
  const addCollection = useClusterStore((state) => state.addCollection)
  const search_params = useSearchParams()
  const addAll = useClusterStore((state) => state.time.addAll)
  const clear = useClusterStore((state) => state.time.clear)
  const loading_ref = useLoading()
  const reload = useMemo(() => {
    if (!search_params.has("reload")) return false
    return search_params.get("reload") == "true"
  }, [search_params])

  useEffect(() => {
    loading_ref.current?.start()
    clear()
    clearGraph()
    const containers = getContainers(search_params)

    Promise.all(
      containers.map(async ({ authors_short, year, exp_id }) => {
        const [publication] = await searchPublication({
          authors_short,
          year: [year],
        })
        if (!publication) return
        await database_provider.load({ exp_id })
        const idx = await database_provider.addPublicationToDb(publication)
        addCollection(idx, publication)
        return {
          publication,
          exp_id,
        }
      }),
    ).then(
      (
        publications: (
          | { publication: Publication; exp_id: string }
          | undefined
        )[],
      ) => {
        loading_ref.current?.finish()
        addAll(
          publications.filter((e) => e) as {
            publication: Publication
            exp_id: string
          }[],
        )
      },
    )
  }, [reload])

  return (
    <Loading ref={loading_ref} fallback={<LoadingSpinner/>}>
      <ClientMain />
    </Loading>
  )
}
