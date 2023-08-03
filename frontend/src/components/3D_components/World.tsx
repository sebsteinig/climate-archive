"use client"
import { useFrame } from "@react-three/fiber"
import { useControls } from "leva"
import { Perf } from "r3f-perf"
import { memo, useRef, useEffect, forwardRef, RefObject } from "react"

import * as THREE from "three"
import { Title } from "./Title"
import Lights from "./Lights"
import Controls from "./Controls"
import { Plane } from "./Plane"
import { Surface } from "./Surface"
import { ATM_2D } from "./ATM_2D"
import { AtmosphereLayer } from "./AtmosphereLayer"
import { useClusterStore } from "@/utils/store/cluster.store"
import { VariableName } from "@/utils/store/variables/variable.types"
import { TextureInfo } from "@/utils/database/database.types"
import { TickFn } from "../time_provider/tick"

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

const World = memo(({ tick }: Props) => {
// export function World ({ tick }: Props) {

  console.log('creating World component')

  const atm2DRef = useRef<THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>>(null)

  useEffect(() => {
    console.log("subscribe")
    // Subscribe to store updates and update prRef.current whenever variables.pr changes
    const unsubscribe = useClusterStore.subscribe(
      (state) => {
        atm2DRef.current.updateUserUniforms(state.variables.pr);
      },
    );
  
    // Cleanup the subscription on unmount
    return () => {
      console.log("unsubscribe")
      unsubscribe();
    };
  }, []);

  useFrame((state, delta) => {

    // console.log(state.scene.children)
    tick(delta).then((res) => {
      
      atm2DRef.current.tick(res.weight)

      if (res.variables.size != 0) {
        for (let [variable, data] of res.variables) {
          switch (variable) {
            case VariableName.pr : { 
              atm2DRef.current.updateTextures(data, res.weight) 
              break
            }
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
      <AtmosphereLayer ref={atm2DRef} />

      <Perf position="bottom-right" />
    </>
  )
});

export { World };
