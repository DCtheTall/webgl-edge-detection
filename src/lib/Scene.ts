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
    this.shaderProgram.useProgram();

    this.sendVectorAttribute(
      2,
      this.vertexBuffer,
      this.shaderProgram.attributeLocations.aVertexPosition,
      new Float32Array([
        -1, 1, -1, -1, 1, 1, 1, -1]),
    );
    this.sendVectorAttribute(
      2,
      this.textureCoordBuffer,
      this.shaderProgram.attributeLocations.aTextureCoord,
      new Float32Array([
        0, 1, 0, 0, 1, 1, 1, 0]),
    );

    this.texture = this.gl.createTexture();
  }

  private sendVectorAttribute(
    dimension: number,
    buffer: WebGLBuffer,
    attribLocation: number,
    values: Float32Array
  ): void {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
    this.gl.vertexAttribPointer(attribLocation, dimension, this.gl.FLOAT, false, 0, 0);
    this.gl.enableVertexAttribArray(attribLocation);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, values, this.gl.DYNAMIC_DRAW);
  }

  public render() {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
  }
}
