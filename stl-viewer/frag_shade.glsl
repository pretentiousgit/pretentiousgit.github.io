uniform sampler2D uTexture;
uniform vec2 uMouse;
uniform float uTime;
uniform vec2 uResolution;
varying vec2 vUv;

void main() {
  vec2 mouse = uMouse / uResolution;
  float dist = distance(vUv, mouse);
  float ripple = sin(dist * 30.0 - uTime * 5.0) * 0.02 * exp(-dist * 8.0);
  
  vec2 offset = normalize(vUv - mouse) * ripple;
  gl_FragColor = texture2D(uTexture, vUv + offset);
}