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
    this.vertexBuffer = this.gl.createBuffer();
    this.textureCoordBuffer = this.gl.createBuffer();

    this.shaderProgram = new ShaderProgram({
      gl: this.gl,
      fragmentShader: require('../shaders/fragment.glsl'),
      vertexShader: require('../shaders/vertex.glsl'),
      attributeLocations: {
        aTextureCoord: 'a_TextureCoord',
        aVertexPosition: 'a_VertexPosition',
      },
      uniformLocations: {
        uTextureSampler2D: 'u_TextureSampler',
      },
    });

    this.texture = this.gl.createTexture();
  }

  public render() {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    this.shaderProgram.useProgram();
    this.shaderProgram.sendTexturePlaneAttributes();
    this.shaderProgram.sendTexturePlaneUniforms();
  }
}
