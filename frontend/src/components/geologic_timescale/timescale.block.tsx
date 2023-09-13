import { memo, useMemo } from "react"
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
import { Cell } from "./timescale.cell"

export type BlockProps = {
  parent_span: number
  branch: GeoBranch
  selection: Selection | undefined
  onSelect: (param: Selection) => void
  status: BlockStatus
  is_focus: boolean
}

export const Block = memo(function Block({
  branch,
  onSelect,
  selection,
  status,
  parent_span,
  is_focus,
}: BlockProps) {
  function b_onSelect(param: Selection) {
    onSelect({
      id: branch.id,
      pid: branch.parent_id,
      data: branch.data,
      fallthrought: param.fallthrought,
      action: param.action,
      child: param,
    })
  }
  const grow_span = useMemo(() => {
    const span = Math.abs(branch.data.age_span.to - branch.data.age_span.from)
    return Math.floor((span / parent_span) * 100)
  }, [parent_span])


  if (branch.branches.size === 0) {
    return (
      <Cell
        grow_span={grow_span}
        key={branch.id}
        branch={branch}
        highlight={status.highlight}
        is_focus={is_focus}
        appearance={status.appearance}
        onSelect={onSelect}
      />
    )
  }

  return (
    <div
      style={{ flexGrow: grow_span, flexBasis: 0 }}
      className={`
              ${status.appearance === BlockAppereance.full ? "" : ""}
              ${status.appearance === BlockAppereance.hidden ? "hidden" : ""}
              ${
                status.appearance === BlockAppereance.reduced
                  ? "w-[2em] h-10"
                  : ""
              }
              truncate transition-all duration-300 ease-in-out `}
      key={branch.id}
    >
      <Cell
        grow_span={grow_span}
        key={branch.id}
        branch={branch}
        onSelect={onSelect}
        is_focus={is_focus}
        appearance={status.appearance}
        highlight={status.highlight}
      />
      <div className="w-full flex flex-row truncate transition-all duration-300 ease-in-out ">
        {Array.from(branch.branches).map(([sub_id, sub_branch]) => {
          const next_selection = nextSelection(sub_id, branch.id, selection)
          return (
            <Block
              parent_span={Math.abs(
                branch.data.age_span.to - branch.data.age_span.from,
              )}
              key={sub_id}
              onSelect={b_onSelect}
              status={statusOf(sub_branch, next_selection)}
              selection={next_selection}
              is_focus={is_focus}
              branch={sub_branch}
            />
          )
        })}
      </div>
    </div>
  )
})
