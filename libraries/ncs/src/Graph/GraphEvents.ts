import { Observable } from "@amodx/core/Observers";
import { NodeEventCursor } from "Nodes/NodeEvents";

export class GraphEvents {
  private events = new Map<string, Observable>();

  hasListener(id: string) {
    return this.events.has(id);
  }

  clearListeners(id: string) {
    let observer = this.events.get(id);
    if (!observer) return false;
    observer.clear();
  }

  addListener(id: string, run: (data: NodeEventCursor) => void) {
    let observer = this.events.get(id);
    if (!observer) {
      observer = new Observable();
      this.events.set(id, observer);
    }
    observer.subscribe(run as any);
  }

  removeListener(id: string, run: Function) {
    let observer = this.events.get(id);
    if (!observer) return false;
    observer.unsubscribe(run);
    return true;
  }
  dispatch<Data>(id: string, data: NodeEventCursor) {
    let observer = this.events.get(id);
    if (!observer) return false;
    (observer as any).notify(data);
    return true;
  }
}
