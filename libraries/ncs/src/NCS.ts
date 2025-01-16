import { Graph } from "./Graphs/Graph";
import { SerializedNodeData, CreateNodeData } from "./Nodes/Node.types";
import { NodeId } from "./Nodes/NodeId";

import { QueryData } from "./Queries/Query.types";
import { QueryPrototype } from "./Queries/QueryPrototype";

import { CreateComponentData } from "./Components/Component.types";
import { registerContext } from "./Register/registerContext";
import { registerComponent } from "./Register/registerComponent";
import { RegisteredTag, registerTag } from "./Register/registerTag";
import { registerSystem } from "./Register/registerSystem";
import { NCSPools } from "./Pools/NCSPools";
import { Schema } from "Schema/Schema";

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
}
export function Node(): CreateNodeData;

export function Node(
  components?: CreateComponentData[],
  tags?: number[] | null,
  ...children: CreateNodeData[]
): CreateNodeData;

export function Node(
  data: string,
  components?: CreateComponentData[],
  ...children: CreateNodeData[]
): CreateNodeData;

export function Node(
  data: {
    id?: true;
    name?: string;
    tags?: number[];
  },
  components?: CreateComponentData[],
  ...children: CreateNodeData[]
): CreateNodeData;

export function Node(
  dataOrComponents?:
    | CreateComponentData[]
    | string
    | {
        id?: true;
        name?: string;
        tags?: number[];
      },
  maybeComponentsOrChildren?: CreateComponentData[] | number[] | null,
  ...restChildren: CreateNodeData[]
): CreateNodeData {
  if (!dataOrComponents) {
    return NCS.createNode(null, "New Node", null, undefined, restChildren);
  }

  // Case A: dataOrComponents is an array => treat it as the components array
  if (Array.isArray(dataOrComponents)) {
    const components = dataOrComponents as CreateComponentData[];
    const children = (restChildren as CreateNodeData[]) ?? [];
    return NCS.createNode(
      undefined,
      undefined,
      Array.isArray(maybeComponentsOrChildren)
        ? (maybeComponentsOrChildren as number[])
        : undefined,
      components,
      children
    );
  }

  // Case B: dataOrComponents is a string => treat it as the name
  if (typeof dataOrComponents === "string") {
    const name = dataOrComponents;
    const components = (maybeComponentsOrChildren ??
      []) as CreateComponentData[];
    return NCS.createNode(undefined, name, undefined, components, restChildren);
  }

  // Case C: dataOrComponents is the object form => { id?, name?, state?, tags? }

  const components = (maybeComponentsOrChildren ?? []) as CreateComponentData[];
  return NCS.createNode(
    dataOrComponents.id,
    dataOrComponents.name,
    dataOrComponents.tags,
    components,
    restChildren
  );
}

export function Tag(id: string, ...children: RegisteredTag[]) {
  const tag = NCS.registerTag({ id });

  children.forEach((_) => {
    tag.tag.addChild(_.tag);
  });
  return tag;
}
