'use client'
import dynamic from "next/dynamic"
import styles from "./page.module.css"
import SelectJournal from "@/components/searchbar/filters/SelectJournals"
import { useClusterStore } from "@/utils/store/cluster.store"
import { usePathname } from "next/navigation"
import { useEffect } from "react"
import { database_provider } from "@/utils/database_provider/DatabaseProvider"

const ClientMain = dynamic(() => import("@/components/ClientMain"), {
  ssr: false,
})
export default function Home() {
  const addCollection = useClusterStore((state) => state.addCollection)
  const add = useClusterStore((state) => state.time.add)
  const clear = useClusterStore((state) => state.time.clear)
  useEffect(() => {
    clear()
    Promise.all([database_provider.loadAllColections()]).then(([e]) => {
      e.map((element) => {
        addCollection(element.id!, element.data)
      })
      const most_recent = e.sort(
        (a, b) => Date.parse(b.date) - Date.parse(a.date),
      )[0]
      if (most_recent) {
        add(most_recent.data)
      }
    })
  }, [])
  return (
    <main id="root" className="w-full h-full">
      <ClientMain />
    </main>
  )
}
