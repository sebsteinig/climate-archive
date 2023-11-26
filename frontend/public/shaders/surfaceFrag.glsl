////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// define uniforms
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
uniform float uLayerOpacity;
uniform float uFrameWeight;
uniform float thisDataMin[12]; 
uniform float thisDataMax[12];
uniform float uUserMinValue;
uniform float uUserMaxValue;
uniform float colorMapIndex;

uniform sampler2D dataTexture;
uniform sampler2D colorMap;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// varying from vertex shader
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

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

// Adjusted remap function to handle user-defined min and max values
float userRemap(float value) {
    if (value < 0.0) {
        return 0.5 * (value - uUserMinValue) / -uUserMinValue;
    } else {
        return 0.5 + 0.5 * value / uUserMaxValue;
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// main program
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

void main()	{

float cmap_index = colorMapIndex;
float opacity_cutoff = 0.0;

// convert relative bitmap value to absolute value for both frames
float thisFrameData = remap( 
    texture2D(
        dataTexture, 
        vUv
        ).r, 
    0.0, 
    1.0, 
    thisDataMin[0], 
    thisDataMax[0]);

float nextFrameData = remap( 
    texture2D(
        dataTexture, 
        vUv
        ).r, 
    0.0, 
    1.0, 
    thisDataMin[0], 
    thisDataMax[0]);

// interpolate between absolute values of both frames
float intData = mix(thisFrameData, nextFrameData, uFrameWeight);

// apply user scaling to data
float dataRemapped = userRemap(intData);

// apply colormap to data
vec4 dataColor = applyColormap( dataRemapped, colorMap, cmap_index );


gl_FragColor = dataColor;
// gl_FragColor = vec4(1.0);

gl_FragColor.a *= uLayerOpacity;

}