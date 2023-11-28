////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// define uniforms
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
uniform float uOpacity;
uniform float uFrame;
uniform float uFrameWeight;
uniform float thisDataMin[12]; 
uniform float thisDataMax[12];
uniform float heightMin[1]; 
uniform float heightMax[1]; 
uniform float textureTimesteps;
uniform float referenceDataMin[12];
uniform float referenceDataMax[12];
uniform float uUserMinValue;
uniform float uUserMaxValue;
uniform float uUserMinValueAnomaly;
uniform float uUserMaxValueAnomaly;
uniform float numLon;
uniform float numLat;
uniform float colorMapIndex;

uniform sampler2D dataTexture;
uniform sampler2D heightTexture;
uniform sampler2D referenceDataTexture;
uniform sampler2D colorMap;

uniform bool referenceDataFlag;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// varying from vertex shader
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
varying vec2 vUv;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// define functions
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// convert float to color via colormap
vec4 applyColormap(float t, sampler2D colormap, float index){
    return(texture2D(colormap,vec2(t, index / 23.0 + 1.0 / 23.0 )));
}

// remap color range
float remap(float value, float inMin, float inMax, float outMin, float outMax) {
    return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);
}

// custom bicubic texture filtering as an alternative to the standard nearest neighbor and bilinear resampling
// more expensive, needs 4 bilinear lookups
// smoother results, but underestimates peak values (different for bilinear filtering)
// from https://stackoverflow.com/questions/13501081/efficient-bicubic-filtering-code-in-glsl

vec4 cubic(float v) {
    vec4 n = vec4(1.0, 2.0, 3.0, 4.0) - v;
    vec4 s = n * n * n;
    float x = s.x;
    float y = s.y - 4.0 * s.x;
    float z = s.z - 4.0 * s.y + 6.0 * s.x;
    float w = 6.0 - x - y - z;

    return vec4(x, y, z, w) * (1.0/6.0);
}

vec4 textureBicubic(sampler2D sampler, vec2 texCoords, float numLon, float numLat) {
    vec2 texSize = vec2(numLon, numLat);

    vec2 invTexSize = 1.0 / texSize;

    texCoords = texCoords * texSize - 0.5;

        vec2 fxy = fract(texCoords);
        texCoords -= fxy;

        vec4 xcubic = cubic(fxy.x);
        vec4 ycubic = cubic(fxy.y);

        vec4 c = texCoords.xxyy + vec2 (-0.5, +1.5).xyxy;

        vec4 s = vec4(xcubic.xz + xcubic.yw, ycubic.xz + ycubic.yw);
        vec4 offset = c + vec4 (xcubic.yw, ycubic.yw) / s;

        offset *= invTexSize.xxyy;
        
        vec4 sample0 = texture2D(sampler, offset.xz);
        vec4 sample1 = texture2D(sampler, offset.yz);
        vec4 sample2 = texture2D(sampler, offset.xw);
        vec4 sample3 = texture2D(sampler, offset.yw);

        float sx = s.x / (s.x + s.y);
        float sy = s.z / (s.z + s.w);

        return mix(
        mix(sample3, sample2, sx), mix(sample1, sample0, sx)
        , sy);
    }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// main program
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

void main()	{

float cmap_index = colorMapIndex;
float opacity_cutoff = 0.0;
    // calculate the width of the UV segment each timesteps
float segmentWidth = 1.0 / textureTimesteps;

// Adjust the UV coordinates
vec2 this_uv = vec2((uFrame / textureTimesteps) + (vUv.x * segmentWidth), vUv.y);
vec2 next_uv = vec2((( uFrame + 1.0) / textureTimesteps) + (vUv.x * segmentWidth), vUv.y);


// convert relative bitmap value to absolute value for both frames
float thisFrameData = remap( 
    texture2D(
        dataTexture, 
        this_uv
        ).r,
    0.0, 
    1.0, 
    thisDataMin[int(uFrame)], 
    thisDataMax[int(uFrame)]);

float nextFrameData = remap( 
    texture2D(
        dataTexture, 
        next_uv
        ).r, 
    0.0, 
    1.0, 
    thisDataMin[int(uFrame + 1.0)], 
    thisDataMax[int(uFrame + 1.0)]);

// interpolate between absolute values of both frames
float intData = mix(thisFrameData, nextFrameData, uFrameWeight);

// apply user scaling to data
float dataRemapped = remap( 
    intData, 
    uUserMinValue, 
    uUserMaxValue, 
    0.0, 
    1.0 );

// only process reference data if reference mode is active
if (referenceDataFlag) {

    float thisReferenceData = remap( 
        texture2D(
            referenceDataTexture, 
            this_uv
            ).r, 
        0.0, 
        1.0, 
        referenceDataMin[int(uFrame)], 
        referenceDataMax[int(uFrame)]);

    float nexReferenceData = remap( 
        texture2D(
            referenceDataTexture, 
            next_uv
            ).r, 
        0.0, 
        1.0, 
        referenceDataMin[int(uFrame + 1.0)], 
        referenceDataMax[int(uFrame + 1.0)]);

    // interpolate between absolute values of both frames
    float intReferenceData = mix(thisReferenceData, nexReferenceData, uFrameWeight);
    
    intData = intData - intReferenceData;

    dataRemapped = remap( 
    intData, 
    uUserMaxValueAnomaly * -1.0, 
    uUserMaxValueAnomaly, 
    0.0, 
    1.0 );

    cmap_index = 17.0;
}


// apply colormap to data
vec4 dataColor = applyColormap( dataRemapped, colorMap, cmap_index );

// send pixel color to screen
if (referenceDataFlag == false) {
    if (dataRemapped >= 0.0 ) {
        gl_FragColor = dataColor;
    }
} else {
    if (abs(intData) >= uUserMinValueAnomaly) {
        gl_FragColor = dataColor;
    }
}

gl_FragColor.a *= uOpacity;

// vec4 height_raw =texture2D(heightTexture,vUv );
float height = remap( 
    texture2D(
        heightTexture, 
        vUv
        ).r, 
    0.0, 
    1.0, 
    heightMin[0], 
    heightMax[0]);

if (height > 0.0) {
    gl_FragColor.a = 0.0;
}

}