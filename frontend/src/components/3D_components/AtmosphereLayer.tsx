"use client"
import { forwardRef, useImperativeHandle, useRef, useEffect } from "react"
import { memo } from 'react';
import { useTexture, shaderMaterial } from "@react-three/drei"
import { extend, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useControls } from 'leva'
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

  const prRef = useRef();
  useEffect(() => {
    // Subscribe to store updates and update prRef.current whenever variables.pr changes
    const unsubscribe = useClusterStore.subscribe(
      (state) => {
        prRef.current = state.variables.pr;
      },
      (state) => state.variables.pr
    );
  
    // Cleanup the subscription on unmount
    return () => {
      unsubscribe();
    };
  }, []);
  
  // const pr = useClusterStore(state => state.variables.pr)

  // material.uniforms.uUserMinValue.value = parseFloat(pr.min)
  // material.uniforms.uUserMaxValue.value = parseFloat(pr.max)

  function update(data) {
    
    // console.log(prRef)
    // materialRef.current.uniforms.uFrameWeight.value = Math.random()
    materialRef.current.uniforms.thisDataFrame.value = loader.load(data.current_url)
    materialRef.current.uniforms.nextDataFrame.value = loader.load(data.next_url) 
    materialRef.current.uniforms.thisDataMin.value = data.current_info.metadata.metadata[12].bounds_matrix[0][0].min * 86400.
    materialRef.current.uniforms.thisDataMax.value = data.current_info.metadata.metadata[12].bounds_matrix[0][0].max * 86400 * 5.
    materialRef.current.uniforms.nextDataMin.value = data.next_info.metadata.metadata[12].bounds_matrix[0][0].min * 86400.
    materialRef.current.uniforms.nextDataMax.value = data.next_info.metadata.metadata[12].bounds_matrix[0][0].max * 86400 * 5.
    materialRef.current.uniforms.uUserMinValue.value = parseFloat(prRef.current.min)
    materialRef.current.uniforms.uUserMaxValue.value = parseFloat(prRef.current.max)

    console.log(prRef.current.min)
    // console.log(materialRef.current.uniforms.thisDataMax.value)

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
    <mesh 
      ref={ref} 
      geometry={ geometry }
      material={ material }>
    </mesh>
  )
}))

export { AtmosphereLayer }
