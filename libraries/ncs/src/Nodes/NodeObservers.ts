import { Observable } from "../Util/Observable";
import { NodeCursor } from "./NodeCursor";
import { NodeObserverIds } from "./Node.types";
import { ComponentCursor } from "../Components/ComponentCursor";
import { TagCursor } from "../Tags/TagCursor";
import { NCSPools } from "../Pools/NCSPools";

export interface NodeObservers {}

export class NodeObservers {
  node: NodeCursor;
  static Get() {
    const cursor = NCSPools.nodeObservers.get();
    if (!cursor) return new NodeObservers();
    return cursor;
  }

  static Retrun(cursor: NodeObservers) {
    return NCSPools.nodeObservers.addItem(cursor);
  }
  private constructor() {}

  get observers() {
    return this.node.arrays._observers;
  }

  get disposed() {
    let observer = this.observers[NodeObserverIds.Disposed]![this.node.index];
    if (!observer) {
      observer = NCSPools.observers.get() || new Observable();
      this.observers[NodeObserverIds.Disposed]![this.node.index] = observer;
    }
    this.node.arrays._hasObservers[this.node.index] = true;
    return observer;
  }

  get enabled() {
    let observer = this.observers[NodeObserverIds.Enabled]![this.node.index];
    if (!observer) {
      observer = NCSPools.observers.get() || new Observable();
      this.observers[NodeObserverIds.Enabled]![this.node.index] = observer;
    }
    this.node.arrays._hasObservers[this.node.index] = true;
    return observer;
  }


  get parented() {
    let observer = this.observers[NodeObserverIds.Parented]![this.node.index];
    if (!observer) {
      observer = NCSPools.observers.get() || new Observable();
      this.observers[NodeObserverIds.Parented]![this.node.index] = observer;
    }
    this.node.arrays._hasObservers[this.node.index] = true;
    return observer;
  }

  get removedFromParent() {
    let observer =
      this.observers[NodeObserverIds.RemovedFromParent]![this.node.index];
    if (!observer) {
      observer = NCSPools.observers.get() || new Observable();
      this.observers[NodeObserverIds.RemovedFromParent]![this.node.index] =
        observer;
    }
    this.node.arrays._hasObservers[this.node.index] = true;
    return observer;
  }

  get childAdded(): Observable<NodeCursor> {
    let observer = this.observers[NodeObserverIds.ChildAdded]![this.node.index];
    if (!observer) {
      observer = NCSPools.observers.get() || new Observable();
      this.observers[NodeObserverIds.ChildAdded]![this.node.index] = observer;
    }
    this.node.arrays._hasObservers[this.node.index] = true;
    return observer;
  }

  get childRemoved(): Observable<NodeCursor> {
    let observer =
      this.observers[NodeObserverIds.ChildRemoved]![this.node.index];
    if (!observer) {
      observer = NCSPools.observers.get() || new Observable();
      this.observers[NodeObserverIds.ChildRemoved]![this.node.index] = observer;
    }
    this.node.arrays._hasObservers[this.node.index] = true;
    return observer;
  }

  get childrenUpdated() {
    let observer =
      this.observers[NodeObserverIds.ChildrenUpdated]![this.node.index];
    if (!observer) {
      observer = NCSPools.observers.get() || new Observable();
      this.observers[NodeObserverIds.ChildrenUpdated]![this.node.index] =
        observer;
    }
    this.node.arrays._hasObservers[this.node.index] = true;
    return observer;
  }

  get isDisposedSet() {
    return (
      this.observers[NodeObserverIds.Disposed]![this.node.index] !== undefined
    );
  }
  get isEnabledSet() {
    return (
      this.observers[NodeObserverIds.Enabled]![this.node.index] !== undefined
    );
  }
  get isParentedSet() {
    return (
      this.observers[NodeObserverIds.Parented]![this.node.index] !== undefined
    );
  }

  get isRemovedFromParentSet() {
    return (
      this.observers[NodeObserverIds.RemovedFromParent]![this.node.index] !==
      undefined
    );
  }

  get isChildAddedSet() {
    return (
      this.observers[NodeObserverIds.ChildAdded]![this.node.index] !== undefined
    );
  }

  get isChildRemovedSet() {
    return (
      this.observers[NodeObserverIds.ChildRemoved]![this.node.index] !==
      undefined
    );
  }

  get isChildrenUpdatedSet() {
    return (
      this.observers[NodeObserverIds.ChildrenUpdated]![this.node.index] !==
      undefined
    );
  }

  get componentAdded(): Observable<ComponentCursor> {
    let observer =
      this.observers[NodeObserverIds.ComponentAdded]![this.node.index];
    if (!observer) {
      observer = new Observable<ComponentCursor>();
      this.observers[NodeObserverIds.ComponentAdded]![this.node.index] =
        observer;
    }
    this.node.arrays._hasObservers[this.node.index] = true;
    return observer;
  }

  get componentRemoved(): Observable<ComponentCursor> {
    // This is the one you already fixed
    let observer =
      this.observers[NodeObserverIds.ComponentRemoved]![this.node.index];
    if (!observer) {
      observer = NCSPools.observers.get() || new Observable();
      this.observers[NodeObserverIds.ComponentRemoved]![this.node.index] =
        observer;
    }
    this.node.arrays._hasObservers[this.node.index] = true;
    return observer;
  }

  get componentsUpdated() {
    let observer =
      this.observers[NodeObserverIds.ComponentsUpdated]![this.node.index];
    if (!observer) {
      observer = NCSPools.observers.get() || new Observable();
      this.observers[NodeObserverIds.ComponentsUpdated]![this.node.index] =
        observer;
    }
    this.node.arrays._hasObservers[this.node.index] = true;
    return observer;
  }

  get isComponentAddedSet() {
    return (
      this.observers[NodeObserverIds.ComponentAdded]![this.node.index] !==
      undefined
    );
  }

  get isComponentRemovedSet() {
    return (
      this.observers[NodeObserverIds.ComponentRemoved]![this.node.index] !==
      undefined
    );
  }

  get isComponentsUpdatedSet() {
    return (
      this.observers[NodeObserverIds.ComponentsUpdated]![this.node.index] !==
      undefined
    );
  }

  get tagsAdded(): Observable<TagCursor> {
    let observer = this.observers[NodeObserverIds.TagAdded]![this.node.index];
    if (!observer) {
      observer = NCSPools.observers.get() || new Observable();
      this.observers[NodeObserverIds.TagAdded]![this.node.index] = observer;
    }
    this.node.arrays._hasObservers[this.node.index] = true;
    return observer;
  }

  get tagsRemoved(): Observable<TagCursor> {
    let observer = this.observers[NodeObserverIds.TagRemoved]![this.node.index];
    if (!observer) {
      observer = NCSPools.observers.get() || new Observable();
      this.observers[NodeObserverIds.TagRemoved]![this.node.index] = observer;
    }
    this.node.arrays._hasObservers[this.node.index] = true;
    return observer;
  }

  get tagsUpdated() {
    let observer =
      this.observers[NodeObserverIds.TagsUpdated]![this.node.index];
    if (!observer) {
      observer = NCSPools.observers.get() || new Observable();
      this.observers[NodeObserverIds.TagsUpdated]![this.node.index] = observer;
    }
    this.node.arrays._hasObservers[this.node.index] = true;
    return observer;
  }

  get isTagsAddedSet() {
    return (
      this.observers[NodeObserverIds.TagAdded]![this.node.index] !== undefined
    );
  }

  get isTagsRemovedSet() {
    return (
      this.observers[NodeObserverIds.TagRemoved]![this.node.index] !== undefined
    );
  }

  get isTagsUpdatedSet() {
    return (
      this.observers[NodeObserverIds.TagsUpdated]![this.node.index] !==
      undefined
    );
  }
}
