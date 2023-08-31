import LeftPage from "$/assets/icons/left-page.svg"
import RightPage from "$/assets/icons/right-page.svg"
import FirstPage from "$/assets/icons/first-page.svg"
import LastPage from "$/assets/icons/last-page.svg"
import { Experiment } from "@/utils/types"

type PagesProps = {
  exps: Experiment[]
  slice: { from: number; size: number }
  changeSlice: (
    x: (prev: { from: number; size: number }) => { from: number; size: number },
  ) => void
}

export default function Pages({ exps, slice, changeSlice }: PagesProps) {
  return (
    <div className="justify-between mt-5 flex flex-row">
      <div className="ml-5 tracking-[.5em] small-caps opacity-70 cursor-default">
        {exps.length} Experiment{exps.length > 1 ? "s" : ""}
      </div>
      <div className=" flex flex-row">
        <FirstPage
          className="cursor-pointer mx-5 w-5 h-5"
          onClick={() => {
            changeSlice((prev) => {
              return { ...prev, from: 0 }
            })
          }}
        />
        <LeftPage
          className="cursor-pointer mx-5 w-5 h-5"
          onClick={() => {
            changeSlice((prev) => {
              const nfrom = Math.max(prev.from - prev.size, 0)
              return { ...prev, from: nfrom }
            })
          }}
        />
        <div className="cursor-default">
          {Math.floor(slice.from / slice.size) + 1} of{" "}
          {Math.floor(exps.length / slice.size) + 1}
        </div>
        <RightPage
          className="cursor-pointer mx-5 w-5 h-5"
          onClick={() => {
            changeSlice((prev) => {
              const nfrom =
                Math.min(
                  (prev.from + prev.size) / prev.size,
                  Math.floor(exps.length / prev.size),
                ) * prev.size
              return { ...prev, from: nfrom }
            })
          }}
        />
        <LastPage
          className="cursor-pointer mx-5 w-5 h-5"
          onClick={() => {
            changeSlice((prev) => {
              const nfrom = Math.floor(exps.length / prev.size) * prev.size
              return { ...prev, from: nfrom }
            })
          }}
        />
      </div>
    </div>
  )
}
