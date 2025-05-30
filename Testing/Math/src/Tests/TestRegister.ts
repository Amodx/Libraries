import { GUI } from "dat.gui";
import { PerspectiveCamera, Camera,Scene, WebGLRenderer } from "three";

export class TestNodes {
  constructor(
    public gui: GUI,
    public scene: Scene,
    public renderer: WebGLRenderer,
    public camera: PerspectiveCamera
  ) {}
}

export class TestRegister {
  static tests = new Map<string, (nodes: TestNodes) => () => void>();
  static _dispose: (() => void) | null = null;
  static register(id: string, run: (nodes: TestNodes) => () => void) {
    this.tests.set(id, run);
  }

  static run(id: string, nodes: TestNodes) {
    if (this._dispose) this._dispose();
    const tests = this.tests.get(id);
    if (!tests) throw new Error(`Test with id ${id} does not exist`);
    this._dispose = tests(nodes);
  }
}
