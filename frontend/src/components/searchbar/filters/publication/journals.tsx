'use client'
import Select from "@/components/inputs/Select"
import LoadingSpinner from "@/components/loadings/LoadingSpinner"
import { useSelectJournal } from "@/utils/api/api"
import { useStore } from "@/utils/store/store"
import { useEffect, useState } from "react"
import { Label, Row } from "../filter.utils"

type SelectJournalProps = {
}
  
export function SelectJournal({} : SelectJournalProps) {
    const { data, error, isLoading } = useSelectJournal()
    const setJournal = useStore(state => state.search.setJournal)
    const journal = useStore(state => state.search.filter.publication.journal)
    const [journals, setJournals] = useState<string[]>([])
    useEffect(() => {
      if(data){
        setJournals(data)
      }
    }, [data])
  
    if (isLoading) return <LoadingSpinner/>;
    if(journals.length == 0) return null;

    return (
        <Row >
            <Label>Journal</Label>
            <Select
                title={journal || undefined}
                value={journal?journal:"default"}
                onChange={(e: any) => {
                    setJournal(e.target.value)
                }}
                >
                <option disabled value={"default"}>
                    Select a journal ...
                </option>
                {journals.map((journal: string, index:number) => (
                    <option key={index} title={journal} value={journal}>
                    {journal.length > 29 ? journal.slice(0, 29) + "..." : journal}
                    </option>
                ))}
            </Select>
        </Row>
    )
  }