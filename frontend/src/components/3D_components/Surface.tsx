"use client"
import { forwardRef, useImperativeHandle } from "react"
import { useTexture } from "@react-three/drei"
import {
  Mesh,
  SphereGeometry,
  MeshStandardMaterial,
  NearestFilter,
} from "three"

type SphereType = Mesh<SphereGeometry, MeshStandardMaterial>

type config = {
  model: string
  heightData: string
}

type SphereProps = {
  config: config
}

function update(params:type) {
  console.log('update')
}

const Surface = forwardRef<SphereType, SphereProps>(({ config }, ref) => {
  const texture = useTexture(config.heightData)
  // Apply nearest neighbor filtering
  texture.minFilter = NearestFilter
  texture.magFilter = NearestFilter

  useImperativeHandle(ref,()=> 
  {
    return {
      update
    }
  })

  return (
    <mesh ref={ref} castShadow>
      <sphereGeometry args={[1, 64, 32]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  )
})

export { Surface }
