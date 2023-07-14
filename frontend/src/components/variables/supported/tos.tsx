import { Variable } from "../utils"
import TemperatureIcon from "$/assets/icons/temperature-slate-500.svg";
import TemperatureGreenIcon from "$/assets/icons/temperature-emerald-300.svg"
import { useClusterStore } from "@/utils/store/cluster.store";
import Slider from "@/components/inputs/Slider";
import InputNumber from "@/components/inputs/InputNumber";
import Checkbox from "@/components/inputs/Checkbox";

type Props = {
}

export function Tos({}:Props) {
    const tos = useClusterStore((state) => state.variables.tos)
    return (
        <Variable title = {"SST"} toggle = {() => tos.toggle()}
        src={tos.active?TemperatureGreenIcon:TemperatureIcon} active = {tos.active} controls = {true}>
            <div>
                <div className="flex flex-wrap gap-2 items-center  py-1">
                    <h5 className="w-56"> SST min. [°C]</h5>
                    <Slider min={-2} max = {40} value = {tos.min} onChange={(event : any) => {
                        return tos.updateMin(event?.target.value)}} step={0.1}></Slider>
                    <InputNumber value = {tos.min} min={-2} max = {40} onChange={(event : any) => {
                        return tos.updateMin(event?.target.value)}}></InputNumber>
                </div>
                
                <div className="flex flex-wrap gap-2 items-center  py-1">
                    <h5 className="w-56"> SST max. [°C]</h5>
                    <Slider min={-2} max = {40} value = {tos.max} onChange={(event : any) => {
                        return tos.updateMax(event?.target.value)}} step={0.1}></Slider>
                    <InputNumber value = {tos.max} min={-2} max = {40} onChange={(event : any) => {
                        return tos.updateMax(event?.target.value)}}></InputNumber>
                </div> 

                <div className="flex flex-wrap gap-2 items-center  py-1">
                    <h5 className="w-56"> anomaly range [°C]</h5>
                    <Slider min={0} max = {20} value = {tos.anomaly_range} onChange={(event : any) => {
                        return tos.updateAnomalyRange(event?.target.value)}} step={0.1}></Slider>
                    <InputNumber value = {tos.anomaly_range} min={0} max = {20} onChange={(event : any) => {
                        return tos.updateAnomalyRange(event?.target.value)}}></InputNumber>
                </div> 

                <div className="flex flex-wrap gap-2 items-center py-1">
                    <h5 className="w-56"> mask anomalies below [°C]</h5>
                    <Slider min={0} max = {20} value = {tos.anomalies_lower_bound} onChange={(event : any) => {
                        return tos.updateAnomaliesLowerBound(event?.target.value)}} step={0.1}></Slider>
                    <InputNumber value = {tos.anomalies_lower_bound} min={0} max = {20} onChange={(event : any) => {
                        return tos.updateAnomaliesLowerBound(event?.target.value)}}></InputNumber>
                </div>

                <div className="flex flex-wrap gap-2 items-center py-1">
                    <h5 className="w-56"> show sea ice</h5>
                    <Checkbox checked = {tos.sea_ice} onChange={() => tos.toggleSeaIce()}></Checkbox>                    
                </div>  
            </div>
        </Variable> 
    )
}