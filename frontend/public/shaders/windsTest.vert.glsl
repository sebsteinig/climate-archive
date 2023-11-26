attribute vec2 aGPUuvs;
uniform sampler2D texturePosition;

void main() {

    vec4 posTemp = texture2D( texturePosition, aGPUuvs );

    vec3 transformedPosition = position + posTemp.xyz;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(transformedPosition, 1.0);
}
