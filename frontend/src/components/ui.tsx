"use client"
import { TimeProvider } from "./time_provider/TimeProvider"
import SideBar from "./sidebar/SideBar"
import { useClusterStore } from "@/utils/store/cluster.store"
import { database_provider } from "@/utils/database_provider/DatabaseProvider"
import { useEffect } from "react"

type Props = {
  journals: JSX.Element
}

export default function UI({ journals }: Props) {
  const addCollection = useClusterStore((state) => state.addCollection)
  const add = useClusterStore((state) => state.time.add)
  useEffect(() => {
    Promise.all([database_provider.loadAllColections()]).then(([e]) => {
      e.map((element) => {
        addCollection(element.id!, element.data)
      })
      const most_recent = e.sort((a,b) => Date.parse(a.date) - Date.parse(b.date))[0]
      if(most_recent){
        add(most_recent.data)
      }
    }
    )
  }, [])

  return (
    <>
      <TimeProvider />
      <SideBar journals={journals} />
    </>
  )
}
