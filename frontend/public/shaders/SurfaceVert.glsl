////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// define uniforms
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
#define M_PI 3.14159265

uniform float uSphereWrapAmount;
uniform float uLayerHeight;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// varying for fragment shader
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
varying vec2 vUv;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// define functions
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

vec3 anglesToSphereCoord(vec2 a, float r) {

    return vec3(
        r * sin(a.y) * sin(a.x),
        r * cos(a.y),
        r * sin(a.y) * cos(a.x)  
    );

}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// main program
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

void main()	{

    // standard plane position
    vec3 modPosition = position;

    // move layer vertically
    modPosition.z += uLayerHeight;

    // calculate sphere position with radius increased by calculated z displacement
    vec2 angles = M_PI * vec2(2. * uv.x, uv.y - 1.);
    vec3 sphPos = anglesToSphereCoord(angles, 1.0 + uLayerHeight );

    // mix plane and sphere position based on chosen projection weight
    vec3 wrapPos = mix(modPosition, sphPos, uSphereWrapAmount);
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4( wrapPos, 1.0 );

    vUv = uv;
}