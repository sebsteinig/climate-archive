"use client"

import { useStore } from "@/utils/store/store"
import { useEffect } from "react"

export function Reset() {
  const clear = useStore((state) => state.worlds.clear)
  const clearGraph = useStore((state) => state.graph.clear)
  const reload = useStore((state) => state.worlds.reload)

  useEffect(() => {
    clear()
    clearGraph()
    reload(true)
  })
  return null
}
