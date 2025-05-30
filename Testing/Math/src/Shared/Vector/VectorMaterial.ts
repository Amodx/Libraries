import { ShaderMaterial, Color } from "three";

// Shared base material
const baseMaterial = new ShaderMaterial({
  uniforms: {
    color: { value: new Color(0xffffff) },
  },
  vertexShader: /* glsl */ `
    void main() {
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    uniform vec3 color;
    void main() {
      gl_FragColor = vec4(color, 1.0);
    }
  `,
  transparent: false,
  depthWrite: true,
});

export class VectorMaterial {
  private _material: ShaderMaterial;

  constructor() {
    this._material = baseMaterial.clone();
  }

  setColor(color: number | Color) {
    this._material.uniforms.color = {
      value: color instanceof Color ? color : new Color(color),
    };
  }

  get material() {
    return this._material;
  }
}
