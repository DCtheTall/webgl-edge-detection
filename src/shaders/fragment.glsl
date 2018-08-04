precision highp float;

#pragma glslify: cannyEdgeDetection = require('glsl-canny-edge-detection');

uniform vec2 u_Resolution;
uniform sampler2D u_TextureSampler;

uniform float u_WeakThreshold;
uniform float u_StrongThreshold;
uniform bool u_UseEdgeDetection;

varying vec2 v_TextureCoord;

void main() {
  float edge = cannyEdgeDetection(
    u_TextureSampler, v_TextureCoord, u_Resolution, u_WeakThreshold, u_StrongThreshold);
  if (u_UseEdgeDetection) {
    gl_FragColor = vec4(vec3(1. - edge), 1.);
  } else {
    gl_FragColor = texture2D(u_TextureSampler, v_TextureCoord);
  }
}
