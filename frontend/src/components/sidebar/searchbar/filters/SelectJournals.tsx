import { getJournals } from "@/utils/api/api"
import { use } from "react"

export default function SelectJournal() {
  let journals = use(getJournals())
  return (
    <>
      {journals.map((journal: string, index) => (
        <option key={index} title={journal} value={journal}>
          {journal.length > 29 ? journal.slice(0, 29) + "..." : journal}
        </option>
      ))}
    </>
  )
}
