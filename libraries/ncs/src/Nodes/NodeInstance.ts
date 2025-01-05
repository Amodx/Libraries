import { Graph } from "../Graphs/Graph";
import { NodeId } from "./NodeId";
import { NodeData, NodeStateData } from "./NodeData";
import { NodeEvents } from "./NodeEvents";
import { NodeObservers } from "./NodeObservers";
import { NodePipelines } from "./NodePipelines";
import { NodeContext } from "./Context/NodeContext";
import { NodeComponents } from "./Components/NodeComponents";
import { NodeTags } from "./Tags/NodeTags";
import { Nullable } from "@amodx/core/Types/UtilityTypes";
export interface NodeInstance {}

export class NodeInstance {
  get id() {
    return this.nodeId;
  }

  name: string;
  state: NodeStateData;

  private _events: Nullable<NodeEvents> = null;

  get events() {
    if (!this._events) this._events = new NodeEvents(this);
    return this._events;
  }
  get hasEvents() {
    return this._events !== null;
  }

  private _context: Nullable<NodeContext> = null;
  get context() {
    if (!this._context) this._context = new NodeContext(this);
    return this._context;
  }
  get hasContexts() {
    return this._context !== null;
  }

  private _observers: Nullable<NodeObservers> = null;
  get observers() {
    if (!this._observers) this._observers = new NodeObservers();
    return this._observers;
  }
  get hasObservers() {
    return this._observers !== null;
  }

  private _pipelines: Nullable<NodePipelines> = null;
  get pipelines(): NodePipelines {
    if (!this._pipelines) this._pipelines = new NodePipelines();
    return this._pipelines;
  }
  get hasPipelines() {
    return this._pipelines !== null;
  }

  private _components: Nullable<NodeComponents> = null;
  get components() {
    if (!this._components) this._components = new NodeComponents(this);
    return this._components;
  }
  get hasComponents() {
    return this._components !== null;
  }

  private _tags: Nullable<NodeTags> = null;
  get tags() {
    if (!this._tags) this._tags = new NodeTags(this);
    return this._tags;
  }
  get hasTags() {
    return this._tags !== null;
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
  dispose() {
    if (this._disposed) return;
    this._disposed = true;
    this.graph.removeNode(this.id);
    this.parent?.removeChild(this.id);

    this.hasComponents && this.components.dispose();
    this.hasTags && this.tags.dispose();

    for (const child of this.children) {
      child.dispose();
    }
    this.hasPipelines &&
      this.pipelines.isDisposedSet &&
      this.pipelines.disposed.pipe(this);
    this.hasObservers &&
      this.observers.isDisposedSet &&
      this.observers.disposed.notify();
    this._observers = null;
    this._pipelines = null;
    this._events = null;
    this._context = null;
    this._tags = null;
  }

  addChildren(...nodes: NodeData[]) {
    for (const node of nodes) {
      const newNode = this.graph.addNode(node, this);
      this.addChild(newNode);
    }
  }

  hasChild(node: NodeInstance) {
    for (let i = 0; i < this.children.length; i++) {
      if (NodeId.Compare(this.children[i].id, node.id)) return true;
    }
    return false;
  }

  parentTo(nodeToParentTo: NodeInstance) {
    if (nodeToParentTo.hasChild(this)) return;
    this.parent?.removeChild(this.id);
    nodeToParentTo.addChild(this);
    this.parent = nodeToParentTo;
    this.hasObservers &&
      this.observers.isParentedSet &&
      nodeToParentTo.observers.parented.notify();
  }

  addChild(node: NodeInstance) {
    if (this.hasChild(node)) return;
    node.parent = this;
    this.children.push(node);
    this.hasObservers &&
      this.observers.isChildAddedSet &&
      this.observers.childAdded.notify(node);
    this.hasObservers &&
      this.observers.isChildrenUpdatedSet &&
      this.observers.childrenUpdated.notify();
    node.hasObservers &&
      node.observers.isParentedSet &&
      node.observers.parented.notify();
  }

  removeChild(id: NodeId) {
    for (let i = 0; i < this.children.length; i++) {
      if (NodeId.Compare(this.children[i].id, id)) {
        const child = this.children.splice(i, 1)![0];
        this.hasObservers &&
          this.observers.isChildRemovedSet &&
          this.observers.childRemoved.notify(child);
        this.hasObservers &&
          this.observers.isChildrenUpdatedSet &&
          this.observers.childrenUpdated.notify();
        this.hasObservers &&
          this.observers.isRemovedFromParentSet &&
          child.observers.removedFromParent.notify();
        return child;
      }
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
        this.pipelines.isCopySet &&
        this.pipelines.copy.pipe(data)) ||
      data
    );
  }
  toJSON(): NodeData {
    const data: NodeData = {
      id: NodeId.Create().idString,
      name: this.name,
      state: this.state,
      children: this.children.map((_) => _.toJSON()),
      tags:
        (this.hasTags && this.tags.tags.map((_) => _.toJSON())) || undefined,
      components:
        (this.hasComponents &&
          this.components.components.map((_) => _.toJSON())) ||
        undefined,
    };
    return (
      (this.hasPipelines &&
        this.pipelines.isToJSONSet &&
        this.pipelines.toJSON.pipe(data)) ||
      data
    );
  }
}
