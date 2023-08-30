import ButtonSecondary from "@/components/buttons/ButtonSecondary"
import Checkbox from "@/components/inputs/Checkbox"
import InputField from "@/components/inputs/InputField"
import MultiSelect from "@/components/inputs/MultiSelect"
import Select from "@/components/inputs/Select"
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react"
import Cross from "$/assets/icons/cross-small-emerald-300.svg"
import Link from "next/link"
import { Label, Row, Section } from "../filter.utils"
import { useStore } from "@/utils/store/store"
import { ExperimentFilters } from "@/utils/store/search/search.store"
import { useSearch } from "@/utils/api/api"

const SUPPORTED_EXTENSION = [ "webp", "png", "jpg"] as const
const SUPPORTED_RESOLUTION = ["default", 1, 2] as const
const SUPPORTED_VARIABLES = [
  "clt",
  "height",
  "mlotst",
  "pr",
  "sic",
  "tas",
  "currents",
  "liconc",
  "pfts",
  "snc",
  "tos",
  "winds",
] as const

function ExpButton({ exp, remove }: { exp: string; remove: Function }) {
  return (
    <div
      className="label mt-2 bg-slate-600 w-fit p-2 border-x-4 border-x-slate-500 
              grid grid-cols-2 gap-1 items-center"
    >
      <p>{exp}</p>
      <Cross
        className={`w-6 h-6 text-slate-500 cursor-pointer`}
        onClick={() => remove()}
      />
    </div>
  )
}

type Props = {
  displaySearchBar: Dispatch<SetStateAction<boolean>>
}

export default function FilterAdvanced({ displaySearchBar }: Props) {
  const filters = useStore(state => state.search.filter.experiment)
  const [searched_exp,setSearchedExp] = useState("")
  const [x,setX] = useState("")
  const [y,setY] = useState("")
  const pushExp = useStore(state => state.search.pushExp)
  const pushVar = useStore(state => state.search.pushVar)
  const removeExp = useStore(state => state.search.removeExp)
  const removeVar = useStore(state => state.search.removeVar)
  const setExtension = useStore(state => state.search.setExtension)
  const toggleLossless = useStore(state => state.search.toggleLossless)
  const setResolution = useStore(state => state.search.setResolution)
  const setConfig = useStore(state => state.search.setConfig)
  
  const {data, error, isLoading} = useSearch(searched_exp)

  useEffect(() => {
    if(x && y){
      const rx = parseFloat(x)
      const ry = parseFloat(y)
      setResolution(rx,ry)
    }
  }, [x,y])

  return (
    <Section title="Advanced filters">
      {filters.exp_ids && filters.exp_ids?.length>0 &&
        <Row>
          {filters.exp_ids.map((exp, idx) => 
            <ExpButton
              exp={exp}
              key={idx}
              remove={() => {
                removeExp(exp)
              }}
            />
          )}
        </Row>
      }
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
              if (e === "Enter" && data?.map((e) => e.exp_id).includes(searched_exp)) {
                pushExp(searched_exp)
              }
            }}
          />
        {data && !isLoading &&
          <Select defaultValue="default" onChange={(e) => pushExp(e.target.value)}>
            <option value="default" disabled>Select a valid id</option>
            {data?.map((e, i) =>
              <option value={e.exp_id} key={i}>{e.exp_id}</option>
            )}
          </Select>
        }
      </Row>
      <Row>
        <Label>Variables</Label>
        <MultiSelect
            name="variables"
            id="variables"
            defaultValue={[]}
            onChange={(e) =>
              pushVar(e)
            }
          >
            {SUPPORTED_VARIABLES.map((ext, idx) => {
              return (
                <option value={ext} key={idx}>
                  {ext}
                </option>
              )
            })}
        </MultiSelect>
      </Row>
      <Row>
        <Label>Extension</Label>
        <Select
          name="extension"
          id="extension"
          defaultValue={filters.extension || SUPPORTED_EXTENSION[0]}
          onChange={(e) => setExtension(e.target.value)}
        >
          {SUPPORTED_EXTENSION.map((ext, idx) => {
            return (
              <option value={ext} key={idx}>
                {ext}
              </option>
            )
          })}
        </Select>
      </Row>
      <Row>
        <Label>Configuration</Label>
        <InputField
            name="config"
            id="config"
            placeholder="configuration ..."
            value={filters.config || ''}
            onChange={(e) => setConfig(e)}
          />
      </Row>
      <Row>
        <Label>Lossless</Label>
        <Checkbox
            name="lossless"
            id="lossless"
            checked={filters.lossless || false}
            onChange={() => toggleLossless()}
          ></Checkbox>
      </Row>
      <Row>
        <Label>Resolution</Label>
        <h5>x</h5>
          <Select
            name="rx"
            id="rx"
            defaultValue={SUPPORTED_RESOLUTION[0].toString()}
            onChange={
              (e) => {
                const x = e.target.value == SUPPORTED_RESOLUTION[0] ? '0' : e.target.value
                setX(x)
              }
            }
          >
            {SUPPORTED_RESOLUTION.map((ext, idx) => {
              return (
                <option value={ext} key={idx}>
                  {ext}
                </option>
              )
            })}
          </Select>

          <h5>y</h5>
          <Select
            name="ry"
            id="ry"
            defaultValue={SUPPORTED_RESOLUTION[0].toString()}
            onChange={
              (e: any) => {
                const y = e.target.value == SUPPORTED_RESOLUTION[0] ? '0' : e.target.value
                setY(y)
              }
            }
          >
            {SUPPORTED_RESOLUTION.map((ext, idx) => {
              return (
                <option value={ext} key={idx}>
                  {ext}
                </option>
              )
            })}
          </Select>
      </Row>
      {filters.exp_ids && filters.exp_ids.length > 0 ? 
      (
        <a href={buildHref(filters)}>
          <div className="bg-slate-600 text-slate-300 rounded-lg outline-none px-5 py-2 tracking-widest shadow w-fit">
            Load
          </div>
        </a>
      ) : null}
    </Section>
  )
}

function buildKeyValue<T>(key:string,value:T | null) {
  if(value) {
    return `${key}=${value}` 
  }
  return ''
}

function join(...args: string[]) {
  return args.filter(e => e).join("&")
}

function buildHref(filters:ExperimentFilters) {
  const exp_ids = buildKeyValue('exp_ids',filters.exp_ids)
  const variables = buildKeyValue('variables',filters.variables)
  const config = buildKeyValue('config_name',filters.config)
  const extension = buildKeyValue('extension',filters.extension)
  const lossless = buildKeyValue('lossless',filters.lossless)
  const resolution = buildKeyValue('resolution',filters.resolution !== null ? `${filters.resolution.x}*${filters.resolution.y}`:null)
  return `/experiments/?${join(exp_ids,variables,config,extension,lossless,resolution)}`
}