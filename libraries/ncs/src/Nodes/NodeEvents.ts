import { Observable } from "@amodx/core/Observers";
import { NodeInstance } from "./NodeInstance";

export class NodeEventCursor {
  id: string;
  node: NodeInstance;
  data: any;
}

class NodeEventsObservers {
  eventTypeAdded = new Observable<string>();
  eventDispatched = new Observable<NodeEventCursor>();
}

export class NodeEvents {
  observers = new NodeEventsObservers();
  private cursor = new NodeEventCursor();
  private events = new Map<string, Observable>();

  constructor(public node: NodeInstance) {}

  hasListener(id: string) {
    return this.events.has(id);
  }

  clearListeners(id: string) {
    let observer = this.events.get(id);
    if (!observer) return false;
    observer.clear();
  }

  addListener<Data>(id: string, run: (data: Data) => void) {
    let observer = this.events.get(id);
    if (!observer) {
      observer = new Observable();
      this.events.set(id, observer);
      this.observers.eventTypeAdded.notify(id);
    }
    observer.subscribe(run as any);
  }

  removeListener(id: string, run: Function) {
    let observer = this.events.get(id);
    if (!observer) return false;
    observer.unsubscribe(run);
    return true;
  }

  dispatch<Data>(id: string, data: Data) {
    let observer = this.events.get(id);
    if (!observer) return false;
    (observer as any).notify(data);
    this.cursor.id = id;
    this.cursor.data = data;
    this.observers.eventDispatched.notify(this.cursor);
    if (this.node.graph.events.hasListener(id)) {
      this.node.graph.events.dispatch(id, this.cursor);
    }
    return true;
  }

  dispatchDeep<Data>(id: string, data: Data) {
   for(const child of  this.node.traverseChildren()) {
        child.events.dispatch(id,data);
   }
  }
}
