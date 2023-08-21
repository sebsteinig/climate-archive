"use client"
import { searchPublication } from "@/utils/api/api"
import { database_provider } from "@/utils/database_provider/DatabaseProvider"
import { useClusterStore } from "@/utils/store/cluster.store"
import {
  TimeController,
  TimeMode,
  TimeSpeed,
} from "@/utils/store/time/time.type"
import { Publication } from "@/utils/types"
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
  const clear = useClusterStore((state) => state.time.clear)
  const addCollection = useClusterStore((state) => state.addCollection)
  useEffect(() => {
    clear()
    loadValdesEtAl2021()
      .then(async (publication) => {
        await database_provider.loadAll({
          exp_ids: publication.exps.map((exp) => exp.id),
          extension: "webp",
        },true)
        const idx = await database_provider.addPublicationToDb(publication)
        addCollection(idx, publication)
        return publication
      })
      .then((publication) => {
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
      <ClientMain />
    </>
  )
}
