import { SystemInstance } from "../Systems/SystemInstance";
import { ComponentInstance } from "../Components/ComponentInstance";
import { Graph } from "./Graph";

export class GraphUpdate {
  private static updatingComponents = new Map<Graph, Set<ComponentInstance>>();

  static addComponentToUpdate(
    component: ComponentInstance<any, any, any, any>
  ) {
    let updating = this.updatingComponents.get(component.node.graph);
    if (!updating) {
      updating = new Set();
      this.updatingComponents.set(component.node.graph, updating);
    }
    updating.add(component);
  }
  static removeComponentFromUpate(
    component: ComponentInstance<any, any, any, any>
  ) {
    let updating = this.updatingComponents.get(component.node.graph);
    if (!updating) return;
    updating.delete(component);
  }

  static getUpdatingComponents(graph: Graph) {
    return this.updatingComponents.get(graph)!;
  }

  private static updatingSystems = new Map<Graph, Set<SystemInstance>>();

  static addSystemToUpdate(system: SystemInstance) {
    let updating = this.updatingSystems.get(system.graph);
    if (!updating) {
      updating = new Set();
      this.updatingSystems.set(system.graph, updating);
    }
    updating.add(system);
  }
  static removeSystemFromUpdate(system: SystemInstance) {
    let updating = this.updatingSystems.get(system.graph);
    if (!updating) return;
    updating.delete(system);
  }

  static getUpdatingSystems(graph: Graph) {
    return this.updatingSystems.get(graph)!;
  }
}
