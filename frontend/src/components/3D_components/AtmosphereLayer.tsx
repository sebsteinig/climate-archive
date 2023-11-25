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
import { useStore } from "@/utils/store/store"

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
  updateTextures : (data:TickData, reference:TickData, reference_flag:boolean) => void
  tick: (weight:number, uSphereWrapAmount:number) => void
}

const AtmosphereLayer = memo(forwardRef<AtmosphereLayerRef, Props>(({ }, ref) => {

  console.log('creating AtmosphereLayer component')
  const atmosphere_layer_ref = useRef<PlaneType>(null)

  // use global state/user input to initialise the layer
  const pr_state = useStore((state) => state.variables.pr)

  const materialRef = useRef(new THREE.ShaderMaterial( {
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    wireframe: false,
    transparent: true,
    side: THREE.DoubleSide,
    uniforms: {
      uFrame: {value: null},
      uFrameWeight: {value: null},
      uSphereWrapAmount: {value: 0.0},
      uLayerHeight: {value: 0.15},
      uLayerOpacity: {value: 0.0},
      dataTexture: {value: null},
      textureTimesteps: {value: null},
      thisDataMin: {value: null},
      thisDataMax: {value: null},
      nextDataMin: {value: null},
      nextDataMax: {value: null},
      referenceDataTexture: {value: null},
      referenceDataMin: {value: null},
      referenceDataMax: {value: null},
      referenceDataFlag: {value: false},
      uUserMinValue: {value: pr_state.min},
      uUserMaxValue: {value: pr_state.max},
      uUserMinValueAnomaly: {value: -5.0},
      uUserMaxValueAnomaly: {value: 5.0},
      colorMap: {value: cmap},
      colorMapIndex: {value: pr_state.colormap_index},
      numLon: {value: 96},
      numLat: {value: 73},
    },
  } ));
  
  function tick(weight:number, uSphereWrapAmount:number) {
    materialRef.current.uniforms.uFrame.value = Math.floor(weight)
    materialRef.current.uniforms.uFrameWeight.value = weight % 1
    materialRef.current.uniforms.uSphereWrapAmount.value = uSphereWrapAmount
    materialRef.current.uniforms.uLayerOpacity.value = 1.0
  }

  function updateUserUniforms(store:PrSlice) {
    materialRef.current.uniforms.uUserMinValue.value = store.min
    materialRef.current.uniforms.uUserMaxValue.value = store.max
    materialRef.current.uniforms.colorMapIndex.value = store.colormap_index
    materialRef.current.uniforms.uUserMinValueAnomaly.value = store.anomaly_range * -1.
    materialRef.current.uniforms.uUserMaxValueAnomaly.value = store.anomaly_range
  }

  async function updateTextures(data:TickData, reference:TickData, reference_flag:boolean) {
    // always update the own data

    // create the texture from the image blob
    // const computeLabel = `load THREE texture ${Date.now()}`;
    // console.time(computeLabel);

    if (materialRef.current.uniforms.uFrameWeight.value == 0.0) {
      console.log("load THREE texture")
      const dataTexture = await loader.loadAsync(URL.createObjectURL(data.textures[0].current_url.image))
      console.log(data)
      dataTexture.wrapS = dataTexture.wrapT = THREE.RepeatWrapping
      materialRef.current.uniforms.dataTexture.value = dataTexture
    }

    materialRef.current.uniforms.thisDataMin.value = data.current.min[0] * 86400.
    materialRef.current.uniforms.thisDataMax.value = data.current.max[0] * 86400.
    materialRef.current.uniforms.nextDataMin.value = data.next.min[0] * 86400.
    materialRef.current.uniforms.nextDataMax.value = data.next.max[0] * 86400.
    materialRef.current.uniforms.textureTimesteps.value = 12.0
    
    // also update the reference data when reference mode is activated
    if ( reference_flag ) {
      const referenceDataTexture = await loader.loadAsync(reference.textures[0].current_url.image)
      referenceDataTexture.wrapS = referenceDataTexture.wrapT = THREE.RepeatWrapping
      materialRef.current.uniforms.referenceDataTexture.value = referenceDataTexture
      materialRef.current.uniforms.referenceDataMin.value = reference.current.min[0] * 86400.
      materialRef.current.uniforms.referenceDataMax.value = reference.current.max[0] * 86400.
      materialRef.current.uniforms.referenceDataFlag.value = true
    } else {
      materialRef.current.uniforms.referenceDataFlag.value = false
    }

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
      material={ materialRef.current }
      renderOrder = { 5 }
      >
    </mesh>
  )
}))

export { AtmosphereLayer }