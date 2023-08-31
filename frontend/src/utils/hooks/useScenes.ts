import { PanelRef } from "@/components/worlds_manager/world_panel/Panel"
import React from "react"
import { RefObject, useRef } from "react"
import { Slots } from "../store/worlds/time/time.type"
import { SceneRef } from "@/components/worlds_manager/world_panel/Scene"

export function useScenes(worlds_slots: Slots) {
  const scene_refs = useRef<RefObject<SceneRef>[]>([])
  for (let world_id of worlds_slots.keys()) {
    scene_refs.current[world_id] = React.createRef<SceneRef>()
  }
  return scene_refs
}
