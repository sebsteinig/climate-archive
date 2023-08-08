import { TimeFrameRef, TimeID, WorldData } from "@/utils/store/time/time.type"
import { EVarID } from "@/utils/store/variables/variable.types"
import { World } from "@/components/3D_components/World"
import { OrbitControls, PerspectiveCamera, View } from "@react-three/drei"
import { CanvasRef } from "../useCanvas"
import { PanelRef } from "./Panel"
import { MutableRefObject, RefObject, useRef } from "react"
import { tickBuilder } from "../tick"

export type SceneProps = {
  time_id: TimeID
  panel_ref: RefObject<PanelRef>
  data: WorldData
  current_frame: TimeFrameRef
  active_variables: EVarID[]
  canvas: CanvasRef
}

export function Scene({
  time_id,
  panel_ref,
  data,
  current_frame,
  active_variables,
  canvas,
}: SceneProps) {
  const camera = useRef()
  if (!panel_ref.current?.container_ref.current) {
    return null
  }
  return (
    <View track={panel_ref.current!.container_ref.current!.track}>
      <World
        tick={tickBuilder(
          time_id,
          panel_ref,
          data,
          current_frame,
          active_variables,
          canvas,
        )}
      />
      {data.conf.camera.is_linked ? (
        <OrbitControls />
      ) : (
        <>
          <PerspectiveCamera
            makeDefault
            ref={camera}
            position={[3, 2, 9]}
            fov={55}
            near={0.1}
            far={200}
          />
          <OrbitControls camera={camera.current} />
        </>
      )}
    </View>
  )
}
