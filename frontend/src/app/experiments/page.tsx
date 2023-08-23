"use client"

import { useEffect, useMemo } from "react"
import { Experiments } from "@/utils/types"
import { database_provider } from "@/utils/database_provider/DatabaseProvider"
import { useClusterStore } from "@/utils/store/cluster.store"
import { useSearchParams } from "next/navigation"
import dynamic from "next/dynamic"
import { RequestMultipleTexture } from "@/utils/database_provider/database_provider.types"
import { Loading, useLoading } from "@/utils/useLoading"
import LoadingSpinner from "@/components/loadings/LoadingSpinner"

const ClientMain = dynamic(() => import("@/components/ClientMain"), {
  ssr: false,
})
export default function ExperimentsPage() {
  const add = useClusterStore((state) => state.time.add)
  const clearGraph = useClusterStore((state) => state.graph.clear)
  const loading_ref = useLoading()
  const searchParams = useSearchParams()
  const clear = useClusterStore((state) => state.time.clear)

  const reload = useMemo(() => {
    if (!searchParams.has("reload")) return false
    return searchParams.get("reload") == "true"
  }, [searchParams])

  const loadExperiments = async (request: RequestMultipleTexture) => {
    await database_provider.loadAll(request)
    const collection = {
      exps: request.exp_ids!.map((exp: string) => {
        return { id: exp, metadata: [] }
      }),
    } as Experiments
    add(collection)
  }

  useEffect(() => {
    loading_ref.current?.start()
    clear()
    clearGraph()
    var request: RequestMultipleTexture = { exp_ids: [] }
    for (let [key, value] of searchParams.entries()) {
      if (key == "reload") continue
      switch (key) {
        case "resolution":
          request.resolution = {
            x: parseInt(value.split("*")[0]),
            y: parseInt(value.split("*")[1]),
          }
          break
        case "exp_ids":
          const ids = value.split(",")
          if (ids[ids.length - 1] == "") ids.pop()
          request.exp_ids = ids
          break
        case "lossless":
          request.lossless = value === "true"
          break
        case "config_name":
          request.config_name = value
          break
        case "variables":
          request.variables = value === "" ? [] : value.split(",")
          break
        case "extension":
          request.extension = value
          break
        default:
          break
      }
    }
    loading_ref.current?.finish()
    loadExperiments(request)
  }, [reload])

  return (
    <Loading ref={loading_ref} fallback={<LoadingSpinner/>}>
      <ClientMain />
    </Loading>
  )
}
