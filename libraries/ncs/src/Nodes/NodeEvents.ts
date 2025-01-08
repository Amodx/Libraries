import { Observable, ObservableFunction } from "../Util/Observable";
import { NodeCursor } from "./NodeCursor";

export class NodeEventCursor {
  id: string;
  node: NodeCursor;
  data: any;
}

export class NodeEvents {
  get events() {
    return this.node.arrays._events;
  }
  get index() {
    return this.node.index;
  }
  node: NodeCursor;
  private cursor = new NodeEventCursor();

  hasListener(id: string) {
    return this.node.arrays._events.has(id);
  }

  clearListeners(id: string) {
    let observer = this.events.get(id)?.[this.index];
    if (!observer) return false;
    observer.clear();
  }

  addListener<Data>(id: string, run: (data: Data) => void) {
    let observer = this.events.get(id)?.[this.index];
    if (!observer) {
      observer = new Observable();
      const observers: Observable[] = [];
      observers[this.index] = observer;
      this.events.set(id, observers);
    }
    observer.subscribe(run as any);
  }

  removeListener(id: string, run: ObservableFunction<any>) {
    let observer = this.events.get(id)?.[this.index];
    if (!observer) return false;
    observer.unsubscribe(run);
    return true;
  }

  dispatch<Data>(id: string, data: Data) {
    let observer = this.events.get(id)?.[this.index];
    if (!observer) return false;
    (observer as any).notify(data);
    this.cursor.id = id;
    this.cursor.data = data;
    return true;
  }

  dispatchDeep<Data>(id: string, data: Data) {
    for (const child of this.node.traverseChildren()) {
      child.events.dispatch(id, data);
    }
  }
}
