"use client";
import { useFrame } from '@react-three/fiber'
import { useControls } from 'leva'
import { Perf } from 'r3f-perf'
import { useRef, forwardRef, RefObject } from 'react'

import * as THREE from 'three';
import { SphereGeometry, Mesh, MeshStandardMaterial } from 'three'
import { Title } from './Title'
import Lights from './Lights'
import Controls from './Controls'
import { Plane } from './Plane'
import { Surface } from './Surface'
import { useClusterStore } from '@/utils/store/cluster.store';
import { Texture, TextureInfo } from '@/utils/database/Texture';
import { VariableName } from '@/utils/store/variables/variable.types';

type Props = {
  config: {
    model: string,
    heightData: string
  }
  tick : (delta:number) => Promise<Map<VariableName,{current_url:string,next_url:string,weight:number}>>
}

function buildTexture(data:ArrayBuffer,info:TextureInfo) {
  var blob = new Blob([data], { type: "image/png" });
  var url = URL.createObjectURL(blob);
  var texture = new THREE.TextureLoader().load(url);
  //, THREE.RGBAFormat, THREE.UnsignedByteType
  // var dataView = new DataView(data);
  // let texture = new THREE.DataTexture(dataView, info.xsize, info.ysize);
  texture.needsUpdate = true;
  return texture;
}

export function World({ config, tick } : Props) {
  // for Leva debug GUI (there must be a better way for this ...)
  const { usePerformance, useTitle } = useControls('global', {
    usePerformance: true,
    useTitle: true,
  })
  const { rotate } = useControls('Globe', {
    rotate: false,
  })

  const exps = useClusterStore((state) => state.collections.current)
  const sphereRef = useRef<Mesh<SphereGeometry, MeshStandardMaterial>>(null)
  let texture = new THREE.TextureLoader()


  useFrame((_, delta) => {
    tick(delta).then((res)=> {
      for(let [variable,data] of res) {
        texture.load(data.current_url,(tt) => {
          if (sphereRef.current){
            sphereRef.current.material.map = tt
          }
        })
        break;
      }
    })
    
    if (rotate) {
      sphereRef.current!.rotation.y += delta / 3
    }
  })

  return (
    <>
      {usePerformance && <Perf position='bottom-right' />}
      {/* {useTitle && <Title config={config}/>} */}
      <Controls />
      <Lights />
      <Surface ref={sphereRef} config={config} />
      {/* <Plane /> */}
    </>
  )
}
