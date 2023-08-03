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
import { ATM_2D, ATM_2D_Ref } from "./ATM_2D"
import { AtmosphereLayer, AtmosphereLayerRef } from "./AtmosphereLayer"
import { useClusterStore } from "@/utils/store/cluster.store"
import { VariableName } from "@/utils/store/variables/variable.types"
import { TextureInfo } from "@/utils/database/database.types"
import { TickFn } from "../time_provider/tick"

type Props = {
  tick: TickFn
}

export function World({ tick }: Props) {

  console.log('creating World component')

  const atmosphere_layer_ref = useRef<AtmosphereLayerRef>(null)

  useFrame((state, delta) => {

    tick(delta).then((res) => {
      //console.log(res.update_texture);
      if(atmosphere_layer_ref.current) {       
        atmosphere_layer_ref.current.tick(res.weight)
      }
      for (let [variable, data] of res.variables) {
        switch (variable) {
          case VariableName.pr : { 
              if(atmosphere_layer_ref.current && res.update_texture) {
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

      <Perf position="bottom-right" />
    </>
  )
}
