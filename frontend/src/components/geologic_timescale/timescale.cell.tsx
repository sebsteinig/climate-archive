import { memo, useRef } from "react"
import { GeoBranch } from "./utils/geologic_tree.utils"
import {
  BlockAppereance,
  BlockStatus,
  Selection,
  SelectionAction,
  lastOf,
  nextSelection,
  selectionEquality,
  statusOf,
} from "./timescale.utils"

export type CellProps = {
  grow_span?: number
  className?: string
  branch: GeoBranch
  onSelect: (param: Selection) => void
  appearance: BlockAppereance
  is_focus: boolean
  highlight: boolean
}

export const Cell = memo(function Cell({
  className,
  branch,
  onSelect,
  highlight,
  is_focus,
  grow_span,
  appearance,
}: CellProps) {
  return (
    <div
      className={`cursor-pointer truncate text-clip tracking-widest 
              small-caps py-1 text-slate-900 text-center ${className ?? ""}
              border border-slate-200 ${!highlight ? "brightness-50" : ""}
              transition-all duration-300 ease-in-out 
              `}
      style={{ backgroundColor: branch.data.color, flexGrow: grow_span ?? 1, flexBasis: 0 }}
      onMouseOver={() => {
        // highlight only selected route
        // if (appearance === BlockAppereance.full && !is_focus) {
        //   onSelect({
        //     id: branch.id,
        //     pid: branch.parent_id,
        //     data: branch.data,
        //     fallthrought: false,
        //     action: SelectionAction.highlight,
        //   })
        // }
      }}
      onClick={() => {
        onSelect({
          id: branch.id,
          pid: branch.parent_id,
          data: branch.data,
          fallthrought: true,
          // action: SelectionAction.focus,
          action: SelectionAction.highlight,
        })
      }}
    >
      {appearance === BlockAppereance.full
        ? branch.data.name
        : branch.data.name.charAt(0)}
    </div>
  )
})
