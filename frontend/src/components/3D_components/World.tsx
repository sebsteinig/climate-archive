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
  config: {
    model: string
    heightData: string
  }
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

export function World({ config, tick }: Props) {
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
    // if(res.precipitation) {
    // console.log(sphereRef)

    // sphereRef.current.update()
    // }
    tick(delta).then((res) => {
      // console.log(res)
      for (let [variable, data] of res) {
        if (variable == 6) {
          atm2DRef.current.update(data)
        }
        // texture.load(data.current_url, (tt) => {
        //   if (sphereRef.current) {
        //     sphereRef.current.material.map = tt
        //   }
        }
      // console.log(res)
      // for (let [variable, data] of res) {
      //   texture.load(data.current_url, (tt) => {
      //     if (sphereRef.current) {
      //       sphereRef.current.material.map = tt
      //     }
      //   })
      //   break
      // }
      //   for (let [variable, data] of res) {
      //     console.log(variable)
      //   break
      // }
      // if(res.precipitation) {
      //   sphereRef.current.update(res.precipitation)
      // }
    })

    // if (rotate) {
    //   sphereRef.current!.rotation.y += delta / 3
    // }
  })

  return (
    <>
      {/* {<Perf position='bottom-right' />}
      {useTitle && <Title config={config}/>}
      <Controls /> */}
      <Lights />
      {/* <Surface ref={sphereRef} config={config} /> */}
      <ATM_2D ref={atm2DRef} config={{placeholder: "test"}}/>
      <Perf position="bottom-right" />
      {/* <Plane /> */}
    </>
  )
}
