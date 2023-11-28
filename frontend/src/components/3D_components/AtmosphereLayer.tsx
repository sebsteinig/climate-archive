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
  const height_state = useStore((state) => state.variables.height)

  
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
      uLayerHeight: {value: height_state.displacement * 0.5},
      // uLayerHeight: {value: 0.25},
      uOpacity: {value: pr_state.opacity},
      dataTexture: {value: null},
      textureTimesteps: {value: null},
      thisDataMin: {value: new Float32Array(1)},
      thisDataMax: {value: new Float32Array(1)},
      referenceDataTexture: {value: null},
      referenceDataMin: {value: new Float32Array(1)},
      referenceDataMax: {value: new Float32Array(1)},
      referenceDataFlag: {value: false},
      uUserMinValue: {value: pr_state.min},
      uUserMaxValue: {value: pr_state.max},
      uUserMinValueAnomaly: {value: pr_state.anomaly_min},
      uUserMaxValueAnomaly: {value: pr_state.anomaly_max},
      colorMap: {value: cmap},
      colorMapIndex: {value: pr_state.colormap_index},
      numLon: {value: 96},
      numLat: {value: 73},
    },
  } )
  );


  
  function tick(weight:number, uSphereWrapAmount:number) {
    materialRef.current.uniforms.uFrame.value = Math.floor(weight)
    materialRef.current.uniforms.uFrameWeight.value = weight % 1
    materialRef.current.uniforms.uSphereWrapAmount.value = uSphereWrapAmount
  }

  function updateUserUniforms(store:PrSlice, store_height:HeightSlice) {
    materialRef.current.uniforms.uUserMinValue.value = store.min
    materialRef.current.uniforms.uUserMaxValue.value = store.max
    materialRef.current.uniforms.colorMapIndex.value = store.colormap_index
    materialRef.current.uniforms.uUserMinValueAnomaly.value = store.anomaly_min
    materialRef.current.uniforms.uUserMaxValueAnomaly.value = store.anomaly_max
    materialRef.current.uniforms.uLayerHeight.value = height_state.displacement * 0.5
    materialRef.current.uniforms.uOpacity.value = store.opacity
  }

  async function updateTextures(data:TickData, reference:TickData, reference_flag:boolean) {

    // always update the own data
    const dataTexture = await loader.loadAsync(URL.createObjectURL(data.textures[0].current_url.image))
    dataTexture.wrapS = dataTexture.wrapT = THREE.RepeatWrapping
    materialRef.current.uniforms.dataTexture.value = dataTexture
    const dataMin = new Float32Array(data.info.min[0][0].map(value => value * 86400));
    const dataMax = new Float32Array(data.info.max[0][0].map(value => value * 86400));

    materialRef.current.uniforms.thisDataMin.value = dataMin
    materialRef.current.uniforms.thisDataMax.value = dataMax
    if (data.textures[0].current_url.path.includes('.avg.')) {
      materialRef.current.uniforms.textureTimesteps.value = 1.0
    } else {
      materialRef.current.uniforms.textureTimesteps.value = 12.0
    };
    
    // also update the reference data when reference mode is activated
    if ( reference_flag ) {
      console.log(reference)
      const referenceDataTexture = await loader.loadAsync(URL.createObjectURL(reference.textures[0].current_url.image))
      referenceDataTexture.wrapS = referenceDataTexture.wrapT = THREE.RepeatWrapping
      materialRef.current.uniforms.referenceDataTexture.value = referenceDataTexture
      const referenceDataMin = new Float32Array(reference.info.min[0][0].map(value => value * 86400));
      const referenceDataMax = new Float32Array(reference.info.max[0][0].map(value => value * 86400));
      materialRef.current.uniforms.referenceDataMin.value = referenceDataMin
      materialRef.current.uniforms.referenceDataMax.value = referenceDataMax
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
      renderOrder = { 4 }
      >
    </mesh>
  )
}))

export { AtmosphereLayer }