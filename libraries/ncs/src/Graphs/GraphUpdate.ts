import { ComponentInstance } from "../Components/ComponentInstance";
import { Graph } from "./Graph";

export class GraphUpdate {
  private static updating = new Map<Graph, Set<ComponentInstance>>();

  static addToUpdate(component: ComponentInstance<any, any, any, any>) {
    let updating = this.updating.get(component.node.graph);
    if (!updating) {
      updating = new Set();
      this.updating.set(component.node.graph, updating);
    }
    updating.add(component);
    component.observers.disposed.subscribeOnce(() => {});
  }
  static removeFromUpate(component: ComponentInstance<any, any, any, any>) {
    let updating = this.updating.get(component.node.graph);
    if (!updating) return;
    updating.delete(component);
  
  }

  static getUpdating(graph: Graph) {
    return this.updating.get(graph)!;
  }
}
