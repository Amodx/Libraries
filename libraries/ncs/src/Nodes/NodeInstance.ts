import { Graph } from "../Graphs/Graph";
import { NodeId } from "./NodeId";
import { NodeData, NodeStateData } from "./NodeData";
import { NodeEvents } from "./NodeEvents";
import { NodeObservers } from "./NodeObservers";
import { NodePipelines } from "./NodePipelines";
import { NodeContext } from "./Context/NodeContext";
import { NodeComponents } from "./Components/NodeComponents";
import { NodeTags } from "./Tags/NodeTags";

export interface NodeInstance {}

export class NodeInstance {
  get id() {
    return this.nodeId;
  }

  name: string;
  state: NodeStateData;

  private _events?: NodeEvents;

  get events() {
    if (!this._events) {
      this._events = new NodeEvents(this);
    }
    return this._events;
  }
  get hasEvents() {
    return Boolean(this._context);
  }

  private _context?: NodeContext;
  get context() {
    if (!this._context) {
      this._context = new NodeContext(this);
    }
    return this._context;
  }
  get hasContexts() {
    return Boolean(this._context);
  }

  private _observers?: NodeObservers;
  get observers() {
    if (!this._observers) {
      this._observers = new NodeObservers();
    }
    return this._observers;
  }
  get hasObservers() {
    return Boolean(this._observers);
  }

  private _pipelines?: NodePipelines;
  get pipelines(): NodePipelines {
    if (!this._pipelines) {
      this._pipelines = new NodePipelines();
    }
    return this._pipelines;
  }
  get hasPipelines() {
    return Boolean(this._pipelines);
  }

  private _components?: NodeComponents;
  get components() {
    if (!this._components) {
      this._components = new NodeComponents(this);
    }
    return this._components;
  }
  get hasComponents() {
    return Boolean(this._components);
  }

  private _tags?: NodeTags;
  get tags() {
    if (!this._tags) {
      this._tags = new NodeTags(this);
    }
    return this._tags;
  }
  get hasTags() {
    return Boolean(this._tags);
  }

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
    while (parent) {
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

    this.hasComponents && (await this.components.dispose());
    this.hasTags && (await this.tags.dispose());
    
    for (const child of this.children) {
      await child.dispose();
    }
    this.hasPipelines &&
      this.pipelines.isDisposedSet() &&
      this.pipelines.disposed.pipe(this);
    this.hasObservers &&
      this.observers.isDisposedSet() &&
      this.observers.disposed.notify();
    delete this._observers;
    delete this._pipelines;
    delete this._events;
    delete this._context;
    delete this._tags;
  }

  async addChildren(...nodes: NodeData[]) {
    for (const node of nodes) {
      const newNode = await this.graph.addNode(node, this);
      this.addChild(newNode);
    }
  }

  parentTo(node: NodeInstance) {
    if (this.children.find((_) => NodeId.Compare(_.id, node.id))) return;
    this.parent?.removeChild(this.id);
    node.addChild(this);
    this.parent = node;
    this.hasObservers &&
      this.observers.isParentedSet() &&
      node.observers.parented.notify();
  }

  addChild(node: NodeInstance) {
    if (this.children.find((_) => NodeId.Compare(_.id, node.id))) return;
    node.parent = this;
    this.children.push(node);
    this.hasObservers &&
      this.observers.isChildAddedSet() &&
      this.observers.childAdded.notify(node);
    node.hasObservers &&
      node.observers.isParentedSet() &&
      node.observers.parented.notify();
  }

  removeChild(id: NodeId) {
    const index = this.children.findIndex((_) => _ && NodeId.Compare(id, _.id));
    if (index !== -1) {
      const child = this.children.splice(index, 1)![0];
      this.hasObservers &&
        this.observers.isChildRemovedSet() &&
        this.observers.childRemoved.notify(child);
      this.hasObservers &&
        this.observers.isRemovedFromParentSet() &&
        child.observers.removedFromParent.notify();
      return child;
    }
    return null;
  }

  copy(): NodeData {
    const data: NodeData = {
      id: NodeId.Create().idString,
      name: this.name,
      state: this.state,
      children: this.children.map((_) => _.copy()),
      tags:
        (this.hasTags && this.tags.tags.map((_) => _.toJSON())) || undefined,
      components:
        (this.hasComponents &&
          this.components.components.map((_) => _.copy())) ||
        undefined,
    };
    return (
      (this.hasPipelines &&
        this.pipelines.isCopySet() &&
        this.pipelines.copy.pipe(data)) ||
      data
    );
  }
  toJSON(): NodeData {
    const data: NodeData = {
      id: NodeId.Create().idString,
      name: this.name,
      state: this.state,
      children: this.children.map((_) => _.copy()),
      tags:
        (this.hasTags && this.tags.tags.map((_) => _.toJSON())) || undefined,
      components:
        (this.hasComponents &&
          this.components.components.map((_) => _.copy())) ||
        undefined,
    };
    return (
      (this.hasPipelines &&
        this.pipelines.isToJSONSet() &&
        this.pipelines.toJSON.pipe(data)) ||
      data
    );
  }
}
