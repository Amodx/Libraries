import { URIMeshShaderAttributes } from "../Classes/URIMeshShaderAttributes";

export type ShaerTextureTypes = "sampler2DArray";
export interface ShaderCodeSections {
  fragMain: ShaderCodeBody;
  vertexMain: ShaderCodeBody;
  fragTop: ShaderCodeBody;
  vertexTop: ShaderCodeBody;
  fragBeforeMain: ShaderCodeBody;
  vertexBeforeMain: ShaderCodeBody;
  fragMainTop: ShaderCodeBody;
  vertexMainTop: ShaderCodeBody;
}
export type ShaderConstantData = {
  id: string;
  body: ShaderCodeBody;
};

export type ShaderTextureData = {
  isArray?: boolean;
  arrayLength?: number;
  type: ShaerTextureTypes;
};
export type ShaderDataTypes =
  | "vec4"
  | "vec3"
  | "vec2"
  | "float"
  | "mat3"
  | "mat4"
  | "int";

export class ShaderData implements ShaderCodeSections {
  static Create(data: Partial<ShaderData>) {
    return new ShaderData(
      data.mesh,
      data.snippetArgumentOverrides,
      data.shaderConstants,
      data.vertexConstants,
      data.fragConstants,
      data.sharedDefines,
      data.vertexDefines,
      data.fragDefines,
      data.sharedUniforms,
      data.vertexUniforms,
      data.fragxUniforms,
      data.varying,
      data.varyingArgumentOverrides,
      data.localVertexFunctions,
      data.localFragFunctions,
      data.sharedFunctions,
      data.fragFunctions,
      data.vertexFunctions,
      data.functionArgumentOverrides,
      data.textures,
      data.fragMain,
      data.vertexMain,
      data.fragTop,
      data.vertexTop,
      data.fragBeforeMain,
      data.vertexBeforeMain,
      data.fragMainTop,
      data.vertexMainTop
    );
  }
  private constructor(
    public mesh = new URIMeshShaderAttributes(""),
    //snippets
    public snippetArgumentOverrides: Map<string, any> = new Map(),
    //constants
    public shaderConstants: Map<string, ShaderConstantData> = new Map(),
    public vertexConstants: Map<string, ShaderConstantData> = new Map(),
    public fragConstants: Map<string, ShaderConstantData> = new Map(),
    //defines
    public sharedDefines: Map<string, ShaderDefinesData> = new Map(),
    public vertexDefines: Map<string, ShaderDefinesData> = new Map(),
    public fragDefines: Map<string, ShaderDefinesData> = new Map(),
    //uniforms
    public sharedUniforms: Map<string, ShaderUniformData> = new Map(),
    public vertexUniforms: Map<string, ShaderUniformData> = new Map(),
    public fragxUniforms: Map<string, ShaderUniformData> = new Map(),
    //varying
    public varying: Map<string, ShaderVaryingData<any>> = new Map(),
    public varyingArgumentOverrides: Map<string, any> = new Map(),
    //functions
    public localVertexFunctions: Map<
      string,
      ShaderFunctionData<any>
    > = new Map(),
    public localFragFunctions: Map<string, ShaderFunctionData<any>> = new Map(),
    public sharedFunctions: string[] = [],
    public fragFunctions: string[] = [],
    public vertexFunctions: string[] = [],
    public functionArgumentOverrides: Map<string, any> = new Map(),
    //textures
    public textures: Map<string, ShaderTextureData> = new Map(),
    //code
    public fragMain: ShaderCodeBody = {
      GLSL: "",
    },
    public vertexMain: ShaderCodeBody = {
      GLSL: "",
    },
    public fragTop: ShaderCodeBody = {
      GLSL: "",
    },
    public vertexTop: ShaderCodeBody = {
      GLSL: "",
    },
    public fragBeforeMain: ShaderCodeBody = {
      GLSL: "",
    },
    public vertexBeforeMain: ShaderCodeBody = {
      GLSL: "",
    },
    public fragMainTop: ShaderCodeBody = {
      GLSL: "",
    },
    public vertexMainTop: ShaderCodeBody = {
      GLSL: "",
    }
  ) {}
}

export type ShaderCodeBody = {
  GLSL: string;
  WGSL?: string;
};
export type GeneratedShaderCodeBody<T> = {
  GLSL: (data: T) => string;
  WGSL?: (data: T) => string;
};
export type ShaderFunctionData<T> = ShaderFuncitonBase<T> & {
  overrides?: ShaderFuncitonBase<T>[];
};

export type ShaderVaryingData<T> = {
  id: string;
  type: ShaderDataTypes;
  arguments?: T;
  body: GeneratedShaderCodeBody<T>;
};
type ShaderFuncitonBase<T> = {
  inputs: [
    id: string,
    type:
      | ShaderDataTypes
      | [type: ShaderDataTypes, arreyLength: number]
      | ShaerTextureTypes
      | [type: ShaerTextureTypes, arreyLength: number]
  ][];
  output: ShaderDataTypes;
  setID?: string;
  arguments: T;
  body: GeneratedShaderCodeBody<T>;
};
export type ShaderSnippetData<T> = {
  id: string;
  arguments?: T;
  body: GeneratedShaderCodeBody<T>;
};

export type ShaderDefinesData = [name: string, value: number];
export type ShaderUniformData =
  | [name: string, type: ShaderDataTypes | "ignore"]
  | [name: string, type: ShaderDataTypes, arrayLength: number];
export type ShaderAttributeData = [name: string, type: ShaderDataTypes];
