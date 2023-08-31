"use client"
import { useEffect } from "react"
import { Slots, TimeFrameRef } from "../store/worlds/time/time.type"
import { EVarID } from "../store/variables/variable.types"
import { usePathname, useRouter } from "next/navigation"
import { resolveURLparams } from "../URL_params/url_params.utils"
import { useErrorBoundary } from "react-error-boundary"
import { useStore } from "../store/store"

export function useInit(
  worlds_slots: Slots,
  current_frame: TimeFrameRef,
  active_variables: EVarID[],
) {
  const router = useRouter()
  const pathname = usePathname()
  const { showBoundary } = useErrorBoundary()
  useEffect(() => {
    // PREPARE EACH TIME FRAMES
    init(worlds_slots, current_frame, active_variables)
      .then(() => {
        if (pathname.includes("publication")) {
          const search_params = resolveURLparams(worlds_slots)
          router.push(pathname + "?" + search_params.toString())
        }
      })
      .catch((e) => {
        showBoundary(e)
      })
  }, [worlds_slots])
  const observed_id = useStore((state) => state.worlds.observed_world)
  useEffect(() => {
    // PREPARE EACH TIME FRAMES
    init(worlds_slots, current_frame, active_variables)
      .then(() => {})
      .catch((e) => {
        showBoundary(e)
      })
  }, [observed_id])
  useEffect(() => {
    // PREPARE EACH TIME FRAMES
    init(worlds_slots, current_frame, active_variables)
      .then(() => {})
      .catch((e) => {
        showBoundary(e)
      })
  }, [active_variables])
}

async function init(
  slots: Slots,
  current_frame: TimeFrameRef,
  active_variables: EVarID[],
) {
  for (let [world_id, data] of slots) {
    const exp = data.exp ?? data.collection.exps[0]
    await current_frame.current.init(world_id, exp, active_variables, data)
  }
}
