"use client"
import { useState, useRef, useImperativeHandle, forwardRef, useEffect } from "react"
import { useGeologicTree } from "../../utils/hooks/useGeologicTree"
import { query } from "./utils/span_tree"
import {
  BlockAppereance,
  Selection,
  SelectionAction,
  lastOf,
  nextSelection,
  selectionEquality,
  statusOf,
} from "./timescale.utils"
import { Block } from "./timescale.block"
import { Cell } from "./timescale.cell"
import { useStore } from "@/utils/store/store"

type TimeScaleProps = {
  onChange: (idx: number, exp_id: string) => void
  current_frame: TimeFrameRef
  world_id: WorldID
}

// export function TimeScale({ onChange }: TimeScaleProps) {
export const TimeScale = forwardRef<any, TimeScaleProps>(({ onChange, current_frame, world_id }, ref) => {

  const worlds = useStore((state) => state.worlds)

  const [tree, exp_span_tree] = useGeologicTree()

  function onSelect(param: Selection) {
    const next_selection = {
      id: tree.root.id,
      pid: tree.root.id,
      data: tree.root.data,
      fallthrought: param.fallthrought,
      action: param.action,
      child: param,
    }
    if (selection && selectionEquality(selection, next_selection)) {
    // if (selection && is_focus && selectionEquality(selection, next_selection)) {
      setSelection(undefined)
      setFocus(false)
    } else {
      if (next_selection.action === SelectionAction.focus) {
        setFocus(true)
      }
      setSelection(next_selection)
      const span_data = query(
        exp_span_tree,
        lastOf(next_selection).data.age_span.to,
      )
      if (span_data) {
        onChange(span_data.data.idx, span_data.data.exp_id)
      }
    }
  }

  function highlightOnly(param: Selection) {
    const next_selection = {
      id: tree.root.id,
      pid: tree.root.id,
      data: tree.root.data,
      fallthrought: param.fallthrought,
      action: param.action,
      child: param,
    }
    if (selection && selectionEquality(selection, next_selection)) {
    // if (selection && is_focus && selectionEquality(selection, next_selection)) {
      setSelection(undefined)
      setFocus(false)
    } else {
      if (next_selection.action === SelectionAction.focus) {
        setFocus(true)
      }
      setSelection(next_selection)
    //   const span_data = query(
    //     exp_span_tree,
    //     lastOf(next_selection).data.age_span.to,
    //   )
    //   if (span_data) {
    //     onChange(span_data.data.idx, span_data.data.exp_id)
    //   }
    }
  }

  function r_onSelect(param: Selection) {
    param.action = SelectionAction.highlight
    setSelection(param)
    setFocus(false)
    const span_data = query(exp_span_tree, param.data.age_span.from)
    if (span_data) {
      onChange(span_data.data.idx, span_data.data.exp_id)
    }
  }
  const [selection, setSelection] = useState<Selection | undefined>()
  const [is_focus, setFocus] = useState<boolean>(false)

  // reset highlights if frame gets changed outside of the controller
  // e.g. by time slider or play/pause button
  useEffect(() => {
    // 
    const checkForChanges = () => {
        let frame = current_frame.current.get(world_id);
        if (!frame ) return;
        if (frame.swapping == true && !frame.controllerFlag) {
          setSelection(undefined)
        }
        // console.log(newValue)
    };
    // Set up the interval
    const intervalId = setInterval(checkForChanges, 10);
    // Clear the interval when the component is unmounted.
    return () => clearInterval(intervalId);
  }, []);  // The empty dependency array means this useEffect runs once when the component mounts.


  return (
    <div
    className={`w-full border-4 border-slate-200 rounded-md bg-slate-900 ${
      worlds.slots.get(world_id)?.time.animation
        ? "brightness-50 pointer-events-none"
        : "pointer-events-auto"
    }`}
      // onMouseLeave={() => {
      //   // if (!is_focus) {
      //     setSelection(undefined)
      //     const span_data = query(exp_span_tree, tree.root.data.age_span.from)
      //     if (span_data) {
      //       onChange(span_data.data.idx, span_data.data.exp_id)
      //     }
      //   // }
      // }}
    >
      <Cell
        branch={{
          ...tree.root,
          parent_id: tree.root.id,
          left_id: tree.root.id,
          right_id: tree.root.id,
        }}
        className="w-full"
        onSelect={r_onSelect}
        is_focus={is_focus}
        // is_focus={true}
        appearance={BlockAppereance.full}
        highlight={true}
      />
      <div className="w-full flex flex-row max-w-full overflow-hidden transition-all duration-300 ease-in-out ">
        {Array.from(tree.root.branches).map(([id, branch]) => {
          const next_selection = nextSelection(id, tree.root.id, selection)

          return (
            <Block
              parent_span={Math.abs(
                tree.root.data.age_span.to - tree.root.data.age_span.from,
              )}
              key={id}
              onSelect={onSelect}
              // onSelect={highlightOnly}
              status={statusOf(branch, next_selection)}
              selection={next_selection}
              is_focus={is_focus}
              // is_focus={true}
              branch={branch}
            />
          )
        })}
      </div>
    </div>
  )
});
