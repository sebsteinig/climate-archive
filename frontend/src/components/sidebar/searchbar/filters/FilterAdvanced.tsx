import ButtonSecondary from "@/components/buttons/ButtonSecondary"
import Checkbox from "@/components/inputs/Checkbox"
import InputField from "@/components/inputs/InputField"
import MultiSelect from "@/components/inputs/MultiSelect"
import Select from "@/components/inputs/Select"
import { DefaultParameter } from "@/utils/api/api.types"
import { useEffect, useState } from "react"
import ArrowUp from "$/assets/icons/arrow-up-emerald-400.svg"
import Cross from "$/assets/icons/cross-small-emerald-300.svg"
import ArrowDown from "$/assets/icons/arrow-down-emerald-400.svg"
import { RequestMultipleTexture } from "@/utils/database_provider/database_provider.types"
import { Experiments } from "../../../../utils/types"
import { useClusterStore } from "@/utils/store/cluster.store"
import { database_provider } from "@/utils/database_provider/DatabaseProvider"
import { TimeMode } from "@/utils/store/time/time.type"
type Exp = {
  id: string
  display: boolean
}

const SUPPORTED_EXTENSION = ["png", "webp", "jpg"]
const SUPPORTED_RESOLUTION = ["default", 1, 2]
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
]

function ExpButton({ exp, remove }: { exp: Exp; remove: Function }) {
  if (exp.display) {
    return (
      <div
        className="label mt-2 bg-slate-600 w-fit p-2 border-x-4 border-x-slate-500 
                grid grid-cols-2 gap-1 items-center"
      >
        <p>{exp.id}</p>
        <Cross className={`w-6 h-6 text-slate-500 cursor-pointer`} onClick={() => remove()}/>
      </div>
    )
  }
  return null
}

type Props = {
  setSearchBarVisible: Function
}

export default function FilterAdvanced({ setSearchBarVisible }: Props) {
  const addCollection = useClusterStore((state) => 
    state.addCollection,
  )
  const [display, setDisplay] = useState(false)
  const [exp_ids, setExpIds] = useState<{ exp_ids: Exp[]; search: string }>({
    exp_ids: [],
    search: "",
  })
  const [config, setConfig] = useState("")
  const [extension, setExtension] = useState(SUPPORTED_EXTENSION[0])
  const [lossless, setLossless] = useState(true)
  const [resolution, setResolution] = useState<{ x?: number; y?: number }>({})
  const [variables, setVariables] = useState<string[]>([])
  const addUnsync = useClusterStore((state) => state.time.addUnSync)
  if (!display) {
    return (
      <>
        <span
          onClick={() => setDisplay(true)}
          className="inline-flex cursor-pointer"
        >
          <h3>Advanced filters</h3>
          <ArrowDown className={`w-4 h-4 self-center ml-4 text-emerald-400`}/>
          
        </span>
      </>
    )
  }

  return (
    <>
      <span
        onClick={() => {
          setDisplay(false)
        }}
        className="inline-flex cursor-pointer"
      >
        <h3>Advanced filters</h3>
        <ArrowUp className={`w-4 h-4 self-center ml-4  text-emerald-400`}/>
        
      </span>
      <span className="flex flex-wrap gap-2">
        {exp_ids.exp_ids?.map((exp, idx) => {
          return (
            <ExpButton
              exp={exp}
              key={idx}
              remove={() => {
                setExpIds((prev) => {
                  prev.exp_ids[idx].display = false
                  prev.exp_ids.splice(idx, 1)
                  return { search: prev.search, exp_ids: prev.exp_ids }
                })
              }}
            />
          )
        })}
      </span>

      <div className="grid grid-flow-col auto-cols-max items-center">
        <h4 className="w-40"> Experiments :</h4>
        <span className="pt-3 grid grid-flow-col auto-cols-max gap-3 items-center">
          <InputField
            name="expid_input"
            value={exp_ids.search}
            id="expid_input"
            placeholder="experiment id ..."
            onChange={(e: any) => {
              setExpIds((prev) => {
                return {
                  ...prev,
                  search: e.target.value,
                  exp_ids: prev.exp_ids.filter((e) => e.display),
                }
              })
            }}
            onKeyDown={(e: any) => {
              if (e.key === "Enter") {
                setExpIds((prev) => {
                  return {
                    search: "",
                    exp_ids: [
                      ...prev.exp_ids,
                      ...prev.search
                        .replaceAll(",", " ")
                        .split(" ")
                        .filter((e) => e)
                        .map((id) => {
                          return { id, display: true }
                        }),
                    ],
                  }
                })
              }
            }}
          ></InputField>
        </span>
      </div>

      <div className="grid grid-flow-col auto-cols-max items-center">
        <h4 className="w-40">Variables :</h4>
        <span className="pt-3 grid grid-flow-col auto-cols-max gap-3 items-center">
          <MultiSelect
            name="variables"
            id="variables"
            defaultValue={[]}
            onChange={(e: any) =>
              setVariables((prev) => {
                const variable = e.target.value
                if (prev.includes(variable)) {
                  return prev
                }
                return [...prev, variable]
              })
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
        </span>
      </div>

      <div className="grid grid-flow-col auto-cols-max items-center">
        <h4 className="w-40">Configuration :</h4>
        <span className="pt-3 grid grid-flow-col auto-cols-max gap-3 items-center">
          <InputField
            name="config"
            id="config"
            placeholder="configuration ..."
            value={config}
            onChange={(e: any) => setConfig(e.target.value)}
          ></InputField>
        </span>
      </div>

      <div className="grid grid-flow-col auto-cols-max items-center">
        <h4 className="w-40">Extension :</h4>
        <span className="pt-3 grid grid-flow-col auto-cols-max gap-3 items-center">
          <Select
            name="extension"
            id="extension"
            defaultValue={extension}
            onChange={(e: any) => setExtension(e.target.value)}
          >
            {SUPPORTED_EXTENSION.map((ext, idx) => {
              return (
                <option value={ext} key={idx}>
                  {ext}
                </option>
              )
            })}
          </Select>
        </span>
      </div>

      <div className="grid grid-flow-col auto-cols-max items-center">
        <h4 className="w-40">Lossless :</h4>
        <span className="pt-3 grid grid-flow-col auto-cols-max gap-3 items-center">
          <Checkbox
            name="lossless"
            id="lossless"
            checked={lossless}
            onChange={(e: any) => setLossless((prev) => !prev)}
          ></Checkbox>
        </span>
      </div>

      <div className="grid grid-flow-col auto-cols-max items-center">
        <h4 className="w-40">Resolution :</h4>
        <span className="pt-3 grid grid-flow-col auto-cols-max gap-3 items-center">
          <h5>x :</h5>
          <Select
            name="ry"
            id="ry"
            defaultValue={SUPPORTED_RESOLUTION[0].toString()}
            onChange={(e: any) => {
              if (e.target.value == SUPPORTED_RESOLUTION[0]) {
                setResolution((prev) => {
                  return {
                    ...prev,
                    y: 0,
                  }
                })
              } else {
                setResolution((prev) => {
                  return {
                    ...prev,
                    y: parseFloat(e.target.value),
                  }
                })
              }
            }}
          >
            {SUPPORTED_RESOLUTION.map((ext, idx) => {
              return (
                <option value={ext} key={idx}>
                  {ext}
                </option>
              )
            })}
          </Select>

          <h5>y :</h5>
          <Select
            name="rx"
            id="rx"
            defaultValue={SUPPORTED_RESOLUTION[0].toString()}
            onChange={(e: any) => {
              if (e.target.value == SUPPORTED_RESOLUTION[0]) {
                setResolution((prev) => {
                  return {
                    ...prev,
                    x: 0,
                  }
                })
              } else {
                setResolution((prev) => {
                  return {
                    ...prev,
                    x: parseFloat(e.target.value),
                  }
                })
              }
            }}
          >
            {SUPPORTED_RESOLUTION.map((ext, idx) => {
              return (
                <option value={ext} key={idx}>
                  {ext}
                </option>
              )
            })}
          </Select>
        </span>
      </div>

      <ButtonSecondary
        disabled={exp_ids.exp_ids.length == 0}
        onClick={async () => {
          setSearchBarVisible(false)
          const request = {
            exp_ids: exp_ids.exp_ids.map((e) => e.id),
            variables: variables,
            config_name: config != "" ? config : undefined,
            extension: extension,
            lossless: lossless,
            resolution: {
              x: resolution.x ?? 0,
              y: resolution.y ?? 0,
            },
          }
          await database_provider.loadAll({
            exp_ids: request.exp_ids,
          })
          const collection = {
            exps: request.exp_ids.map((exp) => {
              return { id: exp, metadata: [] }
            }),
          } as Experiments
          database_provider.addCollectionToDb(collection)
          addCollection(collection, (idx)=>{
            addUnsync(idx, {
              mode: TimeMode.ts,
            })
          })
        }}
      >
        Load
      </ButtonSecondary>
    </>
  )
}
