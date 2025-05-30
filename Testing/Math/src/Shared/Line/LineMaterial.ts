import { ShaderMaterial, Color } from "three";

// Shared base material
const baseMaterial = new ShaderMaterial({
  uniforms: {
    color: { value: new Color(0xffffff) },
  },
  vertexShader: /* glsl */`
    void main() {
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */`
    uniform vec3 color;
    void main() {
      gl_FragColor = vec4(color, 1.0);
    }
  `,
  transparent: false,
});

export class LineMaterial {
  private _material: ShaderMaterial;

  constructor(color = 0xffffff) {
    this._material = baseMaterial.clone();
    this._material.uniforms.color = { value: new Color(color) };
  }

  get material() {
    return this._material;
  }
}
