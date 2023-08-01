"use client"
import { useFrame } from "@react-three/fiber"
import { useControls } from "leva"
import { Perf } from "r3f-perf"
import { useRef, forwardRef, RefObject } from "react"

import * as THREE from "three"
import { SphereGeometry, Mesh, MeshStandardMaterial } from "three"
import { Title } from "./Title"
import Lights from "./Lights"
import Controls from "./Controls"
import { Plane } from "./Plane"
import { Surface } from "./Surface"
import { useClusterStore } from "@/utils/store/cluster.store"
import { VariableName } from "@/utils/store/variables/variable.types"
import { TextureInfo } from "@/utils/database/database.types"
import { TickFn } from "../time_provider/tick"

type Props = {
  config: {
    model: string
    heightData: string
  }
  tick: TickFn
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

  const sphereRef = useRef<Mesh<SphereGeometry, MeshStandardMaterial>>(null)
  let texture = new THREE.TextureLoader()

  useFrame((state, delta) => {
    //console.log('tick');
    
    tick(delta).then((res) => {
      for (let [variable, data] of res.variables) {
        texture.load(data.current_url, (tt) => {
          if (sphereRef.current) {
            sphereRef.current.material.map = tt
          }
        })
        break
      }
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
      <Surface ref={sphereRef} config={config} />
      <Perf position="bottom-right" />
      {/* <Plane /> */}
    </>
  )
}
