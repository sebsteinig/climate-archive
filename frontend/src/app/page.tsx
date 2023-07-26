import dynamic from "next/dynamic"
import styles from "./page.module.css"
import SelectJournal from "@/components/sidebar/searchbar/filters/SelectJournals"

const UI = dynamic(() => import("@/components/ui"), { ssr: false })
export default function Home() {
  return (
    <main id="root" className="w-full h-full">
      <h1 className="absolute right-0 top-0 m-6">CLIMATE ARCHIVE</h1>
      <UI journals={SelectJournal()} />
    </main>
  )
}
