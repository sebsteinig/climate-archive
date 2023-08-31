import InputField from "@/components/inputs/InputField"
import { useStore } from "@/utils/store/store"
import { Label, Row, Section } from "../filter.utils"
import { Period } from "./parameters/period"
import BinIcon from "$/assets/icons/bin.svg"
import { SelectJournal } from "./parameters/journals"
import { InputAuthor } from "./parameters/author"

type PublicationFiltersProps = {
}

export default function PublicationFilters({}: PublicationFiltersProps) {
  const clearFiltersPublication =  useStore(state => state.search.clearFiltersPublication)

  return (
    <Section title="Filter on publication" >
      <Period />
      <SelectJournal />
      <InputAuthor/>

      <div className="flex flex-row justify-end pr-3" >
        <div className="flex flex-row gap-1 items-center group cursor-pointer" onClick={() => clearFiltersPublication()}>
        <BinIcon
          className="shrink-0 grow-0 w-7 h-7 cursor-pointer text-slate-500 group-hover:text-slate-300"
        />
        <span className="group-hover:underline group-hover:text-slate-300 text-slate-500">Clear Filters</span>
        </div>
      </div>
      
    </Section>
  )
}