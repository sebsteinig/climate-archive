// uniform float uFrame;
// uniform float uFrameWeight;
uniform float uWindsSpeed;
uniform float uDelta;
uniform float uRandSeed;
uniform float dataMinU[84];
uniform float dataMaxU[84];
uniform float dataMinV[84];
uniform float dataMaxV[84];
// uniform float level;
// uniform float textureTimesteps;

uniform float uDropRate;
uniform float uDropRateBump;
uniform float uWindsParticleLifeTime;

uniform sampler2D dataTexture;
uniform sampler2D cmapTexture;

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


// Function to calculate the index from 2D coordinates (i, j)
// Assuming the number of columns is 12
const int NUM_COLS = 12;

int getIndex(int i, int j) {
    return i * NUM_COLS + j;
}


void main() {

    float level = 0.0;
    float textureTimesteps = 12.0;
    float uFrame = 0.0;
    float uFrameWeight = 0.0;
    // divide screen space coordinates by viewport size to get UV texture coordinates in the range 0 to 1
    vec2 uv = gl_FragCoord.xy / resolution.xy;

    // look up particle position (texel) from texture
    vec4 posTemp = texture2D( texturePosition, uv );

    // calculate UV coordinates (0 to 1) from particle position
    vec2 gridUV = vec2( posTemp.x / 4. + 0.5, posTemp.y / 2. + 0.5 );

    // gridUV = vec2(0.5, 0.5);

    // calculate the width of the UV segment each timesteps
    float segmentWidthX = 1.0 / textureTimesteps;
    float verticalLevels = 7.0;
    float segmentWidthY = 1.0 / verticalLevels;

    // Adjust the UV coordinates
    // X vertical levels
    vec2 this_uv = gridUV;
    vec2 next_uv = gridUV;
    // 1 or 12 timesteps in the horizontal
    this_uv.x = uFrame / textureTimesteps + (this_uv.x * segmentWidthX);
    next_uv.x = ( uFrame + 1.0) / textureTimesteps + (next_uv.x * segmentWidthX);
    // 7 vertical levels
    this_uv.y = ( 1.0 - ( level + 1.0 ) * segmentWidthY ) + (this_uv.y * segmentWidthY);
    next_uv.y = ( 1.0 - ( level + 1.0 ) * segmentWidthY ) + (next_uv.y * segmentWidthY);

    vec4 intVelocities;

    // 2D surface velocity fields
    // look up model velocities at those UVs for both frames
    // vec4 thisFrameVel = texture2D( dataTexture, this_uv);
    vec4 thisFrameVel = texture2D( dataTexture, this_uv);
    vec4 nextFrameVel = texture2D( dataTexture, next_uv); 

    // flattended array[84]; // 7 * 12 = 84
    // To access the element at [i][j], calculate the index like this:
    // int i = 1; // Example row
    // int j = 2; // Example column
    // float value = yourArrayUniform[i * 12 + j];
    // ... your shader code ...
    int this2DIndex = getIndex(int(level), int(uFrame));
    int next2DIndex = getIndex(int(level), int(uFrame +1.0));

    // remap velocities from RGB image value [0,1] to cm/s [-50,50 cm/s] 
    thisFrameVel.x = remap( thisFrameVel.x, 0.0, 1.0, dataMinU[this2DIndex], dataMaxU[this2DIndex] );
    thisFrameVel.y = remap( thisFrameVel.y, 0.0, 1.0, dataMinV[this2DIndex], dataMaxV[this2DIndex] );
    thisFrameVel.z = 0.0;

    nextFrameVel.x = remap( nextFrameVel.x, 0.0, 1.0, dataMinU[next2DIndex], dataMaxU[next2DIndex] );
    nextFrameVel.y = remap( nextFrameVel.y, 0.0, 1.0, dataMinV[next2DIndex], dataMaxV[next2DIndex] );
    nextFrameVel.z = 0.0;

    // interpolate velocities between frames
    intVelocities = mix(thisFrameVel, nextFrameVel, uFrameWeight);

    // scale particle velocities
    vec3 vel = intVelocities.xyz * uWindsSpeed ;

    // velocity disortion at higher latitudes; needs to be checked; from https://github.com/mapbox/webgl-wind/blob/master/src/shaders/update.frag.glsl
//    if (vc2D.y > 0.01 && vc2D.y < 0.99) {
//      vel.x /= cos(radians(vc2D.y * 180.0 - 90.0));
//    }

    vec3 pos = posTemp.xyz;

    // Advance dynamics one time step
    pos += vel * 0.01 / 3.0 ;
    // pos += 0.1 * uDelta / 3.0 ;
    // pos.xy += uv*0.001;


    if (pos.x > 2.0) {
        pos.x -= 4.0;
    }

    if (pos.x < -2.0) {
        pos.x += 4.0;
    }

    // pos.z = height + uHeightWinds;

    float age;

    // reset particle to random position if lifetime expires or it leaves northern or southern boundary
    if ( posTemp.a > uWindsParticleLifeTime || pos.y >= .9 || pos.y <= -.9 ) {

        // get new random position
        // random reset of particle positions from from https://github.com/mapbox/webgl-wind/blob/master/src/shaders/update.frag.glsl
  
        // a random seed to use for the particle drop
        vec2 seed = (pos.xy + posTemp.xy) * uRandSeed;
        
        pos = getRandomPosition(seed, 1.2, posTemp.z);

        age = 0.;

    // otherwise increment time counter for particle
    } else {

        age = posTemp.a + 1.;

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