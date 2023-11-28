"use client"
import {
  forwardRef,
  useImperativeHandle,
  useRef,
  RefObject,
} from "react"
import { memo, useEffect } from "react"
import * as THREE from "three"
import vertexShader from "$/shaders/surfaceVert.glsl"
import fragmentShader from "$/shaders/surfaceFrag.glsl"
import { TickData } from "../../utils/tick/tick.js"
import { HeightSlice } from "@/utils/store/variables/variable.types"
import { useStore } from "@/utils/store/store"

type PlaneType = THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>

const loader = new THREE.TextureLoader();
const cmap = loader.load('../assets/colormaps/all_colormaps.png')
cmap.minFilter = THREE.NearestFilter;
cmap.magFilter = THREE.NearestFilter;

const geometry = new THREE.PlaneGeometry(4, 2, 64*4, 32*4);

type Props = {

}

export type SurfaceLayerRef = {
  type : RefObject<PlaneType>,
  updateTextures : (data:TickData, reference:TickData, reference_flag:boolean) => void
  tick: (weight:number, uSphereWrapAmount:number) => void
}

const SurfaceLayer = memo(forwardRef<SurfaceLayerRef, Props>(({ }, ref) => {

  console.log('creating SurfaceLayer component')
  const surface_layer_ref = useRef<PlaneType>(null)

  // use global state/user input to initialise the layer
  const height_state = useStore((state) => state.variables.height)

  const materialRef = useRef(new THREE.ShaderMaterial( {
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    wireframe: false,
    transparent: true,
    side: THREE.DoubleSide,
    uniforms: {
      uFrameWeight: {value: null},
      uSphereWrapAmount: {value: 1.0},
      uHeightDisplacement: {value: height_state.displacement},
      uLayerHeight: {value: 0.0},
      uLayerOpacity: {value: 0.0},
      dataTexture: {value: null},
      textureTimesteps: {value: null},
      thisDataMin: {value: new Float32Array(1)},
      thisDataMax: {value: new Float32Array(1)},
      nextDataMin: {value: null},
      nextDataMax: {value: null},
      referenceHeightTexture: {value: null},
      referenceDataMin: {value: null},
      referenceDataMax: {value: null},
      referenceDataHeightFlag: {value: false},
      uUserMinValue: {value: height_state.min},
      uUserMaxValue: {value: height_state.max},
      colorMap: {value: cmap},
      colorMapIndex: {value: height_state.colormap_index},
    },
  } ));
  
  function tick(weight:number, uSphereWrapAmount:number) {
    materialRef.current.uniforms.uFrameWeight.value = weight % 1
    materialRef.current.uniforms.uSphereWrapAmount.value = uSphereWrapAmount
    materialRef.current.uniforms.uLayerOpacity.value = 1.0
  }

  function updateUserUniforms(store:HeightSlice) {
    materialRef.current.uniforms.uUserMinValue.value = store.min
    materialRef.current.uniforms.uUserMaxValue.value = store.max
    materialRef.current.uniforms.colorMapIndex.value = store.colormap_index
    materialRef.current.uniforms.uHeightDisplacement.value = store.displacement
  }

  async function updateTextures(data:TickData, reference:TickData, reference_flag:boolean) {

    // create the texture from the image blob
    const dataTexture = await loader.loadAsync(URL.createObjectURL(data.textures[0].current_url.image))
    console.log(dataTexture)
    dataTexture.wrapS = dataTexture.wrapT = THREE.RepeatWrapping
    materialRef.current.uniforms.dataTexture.value = dataTexture
    const dataMin = new Float32Array(data.info.min[0]);
    const dataMax = new Float32Array(data.info.max[0]);
    materialRef.current.uniforms.thisDataMin.value = dataMin
    materialRef.current.uniforms.thisDataMax.value = dataMax
    materialRef.current.uniforms.textureTimesteps.value = 12.0

    if ( reference_flag ) {

      const referenceHeightTexture = await loader.loadAsync(URL.createObjectURL(reference.textures[0].current_url.image))
      referenceHeightTexture.wrapS = referenceHeightTexture.wrapT = THREE.RepeatWrapping
      materialRef.current.uniforms.referenceHeightTexture.value = referenceHeightTexture     
      materialRef.current.uniforms.referenceDataMin.value =  new Float32Array(reference.info.min[0][0]);     
      materialRef.current.uniforms.referenceDataMax.value =  new Float32Array(reference.info.max[0][0]);     

    }
  }
  

  useImperativeHandle(ref,()=> 
  {
    return {
      type:surface_layer_ref,
      tick,
      updateTextures,
      updateUserUniforms
    }
  })

  return (
    <mesh 
      ref={surface_layer_ref} 
      geometry={ geometry }
      material={ materialRef.current }
      renderOrder = { 1 }
      >
    </mesh>
  )
}))

export { SurfaceLayer }