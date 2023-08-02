"use client"
import { forwardRef, useImperativeHandle, useRef, useEffect } from "react"
import { memo } from 'react';
import * as THREE from 'three'
import vertexShader from '../../shaders/precipitationVert.glsl'
import fragmentShader from '../../shaders/precipitationFrag.glsl'
import { createColormapTexture } from '../../utils/three/colormapTexture.js'
import { useClusterStore } from "@/utils/store/cluster.store"

type SphereType = THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>

// create global geometry and material for later re-use
const loader = new THREE.TextureLoader();
const cmap = createColormapTexture('YlGnBu-9')

const geometry = new THREE.PlaneGeometry(4, 2, 64, 32);
const material = new THREE.ShaderMaterial( {
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
  wireframe: false,
  transparent: true,
  side: THREE.DoubleSide,
  uniforms: {
    uFrameWeight: {value: null},
    uSphereWrapAmount: {value: 0.0},
    uLayerHeight: {value: 0.15},
    uLayerOpacity: {value: 1.0},
    thisDataFrame: {value: null},
    nextDataFrame: {value: null}, 
    thisDataMin: {value: null},
    thisDataMax: {value: null},
    nextDataMin: {value: null},
    nextDataMax: {value: null},
    uUserMinValue: {value: null},
    uUserMaxValue: {value: null},
    colorMap: {value: cmap},
    numLon: {value: 96},
    numLat: {value: 73},
  },
} );

const AtmosphereLayer = memo(forwardRef<SphereType, null>(({ }, ref) => {

  console.log('creating AtmosphereLayer compnent')

  const materialRef = useRef(material)
  
  function tick(weight) {
    materialRef.current.uniforms.uFrameWeight.value = weight % 1
  }

  function updateUserUniforms(store) {
    materialRef.current.uniforms.uUserMinValue.value = parseFloat(store.min)
    materialRef.current.uniforms.uUserMaxValue.value = parseFloat(store.max)
  }

  function updateTextures(data, weight) { 
    materialRef.current.uniforms.thisDataFrame.value = loader.load(data.current_url)
    materialRef.current.uniforms.nextDataFrame.value = loader.load(data.next_url) 
    materialRef.current.uniforms.thisDataMin.value = data.info.metadata.metadata[12].bounds_matrix[0][Math.floor(weight)].min * 86400.
    materialRef.current.uniforms.thisDataMax.value = data.info.metadata.metadata[12].bounds_matrix[0][Math.floor(weight)].max * 86400.
    materialRef.current.uniforms.nextDataMin.value = data.info.metadata.metadata[12].bounds_matrix[0][Math.floor(weight+1)].min * 86400.
    materialRef.current.uniforms.nextDataMax.value = data.info.metadata.metadata[12].bounds_matrix[0][Math.floor(weight+1)].max * 86400.
  }

  useImperativeHandle(ref,()=> 
  {
    return {
      tick,
      updateTextures,
      updateUserUniforms
    }
  })

  return (
    <mesh 
      ref={ref} 
      geometry={ geometry }
      material={ material }>
    </mesh>
  )
}))

export { AtmosphereLayer }
