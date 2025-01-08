import { CreateNodeData } from "../Nodes/Node.types";
import { NodeId } from "../Nodes/NodeId";
import { ComponentCursor } from "../Components/ComponentCursor";
import { NodeArray } from "../Nodes/NodeArray";
import { ComponentArray } from "../Components/ComponentArray";
import { NodeCursor } from "../Nodes/NodeCursor";
import { ContextArray } from "../Contexts/ContextArray";
import { TagArray } from "../Tags/TagArray";

const parentCursor = new NodeCursor();
const nodeCursor = new NodeCursor();
const componentCursor = new ComponentCursor();

function createNode(graph: Graph, data: CreateNodeData, parent: number) {
  const newNode = graph.nodes.addNode(
    data[0],
    parent,
    data[1],
    data[2],
    null,
    null,
    null,
    null
  );
  nodeCursor.graph = graph;

  nodeCursor.setNode(newNode);
  // graph._nodeMap.set(newNode.id, newNode);

  if (data[3]?.length) {
    for (let i = 0; i < data[3].length; i++) {
      nodeCursor.components.add(data[3][i]);
    }
  }
  if (data[4]?.length) {
    for (let i = 0; i < data[4].length; i++) {
      nodeCursor.tags.add(data[4][i]);
    }
  }

  const parentData = graph.nodes._children[parent];
  if (typeof parentData === "undefined") {
    parentCursor.setNode(parent);
    parentCursor.addChild(nodeCursor);
  }

  if (data[5]?.length) {
    for (let i = 0; i < data[5].length; i++) {
      createNode(graph, data[5][i], newNode);
    }
  }
  nodeCursor.setNode(newNode);
  return nodeCursor;
}

export class Graph {
  nodes = new NodeArray();
  components = new Map<string, ComponentArray>();
  contexts = new ContextArray();
  tags = new Map<string, TagArray>();
  _updatingComponents: ComponentArray[] = [];

  root = new NodeCursor();

  constructor() {}
  getNode(index: number, cursor = new NodeCursor()) {
    const nodeIndex = this.nodes._parents[index];
    if (typeof nodeIndex === "undefined")
      throw new Error(`Node with index ${index} does not exist`);
    cursor.setNode(nodeIndex);
    return cursor;
  }

  getNodeFromId(id: bigint | string, cursor = new NodeCursor()) {
    if (typeof id == "string") id = NodeId.FromString(id);
    const nodeIndex = this.nodes._idMap.get(id);
    if (typeof nodeIndex === "undefined")
      throw new Error(`Node with id ${id} does not exist`);
    cursor.setNode(nodeIndex);
    return cursor;
  }


  addNode(data: CreateNodeData, parent: number) {
    const newNode = createNode(this, data, parent);
    if (newNode.hasComponents) {
      const components = newNode.components.components;
      for (let i = 0; i < components.length; i++) {
        componentCursor.setInstance(newNode, components[i], components[i + 1]);
        componentCursor.init();
      }
    }
    for (const child of newNode.traverseChildren()) {
      if (child.hasComponents) {
        const components = child.components.components;
        for (let i = 0; i < components.length; i++) {
          componentCursor.setInstance(child, components[i], components[i + 1]);
          componentCursor.init();
        }
      }
    }
    return newNode;
  }

  removeNode(index: number) {
    const node = this.nodes.removeNode(index);
    if (!node) return;
    nodeCursor.setNode(index);
    if (!nodeCursor.isDisposed()) nodeCursor.dispose();

  }

  update() {
   
  }

  toJSON() {
    return this.root.toJSON();
  }
}
