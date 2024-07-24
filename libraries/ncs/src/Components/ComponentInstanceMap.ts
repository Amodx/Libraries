import { NodeInstance } from "../Nodes/NodeInstance";
import { ComponentInstance } from "./ComponentInstance";
import { Graph } from "../Graph/Graph";

class NodeGraphMap {
  private nodes = new Set<NodeInstance>();
  private components = new Set<ComponentInstance<any,any,any,any>>();
  private nodeMap = new Map<NodeInstance, ComponentInstance<any,any,any,any>[]>();
  addNode(node: NodeInstance, component: ComponentInstance<any,any,any,any>) {
    this.nodes.add(node);
    this.components.add(component);
    let mapped = this.nodeMap.get(node);
    if (!mapped) {
      mapped = [];
      this.nodeMap.set(node, mapped);
    }
    mapped.push(component);
  }
  removeNode(node: NodeInstance, component: ComponentInstance<any,any,any,any>) {
    this.nodes.delete(node);
    this.components.delete(component);
    let mapped = this.nodeMap.get(node);
    if (!mapped) return;
    mapped = mapped.filter((_) => _ != component);
    if (!mapped.length) {
      this.nodeMap.delete(node);
      this.nodes.delete(node);
    }
  }
  getNodes() {
    return this.nodes;
  }
  getComponents() {
    return this.components;
  }
}

export class ComponentInstanceMap {
  private static types = new Map<string, ComponentInstanceMap>();
  static registerComponent(type: string) {
    const map = new ComponentInstanceMap();
    this.types.set(type, map);
    return map;
  }
  static getMap(type: string) {
    const map = this.types.get(type);
    if (!map) throw new Error(`Map for component ${type} does not exist`);
    return map;
  }
  private graphs = new Map<Graph, NodeGraphMap>();

  getMap(graph: Graph) {
    let graphMap = this.graphs.get(graph);
    if (!graphMap) {
      graphMap = new NodeGraphMap();
      this.graphs.set(graph, graphMap);
    }
    return graphMap;
  }

  addNode(node: NodeInstance, component: ComponentInstance<any,any,any,any>) {
    const graphMap = this.getMap(node.graph);
    graphMap.addNode(node, component);
  }

  removeNode(node: NodeInstance, component: ComponentInstance<any,any,any,any>) {
    if (!this.graphs.has(node.graph)) return;
    const graphMap = this.getMap(node.graph);
    graphMap.addNode(node, component);
  }

  getNodes(graph: Graph) {
    const graphMap = this.getMap(graph);
    return graphMap.getNodes();
  }

  getComponents(graph: Graph) {
    const graphMap = this.getMap(graph);
    return graphMap.getComponents();
  }
}
