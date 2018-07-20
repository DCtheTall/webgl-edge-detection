interface ShaderProgramParams {
  gl: WebGLRenderingContext;
  vertexShader: string;
  fragmentShader: string;
  attributeLocations?: {
    [index: string]: string;
    aTextureCoord?: string;
    aVertexPosition?: string;
  };
  uniformLocations?: {
    [index: string]: string;
    uTextureSampler2D: string;
  };
}

export default class ShaderProgram {
  private params: ShaderProgramParams;
  private gl: WebGLRenderingContext;
  private shaderSources: string[];
  private program: WebGLProgram;
  private attributeLocations: { [index: string]: number };
  private uniformLocations: { [index: string]: WebGLUniformLocation };

  constructor(params: ShaderProgramParams) {
    this.params = params;
    this.gl = params.gl;
    this.shaderSources = [];
    this.shaderSources[this.gl.VERTEX_SHADER] = params.vertexShader;
    this.shaderSources[this.gl.FRAGMENT_SHADER] = params.fragmentShader;
    if (params.attributeLocations) this.attributeLocations = {};
    if (params.uniformLocations) this.uniformLocations = {};
    this.initShaderProgram();
  }

  private compileShader(shaderSource: string, shaderType: number): WebGLShader {
    const shader = this.gl.createShader(shaderType);
    this.gl.shaderSource(shader, shaderSource);
    this.gl.compileShader(shader);
    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.error(`Shader failed to compile: ${this.gl.getShaderInfoLog(shader)}`);
      return null;
    }
    return shader;
  }

  private initShaderProgram() {
    const shaders = <WebGLShader[]>[];
    const program = this.gl.createProgram();
    this.shaderSources.forEach((source: string, type: number) => {
      const shader = this.compileShader(source, type);
      if (shader === null) {
        throw new Error('Shader failed to compile. See error message for details.');
      }
      shaders[type] = shader;
    });
    this.gl.attachShader(program, shaders[this.gl.VERTEX_SHADER]);
    this.gl.attachShader(program, shaders[this.gl.FRAGMENT_SHADER]);
    this.gl.linkProgram(program);
    if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
      throw new Error('Could not initialize shader program.');
    }
    this.program = program;
    if (this.attributeLocations) {
      Object.keys(this.params.attributeLocations).forEach((attributeName: string) =>
        this.attributeLocations[attributeName] =
          this.gl.getAttribLocation(program, attributeName));
    }
    if (this.uniformLocations) {
      Object.keys(this.params.uniformLocations).forEach((unifornName: string) =>
        this.uniformLocations[unifornName] =
          this.gl.getUniformLocation(program, unifornName));
    }
  }

  private bufferVectorAttribute(dimension: number, buffer: WebGLBuffer, attrLocation: number, values: Float32Array): void {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
    this.gl.vertexAttribPointer(attrLocation, dimension, this.gl.FLOAT, false, 0, 0);
    this.gl.enableVertexAttribArray(attrLocation);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, values, this.gl.DYNAMIC_DRAW);
  }

  public useProgram() {
    this.gl.useProgram(this.program);
  }

  public sendTexturePlaneAttributes() {

  }

  public sendTexturePlaneUniforms() {

  }
}
