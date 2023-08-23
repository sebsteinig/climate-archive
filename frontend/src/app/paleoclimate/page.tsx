"use client"
import LoadingSpinner from "@/components/loadings/LoadingSpinner"
import { searchPublication } from "@/utils/api/api"
import { database_provider } from "@/utils/database_provider/DatabaseProvider"
import { useClusterStore } from "@/utils/store/cluster.store"
import {
  TimeController,
  TimeMode,
  TimeSpeed,
} from "@/utils/store/time/time.type"
import { Loading, useLoading } from "@/utils/useLoading"
import dynamic from "next/dynamic"
import { useEffect } from "react"

const ClientMain = dynamic(() => import("@/components/ClientMain"), {
  ssr: false,
})

class PublicationNotFound extends Error {
  constructor() {
    super()
  }
}
async function loadValdesEtAl2021() {
  const [publication] = await searchPublication({
    title: "Deep Ocean Temperatures through Time",
    authors_short: "Valdes et al 2021",
    year: [2021],
  })
  if (!publication) throw new PublicationNotFound()
  return publication
}

export default function PaleoClimatePage() {
  const addTime = useClusterStore((state) => state.time.add)
  const clearGraph = useClusterStore((state) => state.graph.clear)
  const clear = useClusterStore((state) => state.time.clear)
  const addCollection = useClusterStore((state) => state.addCollection)
  const loading_ref = useLoading()

  useEffect(() => {
    loading_ref.current?.start()    
    clear()
    clearGraph()
    loadValdesEtAl2021()
      .then(async (publication) => {
        await database_provider.loadAll({
          exp_ids: publication.exps.map((exp) => exp.id),
          extension: "webp",
        })
        const idx = await database_provider.addPublicationToDb(publication)
        addCollection(idx, publication)
        return publication
      })
      .then((publication) => {
        loading_ref.current?.finish()        
        addTime(publication, {
          mode: TimeMode.mean,
          speed: TimeSpeed.very_fast,
          controller: TimeController.geologic,
        })
      })
      .catch((e) => {
        console.log(e)
      })
  }, [])
  return (
    <>
      <Loading ref={loading_ref} fallback={<LoadingSpinner/>}>
        <ClientMain />
      </Loading>
    </>
  )
}
