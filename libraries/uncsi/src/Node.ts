import { ComponentData, NodeData, NodeStateData } from "./NodeData.types";
import { ComponentBase, ComponentBaseConstructor } from "./ComponentBase";
import { NodeGraph } from "./NodeGraph";
import { Observable } from "@amodx/core/Observers";
import { Pipeline } from "@amodx/core/Pipelines";
import { NodeRegister } from "./NodeRegister";
export interface NodeConstructor {
  Create(overrides: Partial<NodeData>): NodeData;
  new (parent: Node, data: NodeData, graph: NodeGraph): Node;
}

export class NodeId {
  high: bigint;
  low: bigint;
  idString: string;

  private constructor(low: bigint, high: bigint) {
    this.low = low;
    this.high = high;
    this.idString = NodeId.ToHexString(this);
  }

  static Create(id?: string): NodeId {
    if (id) {
      const { high, low } = NodeId.FromString(id);
      return new NodeId(low, high);
    } else {
      const array = new Uint8Array(16);
      crypto.getRandomValues(array);

      const high =
        (BigInt(array[0]) << 56n) |
        (BigInt(array[1]) << 48n) |
        (BigInt(array[2]) << 40n) |
        (BigInt(array[3]) << 32n) |
        (BigInt(array[4]) << 24n) |
        (BigInt(array[5]) << 16n) |
        (BigInt(array[6]) << 8n) |
        BigInt(array[7]);

      const low =
        (BigInt(array[8]) << 56n) |
        (BigInt(array[9]) << 48n) |
        (BigInt(array[10]) << 40n) |
        (BigInt(array[11]) << 32n) |
        (BigInt(array[12]) << 24n) |
        (BigInt(array[13]) << 16n) |
        (BigInt(array[14]) << 8n) |
        BigInt(array[15]);

      return new NodeId(low, high);
    }
  }

  static FromString(id: string): { high: bigint; low: bigint } {
    const high = BigInt("0x" + id.slice(0, 16));
    const low = BigInt("0x" + id.slice(16, 32));
    return { high, low };
  }
  static ToHexString(id: NodeId): string {
    return (
      id.high.toString(16).padStart(16, "0") +
      id.low.toString(16).padStart(16, "0")
    );
  }
}

export interface NodeObservers {

}

export class NodeObservers {
  disposed = new Observable();
  childAdded = new Observable<Node>();
  childRemoved = new Observable<Node>();
  childrenUpdated = new Observable();
  componentAdded = new Observable<ComponentBase<any>>();
  componentRemoved = new Observable<ComponentBase<any>>();
  componentsUpdated = new Observable();
}

export interface NodePipelines {
}

export class NodePipelines {
  disposed = new Pipeline<Node>();
  toJSON = new Pipeline<NodeData>();
  copy = new Pipeline<NodeData>();
}

export interface Node {
}

export class Node extends EventTarget {
  static OnCreateData = new Pipeline<NodeData>();
  static OnCreate = new Observable<Node>();
  static Create(data: Partial<NodeData>): NodeData {
    return this.OnCreateData.pipe({
      id: NodeId.Create().idString,
      name: "",
      state: {},
      components: [],
      children: [],
      ...data,
    });
  }

  get id() {
    return this.nodeId;
  }

  isNode: true = true;
  isComponent: false = false;
  isTrait: false = false;

  observers = new NodeObservers();
  pipelines = new NodePipelines();
  components: ComponentBase<any>[] = [];
  children: Node[] = [];
  private nodeId: NodeId;
  constructor(
    public parent: Node,
    public data: NodeData,
    public graph: NodeGraph
  ) {
    super();
    this.nodeId = NodeId.Create(this.data.id);
    Node.OnCreate.notify(this);
    for (const component of data.components) {
      this._addComponentData(component);
    }
  }

  async initAllChildren() {
    for (const children of this.children) {
      await children.initAllComponents();
    }
  }

  async initAllComponents() {
    for (const component of this.components) {
      await component.init();
      await component.initAllTraits();
    }
  }

  *traverseChildren(): Generator<Node> {
    const children = [...this.children];
    while (children.length) {
      const child = children.shift()!;
      yield child;
      if (child.children.length) children.push(...child.children);
    }
  }

  private _disposed = false;
  isDisposed() {
    return this._disposed;
  }
  dispose() {
    if (this._disposed) return;
    this._disposed = true;
    this.graph.removeNode(this.id);
    this.parent?.removeChild(this.id.idString);
    for (const comp of this.components) {
      comp.dispose();
    }
    for (const child of this.children) {
      child.dispose();
    }
    this.pipelines.disposed.pipe(this);
    this.observers.disposed.notify();
  }

  async addChildren(...nodes: NodeData[]) {
    for (const node of nodes) {
      const newNode = await this.graph.addNode(node, this);
      this.addChild(newNode);
    }
  }

  parentTo(node: Node) {
    this.parent?.removeChild(this.id.idString);
    node.addChild(this);
    this.parent = node;
  }
  addChild(node: Node) {
    this.children.push(node);
    this.observers.childAdded.notify(node);
  }
  removeChild(id: string) {
    const index = this.children.findIndex((_) => _.data.id == id);
    if (index !== -1) {
      const child = this.children.splice(index, 1)![0];
      this.observers.childRemoved.notify(child);
    }
  }

  private _addComponentData(...components: ComponentData[]) {
    for (const comp of components) {
      const compType = NodeRegister.getComponent(comp.type);
      const newComponent = new compType(this, comp);
      this.components.push(newComponent);
    }
  }

  async addComponents(...components: ComponentData[]) {
    for (const comp of components) {
      const compType = NodeRegister.getComponent(comp.type);
      const newComponent = new compType(this, comp);
      this.components.push(newComponent);
      await newComponent.init();
      this.observers.componentAdded.notify(newComponent);
    }
    this.observers.componentsUpdated.notify();
  }

  getComponentByClass<ComponentClass extends ComponentBase>(
    componentClass: ComponentBaseConstructor
  ) {
    return this.getCompnent(componentClass.Meta.id) as ComponentClass;
  }
  removeComponentByIndex(index: number) {
    const component = this.components[index];
    if (component) {
      const child = this.components.splice(index, 1)![0];
      this.observers.componentRemoved.notify(child);
      this.observers.componentsUpdated.notify();
      return true;
    }
    return false;
  }
  removeComponent(type: string) {
    return this.removeComponentByIndex(
      this.components.findIndex((_) => _.getMeta().name)
    );
  }

  getCompnent(type: string) {
    return this.components.find((_) => _.type == type);
  }
  getAllComponentsOfType(type: string) {
    return this.components.filter((_) => _.type == type);
  }

  getChildWithComponentByClass<ComponentClass extends ComponentBase>(
    componentClass: ComponentBaseConstructor
  ): { node: Node; component: ComponentClass } | null {
    const found = this.getCompnent(componentClass.Meta.id) as ComponentClass;
    const self = this;

    if (found) return { node: self, component: found };

    for (const child of this.traverseChildren()) {
      const found = child.getCompnent(componentClass.Meta.id) as ComponentClass;
      if (found) return { node: child, component: found };
    }

    return null;
  }

  copy(): NodeData {
    return this.pipelines.toJSON.pipe({
      id: NodeId.Create().idString,
      name: this.data.name,
      state: this.data.state,
      children: this.children.map((_) => _.copy()),
      components: this.components.map((_) => _.copy()),
    });
  }
  toJSON(): NodeData {
    return this.pipelines.toJSON.pipe({
      id: this.data.id,
      name: this.data.name,
      state: this.data.state,
      children: this.children.map((_) => _.toJSON()),
      components: this.components.map((_) => _.toJSON()),
    });
  }
}
