"use client"
import { useFrame, useThree } from "@react-three/fiber"
import { Perf } from "r3f-perf"
import { useRef } from "react"

import * as THREE from "three"
import Lights from "./Lights"
import { AtmosphereLayer, AtmosphereLayerRef } from "./AtmosphereLayer"
import { ALL_VARIABLES, EVarID } from "@/utils/store/variables/variable.types"
import { TickFn } from "../../utils/tick/tick"
import { Coordinate } from "@/utils/store/graph/graph.type"
import { useErrorBoundary } from "react-error-boundary"

type Props = {
  tick: TickFn
  onClick: (coordinate: Coordinate) => void
}

export function World({ tick, onClick }: Props) {
  console.log("creating World component")
  const { showBoundary } = useErrorBoundary()

  const atmosphere_layer_ref = useRef<AtmosphereLayerRef>(null)
  useFrame((state, delta) => {
    tick(delta)
      .then((res) => {
        //console.log(res.update_texture);
        atmosphere_layer_ref.current?.tick(res.weight, res.uSphereWrapAmount)

        //if (res.variables.size === 0) return;
        if (res.update_texture) {
          for (let variable of ALL_VARIABLES) {
            if (!res.variables.has(variable)) {
              switch (variable) {
                case EVarID.pr:
                  {
                    atmosphere_layer_ref.current?.cleanTextures()
                  }
                  break
              }
            }
          }

          for (let [variable, data] of res.variables) {
            switch (variable) {
              case EVarID.pr:
                {
                  atmosphere_layer_ref.current?.updateTextures(data)
                }
                break
            }
          }
        }
      })
      .catch((e) => {
        showBoundary(e)
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

      <OuterSphere onClick={onClick} />
      <Perf position="bottom-right" />
    </>
  )
}

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
