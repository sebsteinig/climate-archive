"use client"
import {
  forwardRef,
  useImperativeHandle,
  useRef,
  RefObject,
} from "react"
import { memo } from "react"
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

const geometry = new THREE.PlaneGeometry(4, 2, 64, 32);

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
  console.log(height_state.colormap_index)
  console.log(height_state.colormap)

  const materialRef = useRef(new THREE.ShaderMaterial( {
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    wireframe: false,
    transparent: true,
    side: THREE.DoubleSide,
    uniforms: {
      uFrameWeight: {value: null},
      uSphereWrapAmount: {value: 0.0},
      uLayerHeight: {value: 0.0},
      uLayerOpacity: {value: 0.0},
      thisDataFrame: {value: null},
      nextDataFrame: {value: null}, 
      thisDataMin: {value: null},
      thisDataMax: {value: null},
      nextDataMin: {value: null},
      nextDataMax: {value: null},
      referenceDataFrame: {value: null},
      referenceDataMin: {value: null},
      referenceDataMax: {value: null},
      referenceDataFlag: {value: false},
      uUserMinValue: {value: height_state.min},
      uUserMaxValue: {value: height_state.max},
      colorMap: {value: cmap},
      colorMapIndex: {value: height_state.colormap_index},
      numLon: {value: 96},
      numLat: {value: 73},
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
  }

  async function updateTextures(data:TickData, reference:TickData, reference_flag:boolean) {
    // always update the own data

    // create the texture from the image blob
    // const thisFrame = loader.load(URL.createObjectURL(data.textures[0].current_url.image))
    // const nextFrame = loader.load(URL.createObjectURL(data.textures[0].next_url.image))
    const thisFrame = await loader.loadAsync(URL.createObjectURL(data.textures[0].current_url.image))
    const nextFrame = await loader.loadAsync(URL.createObjectURL(data.textures[0].next_url.image))
    // const thisFrame = loader.load(data.textures[0].current_url)
    // const nextFrame = loader.load(data.textures[0].next_url)

    thisFrame.wrapS = thisFrame.wrapT = THREE.RepeatWrapping
    nextFrame.wrapS = nextFrame.wrapT = THREE.RepeatWrapping
    materialRef.current.uniforms.thisDataFrame.value = thisFrame
    materialRef.current.uniforms.nextDataFrame.value = nextFrame 
    materialRef.current.uniforms.thisDataMin.value = data.current.min[0]
    materialRef.current.uniforms.thisDataMax.value = data.current.max[0]
    materialRef.current.uniforms.nextDataMin.value = data.next.min[0]
    materialRef.current.uniforms.nextDataMax.value = data.next.max[0]

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