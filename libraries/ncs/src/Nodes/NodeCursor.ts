import { Graph } from "../Graphs/Graph";
import { NodeId } from "./NodeId";
import {
  SerializedNodeData,
  NodeStateData,
  CreateNodeData,
} from "./Node.types";
import { NodeEvents } from "./NodeEvents";
import { NodeObservers } from "./NodeObservers";
import { NodeContext } from "./NodeContext";
import { NodeComponents } from "./NodeComponents";
import { NodeTags } from "./NodeTags";
import { Nullable } from "../Util/Util.types";
import { NodeArray } from "./NodeArray";
import { ComponentCursor } from "../Components/ComponentCursor";
import { SerializedComponentData } from "../Components/Component.types";
import { TagCursor } from "../Tags/TagCursor";

export interface NodeCursor {}

export class NodeCursor {
  get index() {
    return this._index;
  }

  get parentIndex() {
    return this.arrays._parents[this._index];
  }

  get id(): bigint | null {
    return this.graph.nodes._indexMap[this.index] || null;
  }

  get name() {
    return this.arrays._names[this._index];
  }

  get state(): NodeStateData {
    return this.arrays._state[this._index][1];
  }

  private _events: Nullable<NodeEvents> = null;
  get events() {
    if (!this._events) {
      this._events = new NodeEvents();
    }
    this._events.node = this;
    return this._events;
  }
  get hasEvents() {
    return this._events !== null;
  }

  private _context: Nullable<NodeContext> = null;
  get context() {
    if (!this._context) {
      this._context = new NodeContext();
      this._context.node = this;
    }
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

  private _components: Nullable<NodeComponents> = null;
  get components() {
    if (!this._components) {
      this._components = new NodeComponents();
      this._components.node = this;
    }
    return this._components;
  }
  get hasComponents() {
    return this._components !== null;
  }

  private _tags: Nullable<NodeTags> = null;
  get tags() {
    if (!this._tags) {
      this._tags = new NodeTags();
      this._tags.node = this;
    }
    return this._tags;
  }
  get hasTags() {
    return this._tags !== null;
  }

  get children() {
    return this.arrays._children[this._index];
  }
  get parent() {
    return this.arrays._parents[this._index];
  }
  set parent(value: number) {
    this.arrays._parents[this._index] = value;
  }
  data: SerializedNodeData;
  public graph: Graph;
  public arrays: NodeArray;

  private _index = 0;

  setNode(index: number) {
    this._index = index;
    return this;
  }

  *traverseChildren(cursor = nodeCursor): Generator<NodeCursor> {
    const children: number[][] = [this.children];
    while (children.length) {
      const childrenArray = children.shift()!;
      for (let i = 0; i < childrenArray.length; i++) {
        cursor.setNode(childrenArray[i]);
        yield cursor;
        if (cursor.children.length) children.push(cursor.children);
      }
    }
  }
  *traverseParents(cursor = nodeCursor): Generator<NodeCursor> {
    let parent = this.parent;
    while (parent) {
      cursor.setNode(parent);
      yield cursor;
      parent = cursor.parent;
    }
  }
  *traverseComponents(cursor = componentCursor): Generator<ComponentCursor> {
    const components = this.components.components;
    for (let i = 0; i < components.length; i += 2) {
      yield cursor.setInstance(this, components[i], components[i + 1]);
    }
  }
  *traverseTags(cursor = tagCursor): Generator<TagCursor> {
    const tags = this.tags.tags;
    for (let i = 0; i < tags.length; i += 2) {
      yield cursor.setTag(this, tags[i], tags[i + 1]);
    }
  }
  private _disposed = false;
  isDisposed() {
    return this._disposed;
  }
  dispose() {
    if (this._disposed) return;
    this._disposed = true;
    this.graph.removeNode(this.index);
    if (this.parent !== undefined) {
      nodeCursor.setNode(this.parent);
      nodeCursor.removeChild(this.index);
    }

    this.hasComponents && this.components.dispose();
    this.hasTags && this.tags.dispose();

    for (let i = 0; i < this.children.length; i++) {
      nodeCursor.setNode(this.children[i]);
      nodeCursor.dispose();
    }

    this.hasObservers &&
      this.observers.isDisposedSet &&
      this.observers.disposed.notify(nodeCursor);
    this._observers = null;
    this._events = null;
    this._context = null;
    this._tags = null;
  }

  addChildren(...nodes: CreateNodeData[]) {
    for (const node of nodes) {
      const newNode = this.graph.addNode(node, this.index);
      this.addChild(newNode);
    }
  }

  hasChild(node: NodeCursor) {
    for (let i = 0; i < this.children.length; i++) {
      if (this.children[i] == node.index) return true;
    }
    return false;
  }

  parentTo(nodeToParentTo: NodeCursor) {
    if (nodeToParentTo.hasChild(this)) return;
    if (this.parent !== undefined) {
      nodeCursor.setNode(this.parent);
      nodeCursor.removeChild(this.index);
    }
    nodeToParentTo.addChild(this);
    this.parent = nodeToParentTo.index;
    this.hasObservers &&
      this.observers.isParentedSet &&
      nodeToParentTo.observers.parented.notify(nodeCursor);
  }

  addChild(node: NodeCursor) {
    if (this.hasChild(node)) return;
    node.parent = this.index;
    this.children.push(node.index);
    if (this.hasObservers) {
      this.observers.isChildAddedSet && this.observers.childAdded.notify(node);
      this.observers.isChildrenUpdatedSet &&
        this.observers.childrenUpdated.notify(node);
    }
    if (node.hasObservers) {
      node.observers.isParentedSet && node.observers.parented.notify(node);
    }
  }

  removeChild(index: number) {
    for (let i = 0; i < this.children.length; i++) {
      if (this.children[i] == index) {
        const child = this.children.splice(i, 1)![0];
        nodeCursor.setNode(child);
        if (this.hasObservers) {
          this.hasObservers &&
            this.observers.isChildRemovedSet &&
            this.observers.childRemoved.notify(nodeCursor);
          this.hasObservers &&
            this.observers.isChildrenUpdatedSet &&
            this.observers.childrenUpdated.notify(nodeCursor);
        }

        if (nodeCursor.hasObservers) {
          nodeCursor.observers.isRemovedFromParentSet &&
            nodeCursor.observers.removedFromParent.notify(nodeCursor);
        }
        nodeCursor;

        return child;
      }
    }
    return null;
  }

  createId() {
    let id = this.graph.nodes._indexMap[this.index];
    if (!id) id = NodeId.Create();
    this.graph.nodes.addNodeId(this.index, id);
    return id;
  }

  toJSON(): SerializedNodeData {
    let components: SerializedComponentData[] | undefined;
    if (this.hasComponents) {
      components = [];
      for (const comp of this.traverseComponents()) {
        components.push(comp.toJSON());
      }
    }

    let tags: string[] | undefined;
    if (this.hasTags) {
      tags = [];
      for (const comp of this.traverseTags()) {
        tags.push(comp.toJSON());
      }
    }

    let children: SerializedNodeData[] | undefined;
    if (this.children?.length) {
      children = [];
      for (let i = 0; i < this.children.length; i++) {
        nodeCursor.setNode(this.children[i]);
        children.push(nodeCursor.toJSON());
      }
    }

    return {
      id: this.id ? NodeId.ToHexString(this.id) : undefined,
      name: this.name,
      state: this.state,
      children,
      tags,
      components,
    };
  }
}

const componentCursor = new ComponentCursor();
const tagCursor = new TagCursor();
const nodeCursor = new NodeCursor();
