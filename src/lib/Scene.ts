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
        0, 0, 0, 1, 1, 0, 1, 1]),
    );
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

  public setTexture(image: HTMLImageElement) {
    const texture = this.gl.createTexture();
    const isPowerOfTwo = (val: number): boolean => !(val & (val - 1));
    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
    this.gl.texImage2D(
      this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, image);
    this.gl.generateMipmap(this.gl.TEXTURE_2D);
  }

  public render() {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.uniform1i(this.shaderProgram.uniformLocations.uTextureSampler2D, 0);
    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
  }
}
