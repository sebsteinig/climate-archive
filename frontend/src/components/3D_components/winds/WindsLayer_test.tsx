"use client"
import {
  forwardRef,
  useImperativeHandle,
  useRef,
  RefObject,
  memo, 
  useEffect
} from "react"
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
    uWindsMaxParticleCount : {value: 4000},
    uWindsParticleCount : {value: 4000},
    uWindsVerticalSpread : {value: null},
    uWindsParticleLifeTime : {value: 400.0},
    uWindsSpeed : {value: 0.2},
    uWindsSpeedMin : {value: 5.0},
    uWindsSpeedMax : {value: 30.0},
    uWindsScaleMagnitude : {value: false},
    uWindsArrowSize : {value: 1.0},

}

const initialPositions = createInitialWindPositions(shaderUniforms)
const [geometry, quaternionTexture ] = createWindsGeometry(initialPositions, shaderUniforms);

console.log(geometry)
type Props = {

}

export type WindLayerRef = {
  type : RefObject<VectorLayerType>,
  updateTextures : (data:TickData, reference:TickData, reference_flag:boolean) => void
  tick: (weight:number, uSphereWrapAmount:number) => void
}

const WindLayer = memo(forwardRef<WindLayerRef, Props>(({ }, ref) => {

  console.log('creating WindLayer component')
  const wind_layer_ref = useRef<VectorLayerType>(null)


  const gpuComputeWindsRef = useRef({ renderer: null, positionVariable: null });

    const { gl } = useThree(); // Assuming useThree provides the necessary context
    const [renderer, positionVariable] = initComputeRendererWinds(initialPositions, gl, shaderUniforms);
  
    gpuComputeWindsRef.current.renderer = renderer;
    gpuComputeWindsRef.current.positionVariable = positionVariable;

  const state = useThree(); // Assuming useThree provides the necessary context
  const materialRef = useRef( createWindsMaterial(quaternionTexture, shaderUniforms, state.gl, initialPositions) )

  // const state = useThree()

  // const { gpuComputeWinds, positionVariable } = initComputeRendererWinds(initialPositions, state.gl, shaderUniforms)

  // gpuComputeWindRef = useRef(gpuComputeWinds)
  function tick(weight:number, uSphereWrapAmount:number, delta:number) {

    // update and run GPUComputationRenderer
    gpuComputeWindsRef.current.renderer.variables[0].material.uniforms.uFrame.value = Math.floor(weight)
    gpuComputeWindsRef.current.renderer.variables[0].material.uniforms.uFrameWeight.value = weight % 1
    gpuComputeWindsRef.current.renderer.variables[0].material.uniforms.uRandSeed.value = Math.random()
    gpuComputeWindsRef.current.renderer.variables[0].material.uniforms.uDelta.value = delta;
    gpuComputeWindsRef.current.renderer.compute();

    // update the wind material for visualisation
    materialRef.current.uniforms.uFrame.value = Math.floor(weight)
    materialRef.current.uniforms.uFrameWeight.value = weight % 1
    materialRef.current.uniforms.wrapAmountUniform.value = uSphereWrapAmount
    materialRef.current.uniforms["texturePosition"].value = gpuComputeWinds.getCurrentRenderTarget( positionVariable ).texture;

  }

  function updateUserUniforms(store:PrSlice) {
    // materialRef.current.uniforms.uUserMinValue.value = store.min
    // materialRef.current.uniforms.uUserMaxValue.value = store.max
    // console.log("update uniforms")
  }

  async function updateTextures(data:TickData, reference:TickData, reference_flag:boolean) {

    // always update the own data
    // load texture and info
    const dataTexture = await loader.loadAsync(URL.createObjectURL(data.textures[0].current_url.image))
    console.log(dataTexture)
    dataTexture.wrapS = dataTexture.wrapT = THREE.RepeatWrapping
    const dataMinU = new Float32Array(data.info.min[0]);
    const dataMaxU = new Float32Array(data.info.max[0]);
    const dataMinV = new Float32Array(data.info.min[1]);
    const dataMaxV = new Float32Array(data.info.max[1]);

    // update wind input data for the compute renderer
    console.log(dataTexture)
    gpuComputeWindsRef.current.renderer.variables[0].material.uniforms.dataTexture.value = dataTexture
    gpuComputeWindsRef.current.renderer.variables[0].material.uniforms.thisDataMinU.value = dataMinU
    gpuComputeWindsRef.current.renderer.variables[0].material.uniforms.thisDataMaxU.value = dataMaxU
    gpuComputeWindsRef.current.renderer.variables[0].material.uniforms.thisDataMinV.value = dataMinV
    gpuComputeWindsRef.current.renderer.variables[0].material.uniforms.thisDataMaxV.value = dataMaxV

    // update the wind data for scaling the arrows in the arrow material
    materialRef.current.uniforms.dataTexture.value = dataTexture
    materialRef.current.uniforms.thisDataMinU.value = dataMinU
    materialRef.current.uniforms.thisDataMaxU.value = dataMaxU
    materialRef.current.uniforms.thisDataMinV.value = dataMinV
    materialRef.current.uniforms.thisDataMaxV.value = dataMaxV
    if (data.textures[0].current_url.path.includes('.avg.')) {
      materialRef.current.uniforms.textureTimesteps.value = 1.0
      gpuComputeWindsRef.current.renderer.variables[0].material.uniforms.textureTimesteps.value = 1.0
    } else {
      materialRef.current.uniforms.textureTimesteps.value = 12.0
      gpuComputeWindsRef.current.renderer.variables[0].material.uniforms.textureTimesteps.value = 12.0
    };
    
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
  
  // return (
  //   <mesh 
  //     ref={wind_layer_ref} 
  //     geometry={ geometry }
  //     material={ materialRef.current }>
  //     {/* material={ basicMaterial }> */}
  //   </mesh>
  // )

  return (
    <instancedMesh 
      ref={wind_layer_ref} 
      args={[geometry, materialRef.current, shaderUniforms.uWindsMaxParticleCount.value]}
      renderOrder = { 2 }
      >
      {/* material={ basicMaterial }> */}
    </instancedMesh>
  )
}))

export { WindLayer }
