import dynamic from "next/dynamic"
import styles from "./page.module.css"
import SelectJournal from "@/components/searchbar/filters/SelectJournals"

const ClientMain = dynamic(() => import("@/components/ClientMain"), {
  ssr: false,
})
export default function Home() {
  return (
    <main id="root" className="w-full h-full">
      <ClientMain />
    </main>
  )
}
