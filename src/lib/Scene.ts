import ShaderProgram from './ShaderProgram';

export default class Scene {
  private gl: WebGLRenderingContext;
  private vertexBuffer: WebGLBuffer;
  private textureCoordBuffer: WebGLBuffer;
  private shaderProgram: ShaderProgram;
  private texture: WebGLTexture;

  constructor(
    private canvas: HTMLCanvasElement
  ) {
    this.gl = <WebGLRenderingContext>(
      canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
    this.gl.clearColor(0, 0, 0, 1);
    this.gl.viewport(0, 0, canvas.width, canvas.height);

    this.shaderProgram = new ShaderProgram({
      gl: this.gl,
      fragmentShader: require('../shaders/fragment.glsl'),
      vertexShader: require('../shaders/vertex.glsl'),
      attributes: {
        aTextureCoord: {
          locationName: 'a_TextureCoord',
          type: ShaderProgram.Types.VECTOR2,
          data: [0, 0, 0, 1, 1, 0, 1, 1],
        },
        aVertexPosition: {
          locationName: 'a_VertexPosition',
          type: ShaderProgram.Types.VECTOR2,
          data: [-1, 1, -1, -1, 1, 1, 1, -1],
        },
      },
      uniforms: {
        uTextureSampler2D: {
          locationName: 'u_TextureSampler',
          sampler: true,
        },
        uResolution: {
          locationName: 'u_Resolution',
          type: ShaderProgram.Types.VECTOR2,
          data: [canvas.width, canvas.height],
        },
        uStrongThreshold: {
          locationName: 'u_StrongThreshold',
          type: ShaderProgram.Types.FLOAT,
          data: 75,
        },
        uWeakThreshold: {
          locationName: 'u_WeakThreshold',
          type: ShaderProgram.Types.FLOAT,
          data: 50,
        },
      },
    });
    this.shaderProgram.useProgram();

    this.shaderProgram.sendAttributes();
    this.shaderProgram.sendUniforms();
  }

  public setTexture(image: HTMLImageElement) {
    const texture = this.gl.createTexture();
    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
    this.gl.texImage2D(
      this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, image);
    this.gl.generateMipmap(this.gl.TEXTURE_2D);
  }

  public render() {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.uniform1i(this.shaderProgram.uniforms.uTextureSampler2D.location, 0);
    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
  }
}
