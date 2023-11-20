"use client"
import LoadingSpinner from "@/components/loadings/LoadingSpinner"
import { ErrorView } from "@/components/error/ErrorView"
import { searchPublication, searchPublicationAll } from "@/utils/api/api"
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
  // const [publication] = await searchPublicationAll({
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
        console.log('start')

        // await database_provider.loadAll(
        //   {
        //     exp_ids: publication.exps.map((exp) => exp.id),
        //     extension: "webp",
        //   },
        //   true,
        // )

        await database_provider.loadAll(
          {
            exp_ids: publication.exps.slice(0,2).map((exp) => exp.id),
            extension: "webp",
          },
          true,
        )

        // publication = await database_provider.addAllInfo(publication, publication.exps.slice(0,2))
        // console.log(publication.allInfo)

        // Updated to return a Promise
        async function loadAndNotify(slice) {
          return new Promise(async (resolve, reject) => {
            try {
              await database_provider.loadAll(
                {
                  exp_ids: slice.map(exp => exp.id),
                  extension: "webp",
                },
                true
              );
              console.log('done loading ', slice.length, 'experiments');
              // publication = await database_provider.addAllInfo(publication, slice)
              // console.log(publication.allInfo)
              resolve(); // Resolve the promise when done
            } catch (error) {
              console.error("Error loading data:", error);
              reject(error); // Reject the promise on error
            }
          });
        }

        // Await each call to loadAndNotify
        async function initiateSequentialLoads(publication) {
          for (let i = 2; i < publication.exps.length; i += 10) {
          // for (let i = 2; i < 10; i += 10) {

            const slice = publication.exps.slice(i, i + 10);
            console.log('start background loading', i);
            try {
              await loadAndNotify(slice); // Await the completion of loadAndNotify
            } catch (error) {
              // Handle errors if necessary
              console.error('Error in loading batch:', error);
              break; // Optional: break the loop on error
            }
          }
        }

        // Start the process
        initiateSequentialLoads(publication);
        

        console.log('end')


        const idx = await database_provider.addPublicationToDb(publication)
        addCollection(idx, publication)


        // get all texture_info for all experiments and add this to the publication 
        // object for quick access during frame updates

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

        // database_provider.loadAll(
        //   {
        //     exp_ids: publication.exps.map((exp) => exp.id),
        //     extension: "webp",
        //   },
        //   true,
        // )
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
