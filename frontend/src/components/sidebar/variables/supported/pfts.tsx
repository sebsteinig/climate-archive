import { Variable, VariableProps } from "../utils"
import { useClusterStore } from "@/utils/store/cluster.store"

export function Pfts({
  current_variable_controls,
  setCurrentVariableControls,
}: VariableProps) {
  const pfts = useClusterStore((state) => state.variables.pfts)
  return (
    <Variable
      title={pfts.name}
      current_variable_controls={current_variable_controls}
      setCurrentVariableControls={setCurrentVariableControls}
      controls={false}
    >
    </Variable>
  )
}
