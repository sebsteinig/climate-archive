"use client"
import LoadingSpinner from "@/components/loadings/LoadingSpinner"
import { useEffect, useMemo, useState } from "react"
import { searchPublication } from "@/utils/api/api"
import { Publication } from "@/utils/types"
import { database_provider } from "@/utils/database_provider/DatabaseProvider"
import { useStore } from "@/utils/store/store"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import dynamic from "next/dynamic"
import { Loading, useLoading } from "@/utils/useLoading"
import {
  UP_ContainerDesc,
  getContainers,
  resolveURLparams,
} from "@/utils/URL_params/url_params.utils"
import { ErrorBoundary } from "react-error-boundary"
import { ErrorView } from "@/components/ErrorView"

const ClientMain = dynamic(() => import("@/components/ClientMain"), {
  ssr: false,
})

export default function PublicationPage() {
  const loading_ref = useLoading()
  const addCollection = useStore((state) => state.addCollection)
  const pathname = usePathname()
  const search_params = useSearchParams()
  const addAll = useStore((state) => state.worlds.addAll)
  const clear = useStore((state) => state.worlds.clear)
  const router = useRouter()
  const time_slots = useStore((state) => state.worlds.slots)
  const reload_flag = useStore((state) => state.worlds.reload_flag)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!reload_flag) {
      const search_params = resolveURLparams(time_slots)
      router.push(pathname + "?" + search_params.toString())
      return
    }
    clear()
    let containers: UP_ContainerDesc[]
    try {
      containers = getContainers(search_params)
    } catch (e) {
      setError(true)
      return
    }

    Promise.all(
      containers.map(async ({ authors_short, year, exp_id }) => {
        const [publication] = await searchPublication({
          authors_short,
          year: [year],
        })
        console.log(publication)

        if (!publication) return
        await database_provider.load({ exp_id })
        const idx = await database_provider.addPublicationToDb(publication)
        addCollection(idx, publication)
        return {
          publication,
          exp_id,
        }
      }),
    )
      .then(
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
      .catch(() => {
        setError(true)
      })
  }, [reload_flag])
  if (error)
    return <ErrorView try_again_path={pathname + "?" + search_params} />
  return (
    <ErrorBoundary
      fallback={<ErrorView try_again_path={pathname + "?" + search_params} />}
    >
      <Loading ref={loading_ref} fallback={<LoadingSpinner />}>
        <ClientMain />
      </Loading>
    </ErrorBoundary>
  )
}
