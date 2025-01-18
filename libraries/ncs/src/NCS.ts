import { Graph } from "./Graphs/Graph";
import { CreateNodeData } from "./Nodes/Node.types";
import { NodeId } from "./Nodes/NodeId";

import { QueryData } from "./Queries/Query.types";
import { QueryPrototype } from "./Queries/QueryPrototype";

import { CreateComponentData } from "./Components/Component.types";
import { registerContext } from "./Register/registerContext";
import { registerComponent } from "./Register/registerComponent";
import { registerTag } from "./Register/registerTag";
import { registerSystem } from "./Register/registerSystem";
import { NCSPools } from "./Pools/NCSPools";
import { Schema } from "./Schema/Schema";
import {
  copyComponent,
  serializeComponent,
  serializeComponentData,
} from "./Data/serializeComponent";
import { deserializeComponentData } from "./Data/deserializeComponent";
import {
  cloneNode,
  copyNode,
  serializeNode,
  serializeNodeData,
} from "./Data/serializeNode";
import { deserializeNodeData } from "./Data/deserializeNode";

export class NCS {
  static createGraph() {
    return new Graph();
  }

  static createNode(
    id?: true | null,
    name?: string | null,
    tags?: number[] | null,
    components?: CreateComponentData[],
    children: CreateNodeData[] = []
  ): CreateNodeData {
    const data: CreateNodeData = NCSPools.createNodeData.get() || ([] as any);
    data[0] = id ? NodeId.Create() : null;
    data[1] = name || "New Node";
    data[2] = components || null;
    data[3] = tags || null;
    data[4] = children || null;
    return data;
  }

  static schemaFromObject<T extends Record<string, any>>(data: T) {
    return Schema.FromObject<T>(data);
  }
  static createQuery(data: QueryData) {
    return new QueryPrototype(data);
  }
  static registerSystem = registerSystem;
  static registerComponent = registerComponent;
  static registerContext = registerContext;
  static registerTag = registerTag;
  static serializeComponent = serializeComponent;
  static serializeComponentData = serializeComponentData;
  static copyComponent = copyComponent;
  static deserializeComponentData = deserializeComponentData;

  static serializeNode = serializeNode;
  static serializeNodeData = serializeNodeData;
  static copyNode = copyNode;
  static cloneNode = cloneNode;
  static deserializeNodeData = deserializeNodeData;
}
