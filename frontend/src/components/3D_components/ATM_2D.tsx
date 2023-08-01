"use client"
import { forwardRef, useImperativeHandle, useRef } from "react"
import { useTexture, shaderMaterial } from "@react-three/drei"
import { extend, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useControls } from 'leva'
import vertexShader from '../../shaders/precipitationVert.glsl'
import fragmentShader from '../../shaders/precipitationFrag.glsl'
import { createColormapTexture } from '../../utils/three/colormapTexture.js'
import { useClusterStore } from "@/utils/store/cluster.store"

type SphereType = THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>

type config = {
  placeholder: string
}

type SphereProps = {
  config: config
}


const loader = new THREE.TextureLoader();
// const cmap = loader.load("/assets/colormaps/ipccPrecip.png" ); 
const cmap = createColormapTexture('YlGnBu-9')

const DataMaterial = shaderMaterial(
  {
    uFrameWeight: null,
    uSphereWrapAmount: 0.0,
    uHeightPrecipitation: 0.15,
    thisDataFrame: null,
    nextDataFrame: null, 
    thisDataMin: null,
    thisDataMax: null,
    uCMIP6Mode: false,
    colorMap: cmap,
    numLon: 96,
    numLat: 73,
    uPrecipitationMinValue: null,
    uPrecipitationMaxValue: null,
  },
  vertexShader,
  fragmentShader
)


extend({ DataMaterial })

const ATM_2D = forwardRef<SphereType, null>(({ }, ref) => {

  console.log('creating ATM_2D compnent')
  const materialRef = useRef<DataMaterial>(null!)

  const pr = useClusterStore(state => state.variables.pr)

  function update(data) {
    // materialRef.current.uniforms.uFrameWeight.value = Math.random()
    materialRef.current.uniforms.thisDataFrame.value = loader.load(data.current_url)
    materialRef.current.uniforms.nextDataFrame.value = loader.load(data.next_url) 
    materialRef.current.uniforms.thisDataMin.value = data.current_info.metadata.metadata[12].bounds_matrix[0][0].min * 86400.
    materialRef.current.uniforms.thisDataMax.value = data.current_info.metadata.metadata[12].bounds_matrix[0][0].max * 86400 * 5.

    materialRef.current.uniforms.uPrecipitationMinValue.value = parseFloat(pr.min)
    materialRef.current.uniforms.uPrecipitationMaxValue.value = parseFloat(pr.max)

    console.log(materialRef.current.uniforms.thisDataMin.value)
    console.log(materialRef.current.uniforms.thisDataMax.value)

    // console.log(data.current_info.metadata.metadata[12].bounds_matrix[0][5].max)
    // console.log(data.current_info.metadata)
  }

  useImperativeHandle(ref,()=> 
  {
    return {
      update,
    }
  })

  const { uSphereWrap } = useControls({ 
    uSphereWrap: {
      value: 0., 
      min: 0,
      max: 1,
      step: 0.0001
    },
  })


  return (
    <mesh ref={ref}>
      <planeGeometry args={[4, 2, 64, 32]} />
      <dataMaterial ref={materialRef} uSphereWrapAmount={uSphereWrap}/>
    </mesh>
  )
})

export { ATM_2D }
