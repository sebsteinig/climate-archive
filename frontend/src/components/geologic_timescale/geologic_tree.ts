import { useMemo } from "react"
import { GeoTree, buildTree } from "./utils/geologic_tree.utils"
import { GeoTreeRepr } from "./utils/geo_tree"
import { SpanTree, insert } from "./utils/span_tree"
import { exps_span } from "./utils/scotese_02"

export function useGeologicTree(): [GeoTree, SpanTree] {
  const tree = useMemo(() => {
    return buildTree(GeoTreeRepr)
  }, [])
  const exp_span = useMemo(() => {
    const span_tree: SpanTree = {
      root: undefined,
      binder: new Map(),
    }
    const middle =
      exps_span.timeslice[Math.floor(exps_span.timeslice.length / 2)]
    insert(span_tree, Math.abs(middle.tMin), Math.abs(middle.tMax), {
      exp_id: middle.id,
      idx: middle.frame - 1,
    })
    for (let { id, frame, tMin, tMax } of exps_span.timeslice) {
      if (frame === middle.frame) continue
      insert(span_tree, Math.abs(tMin), Math.abs(tMax), {
        exp_id: id,
        idx: frame - 1,
      })
    }
    return span_tree
  }, [tree])
  return [tree, exp_span]
}
