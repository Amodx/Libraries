import { QuadScalarVertexData } from "../Primitives/QuadVertexData.js";
import { Mesh } from "../Mesh/Mesh.js";

export class MesherDataTool {

  vars = new Map<string, number>();
  segments = new Map<string, number[]>();
  quadVertexData = new Map<string, QuadScalarVertexData>();

  mesh: Mesh | null = null;

  startNewMesh(mesh?: Mesh) {
    this.mesh = mesh ? mesh : new Mesh();
  }

  setVar(id: string, value: number) {
    if (this.vars.has(id)) {
      this.vars.set(id, value);
    }
    return this;
  }
  getVar(id: string) {
    return this.vars.get(id);
  }
  resetAll() {
    this.mesh?.clear();

    this.resetVars();
    return this;
  }

  resetVars() {
    for (const key of this.vars.keys()) {
      this.vars.set(key, 0);
    }
    return this;
  }
}
