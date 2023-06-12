import { useMatcapTexture, Text3D } from '@react-three/drei'
import { forwardRef, useEffect} from 'react'

import * as THREE from 'three'

const material = new THREE.MeshMatcapMaterial()

type config = {
    model: string,
    heightData: string
  }

type TitleProps = {
config: config;
}

type TitleType = THREE.Mesh<THREE.SphereGeometry, THREE.MeshStandardMaterial>


const Title = forwardRef<TitleType, TitleProps>(({ config }, ref) => {

    const [ matcapTexture ] = useMatcapTexture('7B5254_E9DCC7_B19986_C8AC91', 256)

    useEffect(() =>
    {
        matcapTexture.colorSpace = THREE.SRGBColorSpace
        matcapTexture.needsUpdate = true

        material.matcap = matcapTexture
        material.needsUpdate = true
    }, [])

    return (
        <Text3D
            material={ material }
            font="./fonts/helvetiker_regular.typeface.json"
            size={ 0.75 }
            height={ 0.2 }
            curveSegments={ 2 }
            position={ [ -3, 1.5, -2. ] }
            bevelEnabled={true}
            bevelThickness={ 0.02 }
            bevelSize={ 0.02 }
            bevelOffset={ 0 }
            bevelSegments={ 2 }
        >
            {config.model}
        </Text3D>
    );
});

export { Title }