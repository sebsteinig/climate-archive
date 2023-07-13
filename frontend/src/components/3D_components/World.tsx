"use client";
import { useFrame } from '@react-three/fiber'
import { useControls } from 'leva'
import { Perf } from 'r3f-perf'
import { useRef, forwardRef, RefObject } from 'react'
import { SphereGeometry, Mesh, MeshStandardMaterial } from 'three'
import { Title } from './Title'
import Lights from './Lights'
import Controls from './Controls'
import { Plane } from './Plane'
import { Surface } from './Surface'
import { useClusterStore } from '@/utils/store/cluster.store';

type Props = {
  config: {
    model: string,
    heightData: string
  }
  tick : (delta:number) => void
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

  useFrame((_, delta) => {
    // if (input_ref) {
    //   console.log(input_ref.current?.value);
    // }
    tick(delta)
    
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
