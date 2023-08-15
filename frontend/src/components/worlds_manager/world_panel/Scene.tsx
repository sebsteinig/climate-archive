import { TimeFrameRef, TimeID, WorldData } from "@/utils/store/time/time.type"
import { EVarID } from "@/utils/store/variables/variable.types"
import { World } from "@/components/3D_components/World"
import {
  OrbitControls,
  OrthographicCamera,
  PerspectiveCamera,
  View,
} from "@react-three/drei"
import { CanvasRef } from "../useCanvas"
import { PanelRef } from "./Panel"
import {
  MutableRefObject,
  RefObject,
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react"
import { tickBuilder } from "../tick"
import { ThreeEvent, useThree } from "@react-three/fiber"
import THREE from "three"
import { AtmosphereLayerRef } from "@/components/3D_components/AtmosphereLayer"

export type SceneProps = {
  time_id: TimeID
  panel_ref: RefObject<PanelRef>
  data: WorldData
  current_frame: TimeFrameRef
  active_variables: EVarID[]
  canvas: CanvasRef
}
export type SceneRef = {
  canOrbit: (can_orbit: boolean) => void
  linkCamera: (is_linked: boolean) => void
}
export const Scene = forwardRef<SceneRef, SceneProps>(function Scene(
  {
    time_id,
    panel_ref,
    data,
    current_frame,
    active_variables,
    canvas,
  }: SceneProps,
  ref,
) {
  const camera_ref = useRef()
  const [can_orbit, setOrbitControl] = useState(true)
  const [is_linked, linkCamera] = useState(true)
  useImperativeHandle(ref, () => {
    return {
      canOrbit(can_orbit) {
        setOrbitControl(can_orbit)
      },
      linkCamera(is_linked) {
        linkCamera(is_linked)
      },
    }
  })
  function handleClickOnWorld(lat:number,lon:number) {
    panel_ref.current?.container_ref.current?.showClickPanel(data,{lat,lon})
  }
  if (!panel_ref.current?.container_ref.current) {
    return null
  }
  return (
    <View track={panel_ref.current!.container_ref.current!.track} 
    >
      <color attach="background" args={["#020617"]} />
      <World
        onClick={handleClickOnWorld}
        tick={tickBuilder(
          time_id,
          panel_ref,
          data,
          current_frame,
          active_variables,
          canvas,
        )}
      />
      {is_linked ? (
        <>
          {can_orbit ? (
            <OrbitControls />
          ) : (
            <>
              <OrthographicCamera
                makeDefault
                //ref={camera}
                position={[3, 2, 9]}
                zoom={100}
                //fov={55}
                near={0.1}
                far={200}
              />
              <OrbitControls enableRotate={false} />
            </>
          )}
        </>
      ) : (
        <>
          <PerspectiveCamera
            makeDefault
            ref={camera_ref}
            position={[3, 2, 9]}
            fov={55}
            near={0.1}
            far={200}
          />
          <OrbitControls enableRotate={can_orbit} />
        </>
      )}
    </View>
  )
})