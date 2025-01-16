import { Graph } from "../Graphs/Graph";
import { NodeId } from "./NodeId";
import { SerializedNodeData } from "./Node.types";
import { NodeEvents } from "./NodeEvents";
import { NodeObservers } from "./NodeObservers";
import { NodeContext } from "./NodeContext";
import { NodeComponents } from "./NodeComponents";
import { NodeTags } from "./NodeTags";
import { Nullable } from "../Util/Util.types";
import { ComponentCursor } from "../Components/ComponentCursor";
import { SerializedComponentData } from "../Components/Component.types";
import { TagCursor } from "../Tags/TagCursor";
import { NCSPools } from "../Pools/NCSPools";

export interface NodeCursor {}

export class NodeCursor {
  static Get() {
    const cursor = NCSPools.nodeCursor.get();
    if (!cursor) return new NodeCursor();
    return cursor;
  }

  static Retrun(cursor: NodeCursor) {
    cursor.clear(
      cursor.hasEvents,
      cursor.hasContexts,
      cursor.hasObservers,
      cursor.hasComponents,
      cursor.hasTags
    );
    NCSPools.nodeCursor.addItem(cursor);
  }

  clear(
    events: boolean,
    context: boolean,
    observers: boolean,
    compoents: boolean,
    tags: boolean
  ) {
    if (events && this._events) {
      NodeEvents.Retrun(this._events);
      this._events = null;
    }
    if (context && this._components) {
      NodeComponents.Retrun(this._components);
      this._components = null;
    }
    if (observers && this._observers) {
      NodeObservers.Retrun(this._observers);
      this._observers = null;
    }
    if (compoents && this._components) {
      NodeComponents.Retrun(this._components);
      this._components = null;
    }
    if (tags && this._tags) {
      NodeTags.Retrun(this._tags);
      this._tags = null;
    }
  }

  get index() {
    return this._index;
  }

  get parentIndex() {
    return this.arrays._parents[this._index];
  }

  get id(): bigint | null {
    return this.graph._nodes._indexMap[this.index] || null;
  }

  get name() {
    return this.arrays._names[this._index];
  }

  private _events: Nullable<NodeEvents> = null;
  get events() {
    if (!this._events) {
      this._events = NodeEvents.Get();
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
      this._context = NodeContext.Get();
      this._context.node = this;
    }
    return this._context;
  }

  get hasContexts() {
    return this._context !== null;
  }

  private _observers: Nullable<NodeObservers> = null;
  get observers() {
    if (!this._observers) this._observers = NodeObservers.Get();
    return this._observers;
  }

  get hasObservers() {
    return this._observers !== null;
  }

  private _components: Nullable<NodeComponents> = null;
  get components() {
    if (!this._components) {
      this._components = NodeComponents.Get();
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
      this._tags = NodeTags.Get();
      this._tags.node = this;
    }
    return this._tags;
  }

  get hasTags() {
    return this._tags !== null;
  }

  get children() {
    return this.arrays._children[this._index] || null;
  }
  get parent() {
    return this.arrays._parents[this._index];
  }
  set parent(value: number) {
    this.arrays._parents[this._index] = value;
  }
  public graph: Graph;
  get arrays() {
    return this.graph._nodes;
  }

  get enabled() {
    return this.arrays._enabled[this._index];
  }
  set enabled(enabled: boolean) {
    this.arrays._enabled[this._index] = enabled;
    if (this.hasObservers) {
      this.observers.isEnabledSet && this.observers.enabled.notify(enabled);
    }
  }
  get isDisposed() {
    return this.arrays._disposed[this._index];
  }
  private _index = 0;

  private constructor() {}

  setNode(graph: Graph, index: number) {
    this._index = index;
    this.graph = graph;
    if (this.arrays._components[index] !== undefined) {
      this._components = NodeComponents.Get();
      this._components.node = this;
    }
    if (this.arrays._tags[index] !== undefined) {
      this._tags = NodeTags.Get();
      this._tags.node = this;
    }
    if (this.arrays._context[index] !== undefined) {
      this._context = NodeContext.Get();
      this._context.node = this;
    }
    return this;
  }

  toRef(cursor = new NodeCursor()) {
    return cursor.setNode(this.graph, this.index);
  }

  *traverseChildren(cursor = nodeCursor): Generator<NodeCursor> {
    const children: number[][] = [this.children];
    while (children.length) {
      const childrenArray = children.shift()!;
      if (!childrenArray) continue;
      for (let i = 0; i < childrenArray.length; i++) {
        cursor.setNode(this.graph, childrenArray[i]);
        yield cursor;
        if (cursor.children?.length) children.push(cursor.children);
      }
    }
  }
  *traverseParents(cursor = nodeCursor): Generator<NodeCursor> {
    let parent = this.parent;
    while (parent) {
      cursor.setNode(this.graph, parent);
      yield cursor;
      parent = cursor.parent;
    }
  }
  *traverseComponents(cursor = componentCursor): Generator<ComponentCursor> {
    const components = this.components!.components;
    for (let i = 0; i < components.length; i += 2) {
      yield cursor.setInstance(this, components[i], components[i + 1]);
    }
  }
  *traverseTags(cursor = tagCursor): Generator<TagCursor> {
    const tags = this.tags!.tags;
    for (let i = 0; i < tags.length; i += 2) {
      yield cursor.setTag(this, tags[i], tags[i + 1]);
    }
  }

  dispose() {
    if (this.isDisposed) return;
    this.graph.removeNode(this.index);
    if (this.parent !== undefined) {
      nodeCursor.setNode(this.graph, this.parent);
      nodeCursor.removeChild(this.index);
    }

    this.hasComponents && this.components!.dispose();
    this.hasTags && this.tags!.dispose();

    if (this.children) {
      for (let i = 0; i < this.children.length; i++) {
        nodeCursor.setNode(this.graph, this.children[i]);
        nodeCursor.dispose();
      }
    }

    this.hasObservers &&
      this.observers!.isDisposedSet &&
      this.observers!.disposed.notify(nodeCursor);

    this.clear(
      this.hasEvents,
      this.hasContexts,
      this.hasObservers,
      this.hasComponents,
      this.hasTags
    );
  }

  hasChild(node: NodeCursor) {
    if (!this.children) return false;
    for (let i = 0; i < this.children.length; i++) {
      if (this.children[i] == node.index) return true;
    }
    return false;
  }

  parentTo(nodeToParentTo: NodeCursor) {
    if (nodeToParentTo.hasChild(this)) return;
    if (this.parent !== undefined) {
      nodeCursor.setNode(this.graph, this.parent);
      nodeCursor.removeChild(this.index);
    }
    nodeToParentTo.addChild(this);
    this.parent = nodeToParentTo.index;
    this.hasObservers &&
      this.observers!.isParentedSet &&
      nodeToParentTo.observers!.parented.notify(nodeCursor);
  }

  addChild(node: NodeCursor) {
    if (this.hasChild(node)) return;
    if (!this.children)
      this.arrays._children[this._index] = NCSPools.numberArray.get() || [];
    node.parent = this.index;
    this.children.push(node.index);
    if (this.hasObservers) {
      this.observers!.isChildAddedSet &&
        this.observers!.childAdded.notify(node);
      this.observers!.isChildrenUpdatedSet &&
        this.observers!.childrenUpdated.notify(node);
    }
    if (node.hasObservers) {
      node.observers!.isParentedSet && node.observers!.parented.notify(node);
    }
  }

  removeChild(index: number) {
    if (!this.children) return;
    for (let i = 0; i < this.children.length; i++) {
      if (this.children[i] == index) {
        const child = this.children.splice(i, 1)![0];
        nodeCursor.setNode(this.graph, child);
        if (this.hasObservers) {
          this.hasObservers &&
            this.observers!.isChildRemovedSet &&
            this.observers!.childRemoved.notify(nodeCursor);
          this.hasObservers &&
            this.observers!.isChildrenUpdatedSet &&
            this.observers!.childrenUpdated.notify(nodeCursor);
        }

        if (nodeCursor.hasObservers) {
          nodeCursor.observers!.isRemovedFromParentSet &&
            nodeCursor.observers!.removedFromParent.notify(nodeCursor);
        }

        return child;
      }
    }
    return null;
  }

  addUniqueId() {
    let id = this.graph._nodes._indexMap[this.index];
    if (!id) id = NodeId.Create();
    this.graph._nodes.addNodeId(this.index, id);
    return id;
  }

  returnCursor() {
    return NodeCursor.Retrun(this);
  }

  cloneCursor(cursor?: NodeCursor) {
    const newCursor = cursor || NodeCursor.Get();
    newCursor.setNode(this.graph, this._index);
    return newCursor;
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
        nodeCursor.setNode(this.graph, this.children[i]);
        children.push(nodeCursor.toJSON());
      }
    }

    return {
      id: this.id ? NodeId.ToHexString(this.id) : undefined,
      name: this.name,
      children,
      tags,
      components,
    };
  }
}

const componentCursor = ComponentCursor.Get();
const tagCursor = TagCursor.Get();
const nodeCursor = NodeCursor.Get();
