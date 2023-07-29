import { Time, TimeFrame, TimeFrameRef } from "@/utils/store/time/time.type"
import { VariableName } from "@/utils/store/variables/variable.types"
import { Experiment } from "@/utils/types"
import { MutableRefObject, useMemo, useRef } from "react"
import { CanvasHolder, tickBuilder } from "../tick"
import { World } from "@/components/3D_components/World"
import { OrbitControls, PerspectiveCamera, View } from "@react-three/drei"
import { useClusterStore } from "@/utils/store/cluster.store"
import THREE from "three"

export type SceneProps = {
  time_idx: number
  collection_idx: number
  track: MutableRefObject<HTMLElement>
  time: Time
  exps: Experiment[]
  current_frame: TimeFrameRef
  active_variables: VariableName[]
  context: CanvasHolder
  onChange: (frame: TimeFrame) => void
}

export function Scene({
  time_idx,
  collection_idx,
  track,
  time,
  exps,
  current_frame,
  active_variables,
  context,
  onChange,
}: SceneProps) {
  var config = {
    model: "Dune",
    heightData: "/assets/textures/tfgzk_height.smoothed.png",
  }
  const time_slots = useClusterStore((state) => state.time.slots.map)
  const conf = useMemo(() => {
    return time_slots.get(time_idx)!.collections.get(collection_idx)!
  }, [time_slots])
  const camera = useRef()
  return (
    <View track={track}>
      <World
        config={config}
        tick={tickBuilder(
          time,
          time_idx,
          collection_idx,
          exps,
          current_frame,
          active_variables,
          context,
          onChange,
        )}
      />
      {conf.camera.is_linked ? 
        <>
          <OrbitControls  />
        </>
        : 
        <>
          <PerspectiveCamera
            makeDefault
            ref={camera}
            position={[3, 2, 9]}
            fov={55}
            near={0.1}
            far={200}
          />
          <OrbitControls  camera={camera.current}/>
        </>
      }
      {/* <>
          <PerspectiveCamera
            makeDefault
            position={[3, 2, 9]}
            fov={55}
            near={0.1}
            far={200}
          />
          <OrbitControls makeDefault />
        </> */}
    </View>
  )
}
