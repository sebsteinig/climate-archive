"use client"
import {
  forwardRef,
  useImperativeHandle,
  useRef,
  RefObject,
  useEffect
} from "react"
import { memo } from "react"
import * as THREE from "three"
import { useThree } from '@react-three/fiber'
import { TickData } from "../../time_provider/tick.js"
import { PrSlice, WindsSlice } from "@/utils/store/variables/variable.types"
import { createInitialWindPositions } from './windsInitialPositions.js'
import { createWindsGeometry } from './windsGeometry.js'
import { createWindsMaterial } from './windsMaterial.js'
import { initComputeRendererWinds } from './windsComputeRenderer.js'
import { useStore } from "@/utils/store/store"

type VectorLayerType = THREE.Mesh<THREE.InstancedBufferGeometry, THREE.ShaderMaterial>

const loader = new THREE.TextureLoader();

const shaderUniforms =
{
    uWindsMaxParticleCount : {value: 4000},
    uWindsParticleCount : {value: 4000},
    uWindsVerticalSpread : {value: null},
    uWindsParticleLifeTime : {value: 400.0},
    uWindsSpeed : {value: 0.2},
    uWindsSpeedMin : {value: 0.0},
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

  const state = useThree()

  // const { gpuComputeWinds, positionVariable } = initComputeRendererWinds(initialPositions, state.gl, shaderUniforms)
  const materialRef = useRef( createWindsMaterial(quaternionTexture, shaderUniforms, state.gl, initialPositions) )

  const gpuComputeWindsRef = useRef({ renderer: null, positionVariable: null });
  useEffect(() => {
    const { gpuComputeWinds, positionVariable } = initComputeRendererWinds(initialPositions, state.gl, shaderUniforms);
    gpuComputeWindsRef.current = { gpuComputeWinds, positionVariable };
    console.log(gpuComputeWindsRef.current)
  }, []);

  function tick(weight:number, uSphereWrapAmount:number, delta:number) {

    // update and run GPUComputationRenderer
    if (gpuComputeWindsRef.current.gpuComputeWinds != null) {
      if (gpuComputeWindsRef.current.gpuComputeWinds.variables[0].material.uniforms.dataTexture.value) {
        gpuComputeWindsRef.current.gpuComputeWinds.variables[0].material.uniforms.uFrame.value = Math.floor(weight)
        gpuComputeWindsRef.current.gpuComputeWinds.variables[0].material.uniforms.uFrameWeight.value = weight % 1
        gpuComputeWindsRef.current.gpuComputeWinds.variables[0].material.uniforms.uRandSeed.value = Math.random()
        gpuComputeWindsRef.current.gpuComputeWinds.variables[0].material.uniforms.uDelta.value = delta;

        gpuComputeWindsRef.current.gpuComputeWinds.compute();

        // update the wind material for visualisation
        materialRef.current.uniforms.uFrame.value = Math.floor(weight)
        materialRef.current.uniforms.uFrameWeight.value = weight % 1
        materialRef.current.uniforms.wrapAmountUniform.value = uSphereWrapAmount
        materialRef.current.uniforms["texturePosition"].value = gpuComputeWindsRef.current.gpuComputeWinds.getCurrentRenderTarget( gpuComputeWindsRef.current.positionVariable ).texture;
      }
  }

  }

  function updateUserUniforms(store:WindsSlice) {
    gpuComputeWindsRef.current.gpuComputeWinds.variables[0].material.uniforms.level.value = store.level;
    materialRef.current.uniforms.level.value = store.level
    materialRef.current.uniforms.uWindsArrowSize.value = store.arrows_size
    materialRef.current.uniforms.uWindsSpeedMin.value = store.min_speed
    gpuComputeWindsRef.current.gpuComputeWinds.variables[0].material.uniforms.uWindsSpeed.value = store.animation_speed

    // shaderUniforms.uWindsParticleCount.value = store.arrows
    // shaderUniforms.uWindsMaxParticleCount.value = store.arrows

  }

  async function updateTextures(data:TickData, reference:TickData, reference_flag:boolean) {

    // always update the own data
    // load texture and info
    const dataTexture = await loader.loadAsync(URL.createObjectURL(data.textures[0].current_url.image))
    console.log(data.info)
    dataTexture.wrapS = dataTexture.wrapT = THREE.RepeatWrapping
    console.log(data.info.min[1])
    const dataMinU = new Float32Array(data.info.min[0].flat());
    const dataMaxU = new Float32Array(data.info.max[0].flat());
    const dataMinV = new Float32Array(data.info.min[1].flat());
    const dataMaxV = new Float32Array(data.info.max[1].flat());

    const flattenedArray = data.info.min[0].flat();
    console.log(flattenedArray)

    // update wind input data for the compute renderer
    console.log("UPDATE COMPUTE TEXTURE")
    console.log(dataTexture)
    gpuComputeWindsRef.current.gpuComputeWinds.variables[0].material.uniforms.dataTexture.value = dataTexture
    gpuComputeWindsRef.current.gpuComputeWinds.variables[0].material.uniforms.dataMinU.value = dataMinU
    gpuComputeWindsRef.current.gpuComputeWinds.variables[0].material.uniforms.dataMaxU.value = dataMaxU
    gpuComputeWindsRef.current.gpuComputeWinds.variables[0].material.uniforms.dataMinV.value = dataMinV
    gpuComputeWindsRef.current.gpuComputeWinds.variables[0].material.uniforms.dataMaxV.value = dataMaxV

    // update the wind data for scaling the arrows in the arrow material
    materialRef.current.uniforms.dataTexture.value = dataTexture
    materialRef.current.uniforms.dataMinU.value = dataMinU
    materialRef.current.uniforms.dataMaxU.value = dataMaxU
    materialRef.current.uniforms.dataMinV.value = dataMinV
    materialRef.current.uniforms.dataMaxV.value = dataMaxV
    if (data.textures[0].current_url.path.includes('.avg.')) {
      materialRef.current.uniforms.textureTimesteps.value = 1.0
      gpuComputeWindsRef.current.gpuComputeWinds.variables[0].material.uniforms.textureTimesteps.value = 1.0
    } else {
      materialRef.current.uniforms.textureTimesteps.value = 12.0
      gpuComputeWindsRef.current.gpuComputeWinds.variables[0].material.uniforms.textureTimesteps.value = 12.0
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
