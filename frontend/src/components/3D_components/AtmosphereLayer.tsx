"use client"
import {
  forwardRef,
  useImperativeHandle,
  useRef,
  RefObject,
} from "react"
import { memo } from "react"
import * as THREE from "three"
import vertexShader from "$/shaders/precipitationVert.glsl"
import fragmentShader from "$/shaders/precipitationFrag.glsl"
import { TickData } from "../../utils/tick/tick.js"
import { PrSlice } from "@/utils/store/variables/variable.types"

type PlaneType = THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>

const loader = new THREE.TextureLoader();
const cmap = loader.load('../assets/colormaps/all_colormaps.png')
cmap.minFilter = THREE.NearestFilter;
cmap.magFilter = THREE.NearestFilter;

const geometry = new THREE.PlaneGeometry(4, 2, 64, 32);

type Props = {

}

export type AtmosphereLayerRef = {
  type : RefObject<PlaneType>,
  updateTextures : (data:TickData) => void
  tick: (weight:number, uSphereWrapAmount:number) => void
}

const AtmosphereLayer = memo(forwardRef<AtmosphereLayerRef, Props>(({ }, ref) => {

  console.log('creating AtmosphereLayer compnent')
  const atmosphere_layer_ref = useRef<PlaneType>(null)

  const materialRef = useRef(new THREE.ShaderMaterial( {
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
      colorMapIndex: {value: null},
      numLon: {value: 96},
      numLat: {value: 73},
    },
  } ));

  console.log('creating AtmosphereLayer compnent')
  
  function tick(weight:number, uSphereWrapAmount:number) {
    materialRef.current.uniforms.uFrameWeight.value = weight % 1
    materialRef.current.uniforms.uSphereWrapAmount.value = uSphereWrapAmount
  }

  function updateUserUniforms(store:PrSlice) {
    materialRef.current.uniforms.uUserMinValue.value = store.min
    materialRef.current.uniforms.uUserMaxValue.value = store.max
    materialRef.current.uniforms.colorMapIndex.value = store.colormap_index
  }

  function updateTextures(data:TickData, reference:TickData) {
    materialRef.current.uniforms.thisDataFrame.value = loader.load(data.textures[0].current_url)
    materialRef.current.uniforms.nextDataFrame.value = loader.load(data.textures[0].next_url) 
    materialRef.current.uniforms.thisDataMin.value = data.current.min[0] * 86400.
    materialRef.current.uniforms.thisDataMax.value = data.current.max[0]  * 86400.
    materialRef.current.uniforms.nextDataMin.value = data.next.min[0]  * 86400.
    materialRef.current.uniforms.nextDataMax.value = data.next.max[0]  * 86400.
  }
  

  useImperativeHandle(ref,()=> 
  {
    return {
      type:atmosphere_layer_ref,
      tick,
      updateTextures,
      updateUserUniforms
    }
  })

  return (
    <mesh 
      ref={atmosphere_layer_ref} 
      geometry={ geometry }
      material={ materialRef.current }>
    </mesh>
  )
}))

export { AtmosphereLayer }