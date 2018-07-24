precision highp float;

#pragma glslify: blur = require('glsl-fast-gaussian-blur/5');

const float CANVAS_WIDTH = 500.;
const float GRADIENT_STEP = 1. / CANVAS_WIDTH;

uniform sampler2D u_TextureSampler;
uniform vec2 u_Resolution;

varying vec2 v_TextureCoord;

vec3 getBlurredTextureColor(sampler2D textureSampler, vec2 textureCoord) {
  return blur(
    textureSampler,
    textureCoord,
    vec2(CANVAS_WIDTH, CANVAS_WIDTH),
    normalize(textureCoord)).xyz;
}

float getTextureIntensity(sampler2D textureSampler, vec2 textureCoord) {
  vec3 color = getBlurredTextureColor(textureSampler, textureCoord);
  return pow(length(clamp(color, vec3(0.), vec3(1.))), 2.);
}

vec2 getGradient(sampler2D textureSampler, vec2 textureCoord) {
  float x0, x1, y0, y1;

  if (textureCoord.x > GRADIENT_STEP) x0 = textureCoord.x - GRADIENT_STEP;
  else x0 = 0.;
  if (1. - textureCoord.x > GRADIENT_STEP) x1 = textureCoord.x + GRADIENT_STEP;
  else x1 = 1.;
  if (textureCoord.y > GRADIENT_STEP) y0 = textureCoord.y - GRADIENT_STEP;
  else y0 = 0.;
  if (1. - textureCoord.y > GRADIENT_STEP) y1 = textureCoord.y + GRADIENT_STEP;
  else y1 = 1.;

  float iX0 = getTextureIntensity(
    textureSampler, vec2(x0, textureCoord.y));
  float iX1 = getTextureIntensity(
    textureSampler, vec2(x1, textureCoord.y));
  float iY0 = getTextureIntensity(
    textureSampler, vec2(textureCoord.x, y0));
  float iY1 = getTextureIntensity(
    textureSampler, vec2(textureCoord.x, y1));

  return vec2(iX1 - iX0, iY1 - iY0);
}

void main() {
  gl_FragColor = vec4(getGradient(u_TextureSampler, v_TextureCoord), 0., 1.);
}
