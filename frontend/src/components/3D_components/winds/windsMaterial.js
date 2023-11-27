import { ShaderMaterial, MeshBasicMaterial, Color, DataTexture, RGBAFormat, LinearFilter, TextureLoader, DoubleSide, BackSide, NoBlending} from 'three';
import { GPUComputationRenderer } from 'three/examples/jsm/misc/GPUComputationRenderer.js'
// import vertexShader from "$/shaders/windsVert.glsl"
import vertexShader from "$/shaders/windsVert.orig.glsl"
// import vertexShader from "$/shaders/windsTest.vert.glsl"
import fragmentShader from "$/shaders/windsFrag.glsl"

function createWindsMaterial(quaternionTexture, shaderUniforms, renderer, initialPositions) {

    // Colormap for particles, from:
    // https://colorbrewer2.org/?type=diverging&scheme=Spectral&n=11

    var colors = [
        //    'rgb(158,1,66)',
            'rgb(213,62,79)',
            'rgb(244,109,67)',
            'rgb(253,174,97)',
            'rgb(254,224,139)',
        //     'rgb(255,255,191)',
            'rgb(230,245,152)',
            'rgb(171,221,164)',
            'rgb(102,194,165)',
            'rgb(50,136,189)',
        //    'rgb(94,79,162)'
            ]
        
            const width = colors.length;
            const height = 1;
            
            const size = width * height;
            const data = new Uint8Array( 3 * size );
        
            
            for ( let i = 0; i < size; i ++ ) {
        
                const rgb = new Color(colors[i])
            
                const stride = i * 3;
            
                data[ stride ] = rgb.r * 255;
                data[ stride + 1 ] = rgb.g * 255;
                data[ stride + 2 ] = rgb.b * 255;
            
            }
            
            // used the buffer to create a DataTexture
            
            const cmapTexture = new DataTexture( data, width, height, RGBAFormat );
            cmapTexture.format = RGBAFormat
            cmapTexture.needsUpdate = true
            cmapTexture.minFilter = LinearFilter
            cmapTexture.maxFilter = LinearFilter

            const loader = new TextureLoader();
            const cmap = loader.load('/assets/colormaps/cbrewerSpeed3.png')

            let gpuComputeWinds = new GPUComputationRenderer( Math.sqrt(shaderUniforms.uWindsMaxParticleCount.value ), Math.sqrt(shaderUniforms.uWindsMaxParticleCount.value ), renderer );

            let dtPosition = gpuComputeWinds.createTexture();
          
            fillTexture( dtPosition, initialPositions );

            const dataTexture = new DataTexture( initialPositions, 64, 64 );
            dataTexture.needsUpdate = true;

            const material = new ShaderMaterial({
                vertexShader: vertexShader,
                fragmentShader: fragmentShader,
                transparent: true,
                depthWrite: false,
                side: DoubleSide,
                uniforms:
                {
                    texturePosition: { value: dataTexture },
                    cmapTexture: { value: cmap },
                    quaternionTexture: { value: quaternionTexture },
                    dataTexture : {value: null },
                    textureTimesteps: {value: null},
                    wrapAmountUniform: { value: 0.0 },
                    uFrame: {value: null},
                    uFrameWeight: { value: null },
                    level: { value: 0.0 },
                    uWindsParticleOpacity: { value: 1.0 },
                    uWindsArrowSize: shaderUniforms.uWindsArrowSize,
                    uWindsMaxArrowSize: { value: 1.0 },
                    uWindsParticleLifeTime: shaderUniforms.uWindsParticleLifeTime,
                    uWindsScaleMagnitude: shaderUniforms.uWindsScaleMagnitude,
                    uWindsColorMagnitude: { value: false },
                    uWindsSpeedMin: shaderUniforms.uWindsSpeedMin,
                    uWindsSpeedMax: shaderUniforms.uWindsSpeedMax,
                    uHeightWinds: { value: 0.18 },
                    dataMinU: {value: new Float32Array(1)},
                    dataMaxU: {value: new Float32Array(1)},
                    dataMinV: {value: new Float32Array(1)},
                    dataMaxV: {value: new Float32Array(1)},
                    referenceDataFlag: {value: false},
                }
            })

        const materialBasic = new MeshBasicMaterial({ color: 0xff0000 }); // Red color for visibility

        return material


}

function fillTexture( texturePosition, initialPositions ) {

    let posArray = texturePosition.image.data;
  
    for ( let k = 0, kl = posArray.length; k < kl; k += 4 ) {
  
      // Fill in texture values
      posArray[ k + 0 ] = initialPositions.posArray[k + 0]
      posArray[ k + 1 ] = initialPositions.posArray[k + 1]
      posArray[ k + 2 ] = initialPositions.posArray[k + 2]
      posArray[ k + 3 ] = initialPositions.posArray[k + 3]
  
    }
  
  }

export {createWindsMaterial}