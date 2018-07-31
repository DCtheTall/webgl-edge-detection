#pragma glslify: blur = require('glsl-fast-gaussian-blur/5');

/**
 * Get the color of a texture after
 * a Guassian blur with a radius of 5 pixels
 */
vec3 getBlurredTextureColor(
  sampler2D textureSampler,
  vec2 textureCoord,
  vec2 resolution
) {
  return blur(
    textureSampler,
    textureCoord,
    resolution,
    normalize(textureCoord)).xyz;
}

/**
 * Get the intensity of the color on a
 * texture after a guassian blur is applied
 */
float getTextureIntensity(
  sampler2D textureSampler,
  vec2 textureCoord,
  vec2 resolution
) {
  vec3 color = getBlurredTextureColor(textureSampler, textureCoord, resolution);
  return pow(length(clamp(color, vec3(0.), vec3(1.))), 2.) / 3.;
}

/**
 * Get the gradient of the textures intensity
 * as a function of the texture coordinate
 */
vec2 getTextureIntensityGradient(
  sampler2D textureSampler,
  vec2 textureCoord,
  vec2 resolution
) {
  float x0, x1, y0, y1;
  vec2 gradientStep = vec2(1.) / resolution;

  if (textureCoord.x > gradientStep.x) x0 = textureCoord.x - gradientStep.x;
  else x0 = 0.;
  if (1. - textureCoord.x > gradientStep.x) x1 = textureCoord.x + gradientStep.x;
  else x1 = 1.;
  if (textureCoord.y > gradientStep.y) y0 = textureCoord.y - gradientStep.y;
  else y0 = 0.;
  if (1. - textureCoord.y > gradientStep.y) y1 = textureCoord.y + gradientStep.y;
  else y1 = 1.;

  float iX0 = getTextureIntensity(
    textureSampler, vec2(x0, textureCoord.y), resolution);
  float iX1 = getTextureIntensity(
    textureSampler, vec2(x1, textureCoord.y), resolution);
  float iY0 = getTextureIntensity(
    textureSampler, vec2(textureCoord.x, y0), resolution);
  float iY1 = getTextureIntensity(
    textureSampler, vec2(textureCoord.x, y1), resolution);

  return vec2(iX1 - iX0, iY1 - iY0);
}

#pragma glslify: export(getTextureIntensityGradient);
