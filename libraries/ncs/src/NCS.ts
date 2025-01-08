import { Graph } from "./Graphs/Graph";
import {
  SerializedNodeData,
  NodeStateData,
  CreateNodeData,
} from "./Nodes/Node.types";
import { NodeId } from "./Nodes/NodeId";

import { QueryData } from "./Queries/Query.types";
import { QueryPrototype } from "./Queries/QueryPrototype";

import { CreateComponentData } from "./Components/Component.types";
import { registerContext } from "./Register/registerContext";
import { registerComponent } from "./Register/registerComponent";
import { RegisteredTag, registerTag } from "./Register/registerTag";
import { registerSystem } from "./Register/registerSystem";

export class NCS {
  static createGraph() {
    return new Graph();
  }

  static createNode(
    id?: true,
    name?: string | null,
    state?: NodeStateData | null,
    tags?: string[],
    components?: CreateComponentData[],
    children: CreateNodeData[] = []
  ): CreateNodeData {
    return [
      id ? NodeId.Create() : null,
      name || "New Node",
      state || {},
      components || null,
      tags || null,
      children || null,
    ];
  }

  static createQuery(data: QueryData) {
    return new QueryPrototype(data);
  }
  static registerSystem = registerSystem;
  static registerComponent = registerComponent;
  static registerContext = registerContext;
  static registerTag = registerTag;
}

export function Node(
  data: {
    id?: true;
    name?: string;
    state?: NodeStateData;
    tags?: string[];
  },
  components?: CreateComponentData[],
  ...children: CreateNodeData[]
): CreateNodeData {
  return NCS.createNode(
    data.id,
    data.name,
    data.state,
    data.tags,
    components,
    children
  );
}

export function Tag(id: string, ...children: RegisteredTag[]) {
  const tag = NCS.registerTag({ id });

  children.forEach((_) => {
    tag.tag.addChild(_.tag);
  });
  return tag;
}
