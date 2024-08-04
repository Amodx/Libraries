import { Graph } from "./Graph";

export interface GraphUpdtable<> {
  update(): void;
}

export class GraphUpdate {
  private static updatingComponents = new Map<Graph, Set<GraphUpdtable>>();

  static addITem(graph: Graph, item: GraphUpdtable) {
    let updating = this.updatingComponents.get(graph);
    if (!updating) {
      updating = new Set();
      this.updatingComponents.set(graph, updating);
    }
    updating.add(item);
  }
  static removeItem(graph: Graph, item: GraphUpdtable) {
    let updating = this.updatingComponents.get(graph);
    if (!updating) return;
    updating.delete(item);
  }

  static getItems(graph: Graph) {
    return this.updatingComponents.get(graph)!;
  }
}
