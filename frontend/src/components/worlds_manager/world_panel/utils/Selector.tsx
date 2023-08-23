import Select from "@/components/inputs/Select"
import { database_provider } from "@/utils/database_provider/DatabaseProvider"
import { useStore } from "@/utils/store/store"
import { WorldID, TimeMode, WorldData } from "@/utils/store/worlds/time.type"
import { getTitleOfExp } from "@/utils/types.utils"
import { useErrorBoundary } from "react-error-boundary"

type SelectorProps = {
  world_id: WorldID
  data: WorldData
}

export function Selector({ world_id, data }: SelectorProps) {
  const changeExp = useStore((state) => state.worlds.changeExp)
  const { showBoundary } = useErrorBoundary()

  if (data.time.mode === TimeMode.mean) return null
  return (
    <Select
      className="grow"
      defaultValue={data.exp?.id}
      onChange={(e) => {
        const idx = e.target.selectedIndex
        const exp = data.collection.exps[idx]

        database_provider
          .load({ exp_id: exp.id })
          .then(async () => {
            changeExp(world_id, exp)
          })
          .catch((e) => {
            showBoundary(e)
          })
      }}
    >
      {data.collection?.exps.map((e) => {
        const { id, label } = getTitleOfExp(e)
        return (
          <option key={e.id} value={e.id}>
            {id} | {label}
          </option>
        )
      })}
    </Select>
  )
}
