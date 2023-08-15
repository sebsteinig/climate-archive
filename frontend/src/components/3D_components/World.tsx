"use client"
import { useFrame, useThree } from "@react-three/fiber"
import { Perf } from "r3f-perf"
import { useRef} from "react"

import * as THREE from "three"
import Lights from "./Lights"
import { AtmosphereLayer, AtmosphereLayerRef } from "./AtmosphereLayer"
import { EVarID } from "@/utils/store/variables/variable.types"
import { TickFn } from "../worlds_manager/tick"

type Props = {
  tick: TickFn
  onClick : (lat:number,lon:number) => void
}

export function World({ tick , onClick }: Props) {
  console.log("creating World component")

  const atmosphere_layer_ref = useRef<AtmosphereLayerRef>(null)
  useFrame((state, delta) => {
    tick(delta).then((res) => {
      //console.log(res.update_texture);
      if (atmosphere_layer_ref.current) {
        atmosphere_layer_ref.current.tick(res.weight, res.uSphereWrapAmount)
      }
      for (let [variable, data] of res.variables) {
        switch (variable) {
          case EVarID.pr: {
            if (atmosphere_layer_ref.current && res.update_texture) {
              atmosphere_layer_ref.current.updateTextures(data)
            }
            break
          }
        }
      }
    })
  })

  return (
    <>
      {/* {<Perf position='bottom-right' />}
      {useTitle && <Title config={config}/>}
      <Controls /> */}
      <Lights />
      {/* <Surface ref={sphereRef} config={config} /> */}
      {/* <ATM_2D ref={atm2DRef} /> */}
      <AtmosphereLayer ref={atmosphere_layer_ref} />

      <OuterSphere onClick={onClick}/>
      <Perf position="bottom-right" />
    </>
  )
}


type OuterSphereRef = THREE.Mesh<THREE.BufferGeometry<THREE.NormalBufferAttributes>>;
type OuterSphereProps = {
  onClick : (lat:number,lon:number) => void
}

function OuterSphere({onClick}:OuterSphereProps) {
  const outer_spher_ref = useRef<OuterSphereRef>(null)
  const {camera,raycaster,mouse} = useThree()

  return (
    <mesh ref={outer_spher_ref} onDoubleClick={(e) => {
      raycaster.setFromCamera(mouse, camera);
      
      const intersects = raycaster.intersectObject(outer_spher_ref.current!);

      if (intersects.length > 0) {
        const intersect = intersects[0];
        if(intersect.uv) {
          var cursorLongitude = intersect.uv.x * 360. - 180.
          var cursorLatitude = intersect.uv.y * 180. - 90.
        
          onClick(cursorLatitude,cursorLongitude)
        }
    }}
    }>
      <sphereGeometry args={[1.1, 64, 32]} />
      <meshStandardMaterial visible={false} />
    </mesh>
  )   
}
