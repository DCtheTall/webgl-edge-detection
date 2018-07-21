precision highp float;

uniform sampler2D u_TextureSampler;

varying vec2 v_TextureCoord;

void main() {
  gl_FragColor = texture2D(u_TextureSampler, v_TextureCoord);
}
