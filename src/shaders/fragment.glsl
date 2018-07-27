precision highp float;

#pragma glslify: cannyEdgeDetection = require('./lib/detect-edge.glsl');

uniform vec2 u_Resolution;
uniform sampler2D u_TextureSampler;

uniform float u_WeakThreshold;
uniform float u_StrongThreshold;

varying vec2 v_TextureCoord;

void main() {
  float edge = cannyEdgeDetection(
    u_TextureSampler, v_TextureCoord, u_Resolution, u_WeakThreshold, u_StrongThreshold);
  gl_FragColor = vec4(vec3(edge), 1.);
}
