import { GPUComputationRenderer } from 'three/examples/jsm/misc/GPUComputationRenderer.js'
import windsComputeShaderPosition from '$/shaders/windsComputeShaderPositionFrag.glsl' 


function initComputeRendererWinds(windsInitialPositions, renderer, shaderUniforms ) {

    let gpuComputeWinds = new GPUComputationRenderer( Math.sqrt(shaderUniforms.uWindsMaxParticleCount.value ), Math.sqrt(shaderUniforms.uWindsMaxParticleCount.value ), renderer );

    let dtPosition = gpuComputeWinds.createTexture();
  
    fillTexture( dtPosition, windsInitialPositions );

    let positionVariable, thisHeightFrame, duneHeightFrame

    positionVariable = gpuComputeWinds.addVariable( "texturePosition", windsComputeShaderPosition, dtPosition );

    gpuComputeWinds.setVariableDependencies( positionVariable, [ positionVariable ] );

    let positionUniforms = positionVariable.material.uniforms;

    let windsThisDataFrame, windsNextDataFrame
  
    positionUniforms[ "dataTexture" ] = { value: null };
    positionUniforms[ "thisDataMinU" ] = {value: new Float32Array(1)};
    positionUniforms[ "thisDataMaxU" ] = {value: new Float32Array(1)};
    positionUniforms[ "thisDataMinV" ] = {value: new Float32Array(1)};
    positionUniforms[ "thisDataMaxV" ] = {value: new Float32Array(1)};
    positionUniforms[ "thisHeightFrame" ] = { value: thisHeightFrame };
    positionUniforms[ "uFrame" ] = { value: null };
    positionUniforms[ "uFrameWeight" ] = { value: null };
    positionUniforms[ "uDelta" ] = { value: null}
    positionUniforms[ "textureTimesteps" ] = { value: null}
    positionUniforms[ "uRandSeed" ] = { value: null }
    positionUniforms[ "uWindsParticleLifeTime" ] = {value: shaderUniforms.uWindsParticleLifeTime.value }
    positionUniforms[ "uWindsSpeed" ] = {value: shaderUniforms.uWindsSpeed.value }

    // positionUniforms[ "uSpeed" ] = shaderUniforms.uJetStreamParticleSpeed
    // positionUniforms[ "uSpeedMax" ] = shaderUniforms.uJetStreamSpeedMax
    // positionUniforms[ "uWindsParticleLifeTime" ] = {value: shaderUniforms.uWindsParticleLifeTime.value }
    // positionUniforms[ "uSphereWrapAmount" ] = shaderUniforms.uSphereWrapAmount
    // positionUniforms[ "uHeightJinds" ] = shaderUniforms.uHeightJetStream
    // positionUniforms[ "uindsSpeedMin" ] = shaderUniforms.uJetStreamSpeedMin
    // positionUniforms[ "uHeightDisplacement" ] = shaderUniforms.uHeightDisplacement
    // positionUniforms[ "uHeightDisplacementDunes" ] = shaderUniforms.uHeightDisplacementDunes
    // positionUniforms[ "uMinDuneHeight" ] = shaderUniforms.uMinDuneHeight
    // positionUniforms[ "uOpacityDunes" ] = shaderUniforms.uOpacityDunes
    // positionUniforms[ "uWindsZonalDataMin" ] = shaderUniforms.uJetStreamZonalDataMin
    // positionUniforms[ "uWindsZonalDataMax" ] = shaderUniforms.uJetStreamZonalDataMax
    // positionUniforms[ "uWindsMeridionalDataMin" ] = shaderUniforms.uJetStreamMeridionalDataMin
    // positionUniforms[ "uWindsMeridionalDataMax" ] = shaderUniforms.uJetStreamMeridionalDataMax
    // positionUniforms[ "uWindsTopographyInfluence" ] = shaderUniforms.uJetStreamTopographyInfluence

    //uWindsSpeedMin: shaderUniforms.uWindsSpeedMin,

    gpuComputeWinds.tickEachFrame = (currentTime, cameraParameters, deltaTime) => { 

      gpuComputeWinds.variables[0].material.uniforms.uDelta.value = deltaTime
      gpuComputeWinds.variables[0].material.uniforms.uRandSeed.value = Math.random()

      gpuComputeWinds.compute();

      winds.material.uniforms[ "texturePosition" ].value = gpuComputeWinds.getCurrentRenderTarget( positionVariable ).texture;

    }


    const error = gpuComputeWinds.init();

    if ( error !== null ) {

      console.error( error );

    } else {

      return { gpuComputeWinds, positionVariable } ;

    }


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
  
  export { initComputeRendererWinds };