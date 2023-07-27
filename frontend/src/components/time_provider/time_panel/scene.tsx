import { Time, TimeFrame } from "@/utils/store/time/time.type"
import { VariableName } from "@/utils/store/variables/variable.types"
import { Experiment } from "@/utils/types"
import { MutableRefObject } from "react"
import { CanvasHolder, tickBuilder } from "../tick"
import { World } from "@/components/3D_components/World"
import { OrbitControls, PerspectiveCamera, View } from "@react-three/drei"
import { useClusterStore } from "@/utils/store/cluster.store"

export type SceneProps = {
  time_idx : number
  collection_idx: number
  panel_idx: number
  track: MutableRefObject<HTMLElement>
  time: Time
  exps: Experiment[]
  frame: TimeFrame
  active_variables: VariableName[]
  context: CanvasHolder
}

export function Scene({
  time_idx,
  collection_idx,
  panel_idx,
  track,
  time,
  exps,
  frame,
  active_variables,
  context,
}: SceneProps) {
  var config = {
    model: "Dune",
    heightData: "/assets/textures/tfgzk_height.smoothed.png",
  }
  const linked = useClusterStore(state => state.time.cameras_state.get(time_idx)?.get(collection_idx)?.get(panel_idx))
  return (
    <View track={track}>
      <World
        config={config}
        tick={tickBuilder(time, exps, frame, active_variables, context)}
      />
      {linked && 
      <>
      <PerspectiveCamera makeDefault position={[3, 2, 9]} fov={55} near={0.1} far={200} />
          <OrbitControls makeDefault />
      </>  }
    </View>
  )
}
