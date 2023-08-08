#define M_PI 3.14159265

uniform sampler2D texturePosition;
uniform sampler2D cmapTexture;
uniform sampler2D quaternionTexture;
uniform sampler2D thisWindsFrame;
uniform sampler2D nextWindsFrame;

uniform float wrapAmountUniform;
uniform float uWindsArrowSize;

uniform float uFrameWeight;
uniform float uWindsSpeedMin;
uniform float uWindsSpeedMax;
uniform float uWindsZonalDataMin;
uniform float uWindsZonalDataMax;
uniform float uWindsMeridionalDataMin;
uniform float uWindsMeridionalDataMax;

uniform float uWindsMaxArrowSize;

uniform float uWindsParticleLifeTime;
uniform float uHeightWinds;

uniform bool uWindsScaleMagnitude;
uniform bool uWindsColorMagnitude;

varying vec4 vColor;

attribute vec2 aGPUuvs;

vec3 anglesToSphereCoord(vec2 a, float r)
{
    return vec3(
        r * sin(a.y) * sin(a.x),
        r * cos(a.y),
        r * sin(a.y) * cos(a.x) * - 1.0
    );
}

// remap function from RGB color to data value
vec3 remapVec3(vec3 value, float inMin, float inMax, float outMin, float outMax) {

    return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);

}

vec4 remapVec4(vec4 value, float inMin, float inMax, float outMin, float outMax) {

    return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);

}

// remap function from RGB color to data value
float remap(float value, float inMin, float inMax, float outMin, float outMax) {

    return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);

}

float map(float value, float inMin, float inMax, float outMin, float outMax) {
  return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);
}

vec3 rotateAxis(vec3 p, vec3 axis, float angle) {

    return mix(dot(axis, p)*axis, p, cos(angle)) + cross(axis,p)*sin(angle);

}

vec3 rotateAxis2(vec3 p, vec3 axis, float angle) {

    return (1. - cos(angle)) * dot(axis, p) * axis + cos(angle) * p + sin(angle) * cross(axis, p);

}

// convert float to color via colormap
vec4 applyColormap(float t, sampler2D colormap){

    return(texture2D(colormap,vec2(t,0.5)));

}

void main()
{
    /**
    * Position
    */

    // read particle position from GPGPU texture
    vec4 posTemp = texture2D( texturePosition, aGPUuvs );

    // calculate UV coordinates (0 to 1) from particle position
    vec2 gridUV = vec2( posTemp.x / 4. + 0.5, posTemp.y / 2. + 0.5 );
//    vec2 gridUV = vec2( posTemp.x / 4. + 0.5 - ( 1. / 96. / 2.0 ), posTemp.y / 2. + 0.5 + ( 1. / 73. / 2.0 ) );
//    vec2 gridUV = vec2( posTemp.x / 4. + 0.5 - ( 1. / 128. / 2.0 ), posTemp.y / 2. + 0.5 + ( 1. / 64. / 2.0 ) );
    // get velocities at particle position
    vec4 velocityInt = mix(texture2D(thisWindsFrame,gridUV),texture2D(nextWindsFrame,gridUV),uFrameWeight);
 
    // get sphere position rotation quaternion at particle position
    vec4 quaternions = texture2D(quaternionTexture,gridUV);

    // remap quaternions from RGB image value [0,1]
    // quaternions.x = remap( quaternions.x, 0.0, 1.0, -1.0, 1.0 );
    // quaternions.y = remap( quaternions.y, 0.0, 1.0, -1.0, 1.0 );
    // quaternions.z = remap( quaternions.z, 0.0, 1.0, -1.0, 1.0 );
    // quaternions.w = remap( quaternions.w, 0.0, 1.0, -1.0, 1.0 );

    quaternions = remapVec4( quaternions, 0.0, 1.0, -1.0, 1.0 );

    // remap velocities from RGB image value [0,1] to cm/s
    velocityInt.x = remap( velocityInt.x, 0.0, 1.0, uWindsZonalDataMin, uWindsZonalDataMax );
    velocityInt.y = remap( velocityInt.y, 0.0, 1.0, uWindsMeridionalDataMin, uWindsMeridionalDataMax );
    velocityInt.z = 0.0;

    float magnitude = length(velocityInt);
 //   float relativeMagnitude = mix(0.0, 1.0, magnitude );
    float relativeMagnitude;
    float relativeOpacity;

    if (magnitude < uWindsSpeedMin) {
        relativeMagnitude = 0.0;
        relativeOpacity = 0.0;
    } else if (magnitude / uWindsSpeedMin < 1.1 ) {
        relativeMagnitude = magnitude / uWindsSpeedMax;
        relativeOpacity =  1. - 10.0 * ( 1.1 - (magnitude / uWindsSpeedMin) ) ;
    } else {
        relativeMagnitude = magnitude / uWindsSpeedMax;
        relativeOpacity = 1.;
    }

    if (relativeMagnitude > ( uWindsMaxArrowSize - wrapAmountUniform * 0.5 )) {
        relativeMagnitude = uWindsMaxArrowSize - wrapAmountUniform * 0.5;
    }

    // apply quaternion rotation depending on uSphereWrapAmount
    vec3 vPositionScaled = position + ( 2.0 * cross( quaternions.xyz, cross( quaternions.xyz, position ) + quaternions.w * position ) * wrapAmountUniform);

    // scale arrow size
    if (uWindsScaleMagnitude) {

         vPositionScaled *= 1.0 * uWindsArrowSize * relativeMagnitude;

    } else {

        vPositionScaled *= 1.0 * uWindsArrowSize ;
    }
//   

    // get velocity direction
    float velAnglePlane = atan( velocityInt.y / velocityInt.x );

    if (velocityInt.x <= 0.) {
        velAnglePlane += M_PI;
    }

    float velAngleSphere = atan( -1. * velocityInt.y / velocityInt.x );

    if (velocityInt.x <= 0.) {
        velAngleSphere += M_PI;
    }

   // velAngle = 0.;

    vec3 vPositionScaledRotated = vec3(
        vPositionScaled.x * -1. * sin(velAnglePlane) + vPositionScaled.y * cos(velAnglePlane),
        vPositionScaled.x * cos(velAnglePlane) + vPositionScaled.y * sin(velAnglePlane),
        vPositionScaled.z
    );

    vec2 angles = M_PI * vec2(-1.0 * map(posTemp.x,-2.0,2.0,0.0,2.0) , map(posTemp.y,1.0,-1.0,0.0,1.0));
    vec3 sphCoordinates = anglesToSphereCoord(angles, 1.0 + posTemp.z + uHeightWinds);

  //  vec3 vPositionScaledRotatedSphere = rotateAxis( vPositionScaled, normalize(-1. * posTemp.xyz), velAngle);
  //  vec3 vPositionScaledRotatedSphere = vPositionScaled;
    vec3 vPositionScaledRotatedSphere = rotateAxis( vPositionScaled, normalize(-1. * sphCoordinates), velAngleSphere + M_PI / 2.);
 //   vec3 vPositionScaledRotatedSphere = rotateAxis( vPositionScaled, normalize(vec3(1.,0.,0)), M_PI/2.);
 //   vec3 vPositionScaledRotatedSphere = rotateAxis( vPositionScaled, normalize(-1. * spherePositions), M_PI / 2.);


    // calculate positions on plane
    vec3 planePos = vPositionScaledRotated+ posTemp.xyz;
    planePos.z += uHeightWinds;

//    vec3 planePos = vPositionScaledRotated + spherePositions;

    // calculate positions on sphere
    
    //vec2 angles = M_PI * vec2(-1.0 * map(planePos.x,-2.0,2.0,0.0,2.0) , map(posTemp.y,1.0,-1.0,0.0,1.0));
   vec3 sphPos = vPositionScaledRotatedSphere + sphCoordinates;
//    vec3 sphPos = vPositionScaledRotated + spherePositions;

    // interpolate between both positions
    vec3 wrapPos = mix(planePos, sphPos, wrapAmountUniform);
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(wrapPos, 1.0) ;
    
    if (uWindsColorMagnitude) {

        // color by magnitude
        vColor = texture2D( cmapTexture, vec2 ( relativeMagnitude, 0.5) );
        //vColor = texture2D( cmapTexture, vec2 ( relativeMagnitude, 0.5) );
        //vColor.a = 1.0;

    } else {

        vColor = vec4(1.0, 1.0, 1.0, relativeMagnitude);
//        vColor = vec4(1.0, 1.0, 1.0, 1.0);
//        vColor = vec4(.9, .9, .9, 1.);

    }


    vColor.a = smoothstep(0., uWindsParticleLifeTime * 0.1 , posTemp.a ) * (1. - smoothstep( uWindsParticleLifeTime - uWindsParticleLifeTime * 0.1, uWindsParticleLifeTime, posTemp.a)) * relativeOpacity;

    // if (uWindsScaleMagnitude) {

    //     vColor.a = 0.3 * vColor.a + 0.7 * vColor.a * relativeMagnitude;

    // }
 //   vColor.a = smoothstep(0., uWindsParticleLifeTime * 0.1 , posTemp.a ) * (1. - smoothstep( uWindsParticleLifeTime - uWindsParticleLifeTime * 0.1, uWindsParticleLifeTime, posTemp.a)) ;

 //   vColor.a = 1.;

    //vColor.a = posTemp.a / 250.0 ;




    
 //   vec4 particleColor = texture2D( cmapTexture, vec2 ( -1.0 * pos.z / uHeightDisplacement / 0.8 , 0.5) );

 //   vColor = particleColor;

}