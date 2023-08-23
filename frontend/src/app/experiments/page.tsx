"use client"

import { useEffect, useMemo, useState } from "react"
import { Experiments } from "@/utils/types"
import { database_provider } from "@/utils/database_provider/DatabaseProvider"
import { useStore } from "@/utils/store/store"
import { usePathname, useSearchParams } from "next/navigation"
import dynamic from "next/dynamic"
import { RequestMultipleTexture } from "@/utils/database_provider/database_provider.types"
import { ErrorBoundary } from "react-error-boundary"
import { ErrorView } from "@/components/ErrorView"
import { useRouter } from "next/router"

const ClientMain = dynamic(() => import("@/components/ClientMain"), {
  ssr: false,
})

async function loadExperiments(request: RequestMultipleTexture) {
  await database_provider.loadAll(request)
  const collection = {
    exps: request.exp_ids!.map((exp: string) => {
      return { id: exp, metadata: [] }
    }),
  } as Experiments
  return collection
}

export default function ExperimentsPage() {
  const add = useStore((state) => state.worlds.add)
  const search_params = useSearchParams()
  const clear = useStore((state) => state.worlds.clear)
  const pathname = usePathname()
  const [error,setError] = useState(false)




  useEffect(() => {
    clear()
    var request: RequestMultipleTexture = { exp_ids: [] }
    for (let [key, value] of search_params.entries()) {
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
    loadExperiments(request)
    .then((collection) => {
      add(collection)
    }).catch(()=>{
      setError(true)
    })
  }, [])
  if(error) return  <ErrorView try_again_path={pathname + "?" + search_params}/>
  return (
    <ErrorBoundary fallback={<ErrorView try_again_path={pathname + "?" + search_params}/>}>
      <ClientMain />
    </ErrorBoundary>
  )
}
