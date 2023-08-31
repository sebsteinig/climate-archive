import { PanelRef } from "@/components/worlds_manager/world_panel/Panel"
import React from "react"
import { RefObject, useRef } from "react"
import { Slots } from "../store/worlds/time/time.type"

export function usePanels(worlds_slots: Slots) {
  const panel_refs = useRef<RefObject<PanelRef>[]>([])
  for (let world_id of worlds_slots.keys()) {
    panel_refs.current[world_id] = React.createRef<PanelRef>()
  }
  return panel_refs
}
