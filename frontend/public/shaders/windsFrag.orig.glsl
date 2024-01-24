precision highp float;

uniform float uWindsParticleOpacity;

varying vec4 vColor;

void main()
{

   gl_FragColor = vColor * uWindsParticleOpacity;
   // gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);


}