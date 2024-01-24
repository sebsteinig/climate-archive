function createInitialWindPositions(shaderUniforms) {

    let posArray = new Float32Array(shaderUniforms.uWindsMaxParticleCount.value * 4);
  
    for ( let k = 0, kl = posArray.length; k < kl; k += 4 ) {
  
      // Fill in texture values
      posArray[ k + 0 ] = (Math.random() - 0.5) * 4.0
 //     posArray[ k + 1 ] = (Math.random() - 0.5) * 1.98
      posArray[ k + 1 ] = ( ( Math.random() + Math.random() ) / 2. - 0.5) * 1.98

      posArray[ k + 2 ] = ( Math.random() - 0.5) * shaderUniforms.uWindsVerticalSpread.value
      // particle age
      posArray[ k + 3 ] = Math.random() * shaderUniforms.uWindsParticleLifeTime.value        
  
    }
    
    return { posArray }

  }

  export { createInitialWindPositions };