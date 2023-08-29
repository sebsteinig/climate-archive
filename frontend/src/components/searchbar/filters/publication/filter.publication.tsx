import { useEffect, useState } from "react"
import ButtonSecondary from "@/components/buttons/ButtonSecondary"
import InputField from "@/components/inputs/InputField"
import Select from "@/components/inputs/Select"
import { SearchPublication } from "@/utils/api/api.types"
import ArrowUp from "$/assets/icons/arrow-up-emerald-400.svg"
import ArrowDown from "$/assets/icons/arrow-down-emerald-400.svg"
import { getJournals, useSelectJournal } from "@/utils/api/api"
import LoadingSpinner from "@/components/loadings/LoadingSpinner"
import CrossIcon from "$/assets/icons/cross-small-emerald-300.svg"
import { useStore } from "@/utils/store/store"
import { Label, Row, Section } from "../filter.utils"
import { Period } from "./period"
import { SelectJournal } from "./journals"

type PublicationFiltersProps = {
}

export default function PublicationFilters({}: PublicationFiltersProps) {
  const author = useStore(state => state.search.filter.publication.author)
  const setAuthor =  useStore(state => state.search.setAuthor)

  return (
    <Section title="Filter on publication" >
      <Period />
      <SelectJournal />
      <Row>
        <Label>Author</Label>
        <InputField
              placeholder="like valdes et al"
              value={author ?? ""}
              onChange={(e: any) => {
                setAuthor(e.target.value)
              }}
        />
      </Row>
    </Section>
  )
}