import { Mesh, InstancedBufferGeometry, Shape, InstancedBufferAttribute, Vector2, BufferGeometry, ExtrudeGeometry, ShapeGeometry, PlaneGeometry, MeshBasicMaterial, RGBAFormat, DataTexture, LinearFilter } from 'three';

function createWindsGeometry(initialPositions, shaderUniforms) {


    // definition of common uniform and attributes   
    const gpuComputeUVs = new Float32Array( shaderUniforms.uWindsMaxParticleCount.value * 2);

    let p = 0;

    var WIDTH = Math.sqrt(shaderUniforms.uWindsMaxParticleCount.value )
    for ( let j = 0; j < WIDTH; j ++ ) {

        for ( let i = 0; i < WIDTH; i ++ ) {

            gpuComputeUVs[ p ++ ] = i / ( WIDTH - 1 );
            gpuComputeUVs[ p ++ ] = j / ( WIDTH - 1 );

        }

    }

    const baseGeometry = getArrowGeometry()
//    const baseGeometry = new PlaneGeometry()

    var jj = 0;
    var kk = 0;

    function map(value, inMin, inMax, outMin, outMax) {

        return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);

      }

    function norm(arr, norm_min, norm_max) {

      return (arr - norm_min) / (norm_max - norm_min)

    }

    // calculate rotations for geometries to be tangent to sphere surface and save to DataTexture to use in shader
    const width = 360.;
    const height = 180.;
    
    const size = width * height;
    const quaternionsData = new Uint8Array( 4 * size ); 

    var textureIndex = 0

    // loop over latitudes
    for ( let jj = 0; jj < height; jj ++ ) {

      // loop over longitudes
      for ( let ii = 0; ii < width; ii ++ ) {
        
        // mesh that we place on sphere at 1x1 degree resolution
        const dummyMesh = new Mesh( baseGeometry, new MeshBasicMaterial );

        // Calculate positions in spherical coordinates at 1x1 degree resolution

        // phi from 0 to 2 PI
        const phi = Math.PI * -1.0 * ( ii / width * 2. )

        // theta from 0 to 1 PI
        const theta =  Math.PI * ( 1. - jj / height * 1. )

        // mimic surface shader calculations for spherical coordinates
        dummyMesh.position.set( 
          1 * Math.sin(theta) * Math.sin(phi), 
          1 * Math.cos(theta),
          - 1.0 * 1 * Math.sin(theta) * Math.cos(phi)
          );

        // orient geometry along sphere surface (tangent)
        dummyMesh.lookAt(0,0,0)
        
        // save as rgba in DataTexture
        // quaternion components in range -1 to 1
        quaternionsData[ textureIndex ] = norm( dummyMesh.quaternion.x, -1., 1. ) * 255;
        quaternionsData[ textureIndex + 1 ] = norm( dummyMesh.quaternion.y, -1., 1. ) * 255;
        quaternionsData[ textureIndex + 2 ] = norm( dummyMesh.quaternion.z, -1., 1. ) * 255;
        quaternionsData[ textureIndex + 3 ] = norm( dummyMesh.quaternion.w, -1., 1. ) * 255;

         textureIndex = textureIndex + 4

      }

    }
     
    const quaternionTexture = new DataTexture( quaternionsData, width, height, RGBAFormat );
    quaternionTexture.format = RGBAFormat
    quaternionTexture.needsUpdate = true
    // quaternionTexture.minFilter = LinearFilter
    // quaternionTexture.maxFilter = LinearFilter

    // for ( let i = 0; i < shaderUniforms.uOceanMaxParticleCount.value; i++ ){

    //     const phi = Math.PI * -1.0 * map(initialPositions.posArray[ jj + 0 ],-2.0,2.0,0.0,2.0)
    //     const theta =  Math.PI * map(initialPositions.posArray[ jj + 1 ],1.0,-1.0,0.0,1.0)

    //     // mimic surface shader calculations for spherical coordinates
    //     dummyMesh.position.set( 
    //       1 * Math.sin(theta) * Math.sin(phi), 
    //       1 * Math.cos(theta),
    //       - 1.0 * 1 * Math.sin(theta) * Math.cos(phi)
    //       );

    //     // orient trees along sphere normals, i.e. always looking upwards/outside of the globe
    //     dummyMesh.lookAt(0,0,0)

    //     // save quaternions (i.e. rotations) for each tree to later apply in the shader for globe view
    //     quaternions[ jj + 0 ] = dummyMesh.quaternion.x
    //     quaternions[ jj + 1 ] = dummyMesh.quaternion.y
    //     quaternions[ jj + 2 ] = dummyMesh.quaternion.z
    //     quaternions[ jj + 3 ] = dummyMesh.quaternion.w

    //     jj = jj + 4

    //     }   

    //     console.log(quaternions)

    // instanced geometries
    const geometry = new InstancedBufferGeometry();
    geometry.copy(baseGeometry);


    geometry.instanceCount = shaderUniforms.uWindsParticleCount.value; 
    geometry.maxInstancedCount = shaderUniforms.uWindsMaxParticleCount.value; 


    geometry.setAttribute('aGPUuvs', new InstancedBufferAttribute(gpuComputeUVs, 2 ));
 //   geometry.setAttribute('quaternions', new InstancedBufferAttribute(quaternions, 4 ));

    const geometry_test = new PlaneGeometry(4, 2, 64, 32);

    return [ geometry_test, quaternionTexture ]

}

/**
 * Creates the arrow-geometry.
 * from https://codepen.io/usefulthink/pen/YNrvpY
 * @return {THREE.BufferGeometry}
 */

 function getArrowGeometry() {
    // const shape = new Shape([
    //   [-0.8, -1], [-0.03, 1], [-0.01, 1.017], [0.0, 1.0185],
    //   [0.01, 1.017], [0.03, 1], [0.8, -1], [0.3, -0.5], [0.3, -2.5], [-0.3, -2.5], [-0.3, -.5]
    // ].map(p => new Vector2(...p)));
    const shape = new Shape([
      [-0.8, -1], [0.0, 1.0185],
      [0.8, -1], [0.3, -0.5], [0.3, -2.5], [-0.3, -2.5], [-0.3, -.5]
    ].map(p => new Vector2(...p)));
  
    const geometry3D = new ExtrudeGeometry(shape, {
      depth: 0.6,
      bevelEnabled: false,
      bevelSize: 0.1, 
      bevelThickness: 0.1, 
      bevelSegments: 1
    });

  
    // orient the geometry 
//     const matrix = new Matrix4()
//         .makeRotationAxis(new Vector3(1, 0, 0),  Math.PI / 4)
//   //      .setPosition(new Vector3(0, 0.15, 0));
  
//     geometry3D.applyMatrix4(matrix);
  
    const geometry2D = new ShapeGeometry( shape );

    // convert to buffer-geometry
    return new BufferGeometry().copy(geometry2D);
//    return new BufferGeometry().copy(geometry3D);
}


export {createWindsGeometry}