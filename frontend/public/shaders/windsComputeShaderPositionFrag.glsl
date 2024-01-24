uniform float uFrame;
uniform float uFrameWeight;
uniform float uWindsSpeed;
uniform float uDelta;
uniform float uRandSeed;
uniform float dataMinU[84];
uniform float dataMaxU[84];
uniform float dataMinV[84];
uniform float dataMaxV[84];
uniform float level;
uniform float textureTimesteps;

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

// find bracketing indices based on user chosen pressure level
float myArray[7] = float[7](1000.0, 850.0, 700.0, 500.0, 200.0, 100.0, 10.0);

vec3 pressure2index(float value) {
    // Check if the value is out of the array bounds
    if (value >= myArray[0]) return vec3(0.0, 0.0, 0.0);
    if (value <= myArray[6]) return vec3(6.0, 6.0, 0.0);

    for (int i = 0; i < 6; ++i) {
        if (value <= myArray[i] && value >= myArray[i + 1]) {
            // Calculate the fraction
            float fraction = (value - myArray[i + 1]) / (myArray[i] - myArray[i + 1]);

            return vec3(float(i), float(i + 1), fraction);
        }
    }

    // Return -1 if something unexpected happens
    return vec3(-1.0, -1.0, -1.0);
}

void main() {

    // divide screen space coordinates by viewport size to get UV texture coordinates in the range 0 to 1
    vec2 uv = gl_FragCoord.xy / resolution.xy;

    // look up particle position (texel) from texture
    vec4 posTemp = texture2D( texturePosition, uv );

    // calculate UV coordinates (0 to 1) from particle position
    vec2 gridUV = vec2( posTemp.x / 4. + 0.5, posTemp.y / 2. + 0.5 );

    // lets do linear interpolation between time steps and vertical levels (involving a total of 4 textures)

    // calculate the width of the UV segment each timesteps
    float segmentWidthX = 1.0 / textureTimesteps;
    float verticalLevels = 7.0;
    float segmentWidthY = 1.0 / verticalLevels;
    // get vertical level indices
    vec3 vertIndices = pressure2index(level);

    // Adjust the UV coordinates
    // X vertical levels
    vec2 this_uv_lower = gridUV;
    vec2 next_uv_lower = gridUV;
    vec2 this_uv_upper = gridUV;
    vec2 next_uv_upper = gridUV;

    // 1 or 12 timesteps in the horizontal
    this_uv_lower.x = uFrame / textureTimesteps + (this_uv_lower.x * segmentWidthX);
    next_uv_lower.x = ( uFrame + 1.0) / textureTimesteps + (next_uv_lower.x * segmentWidthX);
    this_uv_upper.x = uFrame / textureTimesteps + (this_uv_upper.x * segmentWidthX);
    next_uv_upper.x = ( uFrame + 1.0) / textureTimesteps + (next_uv_upper.x * segmentWidthX);
    // 7 vertical levels
    this_uv_lower.y = ( 1.0 - ( vertIndices.x + 1.0 ) * segmentWidthY ) + (this_uv_lower.y * segmentWidthY);
    next_uv_lower.y = ( 1.0 - ( vertIndices.x + 1.0 ) * segmentWidthY ) + (next_uv_lower.y * segmentWidthY);
    this_uv_upper.y = ( 1.0 - ( vertIndices.y + 1.0 ) * segmentWidthY ) + (this_uv_upper.y * segmentWidthY);
    next_uv_upper.y = ( 1.0 - ( vertIndices.y + 1.0 ) * segmentWidthY ) + (next_uv_upper.y * segmentWidthY);

    // look up model velocities at those UVs for all frames
    vec4 thisFrameVel_lower = texture2D( dataTexture, this_uv_lower);
    vec4 nextFrameVel_lower = texture2D( dataTexture, next_uv_lower); 
    vec4 thisFrameVel_upper = texture2D( dataTexture, this_uv_upper);
    vec4 nextFrameVel_upper = texture2D( dataTexture, next_uv_upper); 

    // convert from relative to absolute velocities
    // flattended array[84]; // 7 * 12 = 84
    // To access the element at [i][j], calculate the index like this:
    // int i = 1; // Example row
    // int j = 2; // Example column
    // float value = yourArrayUniform[i * 12 + j];

    // indices to access 2D array storing min/max values for each time ste/ vertical level
    int this2DIndex_lower = getIndex(int(vertIndices.x), int(uFrame));
    int next2DIndex_lower = getIndex(int(vertIndices.x), int(uFrame +1.0));
    int this2DIndex_upper = getIndex(int(vertIndices.y), int(uFrame));
    int next2DIndex_upper = getIndex(int(vertIndices.y), int(uFrame +1.0));

    // remap velocities from RGB image value [0,1] to cm/s [-50,50 cm/s] 
    thisFrameVel_lower.x = remap( thisFrameVel_lower.x, 0.0, 1.0, dataMinU[this2DIndex_lower], dataMaxU[this2DIndex_lower] );
    thisFrameVel_lower.y = remap( thisFrameVel_lower.y, 0.0, 1.0, dataMinV[this2DIndex_lower], dataMaxV[this2DIndex_lower] );
    thisFrameVel_lower.z = 0.0;
    nextFrameVel_lower.x = remap( nextFrameVel_lower.x, 0.0, 1.0, dataMinU[next2DIndex_lower], dataMaxU[next2DIndex_lower] );
    nextFrameVel_lower.y = remap( nextFrameVel_lower.y, 0.0, 1.0, dataMinV[next2DIndex_lower], dataMaxV[next2DIndex_lower] );
    nextFrameVel_lower.z = 0.0;

    thisFrameVel_upper.x = remap( thisFrameVel_upper.x, 0.0, 1.0, dataMinU[this2DIndex_upper], dataMaxU[this2DIndex_upper] );
    thisFrameVel_upper.y = remap( thisFrameVel_upper.y, 0.0, 1.0, dataMinV[this2DIndex_upper], dataMaxV[this2DIndex_upper] );
    thisFrameVel_upper.z = 0.0;
    nextFrameVel_upper.x = remap( nextFrameVel_upper.x, 0.0, 1.0, dataMinU[next2DIndex_upper], dataMaxU[next2DIndex_upper] );
    nextFrameVel_upper.y = remap( nextFrameVel_upper.y, 0.0, 1.0, dataMinV[next2DIndex_upper], dataMaxV[next2DIndex_upper] );
    nextFrameVel_upper.z = 0.0;

    // interpolate velocities between horizontal frames
    vec4 intVelocities_lower = mix(thisFrameVel_lower, nextFrameVel_lower, uFrameWeight);
    vec4 intVelocities_upper = mix(thisFrameVel_upper, nextFrameVel_upper, uFrameWeight);
    // and finally interpolate between vertical levels
    vec4 intVelocities = mix(intVelocities_lower, intVelocities_upper, 1.0 - vertIndices.z);

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

    if (uWindsSpeed > 0.0 ) {

        // reset particle to random position if lifetime expires or it leaves northern or southern boundary
        if ( posTemp.a > uWindsParticleLifeTime || pos.y >= .9 || pos.y <= -.9 ) {

            // get new random position
            // random reset of particle positions from from https://github.com/mapbox/webgl-wind/blob/master/src/shaders/update.frag.glsl
    
            // a random seed to use for the particle drop
            vec2 seed = (pos.xy + posTemp.xy) * uRandSeed;
            
            seed = (pos.xy + posTemp.xy) * uRandSeed * 2.0;

            pos = getRandomPosition(seed, 1.2, posTemp.z);

            age = 0.;

        // otherwise increment time counter for particle
        } else {

            age = posTemp.a + 1.;

        }

    } else {

        age = 200.;
        
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