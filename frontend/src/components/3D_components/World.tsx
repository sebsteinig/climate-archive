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
import { ATM_2D, ATM_2D_Ref } from "./ATM_2D"
import { AtmosphereLayer, AtmosphereLayerRef } from "./AtmosphereLayer"
import { useClusterStore } from "@/utils/store/cluster.store"
import { EVarID } from "@/utils/store/variables/variable.types"
import { TextureInfo } from "@/utils/database/database.types"
import { TickFn } from "../time_provider/tick"

type Props = {
  tick: TickFn
}

const World = memo(({ tick }: Props) => {
// export function World ({ tick }: Props) {

  console.log('creating World component')

  const atmosphere_layer_ref = useRef<AtmosphereLayerRef>(null)

  useEffect(() => {
    console.log("subscribe")
    // Subscribe to store updates and update prRef.current whenever variables.pr changes
    const unsubscribe = useClusterStore.subscribe(
      (state) => {
        atmosphere_layer_ref.current.updateUserUniforms(state.variables.pr);
      },
    );
  
    // Cleanup the subscription on unmount
    return () => {
      console.log("unsubscribe")
      unsubscribe();
    };
  }, []);

  useFrame((state, delta) => {
    tick(delta).then((res) => {

      //console.log(res.update_texture);
      if (atmosphere_layer_ref.current) {
        atmosphere_layer_ref.current.tick(res.weight,res.uSphereWrapAmount)
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

      <Perf position="bottom-right" />
    </>
  )
});

export { World };
