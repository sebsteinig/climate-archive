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
  useEffect(() => {
    Promise.all([database_provider.loadAllColections()]).then((e) =>
      e[0].map((element) => {
        addCollection(element.id!, element.data)
      }),
    )
  }, [])

  return (
    <>
      <TimeProvider />
      <SideBar journals={journals} />
    </>
  )
}
