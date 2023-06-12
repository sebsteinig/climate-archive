import { useFrame } from '@react-three/fiber'
import { useControls } from 'leva'
import { Perf } from 'r3f-perf'
import { useRef, forwardRef } from 'react'
import { SphereGeometry, Mesh, MeshStandardMaterial } from 'three'
import { Title } from './components/Title.tsx'
import Lights from './components/Lights.tsx'
import Controls from './components/Controls.tsx'
import { Plane } from './components/Plane'
import { Surface } from './components/Surface.js'

type WorldProps = {
  config: {
    model: string,
    heightData: string
  }
}

const World: React.FC<WorldProps> = ({ config }) => {
  // for Leva debug GUI (there must be a better way for this ...)
  const { usePerformance, useTitle } = useControls('global', {
    usePerformance: true,
    useTitle: true,
  })
  const { rotate } = useControls('Globe', {
    rotate: false,
  })

  const sphereRef = useRef<Mesh<SphereGeometry, MeshStandardMaterial>>(null)

  useFrame((_, delta) => {
    if (rotate) {
      sphereRef.current!.rotation.y += delta / 3
    }
  })

  return (
    <>
      {usePerformance && <Perf position='bottom-right' />}
      {useTitle && <Title config={config}/>}
      <Controls />
      <Lights />
      <Surface ref={sphereRef} config={config} />
      <Plane />
    </>
  )
}

export { World }
