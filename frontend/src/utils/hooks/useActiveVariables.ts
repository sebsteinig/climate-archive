import { useMemo } from "react"
import { useStore } from "../store/store"

export function useActiveVariables() {
  const stored_active_variables = useStore((state) => state.active_variables)
  const active_variables = useMemo(() => {
    let actives = []
    for (let [key, active] of stored_active_variables.entries()) {
      if (active) actives.push(key)
    }
    return actives
  }, [stored_active_variables])
  return active_variables
}
