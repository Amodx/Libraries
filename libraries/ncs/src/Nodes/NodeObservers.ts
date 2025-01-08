import { Observable } from "../Util/Observable";
import { NodeCursor } from "./NodeCursor";
import { NodeObserverIds } from "./Node.types";
import { ComponentCursor } from "../Components/ComponentCursor";
import { TagCursor } from "../Tags/TagCursor";
export interface NodeObservers {}

export class NodeObservers {
  node: NodeCursor;

  get observers() {
    return this.node.arrays._observers;
  }

  get disposed() {
    let observer = this.observers.get(NodeObserverIds.Disposed)![
      this.node.index
    ];
    if (!observer) {
      observer = new Observable();
      this.observers.get(NodeObserverIds.Disposed)![this.node.index] = observer;
    }
    return observer;
  }

  get parented() {
    let observer = this.observers.get(NodeObserverIds.Parented)![
      this.node.index
    ];
    if (!observer) {
      observer = new Observable();
      this.observers.get(NodeObserverIds.Parented)![this.node.index] = observer;
    }
    return observer;
  }

  get removedFromParent() {
    let observer = this.observers.get(NodeObserverIds.RemovedFromParent)![
      this.node.index
    ];
    if (!observer) {
      observer = new Observable();
      this.observers.get(NodeObserverIds.RemovedFromParent)![this.node.index] =
        observer;
    }
    return observer;
  }

  get childAdded() : Observable<NodeCursor>  {
    let observer = this.observers.get(NodeObserverIds.ChildAdded)![
      this.node.index
    ];
    if (!observer) {
      observer = new Observable();
      this.observers.get(NodeObserverIds.ChildAdded)![this.node.index] =
        observer;
    }
    return observer;
  }

  get childRemoved() : Observable<NodeCursor>  {
    let observer = this.observers.get(NodeObserverIds.ChildRemoved)![
      this.node.index
    ];
    if (!observer) {
      observer = new Observable();
      this.observers.get(NodeObserverIds.ChildRemoved)![this.node.index] =
        observer;
    }
    return observer;
  }

  get childrenUpdated() {
    let observer = this.observers.get(NodeObserverIds.ChildrenUpdated)![
      this.node.index
    ];
    if (!observer) {
      observer = new Observable();
      this.observers.get(NodeObserverIds.ChildrenUpdated)![this.node.index] =
        observer;
    }
    return observer;
  }

  get isDisposedSet() {
    return (
      this.observers.get(NodeObserverIds.Disposed)![this.node.index] !==
      undefined
    );
  }

  get isParentedSet() {
    return (
      this.observers.get(NodeObserverIds.Parented)![this.node.index] !==
      undefined
    );
  }

  get isRemovedFromParentSet() {
    return (
      this.observers.get(NodeObserverIds.RemovedFromParent)![
        this.node.index
      ] !== undefined
    );
  }

  get isChildAddedSet() {
    return (
      this.observers.get(NodeObserverIds.ChildAdded)![this.node.index] !==
      undefined
    );
  }

  get isChildRemovedSet() {
    return (
      this.observers.get(NodeObserverIds.ChildRemoved)![this.node.index] !==
      undefined
    );
  }

  get isChildrenUpdatedSet() {
    return (
      this.observers.get(NodeObserverIds.ChildrenUpdated)![this.node.index] !==
      undefined
    );
  }
  get componentAdded() : Observable<ComponentCursor> {
    let observer = this.observers.get(NodeObserverIds.ComponentAdded)![
      this.node.index
    ];
    if (!observer) {
      observer = new Observable<ComponentCursor>();
      this.observers.get(NodeObserverIds.ComponentAdded)![this.node.index] =
        observer;
    }
    return observer;
  }

  get componentRemoved() : Observable<ComponentCursor> {
    let observer = this.observers.get(NodeObserverIds.ComponentRemoved)![
      this.node.index
    ];
    if (!observer) {
      observer = new Observable();
      this.observers.get(NodeObserverIds.ComponentRemoved)![this.node.index] =
        observer;
    }
    return observer;
  }

  get componentsUpdated() {
    let observer = this.observers.get(NodeObserverIds.ComponentsUpdated)![
      this.node.index
    ];
    if (!observer) {
      observer = new Observable();
      this.observers.get(NodeObserverIds.ComponentsUpdated)![this.node.index] =
        observer;
    }
    return observer;
  }

  get isComponentAddedSet() {
    return (
      this.observers.get(NodeObserverIds.ComponentAdded)![this.node.index] !==
      undefined
    );
  }

  get isComponentRemovedSet() {
    return (
      this.observers.get(NodeObserverIds.ComponentRemoved)![this.node.index] !==
      undefined
    );
  }

  get isComponentsUpdatedSet() {
    return (
      this.observers.get(NodeObserverIds.ComponentsUpdated)![
        this.node.index
      ] !== undefined
    );
  }
  get tagsAdded() : Observable<TagCursor> {
    let observer = this.observers.get(NodeObserverIds.TagAdded)![
      this.node.index
    ];
    if (!observer) {
      observer = new Observable();
      this.observers.get(NodeObserverIds.TagAdded)![this.node.index] = observer;
    }
    return observer;
  }

  get tagsRemoved() : Observable<TagCursor>  {
    let observer = this.observers.get(NodeObserverIds.TagRemoved)![
      this.node.index
    ];
    if (!observer) {
      observer = new Observable();
      this.observers.get(NodeObserverIds.TagRemoved)![this.node.index] =
        observer;
    }
    return observer;
  }

  get tagsUpdated() {
    let observer = this.observers.get(NodeObserverIds.TagsUpdated)![
      this.node.index
    ];
    if (!observer) {
      observer = new Observable();
      this.observers.get(NodeObserverIds.TagsUpdated)![this.node.index] =
        observer;
    }
    return observer;
  }

  get isTagsAddedSet() {
    return (
      this.observers.get(NodeObserverIds.TagAdded)![this.node.index] !==
      undefined
    );
  }

  get isTagsRemovedSet() {
    return (
      this.observers.get(NodeObserverIds.TagRemoved)![this.node.index] !==
      undefined
    );
  }

  get isTagsUpdatedSet() {
    return (
      this.observers.get(NodeObserverIds.TagsUpdated)![this.node.index] !==
      undefined
    );
  }
}
