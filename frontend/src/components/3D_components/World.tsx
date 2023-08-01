"use client"
import { useFrame } from "@react-three/fiber"
import { useControls } from "leva"
import { Perf } from "r3f-perf"
import { useRef, forwardRef, RefObject } from "react"

import * as THREE from "three"
import { Title } from "./Title"
import Lights from "./Lights"
import Controls from "./Controls"
import { Plane } from "./Plane"
import { Surface } from "./Surface"
import { ATM_2D } from "./ATM_2D"
import { useClusterStore } from "@/utils/store/cluster.store"
import { VariableName } from "@/utils/store/variables/variable.types"
import { TextureInfo } from "@/utils/database/database.types"

type Props = {
  tick: (delta: number) => Promise<
    Map<
      VariableName,
      {
        current_url: string
        next_url: string
        weight: number
        current_info: TextureInfo
        next_info: TextureInfo
      }
    >
  >
}

export function World({ tick }: Props) {
  // for Leva debug GUI (there must be a better way for this ...)
  // const { usePerformance, useTitle } = useControls('global', {
  //   usePerformance: true,
  //   useTitle: true,
  // })
  // const { rotate } = useControls('Globe', {
  //   rotate: false,
  // })
  const atm2DRef = useRef<THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>>(null)

  let texture = new THREE.TextureLoader()

  useFrame((state, delta) => {

    tick(delta).then((res) => {
      // console.log(res)
      for (let [variable, data] of res) {
        switch (variable) {
          case VariableName.pr : { 
            atm2DRef.current.update(data) 
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
      <ATM_2D ref={atm2DRef} />

      <Perf position="bottom-right" />
    </>
  )
}
