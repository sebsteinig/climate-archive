import { GeoBranch, GeoData, GeoID } from "./utils/geologic_tree.utils"

export enum BlockAppereance {
  reduced,
  full,
  hidden,
}

export type BlockStatus = {
  highlight: boolean
  appearance: BlockAppereance
}
export type Selection = {
  data: GeoData
  id: GeoID
  pid: GeoID
  fallthrought?: boolean
  unselected?: boolean
  must_falthrought?: boolean
  child?: Selection
  action: SelectionAction
}
export function selectionEquality(sel1: Selection, sel2: Selection): boolean {
  if (sel1.id !== sel2.id) return false
  if (sel1.child) {
    if (sel2.child) {
      return selectionEquality(sel1.child, sel2.child)
    }
    return false
  } else {
    if (sel2.child) return false
    return true
  }
}

export function lastOf(selection: Selection): Selection {
  if (!selection.child) return selection
  return lastOf(selection.child)
}

export enum SelectionAction {
  focus,
  highlight,
}

export function nextSelection(
  id: GeoID,
  pid: GeoID,
  selection: Selection | undefined,
): Selection | undefined {
  if (!selection) return undefined
  if (pid === selection.id) {
    if (selection.child) {
      if (id === selection.child.id) return selection.child
    } else {
      if (selection.fallthrought) {
        return {
          ...selection,
          id,
          pid,
          must_falthrought: true,
        }
      }
    }
  }
  if (selection.child) {
    return {
      ...selection.child,
      unselected: true,
    }
  }
  return {
    ...selection,
    unselected: true,
  }
}

export function statusOf(
  branch: GeoBranch,
  selection: Selection | undefined,
): BlockStatus {
  if (selection === undefined) {
    return {
      highlight: true,
      appearance: BlockAppereance.full,
    }
  }
  if (
    selection.action === SelectionAction.focus &&
    (branch.right_id === selection.id || branch.left_id === selection.id)
  ) {
    return {
      highlight: false,
      appearance: BlockAppereance.reduced,
    }
  }
  if (selection.unselected) {
    return {
      highlight: false,
      appearance:
        selection.action === SelectionAction.focus
          ? BlockAppereance.hidden
          : BlockAppereance.full,
    }
  }
  if (selection.must_falthrought || branch.id === selection.id) {
    return {
      highlight: true,
      appearance: BlockAppereance.full,
    }
  }
  return {
    highlight: false,
    appearance:
      selection.action === SelectionAction.focus
        ? BlockAppereance.hidden
        : BlockAppereance.full,
  }
}
