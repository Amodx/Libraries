import { ComponentData, NodeData } from "./NodeData.types";
import { ComponentBase, ComponentBaseConstructor } from "./ComponentBase";
import { NodeGraph } from "./NodeGraph";
import { Observable } from "@amodx/core/Observers";
import { Pipeline } from "@amodx/core/Pipelines";
import { NodeRegister } from "./NodeRegister";
export interface NodeConstructor {
  CreateNew(overrides: Partial<NodeData>): NodeData;
  new (parent: Node, data: NodeData, graph: NodeGraph): Node;
}
export interface NodeObservers {
  [key: string]: any;
}

export class NodeObservers {
  disposed = new Observable();
  childAdded = new Observable<Node>();
  childRemoved = new Observable<Node>();
  childrenUpdated = new Observable();
  componentAdded = new Observable<ComponentBase<any>>();
  componentRemoved = new Observable<ComponentBase<any>>();
}

export interface NodePipelines {
  [key: string]: any;
}
export class NodePipelines {
  disposed = new Pipeline<Node>();
  toJSON = new Pipeline<NodeData>();
  copy = new Pipeline<NodeData>();
}

export interface Node {
  [key: string]: any;
}

export class Node extends EventTarget {
  static CreateNew(data: Partial<NodeData>): NodeData {
    return {
      id: NodeGraph.GenerateId(),
      name: "",
      state: {},
      components: [],
      children: [],
      ...data,
    };
  }

  get id() {
    return this.data.id;
  }

  isNode: true = true;
  isComponent: false = false;
  isTrait: false = false;

  observers = new NodeObservers();
  pipelines = new NodePipelines();
  components: ComponentBase<any>[] = [];
  children: Node[] = [];
  constructor(
    public parent: Node,
    public data: NodeData,
    public graph: NodeGraph
  ) {
    super();
    for (const component of data.components) {
      this._addComponentData(component);
    }
    this.graph._nodes.set(data.id, this);
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
    this.graph._nodes.delete(this.id);
    this._disposed = true;
    this.parent.removeChild(this.id);
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
    this.parent.removeChild(this.id);
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
    }
  }

  getCompnentById(id: string) {
    return this.components.find((_) => _.data.id == id);
  }
  getComponentByClass<ComponentClass extends ComponentBase>(
    componentClass: ComponentBaseConstructor
  ) {
    return this.getCompnentByType(componentClass.Meta.id) as ComponentClass;
  }
  removeComponentById(id: string) {
    const index = this.components.findIndex((_) => _.data.id == id);
    if (index !== -1) {
      const child = this.components.splice(index, 1)![0];
      this.observers.componentRemoved.notify(child);
    }
  }
  removeComponentByType(type: string) {
    const components = this.components.filter((_) => _.data.type == type);
    components.forEach((_) => this.removeComponentById(_.data.id));
  }

  getCompnentByType(type: string) {
    return this.components.find((_) => _.data.type == type);
  }
  getCompnentsByType(type: string) {
    return this.components.filter((_) => _.data.type == type);
  }

  getChildWithComponentByClass<ComponentClass extends ComponentBase>(
    componentClass: ComponentBaseConstructor
  ): { node: Node; component: ComponentClass } | null {
    const found = this.getCompnentByType(
      componentClass.Meta.id
    ) as ComponentClass;
    const self = this;

    if (found) return { node: self, component: found };

    for (const child of this.traverseChildren()) {
      const found = child.getCompnentByType(
        componentClass.Meta.id
      ) as ComponentClass;
      if (found) return { node: child, component: found };
    }

    return null;
  }

  copy(): NodeData {
    return this.pipelines.toJSON.pipe({
      id: NodeGraph.GenerateId(),
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
