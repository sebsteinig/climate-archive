uniform sampler2D dataTexture;

uniform float uFrame;
uniform float uFrameWeight;
uniform float uWindsSpeed;
uniform float uDelta;
uniform float uRandSeed;
uniform float dataMinU[12];
uniform float dataMaxU[12];
uniform float dataMinV[12];
uniform float dataMaxV[12];
uniform float textureTimesteps;

uniform float uDropRate;
uniform float uDropRateBump;
uniform float uWindsParticleLifeTime;
uniform float uSphereWrapAmount;
uniform float uHeightWinds;

// remap function from RGB color to data value
float remap(float value, float inMin, float inMax, float outMin, float outMax) {

    return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);

}

// pseudo-random generator (https://stackoverflow.com/questions/4200224/random-noise-functions-for-glsl)
const vec3 rand_constants = vec3(12.9898, 78.233, 4375.85453);

float rand(const vec2 co) {
    float t = dot(rand_constants.xy, co);
    return fract(sin(t) * (rand_constants.z + t));
}

vec3 getRandomPosition(vec2 seed, float decimal, float height) {

    // if (uSphereWrapAmount >= 0.5) {

    //     return vec3 (
    //         (rand(seed + 1.0 + decimal) - 0.5) * 4.0,
    //         ( ( rand(seed + 1.0 + 2. * decimal) + rand(seed + 2.0 + decimal) ) / 2. - 0.5) * 1.98,
    //             0.001 
    //     );   

    // } else {

        return vec3 (
            (rand(seed + 1.0 + decimal) - 0.5) * 4.0,
            (rand(seed + 2.0 + decimal) - 0.5) * 1.98,
            // height
            height
        );   

    // }

} 



void main() {

    // divide screen space coordinates by viewport size to get UV texture coordinates in the range 0 to 1
    vec2 uv = gl_FragCoord.xy / resolution.xy;

    // look up particle position (texel) from texture
    vec4 tmpPos = texture2D( texturePosition, uv );
    vec3 pos = tmpPos.xyz;

    // convert xy-plane position to UV texture coordinate [0,1]
    vec2 vc2D  = vec2 (pos.x / 4.0 + 0.5 - ( 1. / 96. / 2.0 ),  pos.y / 2.0 + 0.5 + ( 1. / 73. / 2.0 ) );

    // calculate the width of the UV segment each timesteps
    float segmentWidth = 1.0 / textureTimesteps;
    
    // Adjust the UV coordinates
    vec2 this_uv = vec2((uFrame / textureTimesteps) + (vc2D.x * segmentWidth), vc2D.y);
    vec2 next_uv = vec2((( uFrame + 1.0) / textureTimesteps) + (vc2D.x * segmentWidth), vc2D.y);

    vec4 intVelocities;

    // 2D surface velocity fields
    // look up model velocities at those UVs for both frames
    vec4 thisFrameVel = texture2D( dataTexture, this_uv);
    vec4 nextFrameVel = texture2D( dataTexture, next_uv); 

    // remap velocities from RGB image value [0,1] to cm/s [-50,50 cm/s] 
    thisFrameVel.x = remap( thisFrameVel.x, 0.0, 1.0, dataMinU[int(uFrame)], dataMaxU[int(uFrame)] );
    thisFrameVel.y = remap( thisFrameVel.y, 0.0, 1.0, dataMinU[int(uFrame)], dataMaxU[int(uFrame)] );
    thisFrameVel.z = 0.0;

    nextFrameVel.x = remap( nextFrameVel.x, 0.0, 1.0, dataMinU[int(uFrame+1.0)], dataMaxU[int(uFrame+1.0)] );
    nextFrameVel.y = remap( nextFrameVel.y, 0.0, 1.0, dataMinV[int(uFrame+1.0)], dataMaxV[int(uFrame+1.0)] );
    nextFrameVel.z = 0.0;

    // interpolate velocities between frames
    intVelocities = mix(thisFrameVel, nextFrameVel, uFrameWeight);

    // scale particle velocities
    // vec3 vel = intVelocities.rgb * uWindsSpeed;
    vec3 vel = intVelocities.xyz * uWindsSpeed;
    // vec3 vel = vec3(0.) * uWindsSpeed;

    // velocity disortion at higher latitudes; needs to be checked; from https://github.com/mapbox/webgl-wind/blob/master/src/shaders/update.frag.glsl
//    if (vc2D.y > 0.01 && vc2D.y < 0.99) {
//      vel.x /= cos(radians(vc2D.y * 180.0 - 90.0));
//    }

    // Advance dynamics one time step
    pos += vel * uDelta / 10.0 ;
    // pos += vec3(0.1, 0.1, 0.0) * uDelta / 3.0 ;
    // pos += 0.0 ;

    if (pos.x > 2.0) {
        pos.x -= 4.0;
    }

    if (pos.x < -2.0) {
        pos.x += 4.0;
    }

    // pos.z = height + uHeightWinds;

    float age;

    // reset particle to random position if lifetime expires or it leaves northern or southern boundary
    if ( tmpPos.a > uWindsParticleLifeTime || pos.y >= .9 || pos.y <= -.9 ) {

        // get new random position
        // random reset of particle positions from from https://github.com/mapbox/webgl-wind/blob/master/src/shaders/update.frag.glsl
  
        // a random seed to use for the particle drop
        vec2 seed = (pos.xy + tmpPos.xy) * uRandSeed;
        
        pos = getRandomPosition(seed, 1.2, tmpPos.z);

        age = 0.;

    // otherwise increment time counter for particle
    } else {

        age = tmpPos.a + 1.;

    }


   //     pos = mix(pos, random_pos, drop);

 //   if (pos.y >= 1.0 || pos.y <= -1.0 || heightValueInt.r >= 0.5) {
//    if (pos.y >= 1.0 || pos.y <= -1.0 || landMask >= 0.5 ) {
    // if (pos.y >= 1.0 || pos.y <= -1.0) {
    //     pos = random_pos;
    // }    

    // if (pos.y >= 1.0 || pos.y <= -1.0 || length(vel) <= 0.05 ) {
    //     pos = random_pos;
    // }    


    gl_FragColor = vec4( pos, age );
    // gl_FragColor = vec4( vec3(0.0,1.0,0.0), 1.0 );
    // gl_FragColor = vec4( pos, 1.0 );

// no movement
//     gl_FragColor = tmpPos;
 


}