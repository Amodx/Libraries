import { SystemInstance } from "./SystemInstance";
import { Graph } from "../Graphs/Graph";
import { SystemRegisterData } from "./System.types";

export class SystemPrototype {
  systems = new Map<Graph, SystemInstance>();

  constructor(public data: SystemRegisterData) {}

  add(graph: Graph) {
    if (this.systems.has(graph)) return this.systems.get(graph)!;
    const newSystem = new SystemInstance(graph, this.data);
    this.systems.set(graph, newSystem)!;
    return newSystem;
  }
  remove(graph: Graph) {
    const system = this.systems.get(graph);
    if (!system) return false;
    system.dispose();
    return true;
  }
}
