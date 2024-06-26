"use client"
import {
  forwardRef,
  useImperativeHandle,
  useRef,
  RefObject,
} from "react"
import { memo } from "react"
import * as THREE from "three"
import vertexShader from "$/shaders/sstVert.glsl"
import fragmentShader from "$/shaders/sstFrag.glsl"
import { TickData } from "../../utils/tick/tick.js"
import { TosSlice } from "@/utils/store/variables/variable.types"
import { useStore } from "@/utils/store/store"

type PlaneType = THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>

const loader = new THREE.TextureLoader();
const cmap = loader.load('../assets/colormaps/all_colormaps.png')
cmap.minFilter = THREE.NearestFilter;
cmap.magFilter = THREE.NearestFilter;

const geometry = new THREE.PlaneGeometry(4, 2, 64, 32);

type Props = {

}

export type OceanLayerRef = {
  type : RefObject<PlaneType>,
  updateTextures : (data:TickData, reference:TickData, reference_flag:boolean) => void
  tick: (weight:number, uSphereWrapAmount:number) => void
}

const OceanLayer = memo(forwardRef<OceanLayerRef, Props>(({ }, ref) => {

  console.log('creating OceanLayer component')
  const ocean_layer_ref = useRef<PlaneType>(null)

  // use global state/user input to initialise the layer
  const tos_state = useStore((state) => state.variables.tos)

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
      uLayerHeight: { value: 0.0 },
      // uLayerHeight: { value: 0.12 },
      uOpacity: {value: tos_state.opacity},
      dataTexture: {value: null},
      heightTexture: {value: null},
      textureTimesteps: {value: null},
      thisDataMin: {value: new Float32Array(1)},
      thisDataMax: {value: new Float32Array(1)},
      heightMin: {value: new Float32Array(1)},
      heightMax: {value: new Float32Array(1)},
      referenceDataTexture: {value: null},
      referenceDataMin: {value: new Float32Array(1)},
      referenceDataMax: {value: new Float32Array(1)},
      referenceDataFlag: {value: false},
      referenceHeightTexture: {value: null},
      referenceHeightMin: {value: new Float32Array(1)},
      referenceHeightMax: {value: new Float32Array(1)},
      uUserMinValue: {value: tos_state.min},
      uUserMaxValue: {value: tos_state.max},
      uUserMinValueAnomaly: {value: tos_state.anomaly_min},
      uUserMaxValueAnomaly: {value: tos_state.anomaly_max},
      colorMap: {value: cmap},
      colorMapIndex: {value: tos_state.colormap_index},
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

  function updateUserUniforms(store:TosSlice) {
    materialRef.current.uniforms.uUserMinValue.value = store.min
    materialRef.current.uniforms.uUserMaxValue.value = store.max
    materialRef.current.uniforms.colorMapIndex.value = store.colormap_index
    materialRef.current.uniforms.uUserMinValueAnomaly.value = store.anomaly_min
    materialRef.current.uniforms.uUserMaxValueAnomaly.value = store.anomaly_max
    materialRef.current.uniforms.uOpacity.value = store.opacity
  }

  async function updateTextures(data:TickData, reference:TickData, reference_flag:boolean, surface_layer_ref:RefObject<PlaneType>) {

    // always update the own data
    const dataTexture = await loader.loadAsync(URL.createObjectURL(data.textures[0].current_url.image))
    dataTexture.wrapS = dataTexture.wrapT = THREE.RepeatWrapping
    materialRef.current.uniforms.dataTexture.value = dataTexture
    const dataMin = new Float32Array(data.info.min[0][0]);
    const dataMax = new Float32Array(data.info.max[0][0]);

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
      const referenceDataMin = new Float32Array(reference.info.min[0][0]);
      const referenceDataMax = new Float32Array(reference.info.max[0][0]);
      materialRef.current.uniforms.referenceDataMin.value = referenceDataMin
      materialRef.current.uniforms.referenceDataMax.value = referenceDataMax
      materialRef.current.uniforms.referenceDataFlag.value = true
    } else {
      materialRef.current.uniforms.referenceDataFlag.value = false
    }

    if ( surface_layer_ref != null ) {
      // get surface height texture for masking
      const heightTexture = surface_layer_ref.current?.type.current.material.uniforms.dataTexture.value
      const heightMin = surface_layer_ref.current?.type.current.material.uniforms.thisDataMin.value
      const heightMax = surface_layer_ref.current?.type.current.material.uniforms.thisDataMax.value
      materialRef.current.uniforms.heightTexture.value = heightTexture
      materialRef.current.uniforms.heightMin.value = heightMin
      materialRef.current.uniforms.heightMax.value = heightMax
      
      if ( reference_flag ) {
        console.log(surface_layer_ref.current?.type.current.material.uniforms)
        const referenceHeightTexture = surface_layer_ref.current?.type.current.material.uniforms.referenceHeightTexture.value
        const referenceHeightMin = surface_layer_ref.current?.type.current.material.uniforms.referenceDataMin.value
        const referenceHeightMax = surface_layer_ref.current?.type.current.material.uniforms.referenceDataMax.value
        console.log(referenceHeightMin)
        materialRef.current.uniforms.referenceHeightTexture.value = referenceHeightTexture
        materialRef.current.uniforms.referenceHeightMin.value = referenceHeightMin
        materialRef.current.uniforms.referenceHeightMax.value = referenceHeightMax
      }

    }
  }
  

  useImperativeHandle(ref,()=> 
  {
    return {
      type:ocean_layer_ref,
      tick,
      updateTextures,
      updateUserUniforms
    }
  })

  return (
    <mesh 
      ref={ocean_layer_ref} 
      geometry={ geometry }
      material={ materialRef.current }
      renderOrder = { 2 }
      >
    </mesh>
  )
}))

export { OceanLayer }