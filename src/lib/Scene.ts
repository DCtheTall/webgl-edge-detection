import Shader from './Shader';

interface SceneConstructorParams {
  canvas: HTMLCanvasElement;
  strongEdgeThreshold: number;
  weakEdgeThreshold: number;
}

export default class Scene {
  private gl: WebGLRenderingContext;
  private vertexBuffer: WebGLBuffer;
  private textureCoordBuffer: WebGLBuffer;
  private texture: WebGLTexture;
  private video: HTMLVideoElement;

  public shader: Shader;
  public usingVideo: boolean;

  static isPowerOfTwo(n: number): boolean {
    return (n & (n - 1)) === 0;
  }

  constructor({
    canvas,
    strongEdgeThreshold,
    weakEdgeThreshold,
  }: SceneConstructorParams) {
    this.gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    this.gl.clearColor(0, 0, 0, 1);
    this.gl.viewport(0, 0, canvas.width, canvas.height);

    this.shader = new Shader({
      gl: this.gl,
      fragmentShader: require('../shaders/fragment.glsl'),
      vertexShader: require('../shaders/vertex.glsl'),
      attributes: {
        aTextureCoord: {
          locationName: 'a_TextureCoord',
          type: Shader.Types.VECTOR2,
          data: [0, 0, 0, 1, 1, 0, 1, 1],
        },
        aVertexPosition: {
          locationName: 'a_VertexPosition',
          type: Shader.Types.VECTOR2,
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
          type: Shader.Types.VECTOR2,
          data: [canvas.width, canvas.height],
        },
        uStrongThreshold: {
          locationName: 'u_StrongThreshold',
          type: Shader.Types.FLOAT,
          data: strongEdgeThreshold,
        },
        uWeakThreshold: {
          locationName: 'u_WeakThreshold',
          type: Shader.Types.FLOAT,
          data: weakEdgeThreshold,
        },
        uUseEdgeDetection: {
          locationName: 'u_UseEdgeDetection',
          type: Shader.Types.BOOL,
          data: 1,
        }
      },
    });
    this.shader.useProgram();
  }

  private updateVideoTexture() {
    this.gl.texImage2D(
      this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.video);
  }

  public setWeakThreshold(value: number) {
    this.shader.setUniformData('uWeakThreshold', value);
  }

  public setStrongThreshold(value: number) {
    this.shader.setUniformData('uStrongThreshold', value);
    this.setWeakThreshold(value / 2);
  }

  public setImageTexture(image: HTMLImageElement) {
    const texture = this.gl.createTexture();
    this.usingVideo = false;
    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
    this.gl.texImage2D(
      this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, image);
    if (Scene.isPowerOfTwo(image.width)) {
      this.gl.generateMipmap(this.gl.TEXTURE_2D);
    } else {
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
    }
    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.uniform1i(this.shader.uniforms.uTextureSampler2D.location, 0);
  }

  public setVideoTexture(video: HTMLVideoElement) {
    const texture = this.gl.createTexture();
    const pixel = new Uint8Array([0, 0, 0, 255]);
    this.usingVideo = true;
    this.video = video;
    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
    this.gl.texImage2D(
      this.gl.TEXTURE_2D, 0, this.gl.RGBA, 1, 1, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, pixel);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.uniform1i(this.shader.uniforms.uTextureSampler2D.location, 0);
  }

  public render() {
    if (this.usingVideo) this.updateVideoTexture();
    this.shader.sendAttributes();
    this.shader.sendUniforms();
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
  }
}
