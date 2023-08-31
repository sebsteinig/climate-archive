
import { getTitleOfExp } from "@/utils/types.utils";
import Pages from "./Pages"
import { useState } from "react";
import { Experiment } from "@/utils/types";

export default function ExperimentsTab({ exps }: { exps: Experiment[] }) {
    const [slice, setSlice] = useState<{ from: number; size: number }>({
      from: 0,
      size: 10,
    })
    return (
      <div className="p-5 overflow-x-hidden rounded-lg h-full flex flex-col ">
        <div className="flex-grow ">
          <table className="w-full table-fixed border-collapse" id="exps-table">
            <thead className="text-left bg-slate-700">
              <tr className="rounded-lg">
                <th
                  scope="col"
                  className="truncate px-10 py-3 small-caps tracking-[.5em] font-semibold text-lg border border-slate-700"
                >
                  Experiments
                </th>
                <th
                  scope="col"
                  className="truncate px-10 py-3 small-caps tracking-[.5em] font-semibold text-lg border border-slate-700 "
                >
                  Age
                </th>
              </tr>
            </thead>
            <tbody className="overflow-hidden">
              {exps.length > 0 &&
                exps.slice(slice.from, slice.from + slice.size).map((exp) => {
                  const { id, label } = getTitleOfExp(exp)
                  return (
                    <tr
                      title={`${id} | ${label}`}
                      className="w-full  tracking-widest font-normal text-md border-b border-slate-500 hover:bg-slate-800"
                      key={exp.id}
                    >
                      <td className="truncate border px-10 py-3 font-medium border-slate-800">
                        {id}
                      </td>
                      <td className="truncate border px-10 py-3 font-medium border-slate-800">
                        {label}
                      </td>
                    </tr>
                  )
                })}
            </tbody>
          </table>
        </div>
  
        <Pages 
          slice = {slice}
          exps={exps} 
          changeSlice={(x : (prev : {from : number, size : number}) => {from : number, size : number}) => setSlice(x)}
        />
      </div>
    )
  }