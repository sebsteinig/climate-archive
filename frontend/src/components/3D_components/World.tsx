"use client"
import { useFrame, useThree } from "@react-three/fiber"
import { Perf } from "r3f-perf"
import { useRef, useEffect, memo } from "react"

import * as THREE from "three"
import Lights from "./Lights"
import { AtmosphereLayer, AtmosphereLayerRef } from "./AtmosphereLayer"
import { ALL_VARIABLES, EVarID } from "@/utils/store/variables/variable.types"
import { TickFn } from "../../utils/tick/tick"
import { Coordinate } from "@/utils/store/graph/graph.type"
import { useErrorBoundary } from "react-error-boundary"
import { useStore } from "@/utils/store/store"

type Props = {
  tick: TickFn
  onClick: (coordinate: Coordinate) => void
}

export const World = memo(({ tick }: Props) => {
  
    console.log('creating World component')
  
    const atmosphere_layer_ref = useRef<AtmosphereLayerRef>(null)

    useEffect(() => {
      const userVariables = state => state.variables;
  
      const unsubscribe = useStore.subscribe(
        (state) => {
          atmosphere_layer_ref.current.updateUserUniforms(state.variables.pr);
        },
        userVariables
      );
  
      // Cleanup: unsubscribe when the component is unmounted
      return unsubscribe;
    }, []);  // The empty dependency array means this useEffect runs once when the component mounts
  
    
    useFrame((state, delta) => {
      tick(delta).then((res) => {
  
        if (atmosphere_layer_ref.current) {
          atmosphere_layer_ref.current.tick(res.weight,res.uSphereWrapAmount)
        }
        // if (wind_layer_ref.current) {
        //   wind_layer_ref.current.tick(res.weight,res.uSphereWrapAmount)
        // }
        for (let [variable, data] of res.variables) {
          switch (variable) {
            case EVarID.pr: {
              if (atmosphere_layer_ref.current && res.update_texture) {
                atmosphere_layer_ref.current.updateTextures(data)
              }
              break
            }
            // case EVarID.winds: {
            //   if (wind_layer_ref.current && res.update_texture) {
            //     wind_layer_ref.current.updateTextures(data)
            //   }
            //   break
            // }
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
        {/* <WindLayer ref={wind_layer_ref} /> */}
  
        <Perf position="top-right" />
      </>
    )
  });

type OuterSphereRef = THREE.Mesh<
  THREE.BufferGeometry<THREE.NormalBufferAttributes>
>
type OuterSphereProps = {
  onClick: (coordinate: Coordinate) => void
}

function OuterSphere({ onClick }: OuterSphereProps) {
  const outer_spher_ref = useRef<OuterSphereRef>(null)
  const { camera, raycaster, mouse } = useThree()

  return (
    <mesh
      ref={outer_spher_ref}
      onDoubleClick={(e) => {
        raycaster.setFromCamera(mouse, camera)

        const intersects = raycaster.intersectObject(outer_spher_ref.current!)

        if (intersects.length > 0) {
          const intersect = intersects[0]
          if (intersect.uv) {
            const lon = intersect.uv.x * 360 - 180
            const lat = intersect.uv.y * 180 - 90

            onClick({ lat, lon })
          }
        }
      }}
    >
      <sphereGeometry args={[1.1, 64, 32]} />
      <meshStandardMaterial visible={false} />
    </mesh>
  )
}
