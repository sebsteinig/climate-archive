"use client"
import { useFrame, useThree } from "@react-three/fiber"
import { Perf } from "r3f-perf"
import { useRef, useEffect, memo } from "react"

import * as THREE from "three"
import Lights from "./Lights"
import { AtmosphereLayer, AtmosphereLayerRef } from "./AtmosphereLayer"
import { SurfaceLayer, SurfaceLayerRef } from "./SurfaceLayer"
import { WindLayer, WindLayerRef } from "./winds/WindsLayer"
import { OceanLayer, OceanLayerRef } from "./OceanLayer"

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
    const surface_layer_ref = useRef<SurfaceLayerRef>(null)
    const winds_layer_ref = useRef<WindLayerRef>(null)
    const ocean_layer_ref = useRef<OceanLayerRef>(null)

    const variables_state = useStore((state) => state.active_variables)

    // update shader uniforms when user uses GUI
    useEffect(() => {
      const userVariables = state => state.variables;

      console.log(userVariables)
  
      const unsubscribe = useStore.subscribe(
        (state) => {
            if (atmosphere_layer_ref.current) {
              atmosphere_layer_ref.current.updateUserUniforms(state.variables.pr, state.variables.height);
            }
            if (surface_layer_ref.current) {
              surface_layer_ref.current.updateUserUniforms(state.variables.height);
            }
            if (winds_layer_ref.current) {
              winds_layer_ref.current.updateUserUniforms(state.variables.winds);
            }
            if (ocean_layer_ref.current) {
              ocean_layer_ref.current.updateUserUniforms(state.variables.tos);
            }
        },
        userVariables
      );
  
      // Cleanup: unsubscribe when the component is unmounted
      return unsubscribe;
    }, []);  // The empty dependency array means this useEffect runs once when the component mounts
  
    const world_state = useStore((state) => state.worlds)

    useFrame((state, delta) => {
      tick(delta).then((res) => {

        // update frame weight and projection every frame
        if (variables_state.get(EVarID.pr)) {
          atmosphere_layer_ref.current.tick(res.weight,res.uSphereWrapAmount)
        }
        if (variables_state.get(EVarID.height)) {
          surface_layer_ref.current.tick(res.weight,res.uSphereWrapAmount)
        }
        if (variables_state.get(EVarID.winds)) {
          winds_layer_ref.current.tick(res.weight,res.uSphereWrapAmount, delta)
        }
        if (variables_state.get(EVarID.tos)) {
          ocean_layer_ref.current.tick(res.weight,res.uSphereWrapAmount)
        }
        // update textures only when necessary
        for (let variable of res.variables.keys()) {
        
          let data = res.variables.get(variable);
          let data_reference, reference_flag

          switch (variable) {

            case EVarID.pr: {
              if (atmosphere_layer_ref.current && res.update_texture) {
                if (world_state.observed_world && res.reference) {
                  // console.log("updating reference mode")
                  data_reference = res.reference ? res.reference.get(variable) : undefined;
                  reference_flag = true
                } else {
                  // console.log("updating standard mode")
                  data_reference = null
                  reference_flag = false
                }
                atmosphere_layer_ref.current.updateTextures(data, data_reference, reference_flag);
              }
              break
            }

            case EVarID.height: {
              if (surface_layer_ref.current && res.update_texture) {
                if (world_state.observed_world && res.reference) {
                  // console.log("updating reference mode")
                  data_reference = res.reference ? res.reference.get(variable) : undefined;
                  reference_flag = true
                } else {
                  // console.log("updating standard mode")
                  data_reference = null
                  reference_flag = false
                }
                surface_layer_ref.current.updateTextures(data, data_reference, reference_flag);
              }
              break
            }

            case EVarID.winds: {
              if (winds_layer_ref.current && res.update_texture) {
                if (world_state.observed_world && res.reference) {
                  // console.log("updating reference mode")
                  data_reference = res.reference ? res.reference.get(variable) : undefined;
                  reference_flag = true
                } else {
                  // console.log("updating standard mode")
                  data_reference = null
                  reference_flag = false
                }
                winds_layer_ref.current.updateTextures(data, data_reference, reference_flag);
              }
              break
            }

            case EVarID.tos: {
              if (ocean_layer_ref.current && res.update_texture) {
                if (world_state.observed_world && res.reference) {
                  // console.log("updating reference mode")
                  data_reference = res.reference ? res.reference.get(variable) : undefined;
                  reference_flag = true
                } else {
                  // console.log("updating standard mode")
                  data_reference = null
                  reference_flag = false
                }

                if ( surface_layer_ref != null ) {
                  ocean_layer_ref.current.updateTextures(data, data_reference, reference_flag, surface_layer_ref);
                } else {
                  ocean_layer_ref.current.updateTextures(data, data_reference, reference_flag);
                }
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
        {variables_state.get(EVarID.height) && <SurfaceLayer ref={surface_layer_ref} />}
        {variables_state.get(EVarID.pr) && <AtmosphereLayer ref={atmosphere_layer_ref} />}
        {variables_state.get(EVarID.tos) && <OceanLayer ref={ocean_layer_ref} />}
        {variables_state.get(EVarID.winds) && <WindLayer ref={winds_layer_ref} />}
        {/* <Perf position="top-right" deepAnalyze="true"/> */}
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
