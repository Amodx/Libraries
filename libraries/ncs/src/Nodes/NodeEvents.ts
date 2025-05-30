import { NCSPools } from "../Pools/NCSPools";
import { Observable, ObservableFunction } from "../Util/Observable";
import { NodeCursor } from "./NodeCursor";

export class NodeEventCursor {
  id: string;
  node: NodeCursor;
  data: any;
}

export class NodeEvents {
  static Get() {
    const cursor = NCSPools.nodeEvents.get();
    if (!cursor) return new NodeEvents();
    return cursor;
  }

  static Retrun(cursor: NodeEvents) {
    return NCSPools.nodeEvents.addItem(cursor);
  }
  get events() {
    return this.node.arrays._events;
  }
  get index() {
    return this.node.index;
  }
  node: NodeCursor;
  private cursor = new NodeEventCursor();
  private constructor() {}

  hasListener(id: string) {
    const numberId = this.node.arrays._eventPalette.getNumberId(id);
    if (numberId === undefined) return false;
    return this.node.arrays._events[numberId][this.index] !== undefined;
  }

  clearListeners(id: string) {
    const numberId = this.node.arrays._eventPalette.getNumberId(id);
    if (numberId === undefined) return false;
    let observer = this.node.arrays._events[numberId]?.[this.index];
    if (!observer) return false;
    observer.clear();
    NCSPools.observers.addItem(observer);
    (this.node.arrays._events[numberId][this.index] as any) = undefined;
  }

  addListener<Data>(
    id: string,
    run: (data: Data) => void,
    options?: { once?: boolean }
  ) {
    const numberId = this.node.arrays._eventPalette.isRegistered(id)
      ? this.node.arrays._eventPalette.getNumberId(id)
      : this.node.arrays._eventPalette.register(id);
    let observers = this.node.arrays._events[numberId];
    if (!observers) {
      observers = [];
      this.node.arrays._events[numberId] = observers;
    }
    let observer = observers[this.index];
    if (!observer) {
      observer = NCSPools.observers.get() || new Observable();
      observers[this.index] = observer;
    }
    if (options?.once) {
      observer.subscribeOnce(run);
    } else {
      observer.subscribe(run);
    }
  }

  removeListener(id: string, run: ObservableFunction<any>) {
    const numberId = this.node.arrays._eventPalette.getNumberId(id);
    if (numberId === undefined) return false;
    let observers = this.node.arrays._events[numberId];
    if (!observers || !observers[this.index]) return false;
    observers[this.index].unsubscribe(run);
    return true;
  }

  dispatch<Data>(id: string, data: Data) {
    const numberId = this.node.arrays._eventPalette.getNumberId(id);
    if (numberId === undefined) return false;
    let observers = this.node.arrays._events[numberId];
    if (!observers || !observers[this.index]) return false;
    observers[this.index].notify(data);
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
