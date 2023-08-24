import {
  TimeFrameRef,
  WorldID,
  WorldData,
} from "@/utils/store/worlds/time.type"
import { EVarID } from "@/utils/store/variables/variable.types"
import { World } from "@/components/3D_components/World"
import {
  OrbitControls,
  OrthographicCamera,
  PerspectiveCamera,
  View,
} from "@react-three/drei"
import { PanelRef } from "./Panel"
import {
  RefObject,
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react"
import { tickBuilder } from "../../../utils/tick/tick"
import { Coordinate } from "@/utils/store/graph/graph.type"
import { CanvasRef } from "@/utils/hooks/useCanvas"

export type SceneProps = {
  world_id: WorldID
  panel_ref: RefObject<PanelRef>
  data: WorldData
  current_frame: TimeFrameRef
  active_variables: EVarID[]
  canvas: CanvasRef
  showPopup : (data : WorldData, {lat, lon} : {lat : number, lon : number}, world_id : number) => void  
}
export type SceneRef = {
  canOrbit: (can_orbit: boolean) => void
  linkCamera: (is_linked: boolean) => void
}
export const Scene = forwardRef<SceneRef, SceneProps>(function Scene(
  {
    world_id,
    panel_ref,
    data,
    current_frame,
    active_variables,
    canvas,
    showPopup
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
  function handleClickOnWorld({ lat, lon }: Coordinate) {
    showPopup(data, {lat, lon}, world_id)
  }
  if (!panel_ref.current?.container_ref.current) {
    return null
  }
  return (
    <View track={panel_ref.current!.container_ref.current!.track}>
      <color attach="background" args={["#020617"]} />
      <World
        onClick={handleClickOnWorld}
        tick={tickBuilder(
          world_id,
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
