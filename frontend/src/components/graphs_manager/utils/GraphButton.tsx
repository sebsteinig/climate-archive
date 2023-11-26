import ChartIcon from "$/assets/icons/chart.svg"
import { useStore } from "@/utils/store/store"

export default function GraphButton() {
  const show = useStore((state) => state.graph.show)
  return (
    <div className="absolute right-7 top-7 rounded-full w-fit h-fit bg-slate-700 p-4">
      <ChartIcon
        className="w-9 h-9 cursor-pointer text-slate-400 child:fill-slate-400"
        onClick={() => {
          show(true)
        }}
      />
    </div>
  )
}
