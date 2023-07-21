import { Variable, VariableProps } from "../utils"
import TreesIcon from "$/assets/icons/trees-slate-500.svg";
import TreesGreenIcon from "$/assets/icons/trees-emerald-300.svg";
import { useClusterStore } from "@/utils/store/cluster.store";

export function Pfts({current_variable_controls, setCurrentVariableControls}:VariableProps) {
    const pfts = useClusterStore((state) => state.variables.pfts)
    return (
        <Variable title = {pfts.name} toggle={() => pfts.toggle()}
        current_variable_controls = {current_variable_controls} 
        setCurrentVariableControls={setCurrentVariableControls}
        src = {pfts.active?TreesGreenIcon:TreesIcon} active = {pfts.active}  controls = {false}>
            <div >
                
            </div>
        </Variable> 
    )
}