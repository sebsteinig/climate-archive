import { useState } from "react"
import { useStore } from "@/utils/store/store"
import { useSearch } from "@/utils/api/api"
import { Label, Row } from "../../filter.utils"
import InputField from "@/components/inputs/InputField"
import Select from "@/components/inputs/Select"
import Cross from "$/assets/icons/cross-small-emerald-300.svg"

export function SelectExperiment() {
  const pushExp = useStore((state) => state.search.pushExp)
  const [searched_exp, setSearchedExp] = useState("")
  const { data, error, isLoading } = useSearch(searched_exp)
  return (
    <Row>
      <Label>Experiments</Label>
      <InputField
        name="expid_input"
        value={searched_exp}
        id="expid_input"
        placeholder="experiment id ..."
        onChange={(e) => {
          setSearchedExp(e)
        }}
        onKeyDown={(e) => {
          if (
            e === "Enter" &&
            data?.map((e) => e.exp_id).includes(searched_exp)
          ) {
            pushExp(searched_exp)
          }
        }}
      />
      {data && !isLoading && (
        <Select
          defaultValue="default"
          onChange={(e) => pushExp(e.target.value)}
        >
          <option value="default" disabled>
            Select a valid id
          </option>
          {data?.map((e, i) => (
            <option value={e.exp_id} key={i}>
              {e.exp_id}
            </option>
          ))}
        </Select>
      )}
    </Row>
  )
}

export function SelectedExperiments() {
  const filters = useStore((state) => state.search.filter.experiment)
  const removeExp = useStore((state) => state.search.removeExp)
  return (
    <Row>
      {filters.exp_ids && filters.exp_ids?.length > 0 && (
        <>
          {filters.exp_ids.map((exp, idx) => (
            <div
              key={idx}
              className="label mt-2 bg-slate-600 w-fit p-2 border-x-4 border-x-slate-500 
                      grid grid-cols-2 gap-1 items-center"
            >
              <p>{exp}</p>
              <Cross
                className={`w-6 h-6 text-slate-500 cursor-pointer`}
                onClick={() => removeExp(exp)}
              />
            </div>
          ))}
        </>
      )}
    </Row>
  )
}
