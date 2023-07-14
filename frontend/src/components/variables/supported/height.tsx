import { Variable } from "../utils"
import MountainGreeIcon from "$/assets/icons/mountain-emerald-300.svg";
import MountainIcon from "$/assets/icons/mountain-slate-500.svg";
import { useClusterStore } from "@/utils/store/cluster.store";
import Slider from "@/components/inputs/Slider";
import InputNumber from "@/components/inputs/InputNumber";

type Props = {
}

export function Height({}:Props) {
    const height = useClusterStore((state) => state.variables.height)
    return (
        <Variable title = {"Surface"} toggle = {() => height.toggle()}
        src={height.active?MountainGreeIcon:MountainIcon} active = {height.active} controls = {true}>
            <div>
                <div className="flex flex-wrap gap-2 items-center py-1">
                    <h5 className="w-56"> height diplacement</h5>
                    <Slider min={0} max = {0.8} value = {height.diplacement} onChange={(event : any) => {
                        return height.updateDiplacement(event?.target.value)}} step={0.001}></Slider>
                    <InputNumber value = {height.diplacement} min={0} max = {0.8} onChange={(event : any) => {
                        return height.updateDiplacement(event?.target.value)}}></InputNumber>
                </div>
            </div>
        </Variable> 
    )
}