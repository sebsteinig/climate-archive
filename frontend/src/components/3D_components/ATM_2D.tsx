"use client"
import { forwardRef, useImperativeHandle, useRef } from "react"
import { useTexture, shaderMaterial } from "@react-three/drei"
import { extend, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import vertexShader from '../../shaders/precipitationVert.glsl'
import fragmentShader from '../../shaders/precipitationFrag.glsl'


type SphereType = THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>

type config = {
  placeholder: string
}

type SphereProps = {
  config: config
}


const loader = new THREE.TextureLoader();
const cmap = loader.load("/assets/colormaps/ipccPrecip.png" ); 

const DataMaterial = shaderMaterial(
  {
    uFrameWeight: 1.0,
    uSphereWrapAmount: 0.0,
    uHeightPrecipitation: 0.15,
    thisDataFrame: null,
    nextDataFrame: null, 
    // thisDataMin: null,
    // thisDataMax: null,
    thisDataMin: 0,
    thisDataMax: 20.0,
    uCMIP6Mode: false,
    colorMap: cmap,
    numLon: 96,
    numLat: 73,
    uPrecipitationMinValue: 3.5,
    uPrecipitationMaxValue: 12.0,
  },
  vertexShader,
  fragmentShader
)


extend({ DataMaterial })

const ATM_2D = forwardRef<SphereType, SphereProps>(({ config }, ref) => {

  const materialRef = useRef<DataMaterial>(null!)

  function update(data) {
    // materialRef.current.uniforms.uFrameWeight.value = Math.random()
    materialRef.current.uniforms.thisDataFrame.value = loader.load(data.current_url)
    materialRef.current.uniforms.nextDataFrame.value = loader.load(data.next_url) 
    // materialRef.current.uniforms.thisDataMin.value = data.current_info.metadata.metadata[6].bounds_matrix[0][0].min * 86400.
    // materialRef.current.uniforms.thisDataMax.value = data.current_info.metadata.metadata[6].bounds_matrix[0][0].max * 86400.
    console.log(data.current_info.metadata.metadata[6].bounds_matrix[0][0].max)
  }

  useImperativeHandle(ref,()=> 
  {
    return {
      update,
    }
  })

  return (
    <mesh ref={ref}>
      <planeGeometry args={[4, 2, 64, 32]} />
      <dataMaterial ref={materialRef}/>
    </mesh>
  )
})

export { ATM_2D }
