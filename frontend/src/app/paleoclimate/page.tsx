"use client"
import LoadingSpinner from "@/components/loadings/LoadingSpinner"
import { ErrorView } from "@/components/error/ErrorView"
import { searchPublication } from "@/utils/api/api"
import { database_provider } from "@/utils/database_provider/DatabaseProvider"
import { useStore } from "@/utils/store/store"
import {
  TimeController,
  TimeMode,
  TimeSpeed,
} from "@/utils/store/worlds/time/time.type"
import { Loading, useLoading } from "@/utils/hooks/useLoading"
import { Publication } from "@/utils/types"
import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { ErrorBoundary } from "react-error-boundary"

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
    authors_short: "Valdes et al",
    year: [2021],
  })
  console.log("loading Valdes et al 2021")
  if (!publication) throw new PublicationNotFound()
  console.log("loaded")
  return publication
}

export default function PaleoClimatePage() {
  const loading_ref = useLoading()
  const addTime = useStore((state) => state.worlds.add)
  const clear = useStore((state) => state.worlds.clear)
  const clearGraph = useStore((state) => state.graph.clear)
  const addCollection = useStore((state) => state.addCollection)
  const [error, setError] = useState(false)
  useEffect(() => {
    loading_ref.current?.start()
    clear()
    clearGraph()
    loadValdesEtAl2021()
      .then(async (publication) => {
        await database_provider.loadAll(
          {
            exp_ids: publication.exps.map((exp) => exp.id),
            extension: "webp",
          },
          true,
        )
        // console.log(publication)
        // await database_provider.load(
        //   {
        //     exp_id: ["texqe"],
        //     extension: "webp",
        //   },
        //   true,
        // )
        // await database_provider.load(
        //   {
        //     exp_id: ["texqd"],
        //     extension: "webp",
        //   },
        //   true,
        // )
        const idx = await database_provider.addPublicationToDb(publication)
        addCollection(idx, publication)
        console.log(publication)
        return publication
      })
      .then((publication) => {
        loading_ref.current?.finish()
        addTime(publication, {
          mode: TimeMode.mean,
          speed: TimeSpeed.very_fast,
          controller: TimeController.geologic,
          mode_state: {
            is_writable: true,
            previous: TimeMode.mean,
          },
        })
      })
      .catch(() => {
        setError(true)
      })
  }, [])
  if (error) return <ErrorView try_again_path="/paleoclimate" />
  return (
    <ErrorBoundary fallback={<ErrorView try_again_path="/paleoclimate" />}>
      <Loading ref={loading_ref} fallback={<LoadingSpinner />}>
        <ClientMain />
      </Loading>
    </ErrorBoundary>
  )
}
