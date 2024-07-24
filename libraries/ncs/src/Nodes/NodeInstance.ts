import { ComponentInstance } from "../Components/ComponentInstance";
import { Graph } from "../Graph/Graph";
import { Observable } from "@amodx/core/Observers";
import { Pipeline } from "@amodx/core/Pipelines";
import { NCS } from "../NCS";
import { NodeId } from "./NodeId";
import { NodeData, NodeStateData } from "./NodeData";
import { ComponentData } from "../Components/ComponentData";
import { NodeEvents } from "./NodeEvents";
export interface NodeConstructor {
  Create(overrides: Partial<NodeData>): NodeData;
  new (parent: NodeInstance, data: NodeData, graph: Graph): NodeInstance;
}

export interface NodeObservers {}

export class NodeObservers {
  disposed = new Observable();
  childAdded = new Observable<NodeInstance>();
  childRemoved = new Observable<NodeInstance>();
  childrenUpdated = new Observable();
  componentAdded = new Observable<ComponentInstance<any>>();
  componentRemoved = new Observable<ComponentInstance<any>>();
  componentsUpdated = new Observable();
}

export interface NodePipelines {}

export class NodePipelines {
  disposed = new Pipeline<NodeInstance>();
  toJSON = new Pipeline<NodeData>();
  copy = new Pipeline<NodeData>();
}

export interface NodeInstance {}

export class NodeInstance {
  get id() {
    return this.nodeId;
  }

  name: string;
  state: NodeStateData;
  events = new NodeEvents(this);
  observers = new NodeObservers();
  pipelines = new NodePipelines();
  components: ComponentInstance[] = [];
  children: NodeInstance[] = [];
  private nodeId: NodeId;
  constructor(
    public parent: NodeInstance,
    data: NodeData,
    public graph: Graph
  ) {
    this.name = data.name;
    this.state = data.state;
    this.nodeId = NodeId.Create(data.id);

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

  *traverseChildren(): Generator<NodeInstance> {
    const children = [...this.children];
    while (children.length) {
      const child = children.shift()!;
      yield child;
      if (child.children.length) children.push(...child.children);
    }
  }
  *traverseParents(): Generator<NodeInstance> {
    let parent = this.parent;
    while (parent.name !== this.graph.root.name) {
      yield parent;
      parent = parent.parent;
    }
  }

  private _disposed = false;
  isDisposed() {
    return this._disposed;
  }
  async dispose() {
    if (this._disposed) return;
    this._disposed = true;
    this.graph.removeNode(this.id);
    this.parent?.removeChild(this.id);
    for (const comp of this.components) {
      await comp.dispose();
    }
    for (const child of this.children) {
      await child.dispose();
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

  parentTo(node: NodeInstance) {
    this.parent?.removeChild(this.id);
    node.addChild(this);
    this.parent = node;
  }
  addChild(node: NodeInstance) {
    this.children.push(node);
    this.observers.childAdded.notify(node);
  }

  removeChild(id: NodeId) {
    const index = this.children.findIndex((_) => _ && NodeId.Compare(id, _.id));
    if (index !== -1) {
      const child = this.children.splice(index, 1)![0];
      this.observers.childRemoved.notify(child);
      return child;
    }
    return null;
  }

  private _addComponentData(...components: ComponentData[]) {
    for (const comp of components) {
      const compType = NCS.getComponent(comp.type);
      const newComponent = new ComponentInstance(this, compType, comp);
      this.components.push(newComponent);
    }
  }

  async addComponents(...components: ComponentData[]) {
    for (const comp of components) {
      const compType = NCS.getComponent(comp.type);
      const newComponent = new ComponentInstance(this, compType, comp);
      this.components.push(newComponent);
      await newComponent.init();
      this.observers.componentAdded.notify(newComponent);
    }
    this.observers.componentsUpdated.notify();
  }

  async removeComponentByIndex(index: number) {
    const component = this.components[index];
    if (component) {
      const child = this.components.splice(index, 1)![0];
      this.observers.componentRemoved.notify(child);
      this.observers.componentsUpdated.notify();
      await component.dispose();
      return true;
    }
    return false;
  }
  removeComponent(type: string) {
    return this.removeComponentByIndex(
      this.components.findIndex((_) => _.type == type)
    );
  }

  getCompnent(type: string) {
    return this.components.find((_) => _.type == type);
  }
  getAllComponentsOfType(type: string) {
    return this.components.filter((_) => _.type == type);
  }
  async removeAllComponentsOfType(type: string) {
    const filtered = this.getAllComponentsOfType(type);
    this.components = this.components.filter((_) => _.type != type);
    for (const comp of filtered) {
      await comp.dispose();
    }
    for (const comp of filtered) {
      this.observers.componentRemoved.notify(comp);
    }
    this.observers.componentsUpdated.notify();
    return filtered;
  }

  getChildWithComponent(type: string): ComponentInstance | null {
    for (const child of this.traverseChildren()) {
      const found = child.getCompnent(type) as ComponentInstance;
      if (found) return found;
    }
    return null;
  }

  getParentWithComponent(type: string): ComponentInstance | null {
    for (const parent of this.traverseParents()) {
      const found = parent.getCompnent(type) as ComponentInstance;
      if (found) return found;
    }
    return null;
  }

  copy(): NodeData {
    return this.pipelines.toJSON.pipe({
      id: NodeId.Create().idString,
      name: this.name,
      state: this.state,
      children: this.children.map((_) => _.copy()),
      components: this.components.map((_) => _.copy()),
    });
  }
  toJSON(): NodeData {
    return this.pipelines.toJSON.pipe({
      id: this.id.idString,
      name: this.name,
      state: this.state,
      children: this.children.map((_) => _.toJSON()),
      components: this.components.map((_) => _.toJSON()),
    });
  }
}
