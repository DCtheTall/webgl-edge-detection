precision highp float;

attribute vec2 a_VertexPosition;
attribute vec2 a_TextureCoord;

varying vec2 v_TextureCoord;

void main() {
  v_TextureCoord = a_TextureCoord;
  gl_Position = vec4(a_VertexPosition, 0., 1.);
}
