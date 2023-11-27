precision highp float;

uniform float uWindsParticleOpacity;

uniform sampler2D texturePosition;

varying vec4 vColor;
// varying vec2 vUv;

void main()
{

   // vec4 data = texture2D(texturePosition, vUv);

   gl_FragColor = vColor * uWindsParticleOpacity;
   // gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
   // gl_FragColor = data;

}