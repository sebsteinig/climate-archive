"use client";
import { forwardRef } from 'react'
import { useTexture } from "@react-three/drei";
import { Mesh, SphereGeometry, MeshStandardMaterial, NearestFilter } from 'three'

type SphereType = Mesh<SphereGeometry, MeshStandardMaterial>

type config = {
  model: string,
  heightData: string
}

type SphereProps = {
  config: config;
}

const Surface = forwardRef<SphereType, SphereProps>(({ config }, ref) => {
  const texture = useTexture(config.heightData);
  // Apply nearest neighbor filtering
  texture.minFilter = NearestFilter;
  texture.magFilter = NearestFilter;

  return (
    <mesh ref={ref} castShadow>
      <sphereGeometry args={[1, 64, 32]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
});

export { Surface }
