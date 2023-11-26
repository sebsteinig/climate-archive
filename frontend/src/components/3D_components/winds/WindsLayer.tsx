"use client"
import {
  forwardRef,
  useImperativeHandle,
  useRef,
  RefObject,
} from "react"
import { memo } from "react"
import * as THREE from "three"
import { useThree } from '@react-three/fiber'
import { TickData } from "../../time_provider/tick.js"
import { PrSlice } from "@/utils/store/variables/variable.types"
import { createInitialWindPositions } from './windsInitialPositions.js'
import { createWindsGeometry } from './windsGeometry.js'
import { createWindsMaterial } from './windsMaterial.js'
import { initComputeRendererWinds } from './windsComputeRenderer.js'

type VectorLayerType = THREE.Mesh<THREE.InstancedBufferGeometry, THREE.ShaderMaterial>

const loader = new THREE.TextureLoader();

const shaderUniforms =
{
    uWindsMaxParticleCount : {value: 4096},
    uWindsParticleCount : {value: 4096},
    uWindsVerticalSpread : {value: null},
    uWindsParticleLifeTime : {value: null},
    uWindsSpeedMin : {value: 5.0},
    uWindsSpeedMax : {value: 30.0},

}

const initialPositions = createInitialWindPositions(shaderUniforms)
const [geometry, quaternionTexture ] = createWindsGeometry(initialPositions, shaderUniforms);

type Props = {

}

export type WindLayerRef = {
  type : RefObject<VectorLayerType>,
  updateTextures : (data:TickData) => void
  tick: (weight:number, uSphereWrapAmount:number) => void
}

const WindLayer = memo(forwardRef<WindLayerRef, Props>(({ }, ref) => {

  console.log('creating WindLayer component')
  const wind_layer_ref = useRef<VectorLayerType>(null)

  const state = useThree()

  const gpuComputeWinds = initComputeRendererWinds(initialPositions, state.gl, shaderUniforms)
  const materialRef = useRef( createWindsMaterial(quaternionTexture, shaderUniforms, state.gl, initialPositions) )
  
  function tick(weight:number, uSphereWrapAmount:number) {
    console.log(gpuComputeWinds)
    materialRef.current.material.uniforms.uFrameWeight.value = weight % 1
    materialRef.current.material.uniforms.wrapAmountUniform.value = uSphereWrapAmount
    gpuComputeWinds.variables[0].material.uniforms.uDelta.value = 0.016;
    gpuComputeWinds.variables[0].material.uniforms.uRandSeed.value = Math.random()

    gpuComputeWinds.compute();

    materialRef.material.uniforms[ "texturePosition" ].value = gpuComputeWinds.getCurrentRenderTarget( positionVariable ).texture;
    console.log("tick")
  }

  function updateUserUniforms(store:PrSlice) {
    // materialRef.current.uniforms.uUserMinValue.value = store.min
    // materialRef.current.uniforms.uUserMaxValue.value = store.max
    console.log("update uniforms")
  }

  function updateTextures(data:TickData) {
    // materialRef.current.uniforms.thisDataFrame.value = loader.load(data.textures[0].current_url)
    // materialRef.current.uniforms.nextDataFrame.value = loader.load(data.textures[0].next_url) 
    // materialRef.current.uniforms.thisDataMin.value = data.current.min[0] * 86400.
    // materialRef.current.uniforms.thisDataMax.value = data.current.max[0]  * 86400.
    // materialRef.current.uniforms.nextDataMin.value = data.next.min[0]  * 86400.
    // materialRef.current.uniforms.nextDataMax.value = data.next.max[0]  * 86400.
    console.log("update textures")
  }
  

  useImperativeHandle(ref,()=> 
  {
    return {
      type:wind_layer_ref,
      tick,
      updateTextures,
      updateUserUniforms
    }
  })

  return (
    <mesh 
      ref={wind_layer_ref} 
      geometry={ geometry }
      material={ materialRef.current }>
    </mesh>
  )
}))

export { WindLayer }
