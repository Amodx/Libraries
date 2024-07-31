import { NodeInstance } from "../Nodes/NodeInstance";
import { Graph } from "../Graphs/Graph";
import { ItemNodeMap } from "../Maps/ItemNodeMap";

export class ItemGraphMap<MappedItem> {
  private graphs = new Map<Graph, ItemNodeMap<MappedItem>>();

  getMap(graph: Graph) {
    let graphMap = this.graphs.get(graph);
    if (!graphMap) {
      graphMap = new ItemNodeMap();
      this.graphs.set(graph, graphMap);
    }
    return graphMap;
  }

  addNode(node: NodeInstance, item: MappedItem) {
    const graphMap = this.getMap(node.graph);
    graphMap.addNode(node, item);
  }

  removeNode(node: NodeInstance, item: MappedItem) {
    if (!this.graphs.has(node.graph)) return;
    const graphMap = this.getMap(node.graph);
    graphMap.addNode(node, item);
  }

  getNodes(graph: Graph) {
    const graphMap = this.getMap(graph);
    return graphMap.getNodes();
  }

  getItems(graph: Graph) {
    const graphMap = this.getMap(graph);
    return graphMap.getItems();
  }
}
