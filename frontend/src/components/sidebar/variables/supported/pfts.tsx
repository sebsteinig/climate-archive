import { Variable, VariableProps } from "../Variable"
import { useStore } from "@/utils/store/store"

export function Pfts({
  current_variable_controls,
  setCurrentVariableControls,
}: VariableProps) {
  const pfts = useStore((state) => state.variables.pfts)
  return (
    <Variable
      title={pfts.name}
      current_variable_controls={current_variable_controls}
      setCurrentVariableControls={setCurrentVariableControls}
      controls={false}
    ></Variable>
  )
}
